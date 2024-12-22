import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Lottie from "lottie-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Quiz from "../public/lottie/quiz-2.json";
import TrueOrFalse from "../public/lottie/true-or-false.json";
import TypeAnswer from "../public/lottie/type-answer.json";
import GameFinished from "../public/lottie/drum-roll.json";
import { IoPersonCircle, IoTriangleSharp } from "react-icons/io5";
import { MdHexagon } from "react-icons/md";
import { FaAdjust, FaCircle, FaSquareFull, FaCheck } from "react-icons/fa";
import { useSpring, animated } from "@react-spring/web";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import { io } from "socket.io-client";
import {
  getOrdinalSuffix,
  getScoreLeaderboardHeight,
  getSocket,
} from "./helper/helper";
import Confetti from "react-confetti";
import { Fireworks } from "fireworks-js";

const AnimatedNumber = ({ from, to, duration }: any) => {
  const [currentValue, setCurrentValue] = useState(from);

  useEffect(() => {
    setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime: any) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Clamp to 0-1
        const newValue = Math.floor(from + (to - from) * progress);
        setCurrentValue(newValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, 1000);
  }, [from, to, duration]);

  return (
    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{currentValue}</div>
  );
};

function ShowQuizTitle() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  const { search, state } = useLocation();
  const [showTitle, setShowTitle] = useState(false);
  const [count, setCount] = useState(-1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGameData, setShowGameData] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [theKahootQuestions, setTheKahootQuestions] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<any>(0);
  const [currentTimeLimit, setCurrentTimeLimit] = useState(0);
  const [questionFinished, setQuestionFinished] = useState(false);
  const [leaderboardState, setLeaderboardState] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showDrumRoll, setShowDrumRoll] = useState(false);

  const { principal, nickname, currentPickedKahoot, currentUniquePlayers } =
    useSelector((state: any) => state.user);
  const [uniquePlayers, setUniquePlayers] = useState(currentUniquePlayers);
  const [playerAnswers, setPlayerAnswers] = useState<any>([]);

  const queryParams = new URLSearchParams(search);
  const gamePin = queryParams.get("gamePin");

  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  const [number, setNumber] = useState(0);
  const currentKahootQuestion = theKahootQuestions?.[currentQuestionIndex];
  const uniquePlayersSorted = [...uniquePlayers]?.sort(
    (a: any, b: any) => (b?.totalScore ?? 0) - (a?.totalScore ?? 0)
  );

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    socket.emit("join_game", { gamePin: gamePin });

    socket.on("player_joined", (data: any) => {
      const thePlayer = {
        ...data.thePlayer,
        totalScore: 0,
        currentScore: 0,
        questionIndex: currentQuestionIndex,
        previousScore: 0,
        answer: -1,
        answered: false,
      };
      setUniquePlayers((prevState: any) => {
        for (let i = 0; i < prevState.length; i++) {
          if (prevState[i]?.owner === thePlayer?.owner) {
            return prevState;
          }
        }
        return [...prevState, thePlayer];
      });
    });
    socket.on("player_left", (data: any) => {
      setPlayerAnswers((prevState: any) => {
        const findPrincipalIndex = prevState?.findIndex(
          (theState: any) => theState?.principal === data?.principal
        );
        if (findPrincipalIndex) {
          let temp = [...prevState];
          temp.splice(findPrincipalIndex, 1);
          return temp;
        }
        return prevState;
      });
      setUniquePlayers((prevState: any) => {
        const findIndex = prevState?.find(
          (thePlayer: any) => thePlayer?.owner === data?.principal
        );
        if (findIndex) {
          let temp = [...prevState];
          temp.splice(findIndex, 1);
          return temp;
        }
        return prevState;
      });
    });
    socket.on("player_answer", (data: any) => {
      setPlayerAnswers((prevState: any) => {
        const findPrincipal = prevState?.find(
          (theState: any) => theState?.principal === data?.principal
        );
        if (findPrincipal) {
          return prevState;
        }
        return [
          ...prevState,
          { principal: data.principal, answer: data.answer },
        ];
      });
      setUniquePlayers((prevState: any) => {
        const findPrincipal = prevState?.findIndex(
          (theState: any) => theState?.owner === data?.principal
        );
        if (findPrincipal !== -1) {
          const updatedState = prevState.map((player: any, index: number) => {
            if (index === findPrincipal) {
              return {
                ...player,
                totalScore: data?.totalScore ?? 0,
                currentScore: data?.currentScore ?? 0,
                questionIndex: data?.questionIndex ?? 0,
                previousScore: data?.previousScore ?? 0,
                answer: data?.answer ?? 0,
                nickname: data?.nickname ?? "",
                answered: true,
              };
            }
            return player;
          });
          return updatedState;
        }
        return [
          ...prevState,
          {
            owner: data?.principal ?? "",
            principal: data?.principal ?? "",
            totalScore: data?.currentScore ?? 0,
            currentScore: data?.currentScore ?? 0,
            questionIndex: currentQuestionIndex ?? 0,
            previousScore: data?.previousScore ?? 0,
            nickname: data?.nickname ?? "",
          },
        ];
      });
    });
  }, []);

  useEffect(() => {
    const target = 1000;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 10); // Increment every 10ms

    let currentNumber = 0;
    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= target) {
        currentNumber = target;
        clearInterval(timer);
      }
      setNumber(Math.round(currentNumber));
    }, 10);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (showGameData) {
      const duration = 3000;
      const increment = 100 / (duration / 100);

      const interval = setInterval(() => {
        setProgress((prev) => {
          const nextValue = prev + increment;
          if (nextValue >= 100) {
            clearInterval(interval);
            setShowGameData(false);
            setShowQuestion(true);
            setCurrentTimeLimit(currentKahootQuestion?.timeLimit);
            setUniquePlayers((prevState: any) => {
              const updatedState = prevState.map((player: any) => {
                return {
                  ...player,
                  answered: false,
                };
              });
              return updatedState;
            });
            return 100;
          }
          return nextValue;
        });
      }, 100);
      return () => clearInterval(interval);
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

    const handleBeforeUnload = (event: any) => {
      socket.emit("admin_left", { gamePin: gamePin });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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

  useEffect(() => {
    if (currentPickedKahoot?.questions) {
      setTheKahootQuestions(currentPickedKahoot?.questions ?? []);
    }
  }, [currentPickedKahoot]);

  useEffect(() => {
    if (currentTimeLimit > 1) {
      const timer = setTimeout(() => {
        setCurrentTimeLimit((prevState) => prevState - 1);
      }, 1000);
      if (playerAnswers?.length === uniquePlayers?.length) {
        setQuestionFinished(true);
        setCurrentTimeLimit(0);
        socket.emit("question_finished", { gamePin });
      }
      return () => clearTimeout(timer);
    } else if (currentTimeLimit === 1) {
      const timer = setTimeout(() => {
        setCurrentTimeLimit((prevState) => prevState - 1);
        setQuestionFinished(true);
        setUniquePlayers((prevState: any) => {
          const updatedState = prevState.map((player: any, index: number) => {
            return {
              ...player,
              previousScore: player?.answered
                ? player?.previousScore ?? 0
                : player?.totalScore ?? 0,
            };
          });
          return updatedState;
        });
        socket.emit("question_finished", { gamePin });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTimeLimit, playerAnswers, uniquePlayers]);

  return (
    <div className="waiting-game overflow-hidden relative bg-black/10">
      {!showQuestion && (
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
              className="w-[95%] md:w-[80%] rounded-[10px] bg-white text-black py-[24px] text-[48px] font-bold"
            >
              {currentPickedKahoot?.title}
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
            {(showQuiz || showDrumRoll) && (
              <motion.div
                key={"Quiz"}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center w-full flex-col h-[100vh]"
              >
                {!showDrumRoll &&
                  currentKahootQuestion?.questionType === "Quiz" && (
                    <Lottie
                      className="w-[800px]"
                      width={500}
                      animationData={Quiz}
                    />
                  )}
                {!showDrumRoll &&
                  currentKahootQuestion?.questionType === "True or false" && (
                    <Lottie
                      className="w-[500px]"
                      width={1000}
                      animationData={TrueOrFalse}
                    />
                  )}
                {!showDrumRoll &&
                  currentKahootQuestion?.questionType === "Type answer" && (
                    <Lottie animationData={TypeAnswer} />
                  )}
                {showDrumRoll && (
                  <Lottie
                    className="w-[90vw] md:w-[400px]"
                    animationData={GameFinished}
                  />
                )}
                <p className="w-[90vw] md:w-[50vw] dark-purple-bg text-[3rem] py-[10px] px-[15px] text-white text-center rounded-[10px]">
                  {showDrumRoll
                    ? "Drum roll...."
                    : currentKahootQuestion?.questionType}
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
                  className="bg-white text-black text-[1rem] text-center md:text-[54px] font-bold py-[10px] px-[20px] rounded-[5px]"
                >
                  {currentKahootQuestion?.question}
                </motion.div>
              </div>
            </div>
          )}
          {showGameData && (
            <div className="absolute top-2 right-2 dark-purple-bg px-[30px] py-[5px] rounded-[50px]">
              <p className="text-white text-[24px] md:text-[36px]">
                {currentQuestionIndex + 1} of {theKahootQuestions?.length}
              </p>
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
      {showQuestion && !leaderboardState ? (
        <div className="flex justify-center flex-col items-center h-full relative">
          {questionFinished && (
            <button
              onClick={() => {
                setLeaderboardState(true);
              }}
              className="custom-button-small z-infinite absolute top-[15%] md:top-[20px] right-2 z-infinite"
            >
              Next
            </button>
          )}
          <div className="absolute z-infinite top-[55%] md:top-1/2 shadow-md left-[10px] timer-round -translate-y-1/2">
            {currentTimeLimit ?? 0}
          </div>
          <button></button>
          <div className="absolute z-infinite top-[55%] md:top-1/2 flex justify-center items-center flex-col right-[10px] font-bold rounded-full -translate-y-1/2">
            <p className="answer-round">{playerAnswers?.length}</p>
            <p className="answer-title-round">Answers</p>
          </div>
          <div className="bg-white text-black text-center z-infinite text-[1rem] mt-[20px] mx-[20px] md:text-[40px] w-[80vw] font-bold py-[10px] px-[20px] rounded-[5px]">
            {currentKahootQuestion?.question}
          </div>
          {questionFinished && (
            <div className="absolute inset-0 bg-black/50"></div>
          )}
          {!questionFinished && showQuestion ? (
            <div className="img-container flex justify-center items-center">
              {currentKahootQuestion?.imageUrl &&
                currentKahootQuestion?.imageUrl !== "cdn.svg" && (
                  <img
                    src={currentKahootQuestion?.imageUrl}
                    className="w-[300px] md:w-[400px] h-[250px]"
                  />
                )}
            </div>
          ) : (
            <div className="ranking-container">
              <div className="ranking-sub-container">
                {currentKahootQuestion?.questionType === "Quiz" && (
                  <div className="ranking-inner-container">
                    <div className="first-answer">
                      <div className="the-answer">
                        <div
                          style={{
                            height: `${getScoreLeaderboardHeight(
                              uniquePlayers,
                              0
                            )}%`,
                          }}
                          className="red-answer-inner the-red-answer-bg"
                        ></div>
                      </div>
                      <div className="bottom-answer-inner the-red-darker-answer-bg gap-x-1">
                        <IoTriangleSharp size="12px" />{" "}
                        {uniquePlayers?.filter(
                          (theUser: any) => theUser?.answer === 0
                        )?.length ?? 0}
                        {currentKahootQuestion?.answer1Clicked && (
                          <FaCheck size="12px" />
                        )}
                      </div>
                    </div>
                    <div className="first-answer">
                      <div className="the-answer">
                        <div
                          style={{
                            height: `${getScoreLeaderboardHeight(
                              uniquePlayers,
                              1
                            )}%`,
                          }}
                          className="red-answer-inner the-blue-answer-bg"
                        ></div>
                      </div>
                      <div className="bottom-answer-inner the-blue-darker-answer-bg gap-x-1">
                        <FaAdjust size="12px" />
                        {uniquePlayers?.filter(
                          (theUser: any) => theUser?.answer === 1
                        ).length ?? 0}{" "}
                        {currentKahootQuestion?.answer2Clicked && (
                          <FaCheck size="12px" />
                        )}
                      </div>
                    </div>
                    {currentKahootQuestion?.text3 && (
                      <div className="first-answer">
                        <div className="the-answer">
                          <div
                            style={{
                              height: `${getScoreLeaderboardHeight(
                                uniquePlayers,
                                2
                              )}%`,
                            }}
                            className="red-answer-inner the-orange-answer-bg"
                          ></div>
                        </div>
                        <div className="bottom-answer-inner the-orange-darker-answer-bg gap-x-1">
                          <FaCircle size="12px" />
                          {uniquePlayers?.filter(
                            (theUser: any) => theUser?.answer === 2
                          ).length ?? 0}{" "}
                          {currentKahootQuestion?.answer3Clicked && (
                            <FaCheck size="12px" />
                          )}
                        </div>
                      </div>
                    )}
                    {currentKahootQuestion?.text4 && (
                      <div className="first-answer">
                        <div className="the-answer">
                          <div
                            style={{
                              height: `${getScoreLeaderboardHeight(
                                uniquePlayers,
                                3
                              )}%`,
                            }}
                            className="red-answer-inner the-green-answer-bg"
                          ></div>
                        </div>
                        <div className="bottom-answer-inner the-green-darker-answer-bg gap-x-1">
                          <FaSquareFull size="12px" />
                          {uniquePlayers?.filter(
                            (theUser: any) => theUser?.answer === 3
                          ).length ?? 0}{" "}
                          {currentKahootQuestion?.answer4Clicked && (
                            <FaCheck size="12px" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {currentKahootQuestion?.questionType === "True or false" && (
                  <div className="ranking-inner-container">
                    <div className="first-answer">
                      <div className="the-answer">
                        <div
                          style={{
                            height: `${getScoreLeaderboardHeight(
                              uniquePlayers,
                              0
                            )}%`,
                          }}
                          className="red-answer-inner the-blue-answer-bg"
                        ></div>
                      </div>
                      <div className="bottom-answer-inner the-blue-darker-answer-bg gap-x-1">
                        <FaAdjust size="12px" />
                        {uniquePlayers?.filter(
                          (theUser: any) => theUser?.answer === 0
                        ).length ?? 0}{" "}
                        {currentKahootQuestion?.trueOrFalseAnswer ===
                          "true" && <FaCheck size="12px" />}
                      </div>
                    </div>
                    <div className="first-answer">
                      <div className="the-answer">
                        <div
                          style={{
                            height: `${getScoreLeaderboardHeight(
                              uniquePlayers,
                              1
                            )}%`,
                          }}
                          className="red-answer-inner the-red-answer-bg"
                        ></div>
                      </div>
                      <div className="bottom-answer-inner the-red-darker-answer-bg gap-x-1">
                        <IoTriangleSharp size="12px" />{" "}
                        {uniquePlayers?.filter(
                          (theUser: any) => theUser?.answer === 1
                        )?.length ?? 0}
                        {currentKahootQuestion?.trueOrFalseAnswer ===
                          "false" && <FaCheck size="12px" />}
                      </div>
                    </div>
                  </div>
                )}
                {currentKahootQuestion?.questionType === "Type answer" && (
                  <div className="ranking-type-answer flex flex-col gap-y-4 justify-center items-center">
                    {Array.from(
                      { length: currentKahootQuestion?.additionalAnswers + 1 },
                      (_, index) => index
                    ).map((i: any) => (
                      <div className="question-div">
                        <div
                          className={`question-answer-full ${
                            i === 0
                              ? "bg-red"
                              : i === 1
                              ? "bg-blue"
                              : i === 2
                              ? "bg-orange"
                              : "bg-green-only"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  disabled
                                  maxLength={20}
                                  value={
                                    i === 0
                                      ? currentKahootQuestion?.text1
                                      : i === 1
                                      ? currentKahootQuestion?.text2
                                      : i === 2
                                      ? currentKahootQuestion?.text3
                                      : currentKahootQuestion?.text4
                                  }
                                  placeholder="Type an answer"
                                  className={`${"text-white"} w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {currentKahootQuestion?.questionType === "Quiz" && (
            <div className="grid grid-cols-2 w-full px-[10px] gap-[10px] h-[25vh] mt-[0px] pb-[25px]">
              {currentKahootQuestion?.text1 && (
                <div
                  className={`${
                    questionFinished
                      ? !currentKahootQuestion?.answer1Clicked
                        ? "opacity-65"
                        : ""
                      : ""
                  } answer-div bg-red flex justify-between items-center gap-x-[10px]`}
                >
                  <div className="flex gap-x-2 items-center ml-[10px]">
                    <IoTriangleSharp size="32px" />
                    <p>{currentKahootQuestion?.text1}</p>
                  </div>
                  {questionFinished ? (
                    currentKahootQuestion?.answer1Clicked ? (
                      <FaCheck size="30px" className="mr-[10px]" />
                    ) : (
                      <ImCross size="30px" className="mr-[10px]" />
                    )
                  ) : null}
                </div>
              )}
              {currentKahootQuestion?.text2 && (
                <div
                  className={`${
                    questionFinished
                      ? !currentKahootQuestion?.answer2Clicked
                        ? "opacity-65"
                        : ""
                      : ""
                  } answer-div bg-blue flex justify-between items-center gap-x-[10px]`}
                >
                  <div className="flex gap-x-2 items-center ml-[10px]">
                    <FaAdjust size="32px" />
                    <p>{currentKahootQuestion?.text2}</p>
                  </div>
                  {questionFinished ? (
                    currentKahootQuestion?.answer2Clicked ? (
                      <FaCheck size="30px" className="mr-[10px]" />
                    ) : (
                      <ImCross size="30px" className="mr-[10px]" />
                    )
                  ) : null}
                </div>
              )}
              {currentKahootQuestion?.text3 && (
                <div
                  className={`${
                    questionFinished
                      ? !currentKahootQuestion?.answer3Clicked
                        ? "opacity-65"
                        : ""
                      : ""
                  } answer-div bg-orange flex justify-between items-center gap-x-[10px]`}
                >
                  <div className="flex gap-x-2 items-center ml-[10px]">
                    <FaCircle size="32px" />
                    <p>{currentKahootQuestion?.text3}</p>
                  </div>
                  {questionFinished ? (
                    currentKahootQuestion?.answer3Clicked ? (
                      <FaCheck size="30px" className="mr-[10px]" />
                    ) : (
                      <ImCross size="30px" className="mr-[10px]" />
                    )
                  ) : null}
                </div>
              )}
              {currentKahootQuestion?.text4 && (
                <div
                  className={`${
                    questionFinished
                      ? !currentKahootQuestion?.answer4Clicked
                        ? "opacity-65"
                        : ""
                      : ""
                  } answer-div bg-dark-green flex justify-between items-center gap-x-[10px]`}
                >
                  <div className="flex gap-x-2 items-center ml-[10px]">
                    <FaSquareFull size="32px" />
                    <p>{currentKahootQuestion?.text4}</p>
                  </div>
                  {questionFinished ? (
                    currentKahootQuestion?.answer4Clicked ? (
                      <FaCheck size="30px" className="mr-[10px]" />
                    ) : (
                      <ImCross size="30px" className="mr-[10px]" />
                    )
                  ) : null}
                </div>
              )}
            </div>
          )}
          {currentKahootQuestion?.questionType === "True or false" && (
            <div className="grid grid-cols-2 w-full px-[10px] gap-[10px] h-[25vh] mt-[0px] pb-[25px]">
              <div
                className={`${
                  questionFinished
                    ? currentKahootQuestion?.trueOrFalseAnswer === "false"
                      ? "opacity-65"
                      : ""
                    : ""
                } answer-div bg-blue flex justify-between items-center gap-x-[10px]`}
              >
                <div className="flex gap-x-2 items-center ml-[10px]">
                  <FaAdjust size="32px" />
                  <p>True</p>
                </div>
                {questionFinished ? (
                  currentKahootQuestion?.trueOrFalseAnswer === "true" ? (
                    <FaCheck size="30px" className="mr-[10px]" />
                  ) : (
                    <ImCross size="30px" className="mr-[10px]" />
                  )
                ) : null}
              </div>
              <div
                className={`${
                  questionFinished
                    ? currentKahootQuestion?.trueOrFalseAnswer === "true"
                      ? "opacity-65"
                      : ""
                    : ""
                } answer-div bg-red flex justify-between items-center gap-x-[10px]`}
              >
                <div className="flex gap-x-2 items-center ml-[10px]">
                  <IoTriangleSharp size="32px" />
                  <p>False</p>
                </div>
                {questionFinished ? (
                  currentKahootQuestion?.trueOrFalseAnswer === "false" ? (
                    <FaCheck size="30px" className="mr-[10px]" />
                  ) : (
                    <ImCross size="30px" className="mr-[10px]" />
                  )
                ) : null}
              </div>
            </div>
          )}
          <div className="mt-auto bottomest relative flex justify-center items-center gap-x-[25px] w-full">
            <p className="absolute left-[10px]">
              {currentQuestionIndex + 1}/{theKahootQuestions?.length}
            </p>
            <p className="">
              Game PIN: <span className="font-bold">{gamePin}</span>
            </p>
          </div>
        </div>
      ) : !gameFinished ? (
        <div className="flex justify-center flex-col items-center h-full relative">
          <button
            onClick={() => {
              if (currentQuestionIndex < theKahootQuestions?.length - 1) {
                socket.emit("question_restarted", {
                  gamePin,
                  questionIndex: currentQuestionIndex + 1,
                });
                setLeaderboardState(false);
                setShowQuestion(false);
                setQuestionFinished(false);
                setCurrentQuestionIndex((prevState: any) => prevState + 1);
                setUniquePlayers((prevState: any) => {
                  const updatedState = prevState.map((player: any) => {
                    return {
                      ...player,
                      answer: -1,
                    };
                  });
                  return updatedState;
                });
                setShowQuiz(true);
                setPlayerAnswers([]);
                setTimeout(() => {
                  setShowQuiz(false);
                  setTimeout(() => {
                    setShowGameData(true);
                  }, 600);
                }, 2500);
              } else {
                setShowDrumRoll(true);
                setLeaderboardState(false);
                setShowQuestion(false);
                setQuestionFinished(false);
                socket.emit("game_finished", {
                  gamePin,
                  uniquePlayers: uniquePlayersSorted,
                });
                setTimeout(() => {
                  setShowDrumRoll(false);
                  setTimeout(() => {
                    setLeaderboardState(true);
                    setGameFinished(true);
                    setShowQuestion(true);
                    setQuestionFinished(true);
                  }, 500);
                }, 5000);
              }
            }}
            className="custom-button-small z-infinite absolute top-[1%] md:top-[20px] right-2 z-infinite"
          >
            Next
          </button>
          <div className="bg-white mb-[25px] text-black text-center z-infinite text-[1rem] mt-[20px] mx-[20px] md:text-[40px] w-fit font-bold py-[10px] px-[20px] rounded-[5px]">
            Scoreboard
          </div>
          <div className="flex flex-col gap-y-5 overflow-y-auto w-full justify-start items-center mb-[25px]">
            {uniquePlayersSorted?.length > 0 &&
              Array.isArray(uniquePlayersSorted) &&
              uniquePlayersSorted?.map((userScore: any) => (
                <div className="w-[90vw] flex justify-between items-center rounded-[8px] p-[20px] md:w-[80vw] dark-purple-bg">
                  <div className="flex gap-x-2 items-center">
                    <IoPersonCircle size="40px" />
                    <p className="text-[26px]">
                      {userScore?.nickname?.length > 25
                        ? userScore?.nickname?.slice(0, 25) + "..."
                        : userScore?.nickname}
                    </p>
                  </div>
                  <AnimatedNumber
                    from={userScore?.previousScore}
                    to={userScore?.totalScore}
                    duration={2000}
                  />
                </div>
              ))}
          </div>
          <div className="mt-auto bottomest relative flex justify-center items-center gap-x-[25px] w-full">
            <p className="absolute left-[10px]">
              {currentQuestionIndex + 1}/{theKahootQuestions?.length}
            </p>
            <p className="">
              Game PIN: <span className="font-bold">{gamePin}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col items-center h-full relative">
          <button
            onClick={() => {
              navigate("/profile", {
                state: {
                  routerPrincipal: state.routerPrincipal,
                },
              });
            }}
            className="custom-button-small z-infinite absolute top-[15%] md:top-[20px] right-2 z-infinite"
          >
            Quit
          </button>
          <div className="bg-white mb-[25px] text-black text-center z-infinite text-[1rem] mt-[20px] mx-[20px] md:text-[40px] w-fit font-bold py-[10px] px-[20px] rounded-[5px]">
            Game is finished!
          </div>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            gravity={0.3}
          />
          <div className="flex flex-col gap-y-5 overflow-y-auto w-full justify-start items-center mb-[25px]">
            {uniquePlayersSorted?.length > 0 &&
              Array.isArray(uniquePlayersSorted) &&
              uniquePlayersSorted?.map((userScore: any, index: any) => (
                <div className="w-[90vw] flex justify-between items-center rounded-[8px] p-[20px] md:w-[80vw] dark-purple-bg">
                  <div className="flex gap-x-2 items-center">
                    <IoPersonCircle size="40px" />
                    <p className="text-[26px]">
                      {userScore?.nickname?.length > 25
                        ? userScore?.nickname?.slice(0, 25) + "..."
                        : userScore?.nickname}
                    </p>
                  </div>
                  <p className="text-[26px] font-bold">
                    {getOrdinalSuffix(index + 1)} place
                  </p>
                </div>
              ))}
          </div>
          <div className="mt-auto bottomest relative flex justify-center items-center gap-x-[25px] w-full">
            <p className="absolute left-[10px]">
              {currentQuestionIndex + 1}/{theKahootQuestions?.length}
            </p>
            <p className="">
              Game PIN: <span className="font-bold">{gamePin}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowQuizTitle;
