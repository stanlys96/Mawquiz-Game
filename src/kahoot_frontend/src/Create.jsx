import React, { useState, useRef } from "react";
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
import { Dropdown, Tooltip, Radio, Input, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa6";
import {
  questionTypeItems,
  timeLimitItems,
  answerOptionsItems,
} from "./helper/helper";
import { IoTriangleSharp } from "react-icons/io5";
import { MdHexagon } from "react-icons/md";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";

function Create() {
  const [currentId, setCurrentId] = useState(1);
  const [isOpenExample, setIsOpenExample] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openModalQuestion, setOpenModalQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer1Text, setAnswer1Text] = useState("");
  const [mouseEnter1, setMouseEnter1] = useState(false);
  const [answer1Clicked, setAnswer1Clicked] = useState(false);
  const [answer2Text, setAnswer2Text] = useState("");
  const [mouseEnter2, setMouseEnter2] = useState(false);
  const [answer2Clicked, setAnswer2Clicked] = useState(false);
  const [answer3Text, setAnswer3Text] = useState("");
  const [mouseEnter3, setMouseEnter3] = useState(false);
  const [answer3Clicked, setAnswer3Clicked] = useState(false);
  const [answer4Text, setAnswer4Text] = useState("");
  const [mouseEnter4, setMouseEnter4] = useState(false);
  const [answer4Clicked, setAnswer4Clicked] = useState(false);
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [mouseEnterUl, setMouseEnterUl] = useState(false);
  const [quizData, setQuizData] = useState([
    {
      id: currentId,
      type: "Quiz",
      title: "Title",
    },
  ]);

  const [value, setValue] = useState(1);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDragging(false);
      setIsOpen(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setIsOpen(false);

    // Access the dropped files
    const file = e.dataTransfer.files[0];

    // Ensure it's an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Convert file to a base64 URL
      };
      reader.readAsDataURL(file);
      console.log(file, "<<< FILE");
    } else {
      alert("Please drop an image file.");
    }
  };

  const toggleModalSecond = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsOpenExample(!isOpenExample);
  };

  const toggleModalQuestion = () => {
    setOpenModalQuestion((prevState) => !prevState);
  };

  const dropdownRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
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

  return (
    <main className="background" ref={dropdownRef}>
      <nav className="navbar">
        <div className="flex gap-x-6 items-center w-full">
          <img className="h-[48px]" src="/kahoot-2.png" />
          <div className="kahoot-input-container">
            <button
              onClick={toggleModal}
              className="kahoot-btn-title font-semibold"
            >
              Enter kahoot title...
            </button>
            <button onClick={toggleModal} className="settings-btn">
              Settings
            </button>
          </div>
        </div>
        <div className="flex items-center">
          {/* <div className="vr-container">
            <div className="vertical-rule" />
          </div> */}

          <button className="exit-button mr-4">Exit</button>
          <button className="save-button">Save</button>
        </div>
      </nav>
      <div className="flex justify-between">
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
                <div className="sidebar-card relative">
                  <div>
                    <div className="flex gap-x-2">
                      <p className="ml-[32px] text-sidebar">{index + 1}</p>
                      <p className="text-sidebar">{quiz?.type}</p>
                    </div>
                    <div className="quiz-card ml-[32px] cursor-pointer mt-[5px] mx-[16px] relative">
                      <p className="text-[0.75rem] my-[5px] text-center font-medium">
                        {quiz?.title}
                      </p>
                      <div className="bg-[#F2F2F2] rounded-b-[0.25rem]">
                        <img
                          src="/cdn.svg"
                          className="rounded-b-[0.25rem] py-[10px]"
                        />
                      </div>
                      <div className="exclamation-container">
                        <img className="exclamation" src="/exclamation.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col absolute top-[50%] gap-y-1">
                    <Tooltip placement="right" title={"Duplicate"}>
                      <a className="cursor-pointer rounded-full icon-quiz">
                        <MdOutlineFolderCopy
                          color="#6E6E6E"
                          height={16}
                          width={16}
                        />
                      </a>
                    </Tooltip>
                    <Tooltip placement="right" title={"Delete"}>
                      <a className="cursor-pointer icon-quiz rounded-full">
                        <RiDeleteBinLine
                          color="#6E6E6E"
                          height={16}
                          width={16}
                        />
                      </a>
                    </Tooltip>
                  </div>
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
        <div className="middle-div flex-1">
          <div className="question-div">
            <div className="question-inner-div">
              <div className="question-sub-inner-div">
                <div className="question-1-div">
                  <div className="question-2-div">
                    <input
                      value={question}
                      onChange={(e) => {
                        if (e.target.value.length > 120) return;
                        setQuestion(e.target.value);
                      }}
                      placeholder="Start typing your question"
                      className="w-full text-center question-p bg-transparent border-transparent outline-none"
                      type="text"
                    />
                    <p className="absolute top-1 text-gray right-1 text-[14px] font-semibold">
                      {120 - question?.length}
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
              className="upload-div cursor-pointer gap-y-[16px]"
            >
              {!image ? (
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
                  src={image}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", height: "auto" }}
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
          <div className="grid grid-cols-2 gap-[8px]">
            <div
              className={`answer-card ${
                answer1Text ? "bg-red" : "bg-white"
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
                value={answer1Text}
                onChange={(e) => {
                  if (answer1Text?.length > 75) return;
                  setAnswer1Text(e.target.value);
                }}
                placeholder="Add answer 1"
                className={`${
                  answer1Text ? "text-white" : "text-black"
                } w-full outline-none bg-transparent border-none`}
              />

              {answer1Text && (
                <button
                  onClick={() => setAnswer1Clicked((prevState) => !prevState)}
                  onMouseEnter={() => setMouseEnter1(true)}
                  onMouseLeave={() => setMouseEnter1(false)}
                  className={`${
                    answer1Clicked
                      ? "check-btn-clicked"
                      : `${
                          !answer1Clicked &&
                          !answer2Clicked &&
                          !answer3Clicked &&
                          !answer4Clicked
                            ? "check-btn-animation"
                            : ""
                        } check-btn`
                  }`}
                >
                  <span className={`centang-span`}>
                    {(mouseEnter1 || answer1Clicked) && (
                      <img src="centang.svg" className="centang-img" />
                    )}
                  </span>
                </button>
              )}
              <p className="text-white absolute top-1 right-[10px]">
                {75 - answer1Text?.length}
              </p>
            </div>
            <div
              className={`answer-card ${
                answer2Text ? "bg-blue" : "bg-white"
              } flex gap-x-2 items-center`}
            >
              <div className="shape-div bg-blue">
                <MdHexagon className="mx-[8px]" size="32px" color="white" />
              </div>
              <input
                value={answer2Text}
                onChange={(e) => {
                  if (answer2Text?.length > 75) return;
                  setAnswer2Text(e.target.value);
                }}
                placeholder="Add answer 2"
                className={`${
                  answer2Text ? "text-white" : "text-black"
                } w-full outline-none bg-transparent border-none`}
              />

              {answer2Text && (
                <button
                  onClick={() => setAnswer2Clicked((prevState) => !prevState)}
                  onMouseEnter={() => setMouseEnter2(true)}
                  onMouseLeave={() => setMouseEnter2(false)}
                  className={`${
                    answer2Clicked
                      ? "check-btn-clicked"
                      : `${
                          !answer1Clicked &&
                          !answer2Clicked &&
                          !answer3Clicked &&
                          !answer4Clicked
                            ? "check-btn-animation"
                            : ""
                        } check-btn`
                  }`}
                >
                  <span className={`centang-span`}>
                    {(mouseEnter2 || answer2Clicked) && (
                      <img src="centang.svg" className="centang-img" />
                    )}
                  </span>
                </button>
              )}
              <p className="text-white absolute top-1 right-[10px]">
                {75 - answer2Text?.length}
              </p>
            </div>
            <div
              className={`answer-card ${
                answer3Text ? "bg-orange" : "bg-white"
              } flex gap-x-2 items-center`}
            >
              <div className="shape-div bg-orange">
                <FaCircle className="mx-[8px]" size="32px" color="white" />
              </div>
              <input
                value={answer3Text}
                onChange={(e) => {
                  if (answer3Text?.length > 75) return;
                  setAnswer3Text(e.target.value);
                }}
                placeholder="Add answer 3 (optional)"
                className={`${
                  answer3Text ? "text-white" : "text-black"
                } w-full outline-none bg-transparent border-none`}
              />

              {answer3Text && (
                <button
                  onClick={() => setAnswer3Clicked((prevState) => !prevState)}
                  onMouseEnter={() => setMouseEnter3(true)}
                  onMouseLeave={() => setMouseEnter3(false)}
                  className={`${
                    answer3Clicked
                      ? "check-btn-clicked"
                      : `${
                          !answer1Clicked &&
                          !answer2Clicked &&
                          !answer3Clicked &&
                          !answer4Clicked
                            ? "check-btn-animation"
                            : ""
                        } check-btn`
                  }`}
                >
                  <span className={`centang-span`}>
                    {(mouseEnter3 || answer3Clicked) && (
                      <img src="centang.svg" className="centang-img" />
                    )}
                  </span>
                </button>
              )}
              <p className="text-white absolute top-1 right-[10px]">
                {75 - answer3Text?.length}
              </p>
            </div>
            <div
              className={`answer-card ${
                answer4Text ? "bg-dark-green" : "bg-white"
              } flex gap-x-2 items-center relative`}
            >
              <div className="shape-div bg-dark-green">
                <FaSquareFull className="mx-[8px]" size="32px" color="white" />
              </div>
              <input
                value={answer4Text}
                onChange={(e) => {
                  if (answer4Text?.length > 75) return;
                  setAnswer4Text(e.target.value);
                }}
                placeholder="Add answer 4 (optional)"
                className={`${
                  answer4Text ? "text-white" : "text-black"
                } w-full outline-none bg-transparent border-none`}
              />

              {answer4Text && (
                <button
                  onClick={() => setAnswer4Clicked((prevState) => !prevState)}
                  onMouseEnter={() => setMouseEnter4(true)}
                  onMouseLeave={() => setMouseEnter4(false)}
                  className={`${
                    answer4Clicked
                      ? "check-btn-clicked"
                      : `${
                          !answer1Clicked &&
                          !answer2Clicked &&
                          !answer3Clicked &&
                          !answer4Clicked
                            ? "check-btn-animation"
                            : ""
                        } check-btn`
                  }`}
                >
                  <span className={`centang-span`}>
                    {(mouseEnter4 || answer4Clicked) && (
                      <img src="centang.svg" className="centang-img" />
                    )}
                  </span>
                </button>
              )}
              <p className="text-white absolute top-1 right-[10px]">
                {75 - answer4Text?.length}
              </p>
            </div>
          </div>
        </div>
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
              menu={{ items: questionTypeItems }}
              trigger={["click"]}
            >
              <a
                className="flex justify-between items-center px-[10px]"
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-x-2">
                  <MdQuiz />
                  <p className="text-black">Quiz</p>
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
              menu={{ items: timeLimitItems }}
              trigger={["click"]}
            >
              <a
                className="flex justify-between items-center px-[10px]"
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-x-2">20 seconds</div>
                <DownOutlined />
              </a>
            </Dropdown>
            <div className="flex gap-x-2 items-center mt-[16px]">
              <MdOutlineQuestionAnswer
                className="w-[24px] h-[24px]"
                color="black"
              />
              <p className="text-[#333333] font-semibold">Answer Options</p>
            </div>
            <Dropdown
              className="dropdown-sidebar mt-3 w-full text-black"
              menu={{ items: answerOptionsItems }}
              trigger={["click"]}
            >
              <a
                className="flex justify-between items-center px-[10px]"
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-x-2">Single select</div>
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
          <div className="right-sidebar-bottom mt-auto flex gap-x-2">
            <button className="delete-btn">Delete</button>
            <button className="duplicate-btn">Duplicate</button>
          </div>
        </div>
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
      {isOpenExample && (
        <div
          className="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
          onClick={toggleModal}
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
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Jiggle Modal
            </h2>
            <p className="text-gray-600 mb-4">
              This modal juggles both angular rotation and horizontal movement,
              creating a playful jiggle effect!
            </p>
            <button
              onClick={toggleModal}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
            >
              Close Modal
            </button>
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
                <div className="flex gap-x-4 items-center justify-center w-full">
                  <div
                    onClick={() => {
                      const newQuizData = {
                        id: currentId + 1,
                        title: "Title",
                        type: "Quiz",
                      };
                      setQuizData((prevState) => [...prevState, newQuizData]);
                      setCurrentId((prevState) => prevState + 1);
                      scrollToBottom();
                      toggleModalQuestion();
                    }}
                    className="the-gray cursor-pointer mx-[8px] mt-[8px] rounded-[4px] py-[16px] w-[150px] flex flex-col gap-y-2 justify-center items-center"
                  >
                    <MdQuiz color="black" size="30px" />
                    <p className="text-black">Quiz</p>
                  </div>
                  <div
                    onClick={() => {
                      const newQuizData = {
                        id: currentId + 1,
                        title: "Title",
                        type: "True or false",
                      };
                      setQuizData((prevState) => [...prevState, newQuizData]);
                      setCurrentId((prevState) => prevState + 1);
                      scrollToBottom();
                      toggleModalQuestion();
                    }}
                    className="the-gray cursor-pointer mx-[8px] mt-[8px] rounded-[4px] py-[16px] w-[150px] flex flex-col gap-y-2 justify-center items-center"
                  >
                    <VscSymbolBoolean color="black" size="30px" />
                    <p className="text-black">True or false</p>
                  </div>
                  <div
                    onClick={() => {
                      const newQuizData = {
                        id: currentId + 1,
                        title: "Title",
                        type: "Type answer",
                      };
                      setQuizData((prevState) => [...prevState, newQuizData]);
                      setCurrentId((prevState) => prevState + 1);
                      scrollToBottom();
                      toggleModalQuestion();
                    }}
                    className="the-gray cursor-pointer mx-[8px] mt-[8px] rounded-[4px] py-[16px] w-[150px] flex flex-col gap-y-2 justify-center items-center"
                  >
                    <TiMessageTyping color="black" size="30px" />
                    <p className="text-black">Type answer</p>
                  </div>
                </div>
              </div>
              <div className="close-toggle-button">
                <button onClick={toggleModalQuestion} className="duplicate-btn">
                  Cancel
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
