import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaRegQuestionCircle } from "react-icons/fa";
import {
  MdOutlineFolderCopy,
  MdQuiz,
  MdAccessTime,
  MdOutlineQuestionAnswer,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Dropdown, Tooltip } from "antd";
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

function Create() {
  const [isOpenExample, setIsOpenExample] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleModalSecond = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsOpenExample(!isOpenExample);
  };

  const dropdownRef = useRef(null);

  return (
    <main className="background" ref={dropdownRef}>
      <nav className="navbar">
        <div className="flex gap-x-6 items-center w-full">
          <img className="h-[48px]" src="/kahoot-2.png" />
          <div className="kahoot-input-container">
            <button
              onClick={() => setIsOpenExample(true)}
              className="kahoot-btn-title font-semibold"
            >
              Enter kahoot title...
            </button>
            <button className="settings-btn">Settings</button>
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
          <ul className="sidebar-ul">
            <li className="sidebar-li">
              <div className="sidebar-card relative">
                <div>
                  <div className="flex gap-x-2">
                    <p className="ml-[32px] text-sidebar">1</p>
                    <p className="text-sidebar">Quiz</p>
                  </div>
                  <div className="quiz-card ml-[32px] cursor-pointer mt-[5px] mx-[16px] relative">
                    <p className="text-[0.75rem] my-[5px] text-center font-medium">
                      Title
                    </p>
                    <div className="bg-[#F2F2F2] rounded-b-[0.25rem]">
                      <img src="/cdn.svg" className="rounded-b-[0.25rem]" />
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
                      <RiDeleteBinLine color="#6E6E6E" height={16} width={16} />
                    </a>
                  </Tooltip>
                </div>
              </div>
            </li>
          </ul>
          <div className="sidebar-bottom">
            <div className="question-container">
              <span>
                <button className="question-btn">Add question</button>
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
            <div className="upload-div cursor-pointer gap-y-[16px]">
              <img src="/walaoeh.svg" className="rounded-b-[0.25rem]" />
              <div className="btn-upload-div">
                <FaPlus size="32px" className="block mx-auto" color="black" />
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
                onChange={(e) => setAnswer1Text(e.target.value)}
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
                onChange={(e) => setAnswer2Text(e.target.value)}
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
                onChange={(e) => setAnswer3Text(e.target.value)}
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
                onChange={(e) => setAnswer4Text(e.target.value)}
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

      {/* Button to open modal */}
      {/* <button
        onClick={toggleModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Open Modal
      </button> */}
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-500"
          onClick={toggleModalSecond} // Close modal on background click
        >
          {/* Stop propagation to prevent closing when clicking on the modal */}
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: [1.2, 0.9, 1], opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.68, -0.55, 0.27, 1.55], // Custom spring curve for bounce
            }}
          >
            {/* Close Button */}
            <button
              onClick={toggleModalSecond}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold mb-4">Bouncy Modal</h2>
            <p className="text-gray-600 mb-4">
              This modal bounces into place with a spring-like animation. Add
              your content here!
            </p>
            <button
              onClick={toggleModalSecond}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
            >
              Close Modal
            </button>
          </motion.div>
        </div>
      )}
      {/* Modal Overlay */}
      {isOpenExample && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-500"
          onClick={toggleModal} // Close modal on background click
        >
          {/* Stop propagation to prevent closing when clicking on the modal */}
          <motion.div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, -5, 5, -3, 3, 0], // Angular jiggle
              x: [0, -10, 10, -5, 5, 0], // Slight horizontal jiggle
            }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          >
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold mb-4">Angular Jiggle Modal</h2>
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
    </main>
  );
}

export default Create;