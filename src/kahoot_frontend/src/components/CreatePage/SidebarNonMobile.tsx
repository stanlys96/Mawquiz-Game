import { Tooltip } from "antd";
import { motion } from "framer-motion";
import { MdOutlineFolderCopy } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

interface Props {
  bottomRef: React.RefObject<HTMLUListElement>;
  setMouseEnterUl: (arg: boolean) => void;
  mouseEnterUl: boolean;
  quizData: any;
  setHoveredQuizIndex: (arg: number) => void;
  clickedQuizIndex: number;
  setClickedQuizIndex: (arg: number) => void;
  hoveredQuizIndex: number;
  handleCopyQuiz: (arg: number) => void;
  handleDeleteQuiz: (arg: number) => void;
  handleAddQuestion: () => void;
}

export const SidebarNonMobile = ({
  bottomRef,
  setMouseEnterUl,
  mouseEnterUl,
  quizData,
  setHoveredQuizIndex,
  clickedQuizIndex,
  setClickedQuizIndex,
  hoveredQuizIndex,
  handleCopyQuiz,
  handleDeleteQuiz,
  handleAddQuestion,
}: Props) => {
  return (
    <div className="the-sidebar">
      <ul
        ref={bottomRef}
        onMouseEnter={() => setMouseEnterUl(true)}
        onMouseLeave={() => setMouseEnterUl(false)}
        className={`${
          mouseEnterUl ? "overflow-y-auto" : "overflow-hidden"
        } sidebar-ul`}
      >
        {quizData?.map((quiz: any, index: number) => (
          <motion.li
            onMouseEnter={() => setHoveredQuizIndex(index)}
            onMouseLeave={() => setHoveredQuizIndex(-1)}
            initial={{ opacity: 1, scale: 1 }}
            animate={
              index !== 0
                ? {
                    opacity: 1,
                    scale: 1,
                    y: [0, -10, 10, -5, 5, 0],
                  }
                : {}
            }
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            key={quiz?.id}
            className="sidebar-li"
          >
            <div
              className={`${
                clickedQuizIndex === index && "sidebar-card-clicked"
              } sidebar-card relative`}
            >
              <div>
                <div className="flex gap-x-2">
                  <p className="ml-[32px] text-sidebar">{index + 1}</p>
                  <p className="text-sidebar">{quiz?.questionType}</p>
                </div>
                <div
                  onClick={() => {
                    setClickedQuizIndex(index);
                  }}
                  className={`${
                    clickedQuizIndex === index
                      ? "quiz-card-clicked"
                      : hoveredQuizIndex === index
                      ? "border-quiz-hover"
                      : ""
                  } quiz-card bg-white ml-[32px] cursor-pointer mt-[5px] mx-[16px] relative`}
                >
                  <p className="text-[0.75rem] my-[5px] text-center font-medium">
                    {quiz?.question?.length > 15
                      ? quiz?.question?.slice(0, 15) + "..."
                      : quiz?.question || "Question"}
                  </p>
                  <div className="bg-[#F2F2F2] rounded-b-[0.25rem] flex justify-center items-center">
                    <img
                      src={quizData?.[index]?.imageUrl ?? "walaoeh.svg"}
                      className="rounded-b-[0.25rem] py-[10px] h-[60px] w-[50px] w-full"
                    />
                  </div>
                  <div className="exclamation-container">
                    <img className="exclamation" src="/exclamation.svg" />
                  </div>
                </div>
              </div>
              {(clickedQuizIndex === index || hoveredQuizIndex === index) && (
                <div className="flex flex-col absolute top-[50%] gap-y-1">
                  <Tooltip placement="right" title={"Duplicate"}>
                    <a
                      onClick={() => handleCopyQuiz(index)}
                      className="cursor-pointer rounded-full icon-quiz"
                    >
                      <MdOutlineFolderCopy
                        color="#6E6E6E"
                        height={16}
                        width={16}
                      />
                    </a>
                  </Tooltip>
                  <Tooltip
                    placement="right"
                    title={
                      quizData?.length === 1
                        ? "Can't delete all content"
                        : "Delete"
                    }
                  >
                    <a
                      onClick={() => handleDeleteQuiz(index)}
                      className={`${
                        quizData?.length === 1
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } icon-quiz rounded-full`}
                    >
                      <RiDeleteBinLine color="#6E6E6E" height={16} width={16} />
                    </a>
                  </Tooltip>
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="sidebar-bottom">
        <div className="question-container">
          <span>
            <button onClick={handleAddQuestion} className="question-btn">
              Add question
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
