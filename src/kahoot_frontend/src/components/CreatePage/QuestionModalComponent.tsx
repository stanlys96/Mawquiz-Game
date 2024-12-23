import { MdQuiz } from "react-icons/md";
import { TiMessageTyping } from "react-icons/ti";
import { VscSymbolBoolean } from "react-icons/vsc";

interface Props {
  isChangingQuestionType: boolean;
  quizData: any;
  clickedQuizIndex: number;
  setQuizData: (arg: any) => void;
  newQuizData: any;
  setCurrentId: (arg: any) => void;
  isMobileOrTablet: boolean;
  scrollToEnd: () => void;
  scrollToBottom: () => void;
  setIsChangingQuestionType: (arg: any) => void;
  toggleModalQuestion: () => void;
}

export const QuestionModalComponent = ({
  isChangingQuestionType,
  quizData,
  clickedQuizIndex,
  setQuizData,
  newQuizData,
  setCurrentId,
  isMobileOrTablet,
  scrollToEnd,
  scrollToBottom,
  setIsChangingQuestionType,
  toggleModalQuestion,
}: Props) => {
  return (
    <div className="relative">
      <div className="mt-[24px]">
        <p className="text-black mb-[12px]">Choose Question Type:</p>
        <div className="flex gap-x-4 lg:flex-row flex-col gap-y-4 items-center justify-center w-full">
          {((isChangingQuestionType &&
            quizData?.[clickedQuizIndex]?.questionType !== "Quiz") ||
            !isChangingQuestionType) && (
            <div
              onClick={() => {
                if (!isChangingQuestionType) {
                  setQuizData((prevState: any) => [
                    ...prevState,
                    { ...newQuizData, questionType: "Quiz" },
                  ]);
                  setCurrentId((prevState: any) => prevState + 1);
                  if (isMobileOrTablet) {
                    scrollToEnd();
                  } else {
                    scrollToBottom();
                  }
                } else {
                  let quizTemp = [...quizData];
                  quizTemp[clickedQuizIndex].questionType = "Quiz";
                  setQuizData([...quizTemp]);
                }
                setIsChangingQuestionType(false);
                toggleModalQuestion();
              }}
              className="the-gray cursor-pointer mx-[8px] mt-[8px] rounded-[4px] py-[16px] w-[150px] flex flex-col gap-y-2 justify-center items-center"
            >
              <MdQuiz color="black" size="30px" />
              <p className="text-black">Quiz</p>
            </div>
          )}
          {((isChangingQuestionType &&
            quizData?.[clickedQuizIndex]?.questionType !== "True or false") ||
            !isChangingQuestionType) && (
            <div
              onClick={() => {
                if (!isChangingQuestionType) {
                  setQuizData((prevState: any) => [
                    ...prevState,
                    { ...newQuizData, questionType: "True or false" },
                  ]);
                  setCurrentId((prevState: any) => prevState + 1);
                  if (isMobileOrTablet) {
                    scrollToEnd();
                  } else {
                    scrollToBottom();
                  }
                } else {
                  let quizTemp = [...quizData];
                  quizTemp[clickedQuizIndex].questionType = "True or false";
                  setQuizData([...quizTemp]);
                }
                setIsChangingQuestionType(false);
                toggleModalQuestion();
              }}
              className="the-gray cursor-pointer mx-[8px] mt-[8px] rounded-[4px] py-[16px] w-[150px] flex flex-col gap-y-2 justify-center items-center"
            >
              <VscSymbolBoolean color="black" size="30px" />
              <p className="text-black">True or false</p>
            </div>
          )}
          {((isChangingQuestionType &&
            quizData?.[clickedQuizIndex]?.questionType !== "Type answer") ||
            !isChangingQuestionType) && (
            <div
              onClick={() => {
                if (!isChangingQuestionType) {
                  setQuizData((prevState: any) => [
                    ...prevState,
                    { ...newQuizData, questionType: "Type answer" },
                  ]);
                  setCurrentId((prevState: any) => prevState + 1);
                  if (isMobileOrTablet) {
                    scrollToEnd();
                  } else {
                    scrollToBottom();
                  }
                } else {
                  let quizTemp = [...quizData];
                  quizTemp[clickedQuizIndex].questionType = "Type answer";
                  setQuizData([...quizTemp]);
                }
                setIsChangingQuestionType(false);
                toggleModalQuestion();
              }}
              className="the-gray cursor-pointer mx-[8px] mt-[8px] rounded-[4px] py-[16px] w-[150px] flex flex-col gap-y-2 justify-center items-center"
            >
              <TiMessageTyping color="black" size="30px" />
              <p className="text-black">Type answer</p>
            </div>
          )}
        </div>
      </div>
      <div className="close-toggle-button">
        <button
          onClick={() => {
            toggleModalQuestion();
            setIsChangingQuestionType(false);
          }}
          className="duplicate-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
