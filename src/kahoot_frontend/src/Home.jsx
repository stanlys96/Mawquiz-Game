import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPrincipal } from "../stores/user-slice";
import { IoPersonCircle } from "react-icons/io5";
import IC from "./utils/IC";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("");
  return (
    <main className="background flex justify-center items-center">
      <div className="circle-bg" />
      <div className="square-bg" />
      {loading && (
        <div className="relative kahoot-container">
          <div class="kahoot-spinner">
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
                    onSuccess: () => {
                      const principalText = authClient
                        ?.getIdentity()
                        ?.getPrincipal()
                        ?.toText();
                      setIdentity(principalText);
                      dispatch(setPrincipal(principalText));
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
                onClick={() => navigate("/profile")}
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
