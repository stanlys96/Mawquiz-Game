import { BeatLoader } from "react-spinners";
import { override } from "../helper/helper";

interface Props {
  nickname: string;
  setNickname: (e: any) => void;
  showErrorMessage: boolean;
  nicknameLoading: boolean;
  handleCancelModal: () => void;
  handleUpdateNickname: () => void;
}

export const UpdateNickname = ({
  nickname,
  setNickname,
  showErrorMessage,
  nicknameLoading,
  handleCancelModal,
  handleUpdateNickname,
}: Props) => {
  return (
    <div>
      <div className="mt-[24px]">
        <p className="text-gray mb-[12px] font-semibold text-center">
          Nickname
        </p>
        <p className="text-black text-center">
          Enter a nickname for your profile.
        </p>
        <div className="relative">
          <input
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
            className="mt-[12px] text-center title-input outline-none w-full"
            type="text"
            maxLength={35}
          />
          <p className="absolute top-[40%] text-[#6E6E6E] right-2">
            {35 - (nickname?.length ?? 0)}
          </p>
        </div>
        {showErrorMessage && (
          <p className="text-red font-medium mt-2">
            Nickname is already picked
          </p>
        )}
      </div>
      {nicknameLoading ? (
        <div className="py-[20px]">
          <BeatLoader
            color={"#97E8D4"}
            loading={nicknameLoading}
            cssOverride={override}
            size={35}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="close-toggle-button gap-x-2">
          <button onClick={handleCancelModal} className="exit-button">
            Cancel
          </button>
          <button onClick={handleUpdateNickname} className="save-button">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
