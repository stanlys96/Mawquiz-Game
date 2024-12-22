import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import "./index.css";
import Create from "./Create";
import ConnectWallet from "./ConnectWallet";
import LiveGame from "./LiveGame";
import Waiting from "./Waiting";
import ShowQuizTitle from "./ShowQuizTitle";
import GamePlayer from "./GamePlayer";
import SoloGame from "./SoloGame";

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
        <Route path="/show-quiz-title/:gameId?" element={<ShowQuizTitle />} />
        <Route path="/game-player/:gameId?" element={<GamePlayer />} />
        <Route path="/solo-game/:gameId?" element={<SoloGame />} />
      </Routes>
    </Router>
  );
}

export default App;
