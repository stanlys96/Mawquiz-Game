import { useLocation } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";

function LiveGame() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const gamePin = queryParams.get("gameId");
  return (
    <div className="live-game">
      <div className="h-[15vh] lg:hidden bg-white flex justify-center items-center flex-col gap-y-1">
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
                <div className="gamepin-right flex items-start flex-col gap-y-4">
                  <p className="gamepin-text-right">Game Code:</p>
                  <p className="the-pin">{gamePin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center mt-1">
        <img className="w-[150px] md:w-[200px]" src="kahoot-2.png" />
        <div className="h-[65vh] md:h-[58vh] overflow-auto">
          <div className="flex flex-wrap w-full items-center justify-center">
            {Array(25)
              .fill(0)
              ?.map((theData) => (
                <div className="mt-4 flex items-center flex-wrap relative user-container overflow-y-auto">
                  <button className="user-button">
                    <div className="user-avatar">
                      <IoPersonCircle size={isMobile ? "25px" : "45px"} />
                    </div>
                    <span className="hover:line-through">ajsdoijaosidj</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div>
        <img
          className="w-[150px] md:w-[200px] absolute bottom-2 left-2 cursor-pointer"
          src="kahoot-2.png"
        />
      </div>
    </div>
  );
}

export default LiveGame;
