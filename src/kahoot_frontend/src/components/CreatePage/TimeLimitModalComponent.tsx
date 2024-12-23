interface Props {
  timeLimitData: any;
  setCurrentTimeLimit: (arg: any) => void;
  currentTimeLimit: any;
  quizData: any;
  clickedQuizIndex: any;
  setQuizData: (arg: any) => void;
  toggleModalTimeLimit: () => void;
}

export const TimeLimitModalComponent = ({
  timeLimitData,
  setCurrentTimeLimit,
  currentTimeLimit,
  quizData,
  clickedQuizIndex,
  setQuizData,
  toggleModalTimeLimit,
}: Props) => {
  return (
    <div className="relative">
      <div className="mt-[24px] px-[16px] md:px-[32px] the-box-shadow pb-[32px]">
        <p className="text-gray mb-[12px] text-[24px] font-bold text-left">
          Time limit
        </p>
        <div className="flex gap-3 justify-center items-center flex-wrap">
          {timeLimitData?.map((theData: any) => (
            <button
              onClick={() => {
                setCurrentTimeLimit(theData);
              }}
              className={`${
                currentTimeLimit === theData
                  ? "exit-button-blue"
                  : "exit-button"
              }`}
            >
              {theData}&nbsp;sec
            </button>
          ))}
        </div>
      </div>
      <div className="close-toggle-button gap-x-2">
        <button
          onClick={() => {
            setCurrentTimeLimit(quizData?.[clickedQuizIndex]?.timeLimit);
            toggleModalTimeLimit();
          }}
          className="exit-button"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            let quizTemp = [...quizData];
            quizTemp[clickedQuizIndex].timeLimit = currentTimeLimit;
            setQuizData([...quizTemp]);
            toggleModalTimeLimit();
          }}
          className="done-button"
        >
          Done
        </button>
      </div>
    </div>
  );
};
