import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle, IoTriangleSharp } from "react-icons/io5";
import RotateLoader from "react-spinners/RotateLoader";
import { override } from "./helper/helper";
import {
  HashLoader,
  PacmanLoader,
  PropagateLoader,
  RingLoader,
  SquareLoader,
} from "react-spinners";

const socket = io("http://localhost:3001/", {
  transports: ["websocket", "polling"],
});

function GamePlayer() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { principal, nickname } = useSelector((state: any) => state.user);
  const [isIntroduction, setIsIntroduction] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [count, setCount] = useState(-1);

  const gamePin = queryParams.get("gameId");

  useEffect(() => {
    setIsIntroduction(true);
    setTimeout(() => {
      setQuestionReady(true);
      setIsIntroduction(false);
      setCount(5);
    }, 2500);
    socket.emit("join_game", { gamePin: gamePin });
    socket.on("admin_has_left", () => {
      navigate("/home");
    });

    const handleBeforeUnload = (event: any) => {
      socket.emit("player_left", { gamePin: gamePin, principal, nickname });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (count > 1) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 1) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="waiting-game">
      <div className="bg-black-10 h-[100vh] w-[100vw]">
        {isIntroduction && (
          <div className="flex justify-center items-center flex-col gap-y-2 h-full">
            <p className="text-[60px] font-bold">Get Ready!</p>
            <PacmanLoader
              color={"#97E8D4"}
              loading={true}
              cssOverride={override}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p className="text-[36px] font-semibold text-center px-[15px]">
              Loading...
            </p>
          </div>
        )}
        {questionReady && (
          <div className="flex justify-center items-center flex-col gap-y-2 h-full relative">
            <p className="text-[60px] font-bold">Question 1</p>
            {count > 0 && (
              <div className="circle-countdown-container rounded-full w-fit">
                <div key={count} className="countdown-number w-fit">
                  {count}
                </div>
              </div>
            )}
            <p className="text-[36px] font-semibold text-center px-[15px]">
              Ready...
            </p>
          </div>
        )}
      </div>
      <div className="bottom-bar absolute bottom-0">
        <div className="bottom-bar-inner flex justify-between w-full items-center h-full">
          <div className="flex gap-x-2 items-center">
            <IoPersonCircle color="black" size="32px" />
            <p className="font-bold text-[24px] text-black">Donald Trump</p>
          </div>
          <div className="bg-[#333333] flex px-[40px] rounded-[5px] py-[5px] justify-center items-center">
            <p className="font-bold text-[20px]">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePlayer;
