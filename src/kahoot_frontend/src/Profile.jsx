import { useState } from "react";
import IC from "./utils/IC";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

function Profile() {
  const { principal } = useSelector((state) => state.user);
  const [isHoveredKahoot, setIsHoveredKahoot] = useState(false);
  const [isHoveredDraft, setIsHoveredDraft] = useState(false);
  const [category, setCategory] = useState("kahoot");
  return (
    <main className="background flex justify-center items-center">
      <div className="circle-bg" />
      <div className="square-bg" />
      <div className="flex flex-col profile justify-center items-center gap-y-3">
        <div>
          <p>Identity: {principal?.slice(0, 25) + "..."}</p>
        </div>
        <div className="flex gap-x-4 md:flex-row flex-col gap-y-4 items-center md:items-start">
          <div className="your-kahoots h-fit">
            <div className="your-kahoots-top">
              <div className="flex gap-x-4">
                <p
                  onClick={() => setCategory("kahoot")}
                  onMouseEnter={() => setIsHoveredKahoot(true)}
                  onMouseLeave={() => setIsHoveredKahoot(false)}
                  className={`text-[#6E6E6E] ${
                    category === "kahoot" || isHoveredKahoot
                      ? "text-container"
                      : "text-ordinary"
                  } cursor-pointer font-semibold kahoot-text`}
                >
                  Your kahoots
                </p>
                <p
                  onClick={() => setCategory("draft")}
                  onMouseEnter={() => setIsHoveredDraft(true)}
                  onMouseLeave={() => setIsHoveredDraft(false)}
                  className={`text-[#6E6E6E] ${
                    category === "draft" || isHoveredDraft
                      ? "text-container"
                      : "text-ordinary"
                  } cursor-pointer font-semibold kahoot-text`}
                >
                  Your drafts
                </p>
              </div>
            </div>
            <div className="game-card-container">
              <div className="game-card">
                <div className="game-card-inner cursor-pointer">
                  <div className="relative">
                    <img
                      src="logo.png"
                      className="h-[74px] rounded-l-[4px] w-[109px]"
                    />
                    <div className="question-card">
                      <p className="text-white question-card-text">
                        1&nbsp;Questions
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="py-[8px] px-[12px] text-black font-semibold">
                      US President
                    </p>
                    <div className="px-[12px] py-[2px] bottom-game-card flex justify-between items-center gap-x-[50px]">
                      <p className="dark-text">stanlys96</p>
                      <p className="dark-text font-semibold">0 plays</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-see-all text-center font-bold cursor-pointer mt-[16px] underline">
                See all (1)
              </p>
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
