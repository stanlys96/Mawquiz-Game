import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import "./index.css";
import Create from "./Create";
import ConnectWallet from "./ConnectWallet";
import LiveGame from "./LiveGame";
import Waiting from "./Waiting";
import GamePlay from "./GamePlay";
import ShowQuizTitle from "./ShowQuizTitle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConnectWallet />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/live-game/:gameId?" element={<LiveGame />} />
        <Route path="/waiting/:gameId?" element={<Waiting />} />
        <Route path="/game-play/:gameId?" element={<GamePlay />} />
        <Route path="/show-quiz-title/:gameId?" element={<ShowQuizTitle />} />
      </Routes>
    </Router>
  );
}

export default App;
