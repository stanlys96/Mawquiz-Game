import { useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { FaUnlock, FaLock } from "react-icons/fa";
import { io } from "socket.io-client";
import axios from "axios";

interface Player {
  nickname: string;
  owner: string;
}

const socket = io("http://localhost:3001/", {
  transports: ["websocket", "polling"],
});

function GamePlay() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [players, setPlayers] = useState<any>([]);
  const [locked, setLocked] = useState(false);
  const { search } = useLocation();
  const [uniquePlayers, setUniquePlayers] = useState<Set<any>>(new Set());
  const [uniqueOwners, setUniqueOwners] = useState<Set<any>>(new Set());
  const queryParams = new URLSearchParams(search);

  const gamePin = queryParams.get("gameId");

  useEffect(() => {
    socket.emit("join_game", { gamePin: gamePin });
    // Listen for the player_joined event
    socket.on("player_joined", (data) => {
      setUniquePlayers((prevSet) => {
        const updatedSet = new Set(prevSet);
        updatedSet.add(data?.thePlayer?.owner);
        if (prevSet?.size !== updatedSet?.size) {
          setUniqueOwners((prevState) => {
            const updatedState = new Set(prevState);
            updatedState.add(data?.thePlayer);
            return updatedState;
          });
        }
        return updatedSet;
      });
    });
  }, []);

  return <div className="live-game"></div>;
}

export default GamePlay;
