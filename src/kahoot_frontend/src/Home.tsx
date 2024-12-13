import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { settingPrincipal } from "../stores/user-slice";
import { IoPersonCircle } from "react-icons/io5";
import { Principal } from "@dfinity/principal";
import IC from "./utils/IC";
import { _SERVICE } from "../../declarations/kahoot_backend/kahoot_backend.did";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("");
  const { principal } = useSelector((state: any) => state.user);

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
      <div className="flex flex-col gap-y-2">
        <img className="w-[200px] mx-auto" src="logo.png" />
        <div className="main-container">
          {identity ? (
            <div className="flex flex-col justify-center items-center gap-y-2">
              <IoPersonCircle className="w-[32px] h-[32px] purple-bg rounded-full" />
              <p className="text-black text-center">
                {identity?.slice(0, 20) + "..."}
              </p>
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
    </main>
  );
}

export default Home;
