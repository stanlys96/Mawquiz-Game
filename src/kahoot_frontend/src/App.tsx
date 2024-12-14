import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import "./index.css";
import Create from "./Create";
import ConnectWallet from "./ConnectWallet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConnectWallet />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  );
}

export default App;
