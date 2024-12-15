import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { settingPrincipal } from "../stores/user-slice";
import IC from "./utils/IC";
import { _SERVICE } from "../../declarations/kahoot_backend/kahoot_backend.did";

function ConnectWallet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);

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
          <button
            onClick={() => {
              setLoading(true);
              IC.getAuth(async (authClient) => {
                authClient.login({
                  ...IC.defaultAuthOption,
                  onSuccess: async () => {
                    await backend?.addNewUser(
                      authClient?.getIdentity()?.getPrincipal()
                    );
                    const principalText = authClient
                      ?.getIdentity()
                      ?.getPrincipal()
                      ?.toText();
                    dispatch(settingPrincipal(principalText));
                    setLoading(false);
                    navigate("/home");
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
        </div>
      </div>
    </main>
  );
}

export default ConnectWallet;
