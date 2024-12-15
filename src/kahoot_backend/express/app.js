const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
let globalSocket;

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Sample in-memory database
const quizzes = {}; // Store quizzes
const games = {}; // Store ongoing game sessions

// Create a new quiz
app.post("/quizzes", (req, res) => {
  const { title, questions } = req.body;
  const quizId = Date.now().toString();
  quizzes[quizId] = { title, questions };
  res.json({ quizId, message: "Quiz created successfully" });
});

// Get a specific quiz
app.get("/quizzes/:id", (req, res) => {
  const quiz = quizzes[req.params.id];
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ message: "Quiz not found" });
  }
});

// Start a new game session
app.post("/games", (req, res) => {
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
app.get("/games/:gamePin", (req, res) => {
  const game = games[req.params.gamePin];
  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ message: "Game not found" });
  }
});

app.post("/joinGame/:gamePin", (req, res) => {
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
  };
  res.json({ message: "Successfully joined", status: 200 });
  io.to(req.params.gamePin).emit("player_joined", { thePlayer });
});

app.get("/playersJoined/:gamePin", (req, res) => {
  const game = games[req.params.gamePin];
  res.json({ message: "success", players: game.players });
});

io.on("connection", (socket) => {
  globalSocket = socket;
  socket.on("join_game", ({ gamePin, thePlayer }) => {
    socket.join(gamePin);
  });

  // Submit an answer
  socket.on("submit_answer", ({ pin, answer }) => {
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
      const leaderboard = Object.values(game.players).map((p) => ({
        name: p.name,
        score: p.score,
      }));
      io.to(pin).emit("leaderboard_update", leaderboard);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (const theGame in games) {
      for (const thePlayerKey in games?.[theGame]?.players) {
        if (thePlayerKey === socket.id) {
          delete games?.[theGame]?.players[socket.id];
        }
      }
    }
  });
});
