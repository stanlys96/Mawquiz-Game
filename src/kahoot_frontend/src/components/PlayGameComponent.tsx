import { ImCross } from "react-icons/im";
import { Game } from "../../../declarations/kahoot_backend/kahoot_backend.did";

interface Props {
  currentPickedKahoot?: Game;
  handleClose: () => void;
  handleEditGame: () => void;
  handleHostGameLive: () => void;
  handleSoloGame: () => void;
}

export const PlayGameComponent = ({
  currentPickedKahoot,
  handleEditGame,
  handleHostGameLive,
  handleSoloGame,
  handleClose,
}: Props) => {
  return (
    <div>
      <div className="mt-[24px]">
        <p className="text-gray mb-[12px] font-semibold text-center">
          Play the game!
        </p>
        <p className="text-black text-center">
          Do you want to play {currentPickedKahoot?.title}?
        </p>
      </div>
      <div className="close-toggle-button gap-x-2 md:flex-row flex-col gap-y-2">
        <button onClick={handleEditGame} className="save-button">
          Edit Game
        </button>
        <button onClick={handleHostGameLive} className="done-button">
          Host Game Live
        </button>
        <button
          onClick={handleSoloGame}
          className="the-orange-answer-bg shadow-md min-h-[42px] min-w-[42px] rounded-[4px] px-[16px] relative"
        >
          Play Solo
        </button>
      </div>
      <a onClick={handleClose} className="cursor-pointer">
        <ImCross size="16px" color="#000" className="absolute top-4 right-4" />
      </a>
    </div>
  );
};
