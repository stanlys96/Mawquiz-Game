import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import FormData from "form-data";
import { generateRandomString } from "./helper/helper";

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

const games: any = {};

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
    const { gamePin, questions } = req.body;
    const gameRoom = generateRandomString();
    games[gameRoom] = { players: {}, questions };
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
  const thePlayer = req.body.player;
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
  io.to(req.params.gamePin).emit("player_joined", { thePlayer });
});

app.get("/playersJoined/:gamePin", (req: any, res: any) => {
  const game = games[req.params.gamePin];
  res.json({ message: "success", players: game.players });
});

io.on("connection", (socket: any) => {
  console.log(`Someone just connected: ${socket.id}`);
  socket.on("join_game", ({ gamePin, thePlayer }: any) => {
    socket.join(gamePin);
  });

  socket.on("disconnect", () => {});

  socket.on("player_left", ({ gamePin, principal, nickname }: any) => {
    delete games?.[gamePin]?.players[principal];
    io.to(gamePin).emit("player_left", { principal, nickname });
  });

  socket.on("admin_left", ({ gamePin }: any) => {
    delete games?.[gamePin];
    io.to(gamePin).emit("admin_has_left");
  });

  socket.on("game_started", ({ gamePin, questions }: any) => {
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
  });
});
