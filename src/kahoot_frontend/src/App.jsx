import { useState } from "react";
import { kahoot_backend } from "declarations/kahoot_backend";
import IC from "./utils/IC";
import "./index.css";

function App() {
  const [greeting, setGreeting] = useState("");
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    kahoot_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

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
              <p className="text-black text-center">Identity:</p>
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
                      setIdentity(
                        authClient?.getIdentity()?.getPrincipal()?.toText()
                      );
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
        {/* <div className="error-notification">
          <p className="error-text">
            We didn't recognize that game PIN. Please check and try again.
          </p>
        </div> */}
      </div>
    </main>
  );
}

export default App;
