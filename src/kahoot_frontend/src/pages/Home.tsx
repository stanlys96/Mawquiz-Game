import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { settingNickname, settingPrincipal } from "../../stores/user-slice";
import { Principal } from "@dfinity/principal";
import IC from "../utils/IC";
import { _SERVICE } from "../../../declarations/kahoot_backend/kahoot_backend.did";
import { notification } from "antd";
import { getUserNickname } from "../helper/helper";
import { RiLogoutCircleLine } from "react-icons/ri";
import Swal from "sweetalert2";
import axios from "axios";
import {
  LoadingLayover,
  BouncyModal,
  UpdateNickname,
  JiggleModal,
  LogoutComponent,
  GradientButton,
} from "../components";
import { FaDoorOpen } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import { IoGameController } from "react-icons/io5";

function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = location;
  const principal = state?.routerPrincipal;
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [isOpenModalNickname, setIsOpenModalNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [currentUser, setCurrentUser] = useState<any>();
  const [isOpenModalJiggle, setIsOpenModalJiggle] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [gamePin, setGamePin] = useState("");

  const toggleModalJiggle = () => {
    setIsOpenModalJiggle((prevState) => !prevState);
  };

  const handleEdit = useCallback(() => {
    if (!currentUser?.nickname) return;
    if (currentUser?.nickname?.length > 35) {
      setNickname("");
    } else {
      setNickname(currentUser?.nickname ?? "");
      dispatch(settingNickname(currentUser?.nickname ?? ""));
    }
    setIsOpenModalNickname(true);
  }, [currentUser, nickname, isOpenModalNickname]);

  const handleAddQuiz = useCallback(async () => {
    navigate("/profile", {
      state: {
        routerPrincipal: state.routerPrincipal,
      },
    });
  }, []);

  const handleViewLiveGames = useCallback(async () => {
    navigate("/live-games", {
      state: {
        routerPrincipal: state.routerPrincipal,
      },
    });
  }, []);

  const handleUpdateNickname = useCallback(async () => {
    if (!principal) return;
    if (nickname === currentUser?.nickname) return;
    if (nickname?.trim()?.length === 0) return;
    setNicknameLoading(true);
    backend
      ?.updateNickname(principal, nickname)
      ?.then(async (result) => {
        if (result) {
          const theUser = await backend?.getUser(Principal.fromText(principal));
          setCurrentUser(theUser?.[0]);
          setIsOpenModalNickname(false);
          setNicknameLoading(false);
          dispatch(settingNickname(nickname));
          notification.success({
            message: "Success!",
            description: "You have successfully updated your nickname!",
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
    principal,
    nickname,
    currentUser?.nickname,
    backend,
    isOpenModalNickname,
    nicknameLoading,
    currentUser,
  ]);

  const handleCloseModal = useCallback(() => {
    if (nicknameLoading) return;
    setIsOpenModalNickname(false);
  }, [nicknameLoading, isOpenModalNickname]);

  const handleCancelModal = useCallback(() => {
    setIsOpenModalNickname(false);
    setNickname("");
  }, [isOpenModalNickname, nickname]);

  const handleEnterRoom = useCallback(async () => {
    if (!gamePin) return;
    if (!currentUser?.owner) return;
    try {
      setLoading(true);
      const result = await axios.post(
        `https://mawquiz-backend-production.up.railway.app/joinGame/${gamePin}`,
        {
          player: { ...currentUser, admin: false },
        }
      );
      const status = result?.data?.status;
      if (status === 200) {
        navigate(`/waiting?gamePin=${gamePin}`, {
          state: {
            routerPrincipal: state.routerPrincipal,
          },
        });
      }
      setLoading(false);
    } catch (e: any) {
      console.log(e);
      Swal.fire("There's a problem!", e?.response?.data?.message ?? "", "info");
      setLoading(false);
    }
  }, [loading, gamePin, currentUser?.owner]);

  const handleLogout = useCallback(() => {
    dispatch(settingPrincipal(""));
    dispatch(settingNickname(""));
    toggleModalJiggle();
    navigate("/");
  }, []);

  useEffect(() => {
    axios
      .get("https://mawquiz-backend-production.up.railway.app/getLiveGames")
      .then((result) => {
        console.log(result.data);
      });
    if (!principal) {
      navigate("/");
      return;
    }
    IC.getBackend((result: any) => {
      setBackend(result);
    });
  }, []);

  useEffect(() => {
    if (backend) {
      backend
        ?.getUser(Principal.fromText(principal))
        ?.then((result) => {
          setCurrentUser(result?.[0]);
          dispatch(settingNickname(result?.[0]?.nickname));
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
      <LoadingLayover loading={loading} description="Connecting to Mawquiz!" />
      <div className="flex flex-col justify-center items-center gap-y-2">
        <img className="w-[200px] mx-auto img-home bg-white" src="logo.png" />
        <div className="glowing-container px-[40px] py-[40px]">
          <div className="flex flex-col justify-center items-center gap-y-2 w-full">
            <div className="flex gap-x-2 items-center">
              <GradientButton
                icon={<RiLogoutCircleLine size="26px" color="white" />}
                text="Logout"
                gradient="linear-gradient(90deg, #ff9966, #ff5e62)"
                onClick={toggleModalJiggle}
                className="flex gap-x-2 items-center"
              />
            </div>
            <div className="flex lg:flex-row flex-col gap-y-2 gap-x-2 mt-2 items-center">
              <GradientButton
                className="flex gap-x-2 items-center"
                icon={<IoPerson size="26px" />}
                onClick={handleEdit}
                text={getUserNickname(
                  currentUser?.nickname,
                  currentUser?.owner
                )}
                gradient="linear-gradient(90deg, #0f2027, #203a43, #2c5364)"
              />
            </div>
            <input
              value={gamePin}
              onChange={(e) => setGamePin(e.target.value)}
              className="glowing-input text-center md:w-[300px] my-[8px] h-full"
              placeholder="Enter Game Pin"
            />
            <GradientButton
              icon={<FaDoorOpen size="26px" />}
              onClick={handleEnterRoom}
              text="Enter"
              gradient="linear-gradient(90deg, #134e5e, #71b280)"
              className="w-full flex gap-x-2 items-center justify-center"
            />
          </div>
        </div>
        <div className="mt-[20px] flex flex-col gap-y-4 items-center">
          <GradientButton
            icon={<IoGameController size="26px" />}
            gradient="linear-gradient(90deg, #43cea2, #185a9d)"
            text="View live games!"
            className="cursor-pointer text-black flex gap-x-2 items-center"
            onClick={handleViewLiveGames}
            textColor="#fff"
          />
          <GradientButton
            icon={<MdQuiz size="26px" />}
            gradient="linear-gradient(90deg, #ff9966, #ff5e62)"
            text="Create your own mawquiz for FREE"
            className="cursor-pointer text-black flex gap-x-2 items-center"
            onClick={handleAddQuiz}
            textColor="#fff"
          />
        </div>
      </div>
      <BouncyModal
        isOpenModal={isOpenModalNickname}
        handleClose={handleCloseModal}
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        innerDivClassName="bg-white rounded-lg shadow-lg px-[16px] md:px-[32px] text-center w-[90vw] lg:w-[50vw]"
      >
        <UpdateNickname
          nickname={nickname}
          setNickname={setNickname}
          showErrorMessage={showErrorMessage}
          nicknameLoading={nicknameLoading}
          handleCancelModal={handleCancelModal}
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
    </main>
  );
}

export default Home;
