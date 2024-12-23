import { FaGear } from "react-icons/fa6";

export interface NavbarProps {
  handleNavigateProfile: () => void;
  handleEditQuizTitle: () => void;
  kahootTitle: string;
  handleSaveQuiz: () => void;
  handleExit?: () => void;
}

export const NavbarMobile = ({
  handleNavigateProfile,
  handleEditQuizTitle,
  kahootTitle,
  handleSaveQuiz,
}: NavbarProps) => {
  return (
    <nav className="navbar z-infinite fixed top-0 w-full">
      <div className="flex gap-x-6 items-center w-full">
        <img
          onClick={handleNavigateProfile}
          className="h-[36px]"
          src="/logo.png"
        />
        <div className="kahoot-input-container">
          <button
            onClick={handleEditQuizTitle}
            className="kahoot-btn-title font-semibold"
          >
            {!kahootTitle ? "Enter mawquiz title..." : kahootTitle}
          </button>
          <button onClick={handleEditQuizTitle} className="settings-btn-mobile">
            <FaGear size="16px" />
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={handleSaveQuiz} className="save-button">
          Save
        </button>
      </div>
    </nav>
  );
};
