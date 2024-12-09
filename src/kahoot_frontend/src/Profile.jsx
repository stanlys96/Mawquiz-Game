import { useState } from "react";
import IC from "./utils/IC";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

function Profile() {
  const { principal } = useSelector((state) => state.user);
  const [isHoveredKahoot, setIsHoveredKahoot] = useState(false);
  const [isHoveredDraft, setIsHoveredDraft] = useState(false);
  return (
    <main className="background flex justify-center items-center">
      <div className="circle-bg" />
      <div className="square-bg" />
      <div className="flex flex-col justify-center items-center gap-y-3">
        <div>
          <p>Identity: {principal?.slice(0, 25) + "..."}</p>
        </div>
        <div className="flex gap-x-4 items-start">
          <div className="your-kahoots h-fit">
            <div className="your-kahoots-top">
              <div className="flex gap-x-4">
                <p
                  onMouseEnter={() => setIsHoveredKahoot(true)}
                  onMouseLeave={() => setIsHoveredKahoot(false)}
                  className={`text-[#6E6E6E] ${
                    isHoveredKahoot ? "text-container" : "text-ordinary"
                  } cursor-pointer font-semibold kahoot-text`}
                >
                  Your kahoots
                </p>
                <p
                  onMouseEnter={() => setIsHoveredDraft(true)}
                  onMouseLeave={() => setIsHoveredDraft(false)}
                  className={`text-[#6E6E6E] ${
                    isHoveredDraft ? "text-container" : "text-ordinary"
                  } cursor-pointer font-semibold kahoot-text`}
                >
                  Your drafts
                </p>
              </div>
            </div>
            <div>
              <p className="text-black">ASDJKL</p>
            </div>
          </div>
          <div className="kahoot-card cursor-pointer">
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
    </main>
  );
}

export default Profile;
