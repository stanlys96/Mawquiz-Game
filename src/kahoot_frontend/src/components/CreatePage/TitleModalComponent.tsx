import { Tooltip } from "antd";
import { FaArrowDown, FaCircleQuestion, FaUpload } from "react-icons/fa6";

interface Props {
  kahootTitleTemp: any;
  setKahootTitleTemp: (arg: any) => void;
  imageCoverUrlTemp: any;
  fileInputRef: any;
  handleCoverImage: (arg: any) => void;
  draggingCoverImage: boolean;
  kahootDescriptionTemp: any;
  setKahootDescriptionTemp: (arg: any) => void;
  setKahootTitle: (arg: any) => void;
  setPreviousKahootTitle: (arg: any) => void;
  setFromSaving: (arg: any) => void;
  toggleModalTitle: () => void;
  setImageCoverUrlTemp: (arg: any) => void;
  fromSaving: boolean;
  previousKahootTitle: any;
  previousKahootDescription: any;
  previousImageCoverUrl: any;
  setKahootDescription: (arg: any) => void;
  setPreviousImageCoverUrl: (arg: any) => void;
  setImageCoverUrl: (arg: any) => void;
  setPreviousKahootDescription: (arg: any) => void;
  setLoading: (arg: any) => void;
  addOrUpdateGame: () => void;
}

export const TitleModalComponent = ({
  kahootTitleTemp,
  setKahootTitleTemp,
  imageCoverUrlTemp,
  fileInputRef,
  handleCoverImage,
  draggingCoverImage,
  kahootDescriptionTemp,
  setKahootDescriptionTemp,
  setKahootTitle,
  setPreviousKahootTitle,
  setFromSaving,
  toggleModalTitle,
  setImageCoverUrlTemp,
  fromSaving,
  previousKahootTitle,
  previousKahootDescription,
  previousImageCoverUrl,
  setKahootDescription,
  setPreviousImageCoverUrl,
  setImageCoverUrl,
  setPreviousKahootDescription,
  setLoading,
  addOrUpdateGame,
}: Props) => {
  return (
    <div className="relative">
      <div className="mt-[24px]">
        <p className="text-gray mb-[12px] font-semibold text-left">Title</p>
        <p className="text-black text-left">Enter a title for your mawquiz.</p>
        <div className="relative">
          <input
            value={kahootTitleTemp}
            onChange={(e) => {
              setKahootTitleTemp(e.target.value);
            }}
            className="mt-[12px] title-input outline-none w-full"
            type="text"
            maxLength={95}
          />
          <p className="absolute top-[40%] text-[#6E6E6E] right-2">
            {95 - (kahootTitleTemp?.length ?? 0)}
          </p>
        </div>
        <p className="text-gray mb-[12px] mt-[20px] font-semibold text-left">
          Cover Image{" "}
          <span className="text-[#6E6E6E] font-normal">(optional)</span>
        </p>
        <div className="inner-modal-div-cover relative">
          {!imageCoverUrlTemp ? (
            <div className="flex gap-x-[15px] items-center">
              <FaUpload size="32px" color="black" />
              <div className="flex flex-col gap-y-1">
                <div className="flex gap-x-2 items-center">
                  <p className="text-[#6E6E6E] text-left">
                    Max. file size: 80MB
                  </p>
                  <Tooltip
                    className="z-infinite"
                    placement="top"
                    title={"Image: 80 MB"}
                  >
                    <FaCircleQuestion color="gray" />
                  </Tooltip>
                </div>
              </div>
            </div>
          ) : (
            <img
              onClick={() => {
                (fileInputRef?.current as any)?.click();
              }}
              className="w-[200px] h-[100px]"
              src={imageCoverUrlTemp}
            />
          )}
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            onChange={handleCoverImage}
            className="hidden"
          />
          {!imageCoverUrlTemp && (
            <label
              onClick={(e) => {
                e.stopPropagation();
                (fileInputRef?.current as any)?.click();
              }}
              className="save-button"
            >
              Upload Media
            </label>
          )}
          {draggingCoverImage && (
            <div className="drop-zone flex flex-col gap-y-[24px]">
              <div className="arrow-down-div">
                <span className="arrow-down-span">
                  <FaArrowDown size="88px" />
                </span>
              </div>
              <p className="text-[20px] font-bold">Drop your file here</p>
            </div>
          )}
        </div>
        <p className="text-gray mb-[12px] mt-[20px] font-semibold text-left">
          Description{" "}
          <span className="text-[#6E6E6E] font-normal">(optional)</span>
        </p>
        <p className="text-black text-left">
          Provide a short description for your mawquiz to increase visibility.
        </p>
        <div className="relative">
          <textarea
            value={kahootDescriptionTemp}
            onChange={(e) => setKahootDescriptionTemp(e.target.value)}
            rows={4}
            className="mt-[12px] textarea-input outline-none w-full"
            maxLength={500}
          />
          <p className="absolute top-[20%] text-[#6E6E6E] right-2">
            {500 - (kahootDescriptionTemp?.length ?? 0)}
          </p>
        </div>
      </div>
      <div className="close-toggle-button gap-x-2">
        <button
          onClick={() => {
            setFromSaving(false);
            toggleModalTitle();
            setKahootTitleTemp(previousKahootTitle);
            setKahootDescriptionTemp(previousKahootDescription);
            setImageCoverUrlTemp(previousImageCoverUrl);
          }}
          className="exit-button"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (fromSaving) {
              if (!kahootTitleTemp?.trim()) return;
            }
            setKahootTitleTemp((prevState: any) => {
              setKahootTitle(prevState.trim());
              setPreviousKahootTitle(prevState.trim());
              return prevState.trim();
            });
            setKahootDescriptionTemp((prevState: any) => {
              setKahootDescription(prevState.trim());
              setPreviousKahootDescription(prevState.trim());
              return prevState.trim();
            });
            setImageCoverUrlTemp((prevState: any) => {
              setImageCoverUrl(prevState.trim());
              setPreviousImageCoverUrl(prevState.trim());
              return prevState.trim();
            });
            toggleModalTitle();
            if (fromSaving) {
              setLoading(true);
              addOrUpdateGame();
            }
          }}
          className="save-button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
