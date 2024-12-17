import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import Quiz from "../public/lottie/Study-3.json";
import { IoTriangleSharp } from "react-icons/io5";
import { MdHexagon } from "react-icons/md";
import { FaAdjust, FaCircle, FaSquareFull, FaCheck } from "react-icons/fa";

function ShowQuizTitle() {
  const [showTitle, setShowTitle] = useState(false);
  const [count, setCount] = useState(-1);
  const [rotation, setRotation] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGameData, setShowGameData] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  useEffect(() => {
    if (showGameData) {
      const duration = 3000; // 3 seconds
      const increment = 100 / (duration / 100); // Increment per 100ms

      const interval = setInterval(() => {
        setProgress((prev) => {
          const nextValue = prev + increment;
          if (nextValue >= 100) {
            clearInterval(interval);
            setShowGameData(false);
            setShowQuestion(true);
            return 100; // Stop at 100%
          }
          return nextValue;
        });
      }, 100);
      return () => clearInterval(interval); // Cleanup interval on component unmount
    } else {
      setProgress(0);
    }
  }, [showGameData]);

  useEffect(() => {
    setTimeout(() => {
      setShowTitle(true);
      setTimeout(() => {
        setShowTitle(false);
        setCount(3);
      }, 3000);
    }, 1500);
  }, []);

  useEffect(() => {
    if (count > 1) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 1) {
      const timer = setTimeout(() => {
        setCount(count - 1);
        setShowQuiz(true);
        setTimeout(() => {
          setShowQuiz(false);
          setTimeout(() => {
            setShowGameData(true);
          }, 600);
        }, 2500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);
  return (
    <div className="waiting-game overflow-hidden relative bg-black/10">
      {false && (
        <div className="flex justify-center items-center h-full relative">
          {showTitle && (
            <motion.button
              variants={{
                hidden: { scale: 0.5, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 2500,
                    damping: 20,
                  },
                },
                exit: { scale: 0.5, opacity: 0 },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full bg-white text-black py-[24px] text-[48px] font-bold"
            >
              WALAO
            </motion.button>
          )}
          {count > 0 && (
            <div className="countdown-container w-fit">
              <div key={count} className="countdown-number w-fit">
                {count}
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            {showQuiz && (
              <motion.div
                key={"Quiz"}
                variants={variants} // Use variants for inner div
                initial="hidden" // Initial state
                animate="visible" // Animate to visible state
                exit="exit" // Exit state
                transition={{ duration: 0.5 }} // Transition duration
              >
                <Lottie animationData={Quiz} />
                <p className="w-full bg-black text-[3rem] py-[10px] text-white text-center">
                  Quiz
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {showGameData && (
            <div className="relative flex justify-center items-center w-[90vw]">
              <div>
                <motion.div
                  variants={{
                    hidden: { scale: 0.5, opacity: 0 },
                    visible: {
                      scale: 1,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 2500,
                        damping: 20,
                      },
                    },
                    exit: { scale: 0.5, opacity: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white text-black text-[1rem] md:text-[54px] font-bold py-[10px] px-[20px] rounded-[5px]"
                >
                  WALAO EH WLADOA OSJDOA SJDOIASJIDO
                </motion.div>
              </div>
            </div>
          )}
          {showGameData && (
            <div className="absolute top-2 right-2 dark-purple-bg px-[30px] py-[5px] rounded-[50px]">
              <p className="text-white text-[24px] md:text-[36px]">1 of 2</p>
            </div>
          )}
          {showGameData && (
            <div
              style={{
                width: `100%`,
                transition: "width 0.1s linear",
                marginRight: "auto",
              }}
              className="absolute bottom-[10%] px-[5vw]"
            >
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#47178f",
                  borderRadius: "100px",
                  overflow: "hidden",
                  transition: "width 0.1s linear",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "30px",
                    backgroundColor: "#47178f",
                    transition: "width 0.1s linear",
                  }}
                ></div>
              </div>
            </div>
          )}
          <img
            className="w-[150px] md:w-[200px] absolute bottom-2 left-2 cursor-pointer"
            src="kahoot-2.png"
          />
        </div>
      )}
      {false ? (
        <div className="flex justify-center flex-col items-center h-full relative">
          <button className="custom-button-small z-infinite absolute top-[15%] md:top-[20px] right-2 z-infinite">
            Next
          </button>
          <div className="absolute z-infinite top-[55%] md:top-1/2 shadow-md left-[10px] timer-round -translate-y-1/2">
            20
          </div>
          <button></button>
          <div className="absolute z-infinite top-[55%] md:top-1/2 flex justify-center items-center flex-col right-[10px] font-bold rounded-full -translate-y-1/2">
            <p className="answer-round">0</p>
            <p className="answer-title-round">Answers</p>
          </div>
          <div className="bg-white text-black text-center z-infinite text-[1rem] mt-[20px] mx-[20px] md:text-[40px] w-[80vw] font-bold py-[10px] px-[20px] rounded-[5px]">
            WALAO EH WLADOA OSJDOA SJDOIASJIDO
          </div>
          {/* <div className="absolute inset-0 bg-black/50"></div> */}
          {true ? (
            <div className="img-container flex justify-center items-center">
              <img
                src="background.webp"
                className="w-[300px] md:w-[400px] h-[250px]"
              />
            </div>
          ) : (
            <div className="ranking-container">
              <div className="ranking-sub-container">
                <div className="ranking-inner-container">
                  <div className="first-answer">
                    <div className="the-answer">
                      <div className="red-answer-inner the-red-answer-bg"></div>
                    </div>
                    <div className="bottom-answer-inner the-red-darker-answer-bg">
                      1
                    </div>
                  </div>
                  <div className="first-answer">
                    <div className="the-answer">
                      <div className="red-answer-inner the-blue-answer-bg"></div>
                    </div>
                    <div className="bottom-answer-inner the-blue-darker-answer-bg">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 w-full px-[10px] gap-[10px] h-[25vh] mt-[0px] pb-[25px]">
            <div className="answer-div bg-red flex justify-between items-center gap-x-[10px]">
              <div className="flex gap-x-2 items-center ml-[10px]">
                <IoTriangleSharp size="32px" />
                <p>WALAOEH</p>
              </div>
              <FaCheck size="30px" className="mr-[10px]" />
            </div>
            <div className="answer-div bg-blue flex justify-between items-center gap-x-[10px]">
              <div className="flex gap-x-2 items-center ml-[10px]">
                <FaAdjust size="32px" />
                <p>WALAOEH</p>
              </div>
              <FaCheck size="30px" className="mr-[10px]" />
            </div>
            <div className="answer-div bg-orange flex justify-between items-center gap-x-[10px]">
              <div className="flex gap-x-2 items-center ml-[10px]">
                <FaCircle size="32px" />
                <p>WALAOEH</p>
              </div>
              <FaCheck size="30px" className="mr-[10px]" />
            </div>
            <div className="answer-div bg-dark-green flex justify-between items-center gap-x-[10px]">
              <div className="flex gap-x-2 items-center ml-[10px]">
                <FaSquareFull size="32px" />
                <p>WALAOEH</p>
              </div>
              <FaCheck size="30px" className="mr-[10px]" />
            </div>
          </div>
          <div className="mt-auto bottomest relative flex justify-center items-center gap-x-[25px] w-full">
            <p className="absolute left-[10px]">1/2</p>
            <p className="">
              Game PIN: <span className="font-bold">Habibu</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col items-center h-full relative">
          <button className="custom-button-small z-infinite absolute top-[15%] md:top-[20px] right-2 z-infinite">
            Next
          </button>
          <div className="bg-white text-black text-center z-infinite text-[1rem] mt-[20px] mx-[20px] md:text-[40px] w-fit font-bold py-[10px] px-[20px] rounded-[5px]">
            Scoreboard
          </div>
          <div className="h-[60vh] flex flex-col gap-y-5">
            <div className="scoreboard-div">
              <div className="scoreboard-inner-div">
                <div className="scoreboard-sub-inner-div">
                  <div className="scoreboard-player-icon">
                    <p>WALAO</p>
                  </div>
                  <button className="scoreboard-button">Walao</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto bottomest relative flex justify-center items-center gap-x-[25px] w-full">
            <p className="absolute left-[10px]">1/2</p>
            <p className="">
              Game PIN: <span className="font-bold">Habibu</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowQuizTitle;
