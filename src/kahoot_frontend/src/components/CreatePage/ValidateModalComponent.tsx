import { FaRegImage } from "react-icons/fa6";

interface Props {
  quizChecked: any;
  quizData: any;
  setClickedQuizIndex: (arg: any) => void;
  toggleModalValidate: () => void;
}

export const ValidateModalComponent = ({
  quizChecked,
  quizData,
  setClickedQuizIndex,
  toggleModalValidate,
}: Props) => {
  return (
    <div>
      <div className="mt-[24px] px-[16px] md:px-[32px]">
        <p className="text-gray mb-[12px] text-[24px] font-bold text-left">
          This mawquiz can't be played
        </p>
        <p className="text-black text-left">
          All questions need to be completed before you can start playing.
        </p>
      </div>
      <div className="validate-div mt-[24px] h-full">
        <ul className="validate-subdiv">
          {quizChecked?.map((theData: any) => (
            <li className="validate-li">
              <div className="top-part flex gap-x-2 items-center p-[2px]">
                <div className="dashed-part flex justify-center items-center">
                  {quizData?.[theData?.index]?.imageUrl === "cdn.svg" ? (
                    <FaRegImage color="gray" size="30px" />
                  ) : (
                    <img
                      className="w-[75px] h-[60px]"
                      src={quizData?.[theData?.index]?.imageUrl ?? ""}
                    />
                  )}
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="text-black text-[14px]">
                    {theData?.index + 1} -{" "}
                    {quizData?.[theData?.index]?.questionType}
                  </p>
                  <p className="text-black font-bold text-[13px]">
                    {quizData?.[theData?.index]?.question?.length > 12
                      ? (quizData?.[theData?.index]?.question?.slice(0, 12) ??
                          "") + "..."
                      : quizData?.[theData?.index]?.question ?? ""}
                  </p>
                </div>
                <div className="mr-[10px]">
                  <button
                    onClick={() => {
                      setClickedQuizIndex(theData?.index);
                      toggleModalValidate();
                    }}
                    className="save-button"
                  >
                    Fix
                  </button>
                </div>
              </div>
              <div className="bottom-part flex flex-col items-start">
                {theData?.messages?.map((value: any, index: any) => (
                  <div
                    className={`flex gap-x-2 py-[5px] px-[10px] ${
                      index !== 0 && "border-t border-t-[#F2F2F2]"
                    } w-full items-center`}
                  >
                    <img
                      className="exclamation-ordinary"
                      src="/exclamation.svg"
                    />
                    <p className="text-black text-[14px]">{value}</p>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="close-toggle-button gap-x-2">
        <button
          onClick={() => {
            toggleModalValidate();
          }}
          className="exit-button"
        >
          Back to Edit
        </button>
      </div>
    </div>
  );
};
