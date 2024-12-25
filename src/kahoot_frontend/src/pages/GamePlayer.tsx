import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoPersonCircle, IoTriangleSharp } from "react-icons/io5";
import { getOrdinalSuffix, getSocket, override } from "../helper/helper";
import { PacmanLoader } from "react-spinners";
import { MdQuiz } from "react-icons/md";
import {
  FaAdjust,
  FaCheck,
  FaCircle,
  FaFireAlt,
  FaSquareFull,
} from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { ImCross } from "react-icons/im";
import { VscSymbolBoolean } from "react-icons/vsc";
import Confetti from "react-confetti";
import GameFinished from "../../public/lottie/drum-roll.json";
import Lottie from "lottie-react";
import { AnimatePresence, motion } from "framer-motion";

function GamePlayer() {
  const variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };
  const socket = getSocket();
  const navigate = useNavigate();
  const { search, state } = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const queryParams = new URLSearchParams(search);
  const { principal, nickname, currentQuestions } = useSelector(
    (state: any) => state.user
  );

  const [isIntroduction, setIsIntroduction] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [count, setCount] = useState(-1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answer, setAnswer] = useState(-1);
  const [typeAnswer, setTypeAnswer] = useState("");
  const [questionFinished, setQuestionFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [previousScore, setPreviousScore] = useState<number>(0);
  const [answerStreak, setAnswerStreak] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [theRanking, setTheRanking] = useState(0);
  const [showDrumRoll, setShowDrumRoll] = useState(false);
  const [marker, setMarker] = useState(false);

  const gamePin = queryParams.get("gamePin");
  const theCurrentQuestion = currentQuestions[questionIndex];
  const MAX_SCORE = 1000;
  const MAX_TIME_MS = theCurrentQuestion?.timeLimit * 1000;

  const checkAnswer = useCallback(
    (theAnswer: any): boolean => {
      if (theCurrentQuestion?.questionType === "Quiz") {
        if (theCurrentQuestion?.answer1Clicked && theAnswer === 0) {
          return true;
        }
        if (theCurrentQuestion?.answer2Clicked && theAnswer === 1) {
          return true;
        }
        if (theCurrentQuestion?.answer3Clicked && theAnswer === 2) {
          return true;
        }
        if (theCurrentQuestion?.answer4Clicked && theAnswer === 3) {
          return true;
        }
        return false;
      }
      if (theCurrentQuestion?.questionType === "True or false") {
        if (
          theCurrentQuestion?.trueOrFalseAnswer === "true" &&
          theAnswer === 0
        ) {
          return true;
        }
        if (
          theCurrentQuestion?.trueOrFalseAnswer === "false" &&
          theAnswer === 1
        ) {
          return true;
        }
        return false;
      }
      if (theCurrentQuestion?.questionType === "Type answer") {
        if (theCurrentQuestion?.additionalAnswers === 0) {
          return theCurrentQuestion?.text1 === typeAnswer;
        }
        if (theCurrentQuestion?.additionalAnswers === 1) {
          return (
            theCurrentQuestion?.text1 === typeAnswer ||
            theCurrentQuestion?.text2 === typeAnswer
          );
        }
        if (theCurrentQuestion?.additionalAnswers === 2) {
          return (
            theCurrentQuestion?.text1 === typeAnswer ||
            theCurrentQuestion?.text2 === typeAnswer ||
            theCurrentQuestion?.text3 === typeAnswer
          );
        }
        if (theCurrentQuestion?.additionalAnswers === 3) {
          return (
            theCurrentQuestion?.text1 === typeAnswer ||
            theCurrentQuestion?.text2 === typeAnswer ||
            theCurrentQuestion?.text3 === typeAnswer ||
            theCurrentQuestion?.text4 === typeAnswer
          );
        }
        return false;
      }
      return false;
    },
    [theCurrentQuestion, answer, typeAnswer]
  );

  const calculateScore = useCallback(
    (elapsedTime: number): number => {
      if (elapsedTime > MAX_TIME_MS) return 0;
      return Math.max(
        0,
        Math.round(MAX_SCORE * (1 - elapsedTime / MAX_TIME_MS))
      );
    },
    [MAX_SCORE, MAX_TIME_MS]
  );

  const startQuestion = useCallback(() => {
    setStartTime(Date.now());
    setScore(0);
    setElapsedTime(0);
    setAnswer(-1);
  }, [startTime]);

  const answeringQuestion = useCallback(
    (theAnswer: any) => {
      const currentTime = Date.now();
      const timeTaken = currentTime - (startTime ?? 0);
      const isCorrect = checkAnswer(theAnswer);
      const currentScore = isCorrect ? calculateScore(timeTaken) : 0;
      const currentTotalScore =
        totalScore + (isCorrect ? calculateScore(timeTaken) : 0);
      if (isCorrect) {
        setAnswerStreak((prevState) => prevState + 1);
      } else {
        setAnswerStreak(0);
      }
      socket.emit("player_answer_server", {
        gamePin: gamePin,
        principal,
        answer: theAnswer,
        currentScore,
        totalScore: currentTotalScore,
        isCorrect: isCorrect,
        questionIndex: questionIndex,
        previousScore: previousScore,
        nickname: nickname,
      });
      setAnswer(theAnswer);
      try {
        if (startTime && isCorrect) {
          setElapsedTime(timeTaken);
          setScore(calculateScore(timeTaken));
          setTotalScore((prevState) => {
            setPreviousScore(prevState + calculateScore(timeTaken));
            return prevState + calculateScore(timeTaken);
          });
        }
      } catch (e) {
        console.log(e, "<< error");
      }
    },
    [
      score,
      answer,
      elapsedTime,
      startTime,
      totalScore,
      previousScore,
      answerStreak,
      typeAnswer,
    ]
  );

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    setIsIntroduction(true);
    setTimeout(() => {
      setQuestionReady(true);
      setIsIntroduction(false);
      setCount(5);
    }, 9000);
    socket.emit("join_game", { gamePin: gamePin });
    socket.on("admin_has_left", () => {
      navigate("/home", {
        state: {
          routerPrincipal: state.routerPrincipal,
        },
      });
    });
    socket.on("question_finished", () => {
      setQuestionFinished(true);
      setAnswer((prevState) => {
        if (prevState === -1) {
          return -5;
        }
        return prevState;
      });
    });
    socket.on(
      "question_restarted",
      ({ questionIndex: theQuestionIndex }: any) => {
        setQuestionIndex(theQuestionIndex);
        setTimeout(() => {
          setAnswer(-1);
          setTypeAnswer("");
          setQuestionFinished(false);
          setShowQuestion(false);
          setQuestionReady(true);
          setCount(6);
        }, 250);
      }
    );
    socket.on("game_finished", ({ gamePin, uniquePlayers }: any) => {
      setShowDrumRoll(true);
      setTimeout(() => {
        setShowDrumRoll(false);
        setMarker(true);
        setTimeout(() => {
          setGameFinished(true);
          setMarker(false);
        }, 500);
      }, 5000);
      for (let i = 0; i < (uniquePlayers?.length ?? 0); i++) {
        if (
          uniquePlayers[i]?.principal === principal ||
          uniquePlayers[i]?.owner === principal
        ) {
          setTheRanking(i + 1);
        }
      }
    });

    const handleBeforeUnload = (event: any) => {
      socket.emit("player_left", { gamePin: gamePin, principal, nickname });
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
        setShowQuestion(true);
        setQuestionReady(false);
        startQuestion();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="waiting-game">
      <div className={`bg-black-10 h-[100vh] w-[100vw] overflow-hidden`}>
        {isIntroduction && (
          <div className="flex justify-center items-center flex-col gap-y-2 h-full overflow-hidden">
            <p className="text-[60px] font-bold">Get Ready!</p>
            <PacmanLoader
              color={"#97E8D4"}
              loading={true}
              cssOverride={override}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p className="text-[36px] glowing-container px-[20px] py-[10px] font-semibold text-center px-[15px]">
              Loading...
            </p>
          </div>
        )}
        <AnimatePresence mode="wait">
          {showDrumRoll && (
            <motion.div
              key={"Drum roll"}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center flex-col gap-y-2 h-full overflow-hidden"
            >
              {showDrumRoll && (
                <Lottie
                  className="w-[90vw] md:w-[400px]"
                  animationData={GameFinished}
                />
              )}
              <p className="w-[90vw] glowing-container md:w-[50vw] text-[3rem] py-[10px] px-[15px] text-white text-center rounded-[10px]">
                Drum roll....
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {questionReady && (
          <div className="flex justify-center items-center flex-col gap-y-2 h-full relative">
            <p className="text-[60px] font-bold">
              Question {questionIndex + 1}
            </p>
            {count > 0 && (
              <div className="px-[100px] py-[20px] glowing-container-count rounded-full w-fit">
                <div key={count} className="countdown-number w-[85px]">
                  {count}
                </div>
              </div>
            )}
            <p className="text-[36px] font-semibold text-center px-[15px]">
              Ready...
            </p>
          </div>
        )}
        {!isIntroduction && (
          <div className="absolute top-[10px] w-full">
            <div className="circle-small absolute top-[10px] left-[10px]">
              <p>{questionIndex + 1}</p>
            </div>
            <div className="pt-[15px] w-full flex justify-center items-center">
              <div className="px-[10px] flex gap-x-2 items-center py-[5px] bg-white rounded-[35px] w-fit">
                {theCurrentQuestion?.questionType === "Quiz" && (
                  <MdQuiz size="20px" color="black" />
                )}
                {theCurrentQuestion?.questionType === "True or false" && (
                  <VscSymbolBoolean size="20px" color="black" />
                )}
                <p className="text-center text-[1.5rem] text-black font-semibold">
                  {theCurrentQuestion?.questionType ?? ""}
                </p>
              </div>
            </div>
          </div>
        )}
        {showQuestion &&
          answer === -1 &&
          theCurrentQuestion?.questionType === "Quiz" && (
            <div className="h-full pb-[10vh]">
              <div className="grid grid-cols-2 gap-[10px] mx-[10px] pt-[15vh] h-full">
                {theCurrentQuestion?.text1 && (
                  <div
                    onClick={() => {
                      answeringQuestion(0);
                    }}
                    className={`answer-div cursor-pointer bg-red h-full flex justify-center items-center gap-x-[10px]`}
                  >
                    <div className="flex gap-x-2 items-center justify-center ml-[10px]">
                      <IoTriangleSharp
                        size={`${isMobile ? "70px" : "120px"}`}
                      />
                    </div>
                  </div>
                )}
                {theCurrentQuestion?.text2 && (
                  <div
                    onClick={() => {
                      answeringQuestion(1);
                    }}
                    className={`answer-div cursor-pointer bg-blue h-full flex justify-center items-center gap-x-[10px]`}
                  >
                    <div className="flex gap-x-2 items-center ml-[10px]">
                      <FaAdjust size={`${isMobile ? "70px" : "120px"}`} />
                    </div>
                  </div>
                )}
                {theCurrentQuestion?.text3 && (
                  <div
                    onClick={() => {
                      answeringQuestion(2);
                    }}
                    className={`answer-div cursor-pointer bg-orange h-full flex justify-center items-center gap-x-[10px]`}
                  >
                    <div className="flex gap-x-2 items-center ml-[10px]">
                      <FaCircle size={`${isMobile ? "70px" : "120px"}`} />
                    </div>
                  </div>
                )}
                {theCurrentQuestion?.text4 && (
                  <div
                    onClick={() => {
                      answeringQuestion(3);
                    }}
                    className={`answer-div cursor-pointer bg-dark-green h-full flex justify-center items-center gap-x-[10px]`}
                  >
                    <div className="flex gap-x-2 items-center ml-[10px]">
                      <FaSquareFull size={`${isMobile ? "70px" : "120px"}`} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        {showQuestion &&
          answer === -1 &&
          theCurrentQuestion?.questionType === "True or false" && (
            <div className="h-full pb-[10vh]">
              <div className="grid grid-cols-2 gap-[10px] mx-[10px] pt-[15vh] h-full">
                <div
                  onClick={() => {
                    answeringQuestion(0);
                  }}
                  className={`answer-div cursor-pointer bg-blue h-full flex justify-center items-center gap-x-[10px]`}
                >
                  <div className="flex gap-x-2 items-center justify-center ml-[10px]">
                    <FaAdjust size={`${isMobile ? "70px" : "120px"}`} />
                  </div>
                </div>
                <div
                  onClick={() => {
                    answeringQuestion(1);
                  }}
                  className={`answer-div cursor-pointer bg-red h-full flex justify-center items-center gap-x-[10px]`}
                >
                  <div className="flex gap-x-2 items-center ml-[10px]">
                    <IoTriangleSharp size={`${isMobile ? "70px" : "120px"}`} />
                  </div>
                </div>
              </div>
            </div>
          )}
        {showQuestion &&
          answer === -1 &&
          theCurrentQuestion?.questionType === "Type answer" && (
            <div className="h-full pb-[10vh] flex flex-col gap-y-4 justify-center items-center px-[20px]">
              <div className="question-div">
                <div
                  className={`question-answer-full ${
                    typeAnswer?.length > 0 && "bg-blue"
                  }`}
                >
                  <div className="question-sub-inner-div">
                    <div className="question-1-div-answer">
                      <div className="question-2-div">
                        <input
                          maxLength={20}
                          value={typeAnswer}
                          onChange={(e) => {
                            setTypeAnswer(e.target.value);
                          }}
                          placeholder="Type an answer"
                          className={`${
                            typeAnswer?.length > 0 ? "text-white" : "text-black"
                          } w-full text-center question-p bg-transparent border-transparent outline-none`}
                          type="text"
                        />
                        <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                          {20 - typeAnswer?.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => answeringQuestion(typeAnswer)}
                className="question-btn-answer-player text-center md:w-[300px] w-[50vw]"
              >
                Submit
              </button>
            </div>
          )}
        {!marker && showQuestion && answer !== -1 && !questionFinished && (
          <div className="flex justify-center items-center flex-col gap-y-2 h-full">
            <p className="text-[40px] md:text-[60px] font-bold text-center px-[10px]">
              What a good time!
            </p>
            <PacmanLoader
              color={"#97E8D4"}
              loading={true}
              cssOverride={override}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <p className="text-[36px] glowing-container font-semibold text-center px-[25px] py-[10px]">
              You are doing well!
            </p>
          </div>
        )}
        {!marker && questionFinished && !gameFinished && (
          <div className="flex flex-col gap-y-2 justify-center items-center h-full w-full">
            <p className="text-[36px] font-bold">
              {!checkAnswer(answer) ? "Incorrect!" : "Correct!"}
            </p>
            {!checkAnswer(answer) ? (
              <button className="cross-btn-clicked-game glowing-container p-[30px]">
                <span className="centang-span-game">
                  <ImCross size="40px" className="centang-img" />
                </span>
              </button>
            ) : (
              <button className="check-btn-clicked-game glowing-container p-[30px]">
                <span className="centang-span-game">
                  <FaCheck size="40px" className="centang-img" />
                </span>
              </button>
            )}
            {checkAnswer(answer) && (
              <div className="flex gap-x-2 items-center">
                <FaFireAlt color="" size="30px" />
                <p className="text-[24px] font-bold">
                  Answer streak {answerStreak}
                </p>
                <FaFireAlt color="" size="30px" />
              </div>
            )}
            <div className="bg-black/50 p-[10px] rounded-[5px] w-[300px] text-center">
              <p className="font-bold text-[24px] text-white">
                {checkAnswer(answer) ? `+${score}` : "Great try!"}
              </p>
            </div>
            <p className="text-[18px] font-bold">You are doing well!</p>
          </div>
        )}
        {questionFinished && gameFinished && (
          <div className="flex flex-col gap-y-2 justify-center items-center h-full w-full">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={200}
              gravity={0.3}
            />
            <p className="text-[26px]">Game finished!</p>
            <p className="text-[22px]">
              You are the{" "}
              <span className="font-bold">
                {getOrdinalSuffix(theRanking)} place!
              </span>
            </p>
            <button
              onClick={() =>
                navigate("/home", {
                  state: {
                    routerPrincipal: state.routerPrincipal,
                  },
                })
              }
              className="question-btn-game-player text-center md:w-[300px] w-[50vw]"
            >
              Back to lobby
            </button>
          </div>
        )}
      </div>
      <div className="bottom-bar absolute bottom-0">
        <div className="bottom-bar-inner flex justify-between w-full items-center h-full">
          <div className="flex gap-x-2 items-center">
            <IoPersonCircle color="black" size="32px" />
            <p className="font-bold text-[24px] text-black">
              {nickname
                ? nickname?.length > 8
                  ? nickname?.slice(0, 8) + "..."
                  : nickname
                : principal?.slice(0, 8) + "..."}
            </p>
          </div>
          <div className="bg-[#333333] flex px-[40px] rounded-[5px] py-[5px] justify-center items-center">
            <p className="font-bold text-[20px]">{totalScore ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePlayer;
