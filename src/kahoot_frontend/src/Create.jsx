import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlineFolderCopy, MdQuiz, MdAccessTime } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiCircleQuestion } from "react-icons/ci";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { VscSymbolBoolean } from "react-icons/vsc";
import { TiMessageTyping } from "react-icons/ti";

function Create() {
  const [isOpenExample, setIsOpenExample] = useState(false);

  const toggleModal = () => {
    setIsOpenExample(!isOpenExample);
  };

  const dropdownRef = useRef(null);

  const items = [
    {
      label: (
        <div className="the-gray rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center">
          <MdQuiz size="30px" />
          <p className="text-black">Quiz</p>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div className="the-gray rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center">
          <VscSymbolBoolean size="30px" />
          <p className="text-black">True or False</p>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div className="the-gray rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center">
          <TiMessageTyping size="30px" />
          <p className="text-black">Type Answer</p>
        </div>
      ),
      key: "3",
    },
  ];

  return (
    <main className="background" ref={dropdownRef}>
      <nav className="navbar">
        <div className="flex gap-x-6 items-center w-full">
          <img className="h-[48px]" src="/kahoot-2.png" />
          <div className="kahoot-input-container">
            <button className="kahoot-btn-title font-semibold">
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
                  <a className="cursor-pointer rounded-full icon-quiz">
                    <MdOutlineFolderCopy
                      color="#6E6E6E"
                      height={16}
                      width={16}
                    />
                  </a>
                  <a className="cursor-pointer icon-quiz rounded-full">
                    <RiDeleteBinLine color="#6E6E6E" height={16} width={16} />
                  </a>
                </div>
              </div>
            </li>
          </ul>
          <div className="sidebar-bottom">
            <div className="question-container">
              <span>
                <button className="question-btn">Add question</button>
              </span>
            </div>
          </div>
        </div>
        <div className="middle-div flex-1"></div>
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
              menu={{ items }}
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
              menu={{ items }}
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
      {isOpenExample && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
