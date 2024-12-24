import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { settingPrincipal } from "../../stores/user-slice";
import IC from "../utils/IC";
import { _SERVICE } from "../../../declarations/kahoot_backend/kahoot_backend.did";
import { LoadingLayover, GradientButton } from "../components";
import { FaWallet } from "react-icons/fa";

function ConnectWallet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backend, setBackend] = useState<_SERVICE>();
  const [loading, setLoading] = useState(false);

  const handleConnectWallet = async () => {
    setLoading(true);
    IC.getAuth(async (authClient) => {
      authClient.login({
        ...IC.defaultAuthOption,
        onSuccess: async () => {
          await backend?.addNewUser(authClient?.getIdentity()?.getPrincipal());
          const principalText = authClient
            ?.getIdentity()
            ?.getPrincipal()
            ?.toText();
          dispatch(settingPrincipal(principalText));
          setLoading(false);
          navigate("/home", {
            state: {
              routerPrincipal: principalText,
            },
          });
        },
        onError: () => {
          setLoading(false);
        },
      });
    });
  };

  useEffect(() => {
    IC.getBackend((result: _SERVICE) => {
      setBackend(result);
    });
  }, []);
  return (
    <main className="background flex justify-center items-center">
      <div className="circle-bg" />
      <div className="square-bg" />
      <LoadingLayover loading={loading} description="Connecting to Mawquiz" />
      <div className="flex flex-col justify-center items-center gap-y-2 main-profile">
        <img className="w-[200px] mx-auto img-home bg-white" src="logo.png" />
        <div className="glowing-container py-[20px] px-[60px] flex justify-center items-center">
          <GradientButton
            icon={<FaWallet size="26px" />}
            text="Connect Wallet"
            onClick={handleConnectWallet}
            gradient="linear-gradient(90deg, #42e695, #3bb2b8)"
            className="w-full flex gap-x-2 items-center"
          />
        </div>
      </div>
    </main>
  );
}

export default ConnectWallet;
