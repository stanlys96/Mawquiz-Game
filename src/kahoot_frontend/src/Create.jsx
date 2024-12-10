import React, { useState } from "react";
import { motion } from "framer-motion";

function Create() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <main className="background">
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
      <div className="the-sidebar">
        <ul className="sidebar-ul">
          <li>
            <p className="text-black">Hello World</p>
          </li>
          <li>
            <p className="text-black">Hello World</p>
          </li>
          <li>
            <p className="text-black">Hello World</p>
          </li>
          <li>
            <p className="text-black">Hello World</p>
          </li>
          <li>
            <p className="text-black">Hello World</p>
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

      {/* Button to open modal */}
      <button
        onClick={toggleModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Open Modal
      </button>

      {/* Modal Overlay */}
      {isOpen && (
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
