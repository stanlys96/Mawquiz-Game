import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { settingQuestions } from "../../stores/user-slice";

const socket = io("https://mawquiz-backend-production.up.railway.app/", {
  transports: ["websocket", "polling"],
});

function Waiting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search, state } = useLocation();
  const queryParams = new URLSearchParams(search);
  const { principal, nickname } = useSelector((state: any) => state.user);

  const gamePin = queryParams.get("gamePin");

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    socket.emit("join_game", { gamePin: gamePin });
    socket.on("admin_has_left", () => {
      navigate("/home", {
        state: {
          routerPrincipal: state.routerPrincipal,
        },
      });
    });
    socket.on("game_started", (data) => {
      dispatch(settingQuestions(data));
      navigate(`/game-player?gamePin=${gamePin}`, {
        state: {
          routerPrincipal: state.routerPrincipal,
        },
      });
    });
    const handleBeforeUnload = (event: any) => {
      socket.emit("player_left", { gamePin: gamePin, principal, nickname });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
