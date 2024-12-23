import { Tooltip } from "antd";
import { FaArrowDown, FaCircleQuestion, FaUpload } from "react-icons/fa6";

interface Props {
  handleFileChange: (e: any) => void;
  dragging: boolean;
  toggleModalSecond: () => void;
}

export const UploadImageModalComponent = ({
  handleFileChange,
  dragging,
  toggleModalSecond,
}: Props) => {
  return (
    <div className="relative">
      <div className="pb-[16px]">
        <p className="text-[#333333] text-left font-semibold text-[24px] upload-image-p">
          Upload image
        </p>
      </div>
      <div className="upload-modal-div relative">
        <div className="inner-modal-div relative">
          <div className="flex gap-x-[15px] items-center">
            <FaUpload size="32px" color="black" />
            <div className="flex flex-col gap-y-1">
              <p className="text-[#333333] text-left font-semibold">
                Drop your files here
              </p>
              <div className="flex gap-x-2 items-center">
                <p className="text-[#6E6E6E] text-left">Max. file size: 80MB</p>
                <Tooltip
                  className="z-infinite"
                  placement="top"
                  title={"Image: 80 MB"}
                >
                  <FaCircleQuestion color="gray" />
                </Tooltip>
              </div>
              <div className="flex gap-x-2 items-center">
                <p className="text-[#6E6E6E] text-left">Drop your files here</p>
                <Tooltip
                  className="z-infinite"
                  placement="top"
                  title={"Image: jpeg, jpg, png, gif and webp"}
                >
                  <FaCircleQuestion color="gray" />
                </Tooltip>
              </div>
            </div>
          </div>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="save-button">
            Upload Media
          </label>
        </div>
        {dragging && (
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
      <div className="close-toggle-button">
        <button onClick={toggleModalSecond} className="toggle-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};
