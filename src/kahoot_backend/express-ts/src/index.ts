import express, { Request, Application } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";

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
  ], // Add your URL here
  methods: ["GET", "POST", "PUT", "DELETE"], // Define the allowed HTTP methods
};

let globalSocket: any = null;

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
// app.options("*", cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "connect-src 'self' http://localhost:* https://icp0.io https://*.icp0.io https://icp-api.io wss://mawquiz-backend-production.up.railway.app;"
  );
  next();
});
// app.use((req: any, res: any, next: any) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://cv2ns-7iaaa-aaaac-aac3q-cai.icp0.io",
//     "https://identity.ic0.app",
//     "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=cs3lg-sqaaa-aaaac-aac3a-cai",
//     "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io",
//     "https://mawquiz-backend-production.up.railway.app",
//     "https://icp0.io"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Sample in-memory database
const quizzes: any = {}; // Store quizzes
const games: any = {}; // Store ongoing game sessions

// Create a new quiz
app.post("/quizzes", (req: any, res: any) => {
  const { title, questions } = req.body;
  const quizId = Date.now().toString();
  quizzes[quizId] = { title, questions };
  res.json({ quizId, message: "Quiz created successfully" });
});

// Get a specific quiz
app.get("/quizzes/:id", (req: any, res: any) => {
  const quiz = quizzes[req.params.id];
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

// Start a new game session
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

// Join a game session
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
  game.players[globalSocket.id] = {
    socketId: globalSocket.id,
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
  globalSocket = socket;
  socket.on("join_game", ({ gamePin, thePlayer }: any) => {
    socket.join(gamePin);
  });

  // Submit an answer
  socket.on("submit_answer", ({ pin, answer }: any) => {
    const game = games[pin];
    if (!game) return;

    const currentQuestion = game.quiz.questions[game.currentQuestion];
    const correctAnswer = currentQuestion.correctAnswer;

    // Validate the answer
    const player = game.players[socket.id];
    if (player) {
      if (answer === correctAnswer) {
        player.score += 10; // Add points for a correct answer
      }

      // Broadcast the updated leaderboard
      const leaderboard = Object.values(game.players).map((p: any) => ({
        name: p.name,
        score: p.score,
      }));
      io.to(pin).emit("leaderboard_update", leaderboard);
    }
  });

  socket.on("startGame", ({ gamePin }: any) => {
    io.to(gamePin).emit("gameStarted");
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (const theGame in games) {
      for (const thePlayerKey in games?.[theGame]?.players) {
        if (thePlayerKey === socket.id) {
          const currentPlayer = games?.[theGame]?.players?.[thePlayerKey];
          if (currentPlayer?.admin) {
            io.to(theGame).emit(
              "admin_has_left",
              games?.[theGame]?.players[thePlayerKey]
            );
          } else {
            io.to(theGame).emit(
              "player_left",
              games?.[theGame]?.players[thePlayerKey]
            );
          }
          delete games?.[theGame]?.players[socket.id];
        }
      }
    }
  });

  socket.on("admin_left", ({ gamePin }: any) => {
    delete games?.[gamePin];
    io.to(gamePin).emit("admin_has_left");
  });

  socket.on("game_start", ({ gamePin }: any) => {
    io.to(gamePin).emit("game_start");
  });
});
