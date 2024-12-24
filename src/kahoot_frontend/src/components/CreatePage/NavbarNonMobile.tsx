import { GradientButton } from "@components/GradientButton";
import { NavbarProps } from "./NavbarMobile";

export const NavbarNonMobile = ({
  handleNavigateProfile,
  handleEditQuizTitle,
  kahootTitle,
  handleSaveQuiz,
  handleExit,
}: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="flex gap-x-6 items-center w-full">
        <img
          onClick={handleNavigateProfile}
          className="h-[48px] cursor-pointer"
          src="/logo.png"
        />
        <div className="kahoot-input-container">
          <button
            onClick={handleEditQuizTitle}
            className="kahoot-btn-title font-semibold"
          >
            {!kahootTitle ? "Enter mawquiz title..." : kahootTitle}
          </button>
          <button onClick={handleEditQuizTitle} className="settings-btn">
            Settings
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={handleExit} className="exit-button mr-4">
          Exit
        </button>
        <button onClick={handleSaveQuiz} className="save-button">
          Save
        </button>
      </div>
    </nav>
  );
};
