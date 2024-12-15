import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaRegQuestionCircle,
  FaArrowDown,
  FaUpload,
} from "react-icons/fa";
import {
  MdOutlineFolderCopy,
  MdQuiz,
  MdAccessTime,
  MdOutlineQuestionAnswer,
} from "react-icons/md";
import { VscSymbolBoolean } from "react-icons/vsc";
import { TiMessageTyping } from "react-icons/ti";
import { RiDeleteBinLine } from "react-icons/ri";
import { Dropdown, Tooltip, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaPlus, FaRegImage } from "react-icons/fa6";
import {
  questionTypeItems,
  timeLimitItems,
  convertSecondsToMinutes,
  generateRandomString,
  checkQuizData,
} from "./helper/helper";
import { IoTriangleSharp } from "react-icons/io5";
import { MdHexagon } from "react-icons/md";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import { FaCircleQuestion, FaGear } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  _SERVICE,
  Question,
} from "../../declarations/kahoot_backend/kahoot_backend.did";
import IC from "./utils/IC";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Create() {
  const navigate = useNavigate();
  const defaultQuizData = {
    question: "",
    text1: "",
    text2: "",
    text3: "",
    text4: "",
    answer1Clicked: false,
    answer2Clicked: false,
    answer3Clicked: false,
    answer4Clicked: false,
    additionalAnswers: 0,
    trueOrFalseAnswer: "",
    timeLimit: 20,
    answerOptions: "single",
    imageUrl: "cdn.svg",
  };
  const timeLimitData = [5, 10, 20, 30, 45, 60, 90, 120, 180, 240];
  const { principal } = useSelector((state: any) => state.user);
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [currentId, setCurrentId] = useState(1);
  const [isOpenModalJiggle, setIsOpenModalJiggle] = useState(false);
  const [isOpenExitKahootModal, setIsOpenExitKahootModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openModalQuestion, setOpenModalQuestion] = useState(false);
  const [mouseEnter1, setMouseEnter1] = useState(false);
  const [mouseEnter2, setMouseEnter2] = useState(false);
  const [mouseEnter3, setMouseEnter3] = useState(false);
  const [mouseEnter4, setMouseEnter4] = useState(false);
  const [isChangingQuestionType, setIsChangingQuestionType] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mouseEnterUl, setMouseEnterUl] = useState(false);
  const [clickedQuizIndex, setClickedQuizIndex] = useState(0);
  const [hoveredQuizIndex, setHoveredQuizIndex] = useState(-1);
  const [isOpenModalTitle, setIsOpenModalTitle] = useState(false);
  const [previousKahootTitle, setPreviousKahootTitle] = useState("");
  const [kahootTitle, setKahootTitle] = useState("");
  const [kahootTitleTemp, setKahootTitleTemp] = useState("");
  const [previousKahootDescription, setPreviousKahootDescription] =
    useState("");
  const [kahootDescription, setKahootDescription] = useState("");
  const [kahootDescriptionTemp, setKahootDescriptionTemp] = useState("");
  const [backend, setBackend] = useState<_SERVICE>();
  const [isOpenModalValidate, setIsOpenModalValidate] = useState(false);
  const [quizChecked, setQuizChecked] =
    useState<{ index: number; messages: string[] }[]>();
  const [isOpenModalTimeLimit, setIsOpenModalTimeLimit] = useState(false);
  const [fromSaving, setFromSaving] = useState(false);
  const [quizData, setQuizData] = useState<Question[]>([
    {
      id: currentId,
      questionType: "Quiz",
      ...defaultQuizData,
    },
  ]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flexibleClickedQuizIndex, setFlexibleClickedQuizIndex] = useState(-1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentTimeLimit, setCurrentTimeLimit] = useState(
    quizData?.[clickedQuizIndex]?.timeLimit ?? 20
  );

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault(); // Necessary to allow drop
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setDragging(false);
      setIsOpen(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        let quizTemp = [...quizData];
        quizTemp[clickedQuizIndex].imageUrl = e?.target?.result as any;
        setQuizData([...quizTemp]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    setIsOpen(false);

    // Access the dropped files
    const file = e.dataTransfer.files[0];

    // Ensure it's an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        let quizTemp = [...quizData];
        quizTemp[clickedQuizIndex].imageUrl = reader.result as any;
        setQuizData([...quizTemp]);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please drop an image file.");
    }
  };

  const toggleModalSecond = () => {
    setIsOpen(!isOpen);
  };

  const toggleModalJiggle = () => {
    setIsOpenModalJiggle(!isOpenModalJiggle);
  };

  const toggleModalQuestion = () => {
    setOpenModalQuestion((prevState) => !prevState);
  };

  const toggleModalTitle = () => {
    setIsOpenModalTitle((prevState) => !prevState);
  };

  const toggleModalExitKahoot = () => {
    setIsOpenExitKahootModal((prevState) => !prevState);
  };

  const toggleModalValidate = () => {
    setIsOpenModalValidate((prevState) => !prevState);
  };

  const toggleModalTimeLimit = () => {
    setIsOpenModalTimeLimit((prevState) => !prevState);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollTop = bottomRef?.current?.scrollHeight;
        }
      }, 0);
    }
  };

  const scrollToEnd = () => {
    const element = bottomRef.current;
    if (element) {
      setTimeout(() => {
        element.scrollLeft = element?.scrollWidth - element?.clientWidth;
      }, 0);
    }
  };

  const modalVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring", // Spring for bouncy effect
        stiffness: 500, // Control bounciness
        damping: 20,
      },
    },
    exit: { scale: 0.5, opacity: 0 },
  };
  const newQuizData = {
    id: currentId + 1,
    ...defaultQuizData,
  };

  useEffect(() => {
    IC.getBackend(async (result: any) => {
      setBackend(result);
    });
  }, []);
  return (
    <main className="background" ref={dropdownRef}>
      {loading && (
        <div className="kahoot-container z-moreinfinite h-[100%] w-[100vw]">
          <div className="kahoot-spinner">
            <div />
            <div />
            <div />
            <div />
          </div>
          <p className="montserrat medium text-[28px] leading-[0px]">
            Saving game...
          </p>
        </div>
      )}
      {isMobileOrTablet && (
        <nav className="navbar z-infinite fixed top-0 w-full">
          <div className="flex gap-x-6 items-center w-full">
            <img className="h-[36px]" src="/kahoot-2.png" />
            <div className="kahoot-input-container">
              <button
                onClick={() => {
                  toggleModalTitle();
                  setPreviousKahootTitle(kahootTitleTemp);
                  setPreviousKahootDescription(kahootDescriptionTemp);
                }}
                className="kahoot-btn-title font-semibold"
              >
                {!kahootTitle ? "Enter kahoot title..." : kahootTitle}
              </button>
              <button
                onClick={() => {
                  toggleModalTitle();
                  setPreviousKahootTitle(kahootTitleTemp);
                  setPreviousKahootDescription(kahootDescriptionTemp);
                }}
                className="settings-btn-mobile"
              >
                <FaGear size="16px" />
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                const checkingQuiz = checkQuizData(quizData);
                if (checkingQuiz?.length > 0) {
                  setQuizChecked(checkingQuiz);
                  toggleModalValidate();
                } else if (!kahootTitle) {
                  setFromSaving(true);
                  toggleModalTitle();
                } else {
                  setLoading(true);
                  const gamePin = generateRandomString();
                  backend
                    ?.addGame(
                      gamePin,
                      principal,
                      kahootTitle,
                      kahootDescription,
                      quizData
                    )
                    ?.then((result) => {
                      setLoading(false);
                      Swal.fire({
                        title: "Success!",
                        text: "You have successfully saved your quiz!",
                        icon: "success",
                      })
                        .then((res) => {
                          navigate("/profile");
                        })
                        .catch((thisErr) => {
                          console.log(thisErr);
                        });
                    })
                    ?.catch((error) => {
                      setLoading(false);
                      console.log(error);
                    });
                }
              }}
              className="save-button"
            >
              Save
            </button>
          </div>
        </nav>
      )}
      {!isMobileOrTablet && (
        <nav className="navbar">
          <div className="flex gap-x-6 items-center w-full">
            <img className="h-[48px]" src="/kahoot-2.png" />
            <div className="kahoot-input-container">
              <button
                onClick={() => {
                  toggleModalTitle();
                  setPreviousKahootTitle(kahootTitleTemp);
                  setPreviousKahootDescription(kahootDescriptionTemp);
                }}
                className="kahoot-btn-title font-semibold"
              >
                {!kahootTitle ? "Enter kahoot title..." : kahootTitle}
              </button>
              <button
                onClick={() => {
                  toggleModalTitle();
                  setPreviousKahootTitle(kahootTitleTemp);
                  setPreviousKahootDescription(kahootDescriptionTemp);
                }}
                className="settings-btn"
              >
                Settings
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                toggleModalExitKahoot();
              }}
              className="exit-button mr-4"
            >
              Exit
            </button>
            <button
              onClick={async () => {
                const checkingQuiz = checkQuizData(quizData);
                if (checkingQuiz?.length > 0) {
                  setQuizChecked(checkingQuiz);
                  toggleModalValidate();
                } else if (!kahootTitle) {
                  setFromSaving(true);
                  toggleModalTitle();
                } else {
                  setLoading(true);
                  const gamePin = generateRandomString();
                  backend
                    ?.addGame(
                      gamePin,
                      principal,
                      kahootTitle,
                      kahootDescription,
                      quizData
                    )
                    ?.then((result) => {
                      setLoading(false);
                      Swal.fire({
                        title: "Success!",
                        text: "You have successfully saved your quiz!",
                        icon: "success",
                      })
                        .then((res) => {
                          navigate("/profile");
                        })
                        .catch((thisErr) => {
                          console.log(thisErr);
                        });
                    })
                    ?.catch((error) => {
                      setLoading(false);
                      console.log(error);
                    });
                }
              }}
              className="save-button"
            >
              Save
            </button>
          </div>
        </nav>
      )}
      <div className="flex justify-between">
        {isMobileOrTablet && (
          <div className="fixed bottom-container-mobile h-[4.5rem] bottom-0 bg-white z-infinite w-full flex items-center gap-x-2">
            <ul
              ref={bottomRef}
              onMouseEnter={() => setMouseEnterUl(true)}
              onMouseLeave={() => setMouseEnterUl(false)}
              className={`${
                mouseEnterUl ? "overflow-y-auto" : "overflow-hidden"
              } flex flex-1 mobile-ul w-full mr-auto gap-x-2 h-full`}
            >
              {quizData?.map((quiz, index) => (
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
                              className="rounded-b-[0.25rem] py-[10px] h-[30px] w-[30px]"
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
                  <button
                    onClick={() => {
                      if (loading) return;
                      setOpenModalQuestion(true);
                    }}
                    className="question-btn"
                  >
                    <FaPlus
                      size="24px"
                      className="block my-[10px]"
                      color="white"
                    />
                  </button>
                </span>
                {/* <button
                onClick={toggleModalSecond}
                className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
              >
                Open Bouncy Modal
              </button> */}
              </div>
            </div>
          </div>
        )}
        {!isMobileOrTablet && (
          <div className="the-sidebar">
            <ul
              ref={bottomRef}
              onMouseEnter={() => setMouseEnterUl(true)}
              onMouseLeave={() => setMouseEnterUl(false)}
              className={`${
                mouseEnterUl ? "overflow-y-auto" : "overflow-hidden"
              } sidebar-ul`}
            >
              {quizData?.map((quiz, index) => (
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
                    {(clickedQuizIndex === index ||
                      hoveredQuizIndex === index) && (
                      <div className="flex flex-col absolute top-[50%] gap-y-1">
                        <Tooltip placement="right" title={"Duplicate"}>
                          <a
                            onClick={() => {
                              let quizTemp = [...quizData];
                              quizTemp.splice(index + 1, 0, {
                                ...quizData?.[index],
                                id: currentId + 1,
                              });
                              setCurrentId((prevState) => prevState + 1);
                              setQuizData([...quizTemp]);
                            }}
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
                            onClick={() => {
                              if (quizData?.length === 1) return;
                              setFlexibleClickedQuizIndex(index);
                              toggleModalJiggle();
                            }}
                            className={`${
                              quizData?.length === 1
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } icon-quiz rounded-full`}
                          >
                            <RiDeleteBinLine
                              color="#6E6E6E"
                              height={16}
                              width={16}
                            />
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
                  <button
                    onClick={() => {
                      setOpenModalQuestion(true);
                    }}
                    className="question-btn"
                  >
                    Add question
                  </button>
                </span>
                {/* <button
                onClick={toggleModalSecond}
                className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition"
              >
                Open Bouncy Modal
              </button> */}
              </div>
            </div>
          </div>
        )}
        {!isMobileOrTablet && (
          <div className="middle-div flex-1">
            <div className="question-div">
              <div className="question-inner-div">
                <div className="question-sub-inner-div">
                  <div className="question-1-div">
                    <div className="question-2-div">
                      <input
                        maxLength={120}
                        value={quizData?.[clickedQuizIndex]?.question ?? ""}
                        onChange={(e) => {
                          let quizDataTemp = [...quizData];
                          quizDataTemp[clickedQuizIndex].question =
                            e.target.value;
                          setQuizData([...quizDataTemp]);
                        }}
                        placeholder="Start typing your question"
                        className="w-full text-center question-p bg-transparent border-transparent outline-none"
                        type="text"
                      />
                      <p className="absolute top-1 text-gray right-1 text-[14px] font-semibold">
                        {120 - quizData?.[clickedQuizIndex].question?.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center h-full">
              <div
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => setIsOpen(true)}
                className={`upload-div ${"upload-div-quiz"} cursor-pointer gap-y-[16px]`}
              >
                {quizData?.[clickedQuizIndex]?.imageUrl === "cdn.svg" ? (
                  <div className="flex flex-col gap-y-[16px] justify-center items-center">
                    <img src="/walaoeh.svg" className="rounded-b-[0.25rem]" />
                    <div className="btn-upload-div">
                      <FaPlus
                        size="32px"
                        className="block mx-auto"
                        color="black"
                      />
                    </div>
                    <div>
                      <p className="text-black">
                        <span className="text-gray font-semibold underline">
                          Upload file
                        </span>{" "}
                        or drag here to upload
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={quizData?.[clickedQuizIndex]?.imageUrl}
                    className="w-[200px h-[200px]"
                  />
                )}
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
            </div>
            {quizData?.[clickedQuizIndex]?.questionType === "Quiz" && (
              <div className="grid grid-cols-2 gap-[8px]">
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text1 ? "bg-red" : "bg-white"
                  } flex gap-x-2 items-center relative`}
                >
                  <div className="shape-div bg-red">
                    <IoTriangleSharp
                      className="mx-[8px]"
                      size="32px"
                      color="white"
                    />
                  </div>
                  <input
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text1 ?? ""}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text1 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 1"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text1
                        ? "text-white"
                        : "text-black"
                    } w-full outline-none bg-transparent border-none`}
                  />

                  {quizData?.[clickedQuizIndex]?.text1 && (
                    <button
                      onClick={() => {
                        let quizTemp = [...quizData];
                        quizTemp[clickedQuizIndex].answer1Clicked =
                          !quizTemp[clickedQuizIndex].answer1Clicked;
                        setQuizData([...quizTemp]);
                      }}
                      onMouseEnter={() => setMouseEnter1(true)}
                      onMouseLeave={() => setMouseEnter1(false)}
                      className={`${
                        quizData?.[clickedQuizIndex]?.answer1Clicked
                          ? "check-btn-clicked"
                          : `${
                              !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer4Clicked
                                ? "check-btn-animation"
                                : ""
                            } check-btn`
                      }`}
                    >
                      <span className={`centang-span`}>
                        {(mouseEnter1 ||
                          quizData?.[clickedQuizIndex]?.answer1Clicked) && (
                          <img src="centang.svg" className="centang-img" />
                        )}
                      </span>
                    </button>
                  )}
                  <p className="text-white absolute top-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text1?.length}
                  </p>
                </div>
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text2 ? "bg-blue" : "bg-white"
                  } flex gap-x-2 items-center`}
                >
                  <div className="shape-div bg-blue">
                    <MdHexagon className="mx-[8px]" size="32px" color="white" />
                  </div>
                  <input
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text2}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text2 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 2"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text2
                        ? "text-white"
                        : "text-black"
                    } w-full outline-none bg-transparent border-none`}
                  />

                  {quizData?.[clickedQuizIndex]?.text2 && (
                    <button
                      onClick={() => {
                        let quizTemp = [...quizData];
                        quizTemp[clickedQuizIndex].answer2Clicked =
                          !quizTemp[clickedQuizIndex].answer2Clicked;
                        setQuizData([...quizTemp]);
                      }}
                      onMouseEnter={() => setMouseEnter2(true)}
                      onMouseLeave={() => setMouseEnter2(false)}
                      className={`${
                        quizData?.[clickedQuizIndex]?.answer2Clicked
                          ? "check-btn-clicked"
                          : `${
                              !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer4Clicked
                                ? "check-btn-animation"
                                : ""
                            } check-btn`
                      }`}
                    >
                      <span className={`centang-span`}>
                        {(mouseEnter2 ||
                          quizData?.[clickedQuizIndex]?.answer2Clicked) && (
                          <img src="centang.svg" className="centang-img" />
                        )}
                      </span>
                    </button>
                  )}
                  <p className="text-white absolute top-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text2?.length}
                  </p>
                </div>
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text3
                      ? "bg-orange"
                      : "bg-white"
                  } flex gap-x-2 items-center`}
                >
                  <div className="shape-div bg-orange">
                    <FaCircle className="mx-[8px]" size="32px" color="white" />
                  </div>
                  <input
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text3}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text3 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 3 (optional)"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text3
                        ? "text-white"
                        : "text-black"
                    } w-full outline-none bg-transparent border-none`}
                  />

                  {quizData?.[clickedQuizIndex]?.text3 && (
                    <button
                      onClick={() => {
                        let quizTemp = [...quizData];
                        quizTemp[clickedQuizIndex].answer3Clicked =
                          !quizTemp[clickedQuizIndex].answer3Clicked;
                        setQuizData([...quizTemp]);
                      }}
                      onMouseEnter={() => setMouseEnter3(true)}
                      onMouseLeave={() => setMouseEnter3(false)}
                      className={`${
                        quizData?.[clickedQuizIndex]?.answer3Clicked
                          ? "check-btn-clicked"
                          : `${
                              !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer4Clicked
                                ? "check-btn-animation"
                                : ""
                            } check-btn`
                      }`}
                    >
                      <span className={`centang-span`}>
                        {(mouseEnter3 ||
                          quizData?.[clickedQuizIndex]?.answer3Clicked) && (
                          <img src="centang.svg" className="centang-img" />
                        )}
                      </span>
                    </button>
                  )}
                  <p className="text-white absolute top-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text3?.length}
                  </p>
                </div>
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text4
                      ? "bg-dark-green"
                      : "bg-white"
                  } flex gap-x-2 items-center relative`}
                >
                  <div className="shape-div bg-dark-green">
                    <FaSquareFull
                      className="mx-[8px]"
                      size="32px"
                      color="white"
                    />
                  </div>
                  <input
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text4}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text4 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 4 (optional)"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text4
                        ? "text-white"
                        : "text-black"
                    } w-full outline-none bg-transparent border-none`}
                  />

                  {quizData?.[clickedQuizIndex]?.text4 && (
                    <button
                      onClick={() => {
                        let quizTemp = [...quizData];
                        quizTemp[clickedQuizIndex].answer4Clicked =
                          !quizTemp[clickedQuizIndex].answer4Clicked;
                        setQuizData([...quizTemp]);
                      }}
                      onMouseEnter={() => setMouseEnter4(true)}
                      onMouseLeave={() => setMouseEnter4(false)}
                      className={`${
                        quizData?.[clickedQuizIndex]?.answer4Clicked
                          ? "check-btn-clicked"
                          : `${
                              !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                              !quizData?.[clickedQuizIndex]?.answer4Clicked
                                ? "check-btn-animation"
                                : ""
                            } check-btn`
                      }`}
                    >
                      <span className={`centang-span`}>
                        {(mouseEnter4 ||
                          quizData?.[clickedQuizIndex]?.answer4Clicked) && (
                          <img src="centang.svg" className="centang-img" />
                        )}
                      </span>
                    </button>
                  )}
                  <p className="text-white absolute top-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text4?.length}
                  </p>
                </div>
              </div>
            )}
            {quizData?.[clickedQuizIndex]?.questionType === "True or false" && (
              <div className="grid grid-cols-2 gap-[8px]">
                <div
                  className={`answer-card bg-red flex gap-x-2 items-center relative`}
                >
                  <div className="shape-div bg-red">
                    <IoTriangleSharp
                      className="mx-[8px]"
                      size="32px"
                      color="white"
                    />
                  </div>
                  <p className="text-white w-full outline-none bg-transparent border-none">
                    True
                  </p>

                  <button
                    onClick={() => {
                      let quizTemp = [...quizData];
                      if (
                        quizTemp[clickedQuizIndex].trueOrFalseAnswer === "true"
                      ) {
                        quizTemp[clickedQuizIndex].trueOrFalseAnswer = "false";
                      } else {
                        quizTemp[clickedQuizIndex].trueOrFalseAnswer = "true";
                      }
                      setQuizData([...quizTemp]);
                    }}
                    onMouseEnter={() => setMouseEnter1(true)}
                    onMouseLeave={() => setMouseEnter1(false)}
                    className={`${
                      quizData[clickedQuizIndex]?.trueOrFalseAnswer === "true"
                        ? "check-btn-clicked"
                        : `${
                            !quizData[clickedQuizIndex]?.trueOrFalseAnswer
                              ? "check-btn-animation"
                              : ""
                          } check-btn`
                    }`}
                  >
                    <span className={`centang-span`}>
                      {(mouseEnter1 ||
                        quizData[clickedQuizIndex].trueOrFalseAnswer ===
                          "true") && (
                        <img src="centang.svg" className="centang-img" />
                      )}
                    </span>
                  </button>
                </div>
                <div
                  className={`answer-card bg-blue flex gap-x-2 items-center`}
                >
                  <div className="shape-div bg-blue">
                    <MdHexagon className="mx-[8px]" size="32px" color="white" />
                  </div>
                  <p className="text-white w-full outline-none bg-transparent border-none">
                    False
                  </p>
                  <button
                    onClick={() => {
                      let quizTemp = [...quizData];
                      if (
                        quizTemp[clickedQuizIndex].trueOrFalseAnswer === "false"
                      ) {
                        quizTemp[clickedQuizIndex].trueOrFalseAnswer = "true";
                      } else {
                        quizTemp[clickedQuizIndex].trueOrFalseAnswer = "false";
                      }
                      setQuizData([...quizTemp]);
                    }}
                    onMouseEnter={() => setMouseEnter2(true)}
                    onMouseLeave={() => setMouseEnter2(false)}
                    className={`${
                      quizData[clickedQuizIndex].trueOrFalseAnswer === "false"
                        ? "check-btn-clicked"
                        : `${
                            !quizData[clickedQuizIndex].trueOrFalseAnswer
                              ? "check-btn-animation"
                              : ""
                          } check-btn`
                    }`}
                  >
                    <span className={`centang-span`}>
                      {(mouseEnter2 ||
                        quizData[clickedQuizIndex].trueOrFalseAnswer ===
                          "false") && (
                        <img src="centang.svg" className="centang-img" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}
            {quizData?.[clickedQuizIndex]?.questionType === "Type answer" && (
              <div className="flex justify-center flex-col gap-y-2 items-center w-full">
                <div className="question-div">
                  <div
                    className={`question-inner-div-answer ${
                      quizData[clickedQuizIndex]?.text1?.length > 0 && "bg-red"
                    }`}
                  >
                    <div className="question-sub-inner-div">
                      <div className="question-1-div-answer">
                        <div className="question-2-div">
                          <input
                            maxLength={20}
                            value={quizData?.[clickedQuizIndex]?.text1 ?? ""}
                            onChange={(e) => {
                              let quizTemp = [...quizData];
                              quizTemp[clickedQuizIndex].text1 = e.target.value;
                              setQuizData([...quizTemp]);
                            }}
                            placeholder="Type an answer"
                            className={`${
                              quizData?.[clickedQuizIndex]?.text1?.length > 0
                                ? "text-white"
                                : "text-black"
                            } w-full text-center question-p bg-transparent border-transparent outline-none`}
                            type="text"
                          />
                          <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                            {20 - quizData?.[clickedQuizIndex]?.text1?.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (quizData?.[clickedQuizIndex]?.additionalAnswers > 0)
                      return;
                    let quizTemp = [...quizData];
                    quizTemp[clickedQuizIndex].additionalAnswers =
                      quizTemp[clickedQuizIndex].additionalAnswers + 1;
                    setQuizData([...quizTemp]);
                  }}
                  className="shadow-overlay-button"
                >
                  {(quizData?.[clickedQuizIndex]?.additionalAnswers ?? 0) <= 0
                    ? "Add other accepted answers"
                    : `Other accepted answers ${
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3
                          ? "("
                          : ""
                      }${
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3
                          ? 3 - quizData?.[clickedQuizIndex]?.additionalAnswers
                          : ""
                      }${
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3
                          ? ")"
                          : ""
                      }`}
                </button>
                {quizData?.[clickedQuizIndex]?.additionalAnswers > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 0 && (
                      <div className="question-div">
                        <div
                          className={`question-answer-full ${
                            quizData?.[clickedQuizIndex]?.text2?.length > 0 &&
                            "bg-blue"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  maxLength={20}
                                  value={quizData?.[clickedQuizIndex]?.text2}
                                  onChange={(e) => {
                                    let quizTemp = [...quizData];
                                    quizTemp[clickedQuizIndex].text2 =
                                      e.target.value;
                                    setQuizData([...quizTemp]);
                                  }}
                                  placeholder="Type an answer"
                                  className={`${
                                    quizData?.[clickedQuizIndex]?.text2
                                      ?.length > 0
                                      ? "text-white"
                                      : "text-black"
                                  } w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                                <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                                  {20 -
                                    quizData?.[clickedQuizIndex]?.text2?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 1 && (
                      <div className="question-div">
                        <div
                          className={`question-answer-full ${
                            quizData?.[clickedQuizIndex]?.text3?.length > 0 &&
                            "bg-orange"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  maxLength={20}
                                  value={quizData?.[clickedQuizIndex]?.text3}
                                  onChange={(e) => {
                                    let quizTemp = [...quizData];
                                    quizTemp[clickedQuizIndex].text3 =
                                      e.target.value;
                                    setQuizData([...quizTemp]);
                                  }}
                                  placeholder="Type an answer"
                                  className={`${
                                    quizData?.[clickedQuizIndex]?.text3
                                      ?.length > 0
                                      ? "text-white"
                                      : "text-black"
                                  } w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                                <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                                  {20 -
                                    quizData?.[clickedQuizIndex]?.text3?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 2 && (
                      <div className="question-div">
                        <div
                          className={`question-answer-full ${
                            quizData?.[clickedQuizIndex]?.text4?.length > 0 &&
                            "bg-green-only"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  maxLength={20}
                                  value={quizData?.[clickedQuizIndex]?.text4}
                                  onChange={(e) => {
                                    let quizTemp = [...quizData];
                                    quizTemp[clickedQuizIndex].text4 =
                                      e.target.value;
                                    setQuizData([...quizTemp]);
                                  }}
                                  placeholder="Type an answer"
                                  className={`${
                                    quizData?.[clickedQuizIndex]?.text4
                                      ?.length > 0
                                      ? "text-white"
                                      : "text-black"
                                  } w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                                <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                                  {20 -
                                    quizData?.[clickedQuizIndex]?.text4?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 0 &&
                      quizData?.[clickedQuizIndex]?.additionalAnswers < 3 && (
                        <button
                          onClick={() => {
                            let quizTemp = [...quizData];
                            quizTemp[clickedQuizIndex].additionalAnswers =
                              quizTemp[clickedQuizIndex].additionalAnswers + 1;
                            setQuizData([...quizTemp]);
                          }}
                          className="shadow-overlay-button"
                        >
                          Add more
                        </button>
                      )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {isMobileOrTablet && (
          <div className="middle-div-mobile min-h-[100vh] w-[100vw] mt-[56px] w-full flex flex-col gap-y-4">
            <div className="question-div-main-question">
              <div className="flex gap-x-2 items-center">
                <div className="question-inner-div">
                  <div className="question-sub-inner-div">
                    <div className="question-1-div">
                      <div className="question-2-div">
                        <input
                          maxLength={120}
                          value={quizData?.[clickedQuizIndex]?.question ?? ""}
                          onChange={(e) => {
                            let quizDataTemp = [...quizData];
                            quizDataTemp[clickedQuizIndex].question =
                              e.target.value;
                            setQuizData([...quizDataTemp]);
                          }}
                          placeholder="Start typing your question"
                          className="w-full text-center question-p bg-transparent border-transparent outline-none"
                          type="text"
                        />
                      </div>
                      <p className="absolute top-1 text-gray right-1 text-[14px] font-semibold">
                        {120 - quizData?.[clickedQuizIndex].question?.length}
                      </p>
                    </div>
                  </div>
                </div>
                <Popover
                  placement="bottom"
                  content={
                    <div className="bg-white flex flex-col gap-y-4 p-[8px]">
                      <div
                        onClick={() => {
                          setOpenModalQuestion(true);
                          setIsChangingQuestionType(true);
                          handleOpenChange(false);
                        }}
                        className="flex gap-x-2 items-center"
                      >
                        <p className="montserrat">Change question type</p>
                      </div>
                      <div
                        onClick={() => {
                          setCurrentTimeLimit(
                            quizData?.[clickedQuizIndex]?.timeLimit
                          );
                          handleOpenChange(false);
                          toggleModalTimeLimit();
                        }}
                        className="flex gap-x-2 items-center"
                      >
                        <p className="montserrat">Set time limit</p>
                      </div>
                      <div
                        onClick={() => {
                          let quizTemp = [...quizData];
                          quizTemp.splice(clickedQuizIndex + 1, 0, {
                            ...quizData?.[clickedQuizIndex],
                            id: currentId + 1,
                          });
                          setCurrentId((prevState) => prevState + 1);
                          if (clickedQuizIndex === quizData?.length - 1) {
                            scrollToEnd();
                          }
                          setQuizData([...quizTemp]);
                          handleOpenChange(false);
                        }}
                        className="flex gap-x-2 items-center"
                      >
                        <p className="montserrat">Duplicate</p>
                      </div>
                      {quizData?.length > 1 && (
                        <div
                          onClick={() => {
                            if (quizData?.length === 1) {
                              return;
                            }
                            toggleModalJiggle();
                            handleOpenChange(false);
                          }}
                          className="flex gap-x-2 items-center"
                        >
                          <p className="montserrat">Delete</p>
                        </div>
                      )}
                    </div>
                  }
                  trigger="click"
                  open={open}
                  onOpenChange={handleOpenChange}
                >
                  <div className="three-dots-container flex justify-center items-center">
                    <HiDotsVertical size="24px" color="black" />
                  </div>
                </Popover>
              </div>
            </div>
            <div className="flex justify-center items-center h-full">
              <div
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => setIsOpen(true)}
                className={`upload-div ${"upload-div-quiz"} cursor-pointer gap-y-[16px]`}
              >
                {quizData?.[clickedQuizIndex]?.imageUrl === "cdn.svg" ? (
                  <div className="flex flex-col gap-y-[16px] justify-center items-center">
                    <img src="/walaoeh.svg" className="rounded-b-[0.25rem]" />
                    <div className="btn-upload-div">
                      <FaPlus
                        size="32px"
                        className="block mx-auto"
                        color="black"
                      />
                    </div>
                    <div>
                      <p className="text-black">
                        <span className="text-gray font-semibold underline">
                          Upload file
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    className="h-[200px] w-[200px]"
                    src={quizData?.[clickedQuizIndex]?.imageUrl}
                  />
                )}
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
            </div>
            {quizData?.[clickedQuizIndex]?.questionType === "Quiz" && (
              <div className="grid grid-cols-2 gap-[8px]">
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text1 ? "bg-red" : "bg-white"
                  } flex flex-col gap-x-2 items-center relative`}
                >
                  <div className="flex justify-between w-full mt-[8px]">
                    <div className="shape-div-mobile bg-red p-[3px]">
                      <IoTriangleSharp className="" size="16px" color="white" />
                    </div>
                    {quizData?.[clickedQuizIndex]?.text1 && (
                      <button
                        onClick={() => {
                          let quizTemp = [...quizData];
                          quizTemp[clickedQuizIndex].answer1Clicked =
                            !quizTemp[clickedQuizIndex].answer1Clicked;
                          setQuizData([...quizTemp]);
                        }}
                        onMouseEnter={() => setMouseEnter1(true)}
                        onMouseLeave={() => setMouseEnter1(false)}
                        className={`${
                          quizData?.[clickedQuizIndex]?.answer1Clicked
                            ? "check-btn-mobile-clicked"
                            : `${
                                !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer4Clicked
                                  ? ""
                                  : ""
                              } check-btn-mobile`
                        }`}
                      >
                        <span className={`centang-span-mobile`}>
                          {quizData?.[clickedQuizIndex]?.answer1Clicked && (
                            <img src="centang.svg" className="centang-img" />
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                  <textarea
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text1 ?? ""}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text1 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 1"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text1
                        ? "text-white"
                        : "text-black"
                    } w-full px-[6px] outline-none bg-transparent border-none`}
                  />

                  <p className="text-white absolute bottom-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text1?.length}
                  </p>
                </div>
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text2 ? "bg-blue" : "bg-white"
                  } flex flex-col gap-x-2 items-center relative`}
                >
                  <div className="flex justify-between w-full mt-[8px]">
                    <div className="shape-div-mobile bg-blue p-[3px]">
                      <MdHexagon className="" size="16px" color="white" />
                    </div>
                    {quizData?.[clickedQuizIndex]?.text2 && (
                      <button
                        onClick={() => {
                          let quizTemp = [...quizData];
                          quizTemp[clickedQuizIndex].answer2Clicked =
                            !quizTemp[clickedQuizIndex].answer2Clicked;
                          setQuizData([...quizTemp]);
                        }}
                        onMouseEnter={() => setMouseEnter2(true)}
                        onMouseLeave={() => setMouseEnter2(false)}
                        className={`${
                          quizData?.[clickedQuizIndex]?.answer2Clicked
                            ? "check-btn-mobile-clicked"
                            : `${
                                !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer4Clicked
                                  ? ""
                                  : ""
                              } check-btn-mobile`
                        }`}
                      >
                        <span className={`centang-span-mobile`}>
                          {quizData?.[clickedQuizIndex]?.answer2Clicked && (
                            <img src="centang.svg" className="centang-img" />
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                  <textarea
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text2 ?? ""}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text2 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 1"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text2
                        ? "text-white"
                        : "text-black"
                    } w-full px-[6px] outline-none bg-transparent border-none`}
                  />

                  <p className="text-white absolute bottom-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text2?.length}
                  </p>
                </div>
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text3
                      ? "bg-orange"
                      : "bg-white"
                  } flex flex-col gap-x-2 items-center relative`}
                >
                  <div className="flex justify-between w-full mt-[8px]">
                    <div className="shape-div-mobile bg-orange p-[3px]">
                      <FaCircle className="" size="16px" color="white" />
                    </div>
                    {quizData?.[clickedQuizIndex]?.text3 && (
                      <button
                        onClick={() => {
                          let quizTemp = [...quizData];
                          quizTemp[clickedQuizIndex].answer3Clicked =
                            !quizTemp[clickedQuizIndex].answer3Clicked;
                          setQuizData([...quizTemp]);
                        }}
                        onMouseEnter={() => setMouseEnter2(true)}
                        onMouseLeave={() => setMouseEnter2(false)}
                        className={`${
                          quizData?.[clickedQuizIndex]?.answer3Clicked
                            ? "check-btn-mobile-clicked"
                            : `${
                                !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer4Clicked
                                  ? ""
                                  : ""
                              } check-btn-mobile`
                        }`}
                      >
                        <span className={`centang-span-mobile`}>
                          {quizData?.[clickedQuizIndex]?.answer3Clicked && (
                            <img src="centang.svg" className="centang-img" />
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                  <textarea
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text3 ?? ""}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text3 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 3 (optional)"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text3
                        ? "text-white"
                        : "text-black"
                    } w-full px-[6px] outline-none bg-transparent border-none`}
                  />

                  <p className="text-white absolute bottom-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text3?.length}
                  </p>
                </div>
                <div
                  className={`answer-card ${
                    quizData?.[clickedQuizIndex]?.text4
                      ? "bg-dark-green"
                      : "bg-white"
                  } flex flex-col gap-x-2 items-center relative`}
                >
                  <div className="flex justify-between w-full mt-[8px]">
                    <div className="shape-div-mobile bg-dark-green p-[3px]">
                      <FaSquareFull className="" size="16px" color="white" />
                    </div>
                    {quizData?.[clickedQuizIndex]?.text4 && (
                      <button
                        onClick={() => {
                          let quizTemp = [...quizData];
                          quizTemp[clickedQuizIndex].answer4Clicked =
                            !quizTemp[clickedQuizIndex].answer4Clicked;
                          setQuizData([...quizTemp]);
                        }}
                        onMouseEnter={() => setMouseEnter2(true)}
                        onMouseLeave={() => setMouseEnter2(false)}
                        className={`${
                          quizData?.[clickedQuizIndex]?.answer4Clicked
                            ? "check-btn-mobile-clicked"
                            : `${
                                !quizData?.[clickedQuizIndex]?.answer1Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer2Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer3Clicked &&
                                !quizData?.[clickedQuizIndex]?.answer4Clicked
                                  ? ""
                                  : ""
                              } check-btn-mobile`
                        }`}
                      >
                        <span className={`centang-span-mobile`}>
                          {quizData?.[clickedQuizIndex]?.answer4Clicked && (
                            <img src="centang.svg" className="centang-img" />
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                  <textarea
                    maxLength={75}
                    value={quizData?.[clickedQuizIndex]?.text4 ?? ""}
                    onChange={(e) => {
                      let quizTemp = [...quizData];
                      quizTemp[clickedQuizIndex].text4 = e.target.value;
                      setQuizData([...quizTemp]);
                    }}
                    placeholder="Add answer 4 (optional)"
                    className={`${
                      quizData?.[clickedQuizIndex]?.text4
                        ? "text-white"
                        : "text-black"
                    } w-full px-[6px] outline-none bg-transparent border-none`}
                  />

                  <p className="text-white absolute bottom-1 right-[10px]">
                    {75 - quizData?.[clickedQuizIndex]?.text4?.length}
                  </p>
                </div>
              </div>
            )}
            {quizData?.[clickedQuizIndex]?.questionType === "True or false" && (
              <div className="grid grid-cols-2 gap-[8px]">
                <div
                  className={`answer-card bg-red flex flex-col gap-x-2 items-center relative`}
                >
                  <div className="flex justify-between w-full mt-[8px]">
                    <div className="shape-div-mobile bg-red p-[3px]">
                      <MdHexagon className="" size="16px" color="white" />
                    </div>
                    <button
                      onClick={() => {
                        let quizTemp = [...quizData];
                        if (
                          quizTemp[clickedQuizIndex].trueOrFalseAnswer ===
                          "true"
                        ) {
                          quizTemp[clickedQuizIndex].trueOrFalseAnswer =
                            "false";
                        } else {
                          quizTemp[clickedQuizIndex].trueOrFalseAnswer = "true";
                        }
                        setQuizData([...quizTemp]);
                      }}
                      onMouseEnter={() => setMouseEnter2(true)}
                      onMouseLeave={() => setMouseEnter2(false)}
                      className={`${
                        quizData[clickedQuizIndex].trueOrFalseAnswer === "true"
                          ? "check-btn-mobile-clicked"
                          : `${
                              !quizData[clickedQuizIndex].trueOrFalseAnswer
                                ? "check-btn-animation"
                                : ""
                            } check-btn-mobile`
                      }`}
                    >
                      <span className={`centang-span-mobile`}>
                        {quizData[clickedQuizIndex].trueOrFalseAnswer ===
                          "true" && (
                          <img
                            src="centang.svg"
                            className="centang-img-mobile"
                          />
                        )}
                      </span>
                    </button>
                  </div>
                  <p className="text-white w-full pl-[8px] outline-none bg-transparent border-none">
                    True
                  </p>
                </div>
                <div
                  className={`answer-card bg-blue flex flex-col gap-x-2 items-center relative`}
                >
                  <div className="flex justify-between w-full mt-[8px]">
                    <div className="shape-div-mobile bg-blue p-[3px]">
                      <IoTriangleSharp className="" size="16px" color="white" />
                    </div>
                    <button
                      onClick={() => {
                        let quizTemp = [...quizData];
                        if (
                          quizTemp[clickedQuizIndex].trueOrFalseAnswer ===
                          "false"
                        ) {
                          quizTemp[clickedQuizIndex].trueOrFalseAnswer = "true";
                        } else {
                          quizTemp[clickedQuizIndex].trueOrFalseAnswer =
                            "false";
                        }
                        setQuizData([...quizTemp]);
                      }}
                      onMouseEnter={() => setMouseEnter2(true)}
                      onMouseLeave={() => setMouseEnter2(false)}
                      className={`${
                        quizData[clickedQuizIndex].trueOrFalseAnswer === "false"
                          ? "check-btn-mobile-clicked"
                          : `${
                              !quizData[clickedQuizIndex].trueOrFalseAnswer
                                ? "check-btn-animation"
                                : ""
                            } check-btn-mobile`
                      }`}
                    >
                      <span className={`centang-span-mobile`}>
                        {quizData[clickedQuizIndex].trueOrFalseAnswer ===
                          "false" && (
                          <img
                            src="centang.svg"
                            className="centang-img-mobile"
                          />
                        )}
                      </span>
                    </button>
                  </div>
                  <p className="text-white w-full pl-[8px] outline-none bg-transparent border-none">
                    False
                  </p>
                </div>
              </div>
            )}
            {quizData?.[clickedQuizIndex]?.questionType === "Type answer" && (
              <div className="flex justify-center flex-col gap-y-2 items-center w-full">
                <div className="question-div">
                  <div
                    className={`question-inner-div-answer-mobile ${
                      quizData[clickedQuizIndex]?.text1?.length > 0 && "bg-red"
                    }`}
                  >
                    <div className="question-sub-inner-div">
                      <div className="question-1-div-answer">
                        <div className="question-2-div">
                          <input
                            maxLength={20}
                            value={quizData?.[clickedQuizIndex]?.text1 ?? ""}
                            onChange={(e) => {
                              let quizTemp = [...quizData];
                              quizTemp[clickedQuizIndex].text1 = e.target.value;
                              setQuizData([...quizTemp]);
                            }}
                            placeholder="Type an answer"
                            className={`${
                              quizData?.[clickedQuizIndex]?.text1?.length > 0
                                ? "text-white"
                                : "text-black"
                            } w-full text-center question-p bg-transparent border-transparent outline-none`}
                            type="text"
                          />
                          <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                            {20 - quizData?.[clickedQuizIndex]?.text1?.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (quizData?.[clickedQuizIndex]?.additionalAnswers > 0)
                      return;
                    let quizTemp = [...quizData];
                    quizTemp[clickedQuizIndex].additionalAnswers =
                      quizTemp[clickedQuizIndex].additionalAnswers + 1;
                    setQuizData([...quizTemp]);
                  }}
                  className="shadow-overlay-button"
                >
                  {(quizData?.[clickedQuizIndex]?.additionalAnswers ?? 0) <= 0
                    ? "Add other accepted answers"
                    : `Other accepted answers ${
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3
                          ? "("
                          : ""
                      }${
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3
                          ? 3 - quizData?.[clickedQuizIndex]?.additionalAnswers
                          : ""
                      }${
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3
                          ? ")"
                          : ""
                      }`}
                </button>
                {quizData?.[clickedQuizIndex]?.additionalAnswers > 0 && (
                  <div className="flex flex-col w-full gap-y-4">
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 0 && (
                      <div className="question-div w-full">
                        <div
                          className={`question-answer-full ${
                            quizData?.[clickedQuizIndex]?.text2?.length > 0 &&
                            "bg-blue"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  maxLength={20}
                                  value={quizData?.[clickedQuizIndex]?.text2}
                                  onChange={(e) => {
                                    let quizTemp = [...quizData];
                                    quizTemp[clickedQuizIndex].text2 =
                                      e.target.value;
                                    setQuizData([...quizTemp]);
                                  }}
                                  placeholder="Type an answer"
                                  className={`${
                                    quizData?.[clickedQuizIndex]?.text2
                                      ?.length > 0
                                      ? "text-white"
                                      : "text-black"
                                  } w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                                <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                                  {20 -
                                    quizData?.[clickedQuizIndex]?.text2?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 1 && (
                      <div className="question-div">
                        <div
                          className={`question-answer-full ${
                            quizData?.[clickedQuizIndex]?.text3?.length > 0 &&
                            "bg-orange"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  maxLength={20}
                                  value={quizData?.[clickedQuizIndex]?.text3}
                                  onChange={(e) => {
                                    let quizTemp = [...quizData];
                                    quizTemp[clickedQuizIndex].text3 =
                                      e.target.value;
                                    setQuizData([...quizTemp]);
                                  }}
                                  placeholder="Type an answer"
                                  className={`${
                                    quizData?.[clickedQuizIndex]?.text3
                                      ?.length > 0
                                      ? "text-white"
                                      : "text-black"
                                  } w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                                <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                                  {20 -
                                    quizData?.[clickedQuizIndex]?.text3?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {quizData?.[clickedQuizIndex]?.additionalAnswers > 2 && (
                      <div className="question-div">
                        <div
                          className={`question-answer-full ${
                            quizData?.[clickedQuizIndex]?.text4?.length > 0 &&
                            "bg-dark-green"
                          }`}
                        >
                          <div className="question-sub-inner-div">
                            <div className="question-1-div-answer">
                              <div className="question-2-div">
                                <input
                                  maxLength={20}
                                  value={quizData?.[clickedQuizIndex]?.text4}
                                  onChange={(e) => {
                                    let quizTemp = [...quizData];
                                    quizTemp[clickedQuizIndex].text4 =
                                      e.target.value;
                                    setQuizData([...quizTemp]);
                                  }}
                                  placeholder="Type an answer"
                                  className={`${
                                    quizData?.[clickedQuizIndex]?.text4
                                      ?.length > 0
                                      ? "text-white"
                                      : "text-black"
                                  } w-full text-center question-p bg-transparent border-transparent outline-none`}
                                  type="text"
                                />
                                <p className="absolute top-[25%] text-white right-1 text-[14px] font-semibold">
                                  {20 -
                                    quizData?.[clickedQuizIndex]?.text4?.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-center items-center">
                      {quizData?.[clickedQuizIndex]?.additionalAnswers > 0 &&
                        quizData?.[clickedQuizIndex]?.additionalAnswers < 3 && (
                          <button
                            onClick={() => {
                              let quizTemp = [...quizData];
                              quizTemp[clickedQuizIndex].additionalAnswers =
                                quizTemp[clickedQuizIndex].additionalAnswers +
                                1;
                              setQuizData([...quizTemp]);
                            }}
                            className="shadow-overlay-button"
                          >
                            Add more
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!isMobileOrTablet && (
          <div className="right-sidebar">
            <button className="right-sidebar-btn text-black">
              <FaArrowRight className="absolute left-[20%]" />
            </button>
            <div className="inner-right-sidebar w-full">
              <div className="flex gap-x-2 items-center">
                <FaRegQuestionCircle
                  className="w-[24px] h-[24px]"
                  color="black"
                />
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
                    {convertSecondsToMinutes(
                      quizData?.[clickedQuizIndex]?.timeLimit
                    )}
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
                  setCurrentId((prevState) => prevState + 1);
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
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => toggleModalSecond()}
            className="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg w-[712px] text-center"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
                        <p className="text-[#6E6E6E] text-left">
                          Max. file size: 80MB
                        </p>
                        <Tooltip
                          className="z-infinite"
                          placement="top"
                          title={"Image: 80 MB"}
                        >
                          <FaCircleQuestion color="gray" />
                        </Tooltip>
                      </div>
                      <div className="flex gap-x-2 items-center">
                        <p className="text-[#6E6E6E] text-left">
                          Drop your files here
                        </p>
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
                <button
                  onClick={toggleModalSecond}
                  className="toggle-close-btn"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {isOpenModalJiggle && (
        <div
          className="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
          onClick={toggleModalJiggle}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, -5, 5, -3, 3, 0],
              x: [0, -10, 10, -5, 5, 0],
            }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            <button
              onClick={toggleModalJiggle}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Delete {quizData?.[flexibleClickedQuizIndex]?.questionType}{" "}
              question
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this question? This action can’t
              be undone.
            </p>
            <div className="flex gap-x-2 items-center justify-center">
              <button onClick={toggleModalJiggle} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={() => {
                  let quizTemp = [...quizData];
                  if (flexibleClickedQuizIndex !== -1) {
                    quizTemp.splice(flexibleClickedQuizIndex, 1);
                    if (clickedQuizIndex === flexibleClickedQuizIndex) {
                      setClickedQuizIndex((prevState) => {
                        setQuizData([...quizTemp]);
                        if (clickedQuizIndex === 0) {
                          return prevState;
                        }
                        return prevState - 1;
                      });
                    } else {
                      if (clickedQuizIndex < flexibleClickedQuizIndex) {
                        setQuizData([...quizTemp]);
                      } else if (clickedQuizIndex > flexibleClickedQuizIndex) {
                        setClickedQuizIndex((prevState) => {
                          setQuizData([...quizTemp]);
                          return prevState - 1;
                        });
                      }
                    }
                  } else {
                    quizTemp.splice(clickedQuizIndex, 1);
                    setClickedQuizIndex((prevState) => {
                      setQuizData([...quizTemp]);
                      if (clickedQuizIndex === 0) {
                        return prevState;
                      }
                      return prevState - 1;
                    });
                  }
                  toggleModalJiggle();
                }}
                className="delete-modal-btn"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {openModalQuestion && (
          <div
            onClick={() => toggleModalQuestion()}
            className="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg px-[32px] text-center"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mt-[24px]">
                <p className="text-black mb-[12px]">Choose Question Type:</p>
                <div className="flex gap-x-4 lg:flex-row flex-col gap-y-4 items-center justify-center w-full">
                  {((isChangingQuestionType &&
                    quizData?.[clickedQuizIndex]?.questionType !== "Quiz") ||
                    !isChangingQuestionType) && (
                    <div
                      onClick={() => {
                        if (!isChangingQuestionType) {
                          setQuizData((prevState) => [
                            ...prevState,
                            { ...newQuizData, questionType: "Quiz" },
                          ]);
                          setCurrentId((prevState) => prevState + 1);
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
                    quizData?.[clickedQuizIndex]?.questionType !==
                      "True or false") ||
                    !isChangingQuestionType) && (
                    <div
                      onClick={() => {
                        if (!isChangingQuestionType) {
                          setQuizData((prevState) => [
                            ...prevState,
                            { ...newQuizData, questionType: "True or false" },
                          ]);
                          setCurrentId((prevState) => prevState + 1);
                          if (isMobileOrTablet) {
                            scrollToEnd();
                          } else {
                            scrollToBottom();
                          }
                        } else {
                          let quizTemp = [...quizData];
                          quizTemp[clickedQuizIndex].questionType =
                            "True or false";
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
                    quizData?.[clickedQuizIndex]?.questionType !==
                      "Type answer") ||
                    !isChangingQuestionType) && (
                    <div
                      onClick={() => {
                        if (!isChangingQuestionType) {
                          setQuizData((prevState) => [
                            ...prevState,
                            { ...newQuizData, questionType: "Type answer" },
                          ]);
                          setCurrentId((prevState) => prevState + 1);
                          if (isMobileOrTablet) {
                            scrollToEnd();
                          } else {
                            scrollToBottom();
                          }
                        } else {
                          let quizTemp = [...quizData];
                          quizTemp[clickedQuizIndex].questionType =
                            "Type answer";
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpenModalTitle && (
          <div
            onClick={() => {
              setFromSaving(false);
              toggleModalTitle();
            }}
            className="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg px-[16px] md:px-[32px] text-center w-[90vw] md:w-[600px]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mt-[24px]">
                <p className="text-gray mb-[12px] font-semibold text-left">
                  Title
                </p>
                <p className="text-black text-left">
                  Enter a title for your kahoot.
                </p>
                <div className="relative">
                  <input
                    value={kahootTitleTemp}
                    onChange={(e) => {
                      setKahootTitleTemp(e.target.value);
                    }}
                    className="mt-[12px] title-input outline-none w-full"
                    type="text"
                    maxLength={95}
                  />
                  <p className="absolute top-[40%] text-[#6E6E6E] right-2">
                    {95 - (kahootTitleTemp?.length ?? 0)}
                  </p>
                </div>
                <p className="text-gray mb-[12px] mt-[20px] font-semibold text-left">
                  Description{" "}
                  <span className="text-[#6E6E6E] font-normal">(optional)</span>
                </p>
                <p className="text-black text-left">
                  Provide a short description for your kahoot to increase
                  visibility.
                </p>
                <div className="relative">
                  <textarea
                    value={kahootDescriptionTemp}
                    onChange={(e) => setKahootDescriptionTemp(e.target.value)}
                    rows={5}
                    className="mt-[12px] textarea-input outline-none w-full"
                    maxLength={500}
                  />
                  <p className="absolute top-[20%] text-[#6E6E6E] right-2">
                    {500 - (kahootDescriptionTemp?.length ?? 0)}
                  </p>
                </div>
              </div>
              <div className="close-toggle-button gap-x-2">
                <button
                  onClick={() => {
                    setFromSaving(false);
                    toggleModalTitle();
                    setKahootTitleTemp(previousKahootTitle);
                    setKahootDescriptionTemp(previousKahootDescription);
                  }}
                  className="exit-button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (fromSaving) {
                      if (!kahootTitleTemp) return;
                    }
                    setKahootTitleTemp((prevState) => {
                      setKahootTitle(prevState.trim());
                      setPreviousKahootTitle(prevState.trim());
                      return prevState.trim();
                    });
                    setKahootDescriptionTemp((prevState) => {
                      setKahootDescription(prevState.trim());
                      setPreviousKahootDescription(prevState.trim());
                      return prevState.trim();
                    });
                    toggleModalTitle();
                    if (fromSaving) {
                      setLoading(true);
                      const gamePin = generateRandomString();
                      backend
                        ?.addGame(
                          gamePin,
                          principal,
                          kahootTitle,
                          kahootDescription,
                          quizData
                        )
                        ?.then((result) => {
                          setLoading(false);
                          Swal.fire({
                            title: "Success!",
                            text: "You have successfully saved your quiz!",
                            icon: "success",
                          })
                            .then((res) => {
                              navigate("/profile");
                            })
                            .catch((thisErr) => {
                              console.log(thisErr);
                            });
                        })
                        ?.catch((error) => {
                          setLoading(false);
                          console.log(error);
                        });
                    }
                  }}
                  className="save-button"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {isOpenExitKahootModal && (
        <div
          className="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
          onClick={toggleModalExitKahoot}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, -5, 5, -3, 3, 0],
              x: [0, -10, 10, -5, 5, 0],
            }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            <button
              onClick={toggleModalExitKahoot}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">Exit</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to exit? Your changes will not be saved.
            </p>
            <div className="flex gap-x-2 items-center justify-center">
              <button
                onClick={() => {
                  navigate("/profile");
                }}
                className="cancel-red-btn"
              >
                Exit
              </button>
              <button
                onClick={() => {
                  toggleModalExitKahoot();
                }}
                className="exit-kahoot-btn"
              >
                Keep Editing
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {isOpenModalValidate && (
          <div
            onClick={() => toggleModalValidate()}
            className="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg text-center h-full md:h-[95vh] flex flex-col gap-y-4 w-[100vw] md:w-[640px]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mt-[24px] px-[16px] md:px-[32px]">
                <p className="text-gray mb-[12px] text-[24px] font-bold text-left">
                  This kahoot can't be played
                </p>
                <p className="text-black text-left">
                  All questions need to be completed before you can start
                  playing.
                </p>
              </div>
              <div className="validate-div mt-[24px] h-full">
                <ul className="validate-subdiv">
                  {quizChecked?.map((theData) => (
                    <li className="validate-li">
                      <div className="top-part flex gap-x-2 items-center p-[2px]">
                        <div className="dashed-part flex justify-center items-center">
                          {quizData?.[theData?.index]?.imageUrl ===
                          "cdn.svg" ? (
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
                              ? (quizData?.[theData?.index]?.question?.slice(
                                  0,
                                  12
                                ) ?? "") + "..."
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
                        {theData?.messages?.map((value, index) => (
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpenModalTimeLimit && (
          <div
            onClick={() => toggleModalTimeLimit()}
            className="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg text-center md:h-[95vh] flex flex-col gap-y-4 w-[90vw] md:w-[640px]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mt-[24px] px-[16px] md:px-[32px] the-box-shadow pb-[32px]">
                <p className="text-gray mb-[12px] text-[24px] font-bold text-left">
                  Time limit
                </p>
                <div className="flex gap-3 justify-center items-center flex-wrap">
                  {timeLimitData?.map((theData) => (
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
                    setCurrentTimeLimit(
                      quizData?.[clickedQuizIndex]?.timeLimit
                    );
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Create;
