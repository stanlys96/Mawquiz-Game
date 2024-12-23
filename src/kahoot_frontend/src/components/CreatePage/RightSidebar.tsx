import { Dropdown } from "antd";
import { FaArrowRight, FaRegQuestionCircle } from "react-icons/fa";
import { MdAccessTime, MdQuiz } from "react-icons/md";
import { TiMessageTyping } from "react-icons/ti";
import { VscSymbolBoolean } from "react-icons/vsc";
import { DownOutlined } from "@ant-design/icons";
import {
  convertSecondsToMinutes,
  questionTypeItems,
  timeLimitItems,
} from "../../helper/helper";

interface Props {
  quizData: any;
  clickedQuizIndex: number;
  setQuizData: (arg: any) => void;
  toggleModalJiggle: () => void;
  setCurrentId: (arg: any) => void;
  currentId: number;
  scrollToEnd: () => void;
  handleOpenChange: (arg: any) => void;
}

export const RightSidebar = ({
  quizData,
  clickedQuizIndex,
  setQuizData,
  toggleModalJiggle,
  setCurrentId,
  currentId,
  scrollToEnd,
  handleOpenChange,
}: Props) => {
  return (
    <div className="right-sidebar">
      <button className="right-sidebar-btn text-black">
        <FaArrowRight className="absolute left-[20%]" />
      </button>
      <div className="inner-right-sidebar w-full">
        <div className="flex gap-x-2 items-center">
          <FaRegQuestionCircle className="w-[24px] h-[24px]" color="black" />
          <p className="text-[#333333] font-semibold">Question Type</p>
        </div>
        <Dropdown
          className="dropdown-sidebar mt-3 w-full text-black"
          menu={{
            items: questionTypeItems((questionType: string) => {
              let quizDataTemp = [...quizData];
              quizDataTemp[clickedQuizIndex].questionType = questionType;
              setQuizData([...quizDataTemp]);
            }),
          }}
          trigger={["click"]}
        >
          <a
            className="flex justify-between items-center px-[10px]"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-x-2">
              {quizData?.[clickedQuizIndex]?.questionType === "Quiz" ? (
                <MdQuiz />
              ) : quizData?.[clickedQuizIndex]?.questionType ===
                "True or false" ? (
                <VscSymbolBoolean />
              ) : (
                <TiMessageTyping />
              )}
              <p className="text-black">
                {quizData?.[clickedQuizIndex]?.questionType}
              </p>
            </div>
            <DownOutlined />
          </a>
        </Dropdown>
        <div className="horizontal-rule" />
        <div className="flex gap-x-2 items-center">
          <MdAccessTime className="w-[24px] h-[24px]" color="black" />
          <p className="text-[#333333] font-semibold">Time Limit</p>
        </div>
        <Dropdown
          className="dropdown-sidebar mt-3 w-full text-black"
          menu={{
            items: timeLimitItems((timeLimit: number) => {
              let quizDataTemp = [...quizData];
              quizDataTemp[clickedQuizIndex].timeLimit = timeLimit;
              setQuizData([...quizDataTemp]);
            }),
          }}
          trigger={["click"]}
        >
          <a
            className="flex justify-between items-center px-[10px]"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-x-2">
              {convertSecondsToMinutes(quizData?.[clickedQuizIndex]?.timeLimit)}
            </div>
            <DownOutlined />
          </a>
        </Dropdown>
      </div>
      <div className="right-sidebar-bottom mt-auto flex gap-x-2">
        {quizData?.length > 1 && (
          <button
            onClick={() => {
              if (quizData?.length === 1) return;
              toggleModalJiggle();
            }}
            className="delete-btn"
          >
            Delete
          </button>
        )}
        <button
          onClick={() => {
            let quizTemp = [...quizData];
            quizTemp.splice(clickedQuizIndex + 1, 0, {
              ...quizData?.[clickedQuizIndex],
              id: currentId + 1,
            });
            setCurrentId((prevState: any) => prevState + 1);
            if (clickedQuizIndex === quizData?.length - 1) {
              scrollToEnd();
            }
            setQuizData([...quizTemp]);
            handleOpenChange(false);
          }}
          className="duplicate-btn"
        >
          Duplicate
        </button>
      </div>
    </div>
  );
};
