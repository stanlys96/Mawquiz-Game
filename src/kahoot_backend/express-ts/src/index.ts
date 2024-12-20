import express, { Request, Application } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import FormData from "form-data";

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
    "http://localhost:3000",
    "https://identity.ic0.app",
    "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=cs3lg-sqaaa-aaaac-aac3a-cai",
    "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io",
    "https://mawquiz-backend-production.up.railway.app",
    "https://smart-marketplace-web3.vercel.app",
    "smart-marketplace-web3.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: [
        "'self'",
        "http://localhost:*",
        "https://icp0.io",
        "https://*.icp0.io",
        "https://icp-api.io",
        "wss://mawquiz-backend-production.up.railway.app",
      ],
    },
  })
);

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "connect-src 'self' http://localhost:* https://icp0.io https://*.icp0.io https://icp-api.io wss://mawquiz-backend-production.up.railway.app;"
  );
  next();
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const quizzes: any = {};
const games: any = {};

app.post("/pinFileToIPFS", upload.single("file"), async (req: any, res: any) => {
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
        headers
      }
    );
    res.json(response.data);
  } catch(e) {
    console.log(e);
    res.status(500).send('Error pinning file to IPFS');
  }
})

app.post("/pinJSONToIPFS", async (req: any, res: any) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
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
    res.status(500).send('Error pinning JSON to IPFS');
  }
})

app.post("/quizzes", (req: any, res: any) => {
  const { title, questions } = req.body;
  const quizId = Date.now().toString();
  quizzes[quizId] = { title, questions };
  res.json({ quizId, message: "Quiz created successfully" });
});

app.get("/quizzes/:id", (req: any, res: any) => {
  const quiz = quizzes[req.params.id];
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

app.post("/games", (req: any, res: any) => {
  try {
    const { gamePin, questions } = req.body;
    games[gamePin] = { players: {}, questions };
    res.json({ gamePin, message: "Game started successfully" });
  } catch (e) {
    console.log(e, "<< E");
    res.json({ gamePin: "", message: "error" });
  }
});

app.get("/games/:gamePin", (req: any, res: any) => {
  const game = games[req.params.gamePin];
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ message: "Game not found" });
  }
});

app.post("/joinGame/:gamePin", (req: any, res: any) => {
  const game = games[req.params.gamePin];
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

  socket.on("submit_answer", ({ pin, answer }: any) => {
    const game = games[pin];
    if (!game) return;

    const currentQuestion = game.quiz.questions[game.currentQuestion];
    const correctAnswer = currentQuestion.correctAnswer;

    const player = game.players[socket.id];
    if (player) {
      if (answer === correctAnswer) {
        player.score += 10;
      }

      const leaderboard = Object.values(game.players).map((p: any) => ({
        name: p.name,
        score: p.score,
      }));
      io.to(pin).emit("leaderboard_update", leaderboard);
    }
  });

  socket.on("startGame", ({ gamePin, questions }: any) => {
    io.to(gamePin).emit("gameStarted", questions);
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
    console.log(questions, "<<< QUESTIONS");
    io.to(gamePin).emit("game_started", questions);
  });
});
