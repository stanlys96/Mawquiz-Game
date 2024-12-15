import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { settingPrincipal } from "../stores/user-slice";
import { IoPersonCircle } from "react-icons/io5";
import { Principal } from "@dfinity/principal";
import IC from "./utils/IC";
import { _SERVICE } from "../../declarations/kahoot_backend/kahoot_backend.did";
import { FiEdit } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import BeatLoader from "react-spinners/BeatLoader";
import { notification } from "antd";
import { modalVariants, override } from "./helper/helper";
import { RiLogoutCircleLine } from "react-icons/ri";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [isOpenModalNickname, setIsOpenModalNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [currentUser, setCurrentUser] = useState<any>();
  const [isOpenModalJiggle, setIsOpenModalJiggle] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const { principal } = useSelector((state: any) => state.user);

  const toggleModalJiggle = () => {
    setIsOpenModalJiggle((prevState) => !prevState);
  };

  useEffect(() => {
    IC.getBackend((result: any) => {
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
    }
  }, [principal, backend]);
  return (
    <main className="background flex justify-center items-center">
      <div className="circle-bg" />
      <div className="square-bg" />
      {loading && (
        <div className="relative kahoot-container">
          <div className="kahoot-spinner">
            <div />
            <div />
            <div />
            <div />
          </div>
          <p className="montserrat medium text-[28px] leading-[0px]">
            Connecting to Mawquiz!
          </p>
        </div>
      )}
      <div className="flex flex-col justify-center items-center gap-y-2 main-profile">
        <img className="w-[200px] mx-auto img-home bg-white" src="logo.png" />
        <div className="main-container">
          <div className="flex flex-col justify-center items-center gap-y-2">
            <div className="flex gap-x-2 items-center">
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
                className="cursor-pointer p-[8px] flex lg:hidden bg-dark-green rounded-full flex items-center justify-center"
              >
                <FiEdit color="white" />
              </div>
              <div
                onClick={toggleModalJiggle}
                className="cursor-pointer p-[8px] purple-bg rounded-full flex items-center justify-center"
              >
                <RiLogoutCircleLine color="white" />
              </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-y-2 gap-x-2 items-center">
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
                className="cursor-pointer p-[8px] bg-dark-green rounded-full hidden lg:flex items-center justify-center"
              >
                <FiEdit color="white" />
              </div>
              <p
                onClick={() => {
                  if (!currentUser?.nickname) return;
                  if (currentUser?.nickname?.length > 35) {
                    setNickname("");
                  } else {
                    setNickname(currentUser?.nickname ?? "");
                  }
                  setIsOpenModalNickname(true);
                }}
                className="cursor-pointer text-black text-center"
              >
                {currentUser?.nickname
                  ? currentUser?.nickname?.length > 20
                    ? currentUser?.nickname?.slice(0, 20) + "..."
                    : currentUser?.nickname ?? ""
                  : currentUser?.owner?.slice(0, 20) + "..."}
              </p>
            </div>
            <input
              className="game-pin-input mt-[10px] w-[100px]"
              placeholder="Game Pin"
            />
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 2000);
              }}
              className="custom-button w-full"
            >
              Enter
            </button>
          </div>
        </div>
        <div className="mt-[40px]">
          <p className="text-center">
            Create your own kahoot for FREE{" "}
            <a
              onClick={async () => {
                // backend?.updateNickname(identity, "WALAO EH");
                // console.log(
                //   await backend?.getUser(Principal.fromText(identity)),
                //   "<<< ???"
                // );
                navigate("/profile");
              }}
              className="underline cursor-pointer"
            >
              here
            </a>
          </p>
        </div>
      </div>
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
                      if (!principal) return;
                      if (nickname === currentUser?.nickname) return;
                      if (nickname?.trim()?.length === 0) return;
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
                  toggleModalJiggle();
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

export default Home;
