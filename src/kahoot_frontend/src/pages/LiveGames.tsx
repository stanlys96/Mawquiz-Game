import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { settingKahoot, settingPrincipal } from "../../stores/user-slice";
import IC from "../utils/IC";
import {
  _SERVICE,
  Game,
} from "../../../declarations/kahoot_backend/kahoot_backend.did";
import { IoPerson } from "react-icons/io5";
import { Principal } from "@dfinity/principal";
import { LoadingLayover } from "../components/LoadingLayover";
import axios from "axios";
import Swal from "sweetalert2";
import { getSocket } from "../helper/helper";
import { Empty } from "antd";

function LiveGames() {
  const location = useLocation();
  const { state } = location;
  const socket = getSocket();
  const navigate = useNavigate();
  const { principal, nickname } = useSelector((state: any) => state.user);
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);
  const [liveGames, setLiveGames] = useState<any>([]);
  const [, setCurrentUser] = useState<any>();

  const filterLiveGames = (theGame: any) => {
    return theGame?.owner !== state?.routerPrincipal;
  };
  const finalLiveGames = liveGames?.filter(filterLiveGames);
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://mawquiz-backend-production.up.railway.app/getLiveGames")
      .then((result) => {
        const theResult = result.data;
        setLiveGames(theResult?.games);
        setLoading(false);
        socket.on("games_data_changed", ({ games }: any) => {
          setLiveGames(games);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    IC.getBackend((result: any) => {
      setBackend(result);
    });
    return () => {
      socket.off("games_data_changed");
    };
  }, []);

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    if (principal && backend) {
      backend
        ?.getUser(Principal.fromText(principal))
        ?.then((result) => {
          setCurrentUser(result?.[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [principal, backend]);
  return (
    <main className="h-[100vh]">
      <LoadingLayover loading={loading} description="Loading data..." />
      <div className="flex md:flex-row flex-col gap-y-2 items-center justify-center md:justify-between bg-[#FFF] h-[18vh] md:h-[10vh] border-b border-b-[#E9E8E9] py-[10px] px-[15px]">
        <img
          onClick={() => {
            navigate("/home", {
              state: {
                routerPrincipal: state.routerPrincipal,
              },
            });
          }}
          className="cursor-pointer w-[200px]"
          src="logo.png"
        />
        <div className="flex gap-x-2 items-center">
          <p className="text-black">
            {nickname
              ? nickname?.length > 15
                ? nickname?.slice(0, 15) + "..."
                : nickname
              : principal?.slice(0, 15) + "..."}
          </p>
          <div
            onClick={() =>
              navigate("/profile", {
                state: {
                  routerPrincipal: state.routerPrincipal,
                },
              })
            }
            className="cursor-pointer p-[8px] rounded-full purple-bg"
          >
            <IoPerson size="22px" color="white" />
          </div>
        </div>
      </div>
      <div
        style={{ borderRadius: 0 }}
        className="flex flex-col py-[50px] glowing-container-2 justify-center items-center gap-y-4 bg-[#FAFAFA] min-h-[82vh]  md:min-h-[90vh]"
      >
        {finalLiveGames?.length > 0 ? (
          finalLiveGames?.map((liveGame: any) => (
            <div
              key={liveGame?.gameRoom}
              className="w-[70%] bg-white px-[20px] py-[12px] shadow-card rounded-[4px] flex md:flex-row gap-y-3 flex-col  justify-between items-center"
            >
              <div className="flex gap-x-4 md:flex-row flex-col gap-y-2 items-center">
                <img
                  className="w-[150px] h-[100px] "
                  src={
                    liveGame?.imageCoverUrl
                      ? liveGame?.imageCoverUrl
                      : "/logo.png"
                  }
                />
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-black font-bold text-[20px] md:text-left text-center">
                    {liveGame?.title} ({liveGame?.gameRoom})
                  </p>
                  <p className="text-black md:text-left text-center">
                    {Object.keys(liveGame?.players)?.length} players
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-x-3 gap-y-3 items-center">
                <div className="flex gap-x-2 md:flex-row flex-col gap-y-2 items-center">
                  <div
                    className={`${"glowing-container-2"} font-bold px-[25px] py-[10px]`}
                  >
                    {!liveGame?.started ? "Waiting" : "Game has started!"}
                  </div>
                  {!liveGame?.started && (
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const currentUser = {
                            owner: state.routerPrincipal,
                            nickname: nickname,
                          };
                          const result = await axios.post(
                            `https://mawquiz-backend-production.up.railway.app/joinGame/${liveGame?.gameRoom}`,
                            {
                              player: { ...currentUser, admin: false },
                            }
                          );
                          const status = result?.data?.status;
                          if (status === 200) {
                            navigate(`/waiting?gamePin=${liveGame?.gameRoom}`, {
                              state: {
                                routerPrincipal: state.routerPrincipal,
                              },
                            });
                          }
                          setLoading(false);
                        } catch (e: any) {
                          console.log(e);
                          Swal.fire(
                            "There's a problem!",
                            e?.response?.data?.message ?? "",
                            "info"
                          );
                          setLoading(false);
                        }
                      }}
                      className="save-button"
                    >
                      Join Game
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-y-4">
            <Empty />
            <p>No live games available...</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default LiveGames;
