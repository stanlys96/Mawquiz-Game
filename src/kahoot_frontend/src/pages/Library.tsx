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
import { FaPencil } from "react-icons/fa6";
import { LoadingLayover } from "../components/LoadingLayover";

function Library() {
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { principal, nickname } = useSelector((state: any) => state.user);
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [, setCurrentUser] = useState<any>();

  const handleHostGameLive = useCallback(
    async (userGame: Game) => {
      try {
        setLoading(true);
        const theData = await fetch("http://localhost:3001/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gamePin: userGame?.gamePin,
            questions: userGame?.questions,
          }),
        });

        const createGame = await theData?.json();
        if (createGame?.message !== "error") {
          dispatch(settingKahoot(userGame));
          navigate(`/live-game?gamePin=${createGame?.gameRoom}`, {
            state: {
              routerPrincipal: state.routerPrincipal,
            },
          });
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e, "<< E");
      }
    },
    [loading, state, userGames]
  );

  useEffect(() => {
    IC.getBackend((result: any) => {
      setBackend(result);
    });
  }, []);

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    if (principal && backend) {
      setLoading(true);
      backend
        ?.getUser(Principal.fromText(principal))
        ?.then((result) => {
          setCurrentUser(result?.[0]);
        })
        .catch((err) => {
          console.log(err);
        });
      backend
        ?.getGamesByPrincipal(principal)
        ?.then(async (res) => {
          setLoading(false);
          setUserGames(res);
        })
        .catch((err) => {
          setLoading(false);
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
          <button
            onClick={() => {
              navigate("/create", {
                state: {
                  mode: "create",
                  routerPrincipal: state.routerPrincipal,
                },
              });
            }}
            className="question-btn flex-1"
          >
            Create
          </button>
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
      <div className="flex flex-col py-[50px] glowing-container-2 justify-center items-center gap-y-4 bg-[#FAFAFA] min-h-[82vh]  md:min-h-[90vh]">
        {userGames?.map((userGame, index) => (
          <div
            key={userGame?.gamePin}
            className="w-[70%] bg-white px-[20px] py-[12px] shadow-card rounded-[4px] flex md:flex-row gap-y-3 flex-col  justify-between items-center"
          >
            <div className="flex gap-x-4 md:flex-row flex-col gap-y-2 items-center">
              <img
                className="w-[150px] h-[100px]"
                src={
                  userGame?.imageCoverUrl
                    ? userGame?.imageCoverUrl
                    : "/logo.png"
                }
              />
              <p className="text-black">{userGame?.title}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-x-3 gap-y-3 items-center">
              <div className="flex gap-x-2 items-center">
                <button
                  onClick={() => handleHostGameLive(userGame)}
                  className="cursor-pointer exit-button"
                >
                  Host live
                </button>
                <button
                  onClick={() => {
                    dispatch(settingKahoot(userGame));
                    navigate(`/solo-game?gamePin=${userGame?.gamePin}`, {
                      state: {
                        routerPrincipal: state.routerPrincipal,
                      },
                    });
                  }}
                  className="save-button"
                >
                  Play solo
                </button>
              </div>
              <div
                onClick={() => {
                  dispatch(settingKahoot(userGame));
                  navigate("/create", {
                    state: {
                      mode: "edit",
                      data: userGame?.questions,
                      title: userGame?.title,
                      description: userGame?.description,
                      gamePin: userGame?.gamePin,
                      routerPrincipal: state.routerPrincipal,
                      imageCoverUrl: userGame?.imageCoverUrl,
                    },
                  });
                }}
                className="cursor-pointer"
              >
                <FaPencil
                  className="cursor-pointer"
                  size="20px"
                  color="black"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Library;
