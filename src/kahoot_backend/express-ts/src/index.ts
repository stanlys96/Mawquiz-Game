import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import FormData from "form-data";
import { generateRandomString, objectToArray } from "./helper/helper";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

dotenv.config();
const upload = multer({ dest: "uploads/" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const corsOptions = {
  origin: [
    "https://cv2ns-7iaaa-aaaac-aac3q-cai.icp0.io",
    "https://smart-marketplace-web3.vercel.app",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ["'self'", "*"],
    },
  })
);

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "connect-src 'self' *;");
  next();
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const gamesFilePath = path.join(__dirname, "games.json");
let games: any = {};
if (fs.existsSync(gamesFilePath)) {
  try {
    const data = fs.readFileSync(gamesFilePath, "utf-8");
    games = JSON.parse(data);
    console.log("Games loaded successfully");
  } catch (error) {
    console.error("Error reading games.json:", error);
  }
}

function saveGamesToFile() {
  try {
    fs.writeFileSync(gamesFilePath, JSON.stringify(games, null, 2), "utf-8");
    console.log("Games saved successfully");
  } catch (error) {
    console.error("Error saving games.json:", error);
  }
}

function getGamesData() {
  try {
    const fileData = fs.readFileSync(gamesFilePath, "utf-8");
    const games = JSON.parse(fileData);
    return games;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

app.post(
  "/pinFileToIPFS",
  upload.single("file"),
  async (req: any, res: any) => {
    try {
      const file = req.file;

      const formData = new FormData();
      formData.append("file", require("fs").createReadStream(file.path));
      const headers = {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      };

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers,
        }
      );
      res.json(response.data);
    } catch (e) {
      console.log(e);
      res.status(500).send("Error pinning file to IPFS");
    }
  }
);

app.post("/pinJSONToIPFS", async (req: any, res: any) => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      req.body,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_API_SECRET,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error pinning JSON to IPFS");
  }
});

app.post("/games", (req: any, res: any) => {
  try {
    const {
      gamePin,
      questions,
      owner,
      nickname,
      title,
      imageCoverUrl,
      description,
    } = req.body;
    const gameRoom = generateRandomString(7, games);
    games[gameRoom] = {
      owner: owner,
      nickname: nickname,
      title: title,
      imageCoverUrl: imageCoverUrl,
      description: description,
      players: {},
      questions,
      locked: false,
      started: false,
    };
    saveGamesToFile();
    io.emit("games_data_changed", {
      games: objectToArray(getGamesData(), "gameRoom"),
    });
    res.json({ gamePin, gameRoom, message: "Game started successfully" });
  } catch (e) {
    console.log(e, "<< E");
    res.json({ gamePin: "", gameRoom: "", message: "error" });
  }
});

app.post("/joinGame/:gamePin", (req: any, res: any) => {
  const game = games[req.params.gamePin];
  if (!game) {
    return res.status(404).json({
      message: "Game room does not exist!",
      status: 404,
    });
  }
  if (game?.locked) {
    return res.status(400).json({
      message: "Game is locked!",
      status: 400,
    });
  }
  if (game?.started) {
    return res.status(400).json({
      message: "Game has started!",
      status: 400,
    });
  }
  const thePlayer = req.body.player;
  if (game?.owner === thePlayer?.owner) {
    return res
      .status(400)
      .json({ message: "You are the owner of this game room!", status: 400 });
  }
  for (const key in game.players) {
    for (const secondKey in game.players[key]) {
      if (
        secondKey === "principal" &&
        game.players[key][secondKey] === thePlayer?.owner
      ) {
        return res
          .status(400)
          .json({ message: "You have already joined this game!", status: 400 });
      }
    }
  }
  game.players[thePlayer?.owner] = {
    name: thePlayer?.nickname,
    principal: thePlayer?.owner,
    score: 0,
    admin: thePlayer?.admin,
  };
  res.json({ message: "Successfully joined", status: 200 });
  saveGamesToFile();
  io.to(req.params.gamePin).emit("player_joined", { thePlayer });
  io.emit("games_data_changed", {
    games: objectToArray(getGamesData(), "gameRoom"),
  });
});

app.get("/getLiveGames", (req: any, res: any) => {
  const result = objectToArray(games, "gameRoom");
  res.json({ message: "success", games: result });
});

app.post("/deleteGameRoom", (req: any, res: any) => {
  const gameRoom = req.body.gameRoom;
  delete games[gameRoom];
  saveGamesToFile();
  io.emit("games_data_changed", {
    games: objectToArray(getGamesData(), "gameRoom"),
  });
  res.json({ message: "success", gameRoom: gameRoom });
});

io.on("connection", (socket: any) => {
  console.log(`Someone just connected: ${socket.id}`);
  socket.on("join_game", ({ gamePin }: any) => {
    socket.join(gamePin);
  });

  socket.on("disconnect", () => {});

  socket.on("player_left", ({ gamePin, principal, nickname }: any) => {
    delete games?.[gamePin]?.players[principal];
    saveGamesToFile();
    io.to(gamePin).emit("player_left", { principal, nickname });
    io.emit("games_data_changed", {
      games: objectToArray(getGamesData(), "gameRoom"),
    });
  });

  socket.on("toggle_lock_game", ({ gamePin }: any) => {
    games[gamePin].locked = !games[gamePin].locked;
  });

  socket.on("kick_player", ({ gamePin, principal, nickname }: any) => {
    delete games?.[gamePin]?.players[principal];
    io.to(gamePin).emit("kick_player", { principal, nickname });
    saveGamesToFile();
    io.emit("games_data_changed", {
      games: objectToArray(getGamesData(), "gameRoom"),
    });
  });

  socket.on("admin_left", ({ gamePin }: any) => {
    delete games?.[gamePin];
    saveGamesToFile();
    io.to(gamePin).emit("admin_has_left");
    io.emit("games_data_changed", {
      games: objectToArray(getGamesData(), "gameRoom"),
    });
  });

  socket.on("game_started", ({ gamePin, questions }: any) => {
    games[gamePin].started = true;
    saveGamesToFile();
    io.emit("games_data_changed", {
      games: objectToArray(getGamesData(), "gameRoom"),
    });
    io.to(gamePin).emit("game_started", questions);
  });

  socket.on(
    "player_answer_server",
    ({
      gamePin,
      principal,
      answer,
      currentScore,
      totalScore,
      isCorrect,
      questionIndex,
      previousScore,
      nickname,
    }: any) => {
      io.to(gamePin).emit("player_answer", {
        gamePin,
        principal,
        answer,
        currentScore,
        totalScore,
        isCorrect,
        questionIndex,
        previousScore,
        nickname,
      });
    }
  );

  socket.on("question_finished", ({ gamePin }: any) => {
    io.to(gamePin).emit("question_finished", { gamePin });
  });

  socket.on("question_restarted", ({ gamePin, questionIndex }: any) => {
    io.to(gamePin).emit("question_restarted", { gamePin, questionIndex });
  });

  socket.on("game_finished", ({ gamePin, uniquePlayers }: any) => {
    io.to(gamePin).emit("game_finished", { gamePin, uniquePlayers });
    delete games[gamePin];
    saveGamesToFile();
    io.emit("games_data_changed", {
      games: objectToArray(getGamesData(), "gameRoom"),
    });
  });
});
