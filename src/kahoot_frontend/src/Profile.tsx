import { useEffect, useState } from "react";
import IC from "./utils/IC";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { IoPersonCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  _SERVICE,
  Game,
} from "../../declarations/kahoot_backend/kahoot_backend.did";
import { Principal } from "@dfinity/principal";
import { FiEdit } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { modalVariants, override } from "./helper/helper";
import { BeatLoader } from "react-spinners";
import { notification } from "antd";
import { settingPrincipal } from "../stores/user-slice";
import { FaHome } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { principal } = useSelector((state: any) => state.user);
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

  const toggleModalJiggle = () => {
    setIsOpenModalJiggle((prevState) => !prevState);
  };

  useEffect(() => {
    IC.getBackend(async (result: any) => {
      setBackend(result);
    });
  }, []);

  useEffect(() => {
    if (principal && backend) {
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
          setUserGames(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [principal, backend]);

  return (
    <main className="background flex justify-center items-center">
      <div className="flex main-profile flex-col justify-center items-center gap-y-3">
        <div className="absolute top-[10px] right-[10px] p-[16px] identity-container flex gap-x-2 items-center">
          <div
            onClick={() => {
              navigate("/home");
            }}
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
            onClick={() => {
              if (!currentUser?.nickname) return;
              if (currentUser?.nickname?.length > 35) {
                setNickname("");
              } else {
                setNickname(currentUser?.nickname ?? "");
              }
              setIsOpenModalNickname(true);
            }}
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <p className="dark-text">
              {currentUser?.nickname
                ? currentUser?.nickname?.length > 20
                  ? currentUser?.nickname?.slice(0, 20) + "..."
                  : currentUser?.nickname ?? ""
                : currentUser?.owner?.slice(0, 20) + "..."}
            </p>
          </div>
          <div
            onClick={() => {
              if (!currentUser?.nickname) return;
              if (currentUser?.nickname?.length > 35) {
                setNickname("");
              } else {
                setNickname(currentUser?.nickname ?? "");
              }
              setIsOpenModalNickname(true);
            }}
            className="cursor-pointer p-[8px] bg-dark-green rounded-full flex items-center justify-center"
          >
            <FiEdit color="white" />
          </div>
        </div>
        <div className="flex gap-x-4 md:pt-0 pt-[250px] md:flex-row flex-col-reverse gap-y-4 items-center md:items-start">
          <div className="your-kahoots h-fit">
            <div className="your-kahoots-top">
              <div className="flex gap-x-4">
                <p
                  onClick={() => setCategory("kahoot")}
                  onMouseEnter={() => setIsHoveredKahoot(true)}
                  onMouseLeave={() => setIsHoveredKahoot(false)}
                  className={`text-[#6E6E6E] ${
                    category === "kahoot" || isHoveredKahoot
                      ? "text-container"
                      : "text-ordinary"
                  } cursor-pointer font-semibold kahoot-text`}
                >
                  Your kahoots
                </p>
              </div>
            </div>
            <div className="game-card-container">
              {userGames?.length > 0 ? (
                userGames?.map((userGame) => (
                  <div className="game-card">
                    <div className="game-card-inner cursor-pointer">
                      <div className="relative">
                        <img
                          src="logo.png"
                          className="h-[74px] rounded-l-[4px] w-[109px]"
                        />
                        <div className="question-card">
                          <p className="text-white question-card-text">
                            {userGame?.questions?.length}&nbsp;Questions
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between w-[200px]">
                        <p className="py-[8px] px-[12px] text-black font-semibold">
                          {userGame?.title?.length > 15
                            ? (userGame?.title?.slice(0, 15) ?? "") + "..."
                            : userGame?.title ?? ""}
                        </p>
                        <div className="px-[12px] py-[2px] bottom-game-card flex justify-between items-center gap-x-[50px]">
                          <p className="dark-text font-semibold">
                            {userGame?.played} plays
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-black text-center">
                  You have not created any games...
                </p>
              )}
            </div>
            {userGames?.length > 0 && (
              <p className="text-see-all text-center font-bold cursor-pointer my-[16px] underline">
                See all ({userGames?.length})
              </p>
            )}
          </div>
          <div
            onClick={() => navigate("/create")}
            className="kahoot-card cursor-pointer"
          >
            <a className="kahoot-card-title">
              <div className="card-top">
                <img src="/card-kahoot.svg" />
              </div>
              <div className="card-bot">
                <div className="card-mid">
                  <span className="card-span flex justify-center items-center">
                    <FaPlus
                      style={{ verticalAlign: "middle" }}
                      className="w-[100%] h-[100%] mx-auto"
                    />
                  </span>
                </div>
                <div className="card-desc text-black">Create a new kahoot</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="circle-bg" />
      <div className="square-bg" />
      <AnimatePresence>
        {isOpenModalNickname && (
          <div
            onClick={() => {
              if (nicknameLoading) return;
              setIsOpenModalNickname(false);
            }}
            className="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg px-[16px] md:px-[32px] text-center w-[90vw] lg:w-[50vw]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mt-[24px]">
                <p className="text-gray mb-[12px] font-semibold text-center">
                  Nickname
                </p>
                <p className="text-black text-center">
                  Enter a nickname for your profile.
                </p>
                <div className="relative">
                  <input
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                    }}
                    className="mt-[12px] text-center title-input outline-none w-full"
                    type="text"
                    maxLength={35}
                  />
                  <p className="absolute top-[40%] text-[#6E6E6E] right-2">
                    {35 - (nickname?.length ?? 0)}
                  </p>
                </div>
                {showErrorMessage && (
                  <p className="text-red font-medium mt-2">
                    Nickname is already picked
                  </p>
                )}
              </div>
              {nicknameLoading ? (
                <div className="py-[20px]">
                  <BeatLoader
                    color={"#97E8D4"}
                    loading={nicknameLoading}
                    cssOverride={override}
                    size={35}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <div className="close-toggle-button gap-x-2">
                  <button
                    onClick={() => {
                      setIsOpenModalNickname(false);
                      setNickname("");
                    }}
                    className="exit-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (nickname?.trim()?.length === 0) return;
                      if (nickname === currentUser?.nickname) return;
                      setNicknameLoading(true);
                      backend
                        ?.updateNickname(principal, nickname)
                        ?.then(async (result) => {
                          if (result) {
                            const theUser = await backend?.getUser(
                              Principal.fromText(principal)
                            );
                            setCurrentUser(theUser?.[0]);
                            setIsOpenModalNickname(false);
                            setNicknameLoading(false);
                            notification.success({
                              message: "Success!",
                              description:
                                "You have successfully updated your nickname!",
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
                    }}
                    className="save-button"
                  >
                    Submit
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {isOpenModalJiggle && (
        <div
          className="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
          onClick={toggleModalJiggle}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, -5, 5, -3, 3, 0],
              x: [0, -10, 10, -5, 5, 0],
            }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            <button
              onClick={toggleModalJiggle}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">Logout</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-x-2 items-center justify-center">
              <button onClick={toggleModalJiggle} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(settingPrincipal(""));
                  navigate("/");
                }}
                className="delete-modal-btn"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

export default Profile;
