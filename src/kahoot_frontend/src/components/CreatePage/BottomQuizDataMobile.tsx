import { motion } from "framer-motion";
import { Game } from "../../../../declarations/kahoot_backend/kahoot_backend.did";
import { FaPlus, FaRegImage } from "react-icons/fa6";

interface Props {
  bottomRef: React.RefObject<HTMLUListElement>;
  setMouseEnterUl: (arg: boolean) => void;
  mouseEnterUl: boolean;
  quizData: any;
  setHoveredQuizIndex: (arg: number) => void;
  clickedQuizIndex: number;
  setClickedQuizIndex: (arg: number) => void;
  hoveredQuizIndex: number;
  handleAddQuestion: () => void;
  loading: boolean;
}

export const BottomQuizDataMobile = ({
  bottomRef,
  setMouseEnterUl,
  mouseEnterUl,
  quizData,
  setHoveredQuizIndex,
  clickedQuizIndex,
  loading,
  setClickedQuizIndex,
  handleAddQuestion,
  hoveredQuizIndex,
}: Props) => {
  return (
    <div className="fixed bottom-container-mobile h-[4.5rem] bottom-0 bg-white z-infinite w-full flex items-center gap-x-2">
      <ul
        ref={bottomRef}
        onMouseEnter={() => setMouseEnterUl(true)}
        onMouseLeave={() => setMouseEnterUl(false)}
        className={`${
          mouseEnterUl ? "overflow-y-auto" : "overflow-hidden"
        } flex flex-1 mobile-ul w-full mr-auto gap-x-2 h-full`}
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
            className="w-[100px]"
          >
            <div
              className={`${
                clickedQuizIndex === index && "sidebar-card-clicked"
              } p-[8px] w-[100px] h-full flex justify-center items-center relative`}
            >
              <div className="flex gap-x-2">
                <p className="text-sidebar">{index + 1}</p>
                <div
                  onClick={() => {
                    if (loading) return;
                    setClickedQuizIndex(index);
                  }}
                  className={`${
                    clickedQuizIndex === index
                      ? "quiz-card-clicked"
                      : hoveredQuizIndex === index
                      ? "border-quiz-hover"
                      : ""
                  } quiz-card bg-white cursor-pointer mt-[5px] relative`}
                >
                  <p className="text-[0.75rem] bg-[#F2F2F2] rounded-t-[0.25rem] text-[#6E6E6E] py-[2px] text-center font-medium">
                    {quiz?.question?.length > 5
                      ? quiz?.question?.slice(0, 5) + "..."
                      : quiz?.question || "Question"}
                  </p>
                  <div className="bg-[#F2F2F2] rounded-b-[0.25rem] px-[4px] flex justify-center items-center">
                    {quizData?.[index]?.imageUrl !== "cdn.svg" ? (
                      <img
                        src={quizData?.[index]?.imageUrl ?? "walaoeh.svg"}
                        className="rounded-b-[0.25rem] py-[10px] h-[30px] w-[60px]"
                      />
                    ) : (
                      <div className="">
                        <FaRegImage className="h-[30px] w-[60px] pb-[5px]" />
                      </div>
                    )}
                  </div>
                  <div className="exclamation-container-mobile">
                    <img className="exclamation" src="/exclamation.svg" />
                  </div>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="mr-[10px]">
        <div className="question-container">
          <span>
            <button onClick={handleAddQuestion} className="question-btn">
              <FaPlus size="24px" className="block my-[10px]" color="white" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
