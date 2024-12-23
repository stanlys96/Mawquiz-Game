import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { settingNickname, settingPrincipal } from "../../stores/user-slice";
import { Principal } from "@dfinity/principal";
import IC from "../utils/IC";
import { _SERVICE } from "../../../declarations/kahoot_backend/kahoot_backend.did";
import { FiEdit } from "react-icons/fi";
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
} from "../components";

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
        navigate(`/waiting?gameId=${gamePin}`, {
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
      <div className="flex flex-col justify-center items-center gap-y-2 main-profile">
        <img className="w-[200px] mx-auto img-home bg-white" src="logo.png" />
        <div className="main-container">
          <div className="flex flex-col justify-center items-center gap-y-2">
            <div className="flex gap-x-2 items-center">
              <div
                onClick={handleEdit}
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
                onClick={handleEdit}
                className="cursor-pointer p-[8px] bg-dark-green rounded-full hidden lg:flex items-center justify-center"
              >
                <FiEdit color="white" />
              </div>
              <p
                onClick={handleEdit}
                className="cursor-pointer text-black text-center"
              >
                {getUserNickname(currentUser?.nickname, currentUser?.owner)}
              </p>
            </div>
            <input
              value={gamePin}
              onChange={(e) => setGamePin(e.target.value)}
              className="game-pin-input mt-[10px] w-[100px]"
              placeholder="Game Pin"
            />
            <button onClick={handleEnterRoom} className="custom-button w-full">
              Enter
            </button>
          </div>
        </div>
        <div className="mt-[40px]">
          <p className="text-center">
            Create your own mawquiz for FREE{" "}
            <a onClick={handleAddQuiz} className="underline cursor-pointer">
              here
            </a>
          </p>
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
