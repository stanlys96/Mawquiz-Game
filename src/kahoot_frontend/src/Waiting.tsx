import { useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { FaUnlock, FaLock } from "react-icons/fa";
import { io } from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";

interface Player {
  nickname: string;
  owner: string;
}

const socket = io("http://localhost:3001");

function Waiting() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [players, setPlayers] = useState<any>([]);
  const [locked, setLocked] = useState(false);
  const { search } = useLocation();
  const [uniquePlayers, setUniquePlayers] = useState<Set<any>>(new Set());
  const [uniqueOwners, setUniqueOwners] = useState<Set<any>>(new Set());
  const queryParams = new URLSearchParams(search);
  const { principal, nickname } = useSelector((state: any) => state.user);

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

  return (
    <div className="waiting-game">
      <div className="bg-black-10 h-[100vh] w-[100vw]">
        <img
          className="w-[150px] md:w-[200px] absolute bottom-2 left-2 cursor-pointer"
          src="kahoot-2.png"
        />
        <div className="flex justify-center items-center flex-col gap-y-2 h-full">
          <button className="astronaut-btn">
            <div className="astronaut-div">
              <div className="astronaut-subdiv">
                <img className="astronaut-img-1" src="/helm.svg" />
                <img className="astronaut-img-2" src="/earth.svg" />
              </div>
            </div>
          </button>
          <p className="text-[36px] font-semibold px-[15px] text-center">
            {nickname
              ? (nickname?.length > 15
                  ? nickname?.slice(0, 15) + "..."
                  : nickname ?? "") ?? ""
              : (principal?.length > 15
                  ? principal?.slice(0, 15) + "..."
                  : principal ?? "") ?? ""}
          </p>
          <p className="text-[20px] font-semibold text-center px-[15px]">
            You're in! See your nickname on screen?
          </p>
        </div>
      </div>
    </div>
  );
}

export default Waiting;
