import { useCallback, useEffect, useState } from "react";
import IC from "../utils/IC";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  _SERVICE,
  Game,
} from "../../../declarations/kahoot_backend/kahoot_backend.did";
import { Principal } from "@dfinity/principal";
import { FiEdit } from "react-icons/fi";
import { getUserNickname } from "../helper/helper";
import { notification } from "antd";
import { settingKahoot, settingPrincipal } from "../../stores/user-slice";
import { FaHome } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";
import {
  BouncyModal,
  GradientButton,
  JiggleModal,
  LoadingLayover,
  LogoutComponent,
  PlayGameComponent,
  SquareAndCircleBg,
  UpdateNickname,
} from "../components";
import { MdQuiz } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

function Profile() {
  const location = useLocation();
  const { state } = location;
  const principal = state?.routerPrincipal;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isHoveredKahoot, setIsHoveredKahoot] = useState(false);
  const [category, setCategory] = useState("kahoot");
  const [backend, setBackend] = useState<_SERVICE>();
  const [currentUser, setCurrentUser] = useState<any>();
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [isOpenModalNickname, setIsOpenModalNickname] = useState(false);
  const [isOpenModalJiggle, setIsOpenModalJiggle] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [nickname, setNickname] = useState("");
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [isOpenModalKahoot, setIsOpenModalKahoot] = useState<boolean>(false);
  const [currentPickedKahoot, setCurrentPickedKahoot] = useState<Game>();
  const [initialLoading, setInitialLoading] = useState<boolean>(false);

  const toggleModalJiggle = () => {
    setIsOpenModalJiggle((prevState) => !prevState);
  };

  const getPaddingTop = useCallback(() => {
    if (userGames?.length > 4) {
      return 240;
    }
    return userGames?.length * 60;
  }, [userGames]);

  const handleUpdateNickname = useCallback(() => {
    if (nickname?.trim()?.length === 0) return;
    if (nickname === currentUser?.nickname) return;
    setNicknameLoading(true);
    backend
      ?.updateNickname(principal, nickname)
      ?.then(async (result) => {
        if (result) {
          const theUser = await backend?.getUser(Principal.fromText(principal));
          setCurrentUser(theUser?.[0]);
          setIsOpenModalNickname(false);
          setNicknameLoading(false);
          notification.success({
            message: "Success!",
            description: "You have successfully updated your nickname!",
            placement: isMobile ? "bottomLeft" : "topLeft",
          });
        } else {
          setNicknameLoading(false);
          setShowErrorMessage(true);
          setTimeout(() => {
            setShowErrorMessage(false);
          }, 2500);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsOpenModalNickname(false);
        setNicknameLoading(false);
      });
  }, [
    nickname,
    currentUser?.nickname,
    nicknameLoading,
    backend,
    currentUser,
    isOpenModalNickname,
    notification,
    showErrorMessage,
  ]);

  const handleCancelNickname = useCallback(() => {
    setIsOpenModalNickname(false);
    setNickname("");
  }, [isOpenModalNickname, nickname]);

  const handleCloseNickname = useCallback(() => {
    if (nicknameLoading) return;
    setIsOpenModalNickname(false);
  }, [nicknameLoading, isOpenModalNickname]);

  const handleLogout = useCallback(() => {
    dispatch(settingPrincipal(""));
    navigate("/");
  }, []);

  const handleNavigateHome = useCallback(() => {
    navigate("/home", {
      state: {
        routerPrincipal: state.routerPrincipal,
      },
    });
  }, []);

  const handleNavigateCreate = useCallback(() => {
    navigate("/create", {
      state: {
        mode: "create",
        routerPrincipal: state.routerPrincipal,
      },
    });
  }, []);

  const handleNavigateLibrary = useCallback(() => {
    navigate("/library", {
      state: {
        routerPrincipal: state.routerPrincipal,
      },
    });
  }, []);

  const handleOpenModalNickname = useCallback(() => {
    if (!currentUser?.nickname) return;
    if (currentUser?.nickname?.length > 35) {
      setNickname("");
    } else {
      setNickname(currentUser?.nickname ?? "");
    }
    setIsOpenModalNickname(true);
  }, [currentUser?.nickname, nickname, isOpenModalNickname]);

  const handleClickCard = useCallback(
    (userGame: Game) => {
      setIsOpenModalKahoot(true);
      setCurrentPickedKahoot(userGame);
    },
    [isOpenModalKahoot, currentPickedKahoot]
  );

  const handleCloseKahootModal = useCallback(() => {
    if (nicknameLoading) return;
    setIsOpenModalKahoot(false);
  }, [nicknameLoading, isOpenModalKahoot]);

  const handleEditGame = useCallback(() => {
    dispatch(settingKahoot(currentPickedKahoot));
    navigate("/create", {
      state: {
        mode: "edit",
        data: currentPickedKahoot?.questions,
        title: currentPickedKahoot?.title,
        description: currentPickedKahoot?.description,
        gamePin: currentPickedKahoot?.gamePin,
        routerPrincipal: state.routerPrincipal,
        imageCoverUrl: currentPickedKahoot?.imageCoverUrl,
      },
    });
  }, [currentPickedKahoot]);

  const handleSoloGame = useCallback(() => {
    dispatch(settingKahoot(currentPickedKahoot));
    navigate(`/solo-game?gamePin=${currentPickedKahoot?.gamePin}`, {
      state: {
        routerPrincipal: principal,
      },
    });
  }, [currentPickedKahoot, principal]);
  const handleHostGameLive = useCallback(async () => {
    try {
      setLoading(true);
      setIsOpenModalKahoot(false);
      const theData = await fetch(
        "https://mawquiz-backend-production.up.railway.app/games",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gamePin: currentPickedKahoot?.gamePin,
            questions: currentPickedKahoot?.questions,
            owner: state.routerPrincipal,
            nickname: currentUser?.nickname,
            title: currentPickedKahoot?.title,
            description: currentPickedKahoot?.description,
            imageCoverUrl: currentPickedKahoot?.imageCoverUrl,
          }),
        }
      );

      const createGame = await theData?.json();
      if (createGame?.message !== "error") {
        dispatch(settingKahoot(currentPickedKahoot));
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
  }, [loading, isOpenModalKahoot, currentPickedKahoot]);

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    IC.getBackend(async (result: any) => {
      setBackend(result);
    });
  }, []);

  useEffect(() => {
    if (backend) {
      setInitialLoading(true);
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
          setInitialLoading(false);
          setUserGames(res);
        })
        .catch((err) => {
          setInitialLoading(false);
          console.log(err);
        });
    }
  }, [principal, backend]);
  return (
    <main className="background flex h-min-[100vh] justify-center items-center">
      <LoadingLayover
        loading={loading || initialLoading}
        description={loading ? "Creating game room!" : "Loading data..."}
      />
      <div className="flex main-profile flex-col justify-center items-center gap-y-3">
        <div className="absolute z-infinite top-[10px] right-[10px] p-[16px] identity-container flex gap-x-2 items-center">
          <div
            onClick={handleNavigateHome}
            className="cursor-pointer p-[8px] bg-blue rounded-full flex items-center justify-center"
          >
            <FaHome color="white" />
          </div>
          <div
            onClick={toggleModalJiggle}
            className="cursor-pointer p-[8px] purple-bg rounded-full flex items-center justify-center"
          >
            <RiLogoutCircleLine color="white" />
          </div>
          <div
            onClick={handleOpenModalNickname}
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <p className="dark-text">
              {getUserNickname(currentUser?.nickname, currentUser?.owner)}
            </p>
          </div>
          <div
            onClick={handleOpenModalNickname}
            className="cursor-pointer p-[8px] bg-dark-green rounded-full flex items-center justify-center"
          >
            <FiEdit color="white" />
          </div>
        </div>
        <div
          className={`flex gap-x-4 md:pt-0 md:flex-row flex-col-reverse gap-y-4 items-center`}
          style={isMobile ? { paddingTop: `${getPaddingTop()}px` } : {}}
        >
          <div className="glowing-container-2 px-[10px] pt-[10px] pb-[20px] h-fit mb-[60px] md:mb-0 mx-[10px]">
            <div className="your-kahoots-top">
              <div className="flex gap-x-4 justify-center">
                <GradientButton
                  icon={<MdQuiz size="26px" />}
                  className="flex gap-x-2 items-center"
                  gradient="linear-gradient(90deg, #2c3e50, #4ca1af)"
                  text="Your mawquizes"
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className="game-card-container">
              {userGames?.length > 0 ? (
                userGames?.map((userGame) => (
                  <div
                    onClick={() => handleClickCard(userGame)}
                    className="game-card"
                  >
                    <div className="game-card-inner cursor-pointer">
                      <div className="relative">
                        <img
                          src={
                            userGame?.imageCoverUrl
                              ? userGame?.imageCoverUrl
                              : "logo.png"
                          }
                          className="h-[74px] rounded-l-[4px] w-[109px]"
                        />
                        <div className="question-card">
                          <p className="text-white question-card-text">
                            {userGame?.questions?.length}&nbsp;Questions
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col border-l border-l-gray border-t border-t-gray border-r border-r-gray justify-between w-[200px]">
                        <p className="py-[8px] px-[12px] text-black font-semibold">
                          {userGame?.title?.length > 15
                            ? (userGame?.title?.slice(0, 15) ?? "") + "..."
                            : userGame?.title ?? ""}
                        </p>
                        <div className="px-[12px] py-[2px] border-t-[1px] border-t-gray bottom-game-card flex justify-center items-center gap-x-[50px]">
                          <p className="dark-text text-center font-semibold">
                            {userGame?.played} plays
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center">
                  You have not created any games...
                </p>
              )}
            </div>
            {userGames?.length > 0 && (
              <GradientButton
                icon={<FaEye size="26px" />}
                onClick={handleNavigateLibrary}
                className="mt-[10px] self-center flex gap-x-2 items-center mx-auto justify-center"
                gradient="linear-gradient(90deg, #ff9966, #ff5e62)"
                text={`See all (${userGames?.length})`}
              />
            )}
          </div>
          <div
            onClick={handleNavigateCreate}
            className="glowing-container w-[199px] h-[260px] cursor-pointer mt-[40px] md:mt-0"
          >
            <a className="kahoot-card-title">
              <div className="card-top"></div>
              <div className="card-bot">
                <div className="card-mid">
                  <span className="card-span flex justify-center items-center">
                    <FaPlus
                      style={{ verticalAlign: "middle" }}
                      className="w-[100%] h-[100%] mx-auto"
                    />
                  </span>
                </div>
                <div className="card-desc text-white">Create a new mawquiz</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <SquareAndCircleBg />
      <BouncyModal
        isOpenModal={isOpenModalNickname}
        handleClose={handleCloseNickname}
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        innerDivClassName="bg-white rounded-lg shadow-lg px-[16px] md:px-[32px] text-center w-[90vw] lg:w-[50vw]"
      >
        <UpdateNickname
          nickname={nickname}
          setNickname={setNickname}
          showErrorMessage={showErrorMessage}
          nicknameLoading={nicknameLoading}
          handleCancelModal={handleCancelNickname}
          handleUpdateNickname={handleUpdateNickname}
        />
      </BouncyModal>
      <JiggleModal
        isOpen={isOpenModalJiggle}
        onClose={toggleModalJiggle}
        outerDivClassName="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
        innerDivClassName="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
      >
        <LogoutComponent onClose={toggleModalJiggle} onLogout={handleLogout} />
      </JiggleModal>
      <BouncyModal
        isOpenModal={isOpenModalKahoot}
        handleClose={handleCloseKahootModal}
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        innerDivClassName="bg-white rounded-lg shadow-lg px-[16px] md:px-[32px] text-center w-[90vw] relative lg:w-[50vw]"
      >
        <PlayGameComponent
          currentPickedKahoot={currentPickedKahoot}
          handleClose={() => setIsOpenModalKahoot(false)}
          handleEditGame={handleEditGame}
          handleHostGameLive={handleHostGameLive}
          handleSoloGame={handleSoloGame}
        />
      </BouncyModal>
    </main>
  );
}

export default Profile;
