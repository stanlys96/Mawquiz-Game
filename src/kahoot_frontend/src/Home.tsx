import { useState, useEffect, CSSProperties, useMemo } from "react";
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

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [identity, setIdentity] = useState("");
  const [isOpenModalNickname, setIsOpenModalNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [currentUser, setCurrentUser] = useState<any>();

  const { principal } = useSelector((state: any) => state.user);
  const modalVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring", // Spring for bouncy effect
        stiffness: 500, // Control bounciness
        damping: 20,
      },
    },
    exit: { scale: 0.5, opacity: 0 },
  };

  useEffect(() => {
    IC.getBackend((result: any) => {
      setBackend(result);
    });
  }, []);
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
            Connecting to Kahoot!
          </p>
        </div>
      )}
      <div className="flex flex-col justify-center items-center gap-y-2 main-profile">
        <img className="w-[200px] mx-auto img-home" src="logo.png" />
        <div className="main-container">
          {identity ? (
            <div className="flex flex-col justify-center items-center gap-y-2">
              <div className="flex gap-x-2 items-center">
                <div
                  onClick={() => {
                    setNickname(currentUser?.nickname ?? "");
                    setIsOpenModalNickname(true);
                  }}
                  className="cursor-pointer p-[8px] flex lg:hidden bg-dark-green rounded-full flex items-center justify-center"
                >
                  <FiEdit color="white" />
                </div>
                <IoPersonCircle className="w-[32px] h-[32px] purple-bg rounded-full" />
              </div>
              <div className="flex lg:flex-row flex-col gap-y-2 gap-x-2 items-center">
                <div
                  onClick={() => {
                    setNickname(currentUser?.nickname ?? "");
                    setIsOpenModalNickname(true);
                  }}
                  className="cursor-pointer p-[8px] bg-dark-green rounded-full hidden lg:flex items-center justify-center"
                >
                  <FiEdit color="white" />
                </div>
                <p className="text-black text-center">
                  {currentUser?.nickname
                    ? currentUser?.nickname?.length > 20
                      ? currentUser?.nickname?.slice(0, 20) + "..."
                      : currentUser?.nickname
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
          ) : (
            <button
              onClick={() => {
                setLoading(true);
                IC.getAuth(async (authClient) => {
                  authClient.login({
                    ...IC.defaultAuthOption,
                    onSuccess: async () => {
                      await backend?.addNewUser(
                        authClient?.getIdentity()?.getPrincipal(),
                        ""
                      );
                      const principalText = authClient
                        ?.getIdentity()
                        ?.getPrincipal()
                        ?.toText();
                      const theUser = await backend?.getUser(
                        Principal.fromText(principalText)
                      );
                      setCurrentUser(theUser?.[0]);
                      setIdentity(principalText);
                      dispatch(settingPrincipal(principalText));
                      setLoading(false);
                    },
                    onError: () => {
                      setLoading(false);
                    },
                  });
                });
              }}
              className="custom-button"
            >
              Connect Wallet
            </button>
          )}
        </div>
        {identity && (
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
        )}
        {/* <div className="error-notification">
          <p className="error-text">
            We didn't recognize that game PIN. Please check and try again.
          </p>
        </div> */}
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
                      setNicknameLoading(true);
                      backend
                        ?.updateNickname(identity, nickname)
                        ?.then(async (result) => {
                          const theUser = await backend?.getUser(
                            Principal.fromText(identity)
                          );
                          setCurrentUser(theUser?.[0]);
                          setIsOpenModalNickname(false);
                          setNicknameLoading(false);
                          notification.success({
                            message: "Success!",
                            description:
                              "You have successfully updated your nickname!",
                          });
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
    </main>
  );
}

export default Home;
