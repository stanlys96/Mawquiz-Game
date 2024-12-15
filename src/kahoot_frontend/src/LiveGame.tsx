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

const socket = io("https://mawquiz-backend-production.up.railway.app/");

function LiveGame() {
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

  return (
    <div className="live-game">
      <div className="h-[15vh] lg:hidden bg-white flex justify-center items-center flex-col gap-y-1">
        {!locked ? (
          <div className="flex justify-center items-center flex-col gap-y-1">
            <p className="text-black text-center text-[14px] px-[10px]">
              Join at{" "}
              <span className="font-bold">
                https://cv2ns-7iaaa-aaaac-aac3q-cai.icp0.io/
              </span>
            </p>
            <p className="text-black text-[14px]">
              with game code: <span className="font-bold">{gamePin}</span>
            </p>
          </div>
        ) : (
          <div className="text-black text-center text-[14px] px-[10px] flex flex-col items-center gap-y-1 gap-x-2">
            This game is now locked - no one else can join <FaLock />
          </div>
        )}
      </div>
      <div className="hidden lg:flex gamepin-container">
        <div className="gamepin-subcontainer">
          <div className="gamepin-innercontainer">
            <div className="gamepin-3">
              <div className="gamepin-4">
                <div className="gamepin-left">
                  <div className="gamepin-left-inner px-[10px]">
                    <p>Join at</p>
                    <p className="font-bold">
                      https://cv2ns-7iaaa-aaaac-aac3q-cai.icp0.io/
                    </p>
                  </div>
                </div>
                {!locked ? (
                  <div className="gamepin-right flex items-start flex-col gap-y-4">
                    <p className="gamepin-text-right">Game Code:</p>
                    <p className="the-pin">{gamePin}</p>
                  </div>
                ) : (
                  <div className="gamepin-right flex items-start flex-col gap-y-4">
                    <div className="the-dark-bg w-full h-full flex justify-center items-center px-[50px] rounded-[8px]">
                      <FaLock size="30px" color="white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center mt-4 md:mt-1">
        <div className="flex items-center gap-x-4">
          <img className="w-[150px] md:w-[200px]" src="kahoot-2.png" />
          <div className="flex gap-x-2">
            <button
              onClick={() => setLocked((prevState) => !prevState)}
              className={`${!locked ? "lock-btn" : "lock-btn-lock"} font-bold`}
            >
              {locked ? <FaLock size="20px" /> : <FaUnlock size="20px" />}
            </button>
            <button
              onClick={() => {}}
              disabled={uniqueOwners?.size <= 0}
              className="lock-btn font-bold"
            >
              Start
            </button>
          </div>
        </div>
        <div className="h-[65vh] md:h-[58vh] overflow-auto">
          <div className="flex flex-wrap w-full items-start justify-center h-full">
            {uniqueOwners?.size > 0 ? (
              Array.from(uniqueOwners)?.map((owner: any) => (
                <div className="mt-4 flex items-center flex-wrap relative user-container overflow-y-auto">
                  <button className="user-button">
                    <div className="user-avatar">
                      <IoPersonCircle size={isMobile ? "25px" : "45px"} />
                    </div>
                    <span className="hover:line-through">
                      {owner?.nickname?.length > 15
                        ? owner?.nickname?.slice(0, 15) + "..."
                        : owner?.nickname ?? ""}
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="bg-[#47178F] p-[5px] rounded-[5px]">
                  <p className="text-[20px] md:text-[24px]">
                    Waiting for other players...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <img
          className="w-[150px] md:w-[200px] absolute bottom-2 left-2 cursor-pointer"
          src="kahoot-2.png"
        />
      </div>
      <div className="player-absolute absolute bottom-2 right-2 flex gap-x-2">
        <IoPersonCircle size="32px" className="ml-2" />
        <p className="player-absolute-text mr-5">{uniqueOwners?.size ?? 0}</p>
      </div>
    </div>
  );
}

export default LiveGame;
