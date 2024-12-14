import { MdQuiz } from "react-icons/md";
import { VscSymbolBoolean } from "react-icons/vsc";
import { TiMessageTyping } from "react-icons/ti";
import { CSSProperties } from "react";

export const questionTypeItems = (callback: (arg: string) => void) => [
  {
    label: (
      <div
        onClick={() => callback("Quiz")}
        className="the-gray mx-[8px] mt-[8px] rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center"
      >
        <MdQuiz size="30px" />
        <p className="text-black">Quiz</p>
      </div>
    ),
    key: "0",
  },
  {
    label: (
      <div
        onClick={() => callback("True or false")}
        className="the-gray mx-[8px] mt-[8px] rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center"
      >
        <VscSymbolBoolean size="30px" />
        <p className="text-black">True or False</p>
      </div>
    ),
    key: "1",
  },
  {
    label: (
      <div
        onClick={() => callback("Type answer")}
        className="the-gray mx-[8px] mt-[8px] mb-[8px] rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center"
      >
        <TiMessageTyping size="30px" />
        <p className="text-black">Type Answer</p>
      </div>
    ),
    key: "3",
  },
];

export const timeLimitItems = (callback: (arg: number) => void) => [
  {
    label: (
      <p
        onClick={() => callback(5)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        5 seconds
      </p>
    ),
    key: "1",
  },
  {
    label: (
      <p
        onClick={() => callback(10)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        10 seconds
      </p>
    ),
    key: "2",
  },
  {
    label: (
      <p
        onClick={() => callback(20)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        20 seconds
      </p>
    ),
    key: "3",
  },
  {
    label: (
      <p
        onClick={() => callback(30)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        30 seconds
      </p>
    ),
    key: "4",
  },
  {
    label: (
      <p
        onClick={() => callback(45)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        45 seconds
      </p>
    ),
    key: "5",
  },
  {
    label: (
      <p
        onClick={() => callback(60)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        1 minute
      </p>
    ),
    key: "6",
  },
  {
    label: (
      <p
        onClick={() => callback(90)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        1 minute 30 seconds
      </p>
    ),
    key: "7",
  },
  {
    label: (
      <p
        onClick={() => callback(120)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        2 minutes
      </p>
    ),
    key: "8",
  },
  {
    label: (
      <p
        onClick={() => callback(180)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px]"
      >
        3 minutes
      </p>
    ),
    key: "9",
  },
  {
    label: (
      <p
        onClick={() => callback(240)}
        className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[4px] mt-[4px] mb-[4px]"
      >
        4 minutes
      </p>
    ),
    key: "10",
  },
];

export const answerOptionsItems = (callback: (arg: string) => void) => [
  {
    label: (
      <div
        onClick={() => callback("single")}
        className="text-time-limit rounded-[4px] p-[8px] mx-[8px] mt-[8px]"
      >
        <p className="text-[18px] font-semibold text-gray">Single select</p>
        <p className="text-[12px] text-semigray">
          Players can only select one of the answers
        </p>
      </div>
    ),
    key: "1",
  },
  {
    label: (
      <div
        onClick={() => callback("multiple")}
        className="text-time-limit rounded-[4px] p-[8px] mx-[8px] mb-[8px]"
      >
        <p className="text-[18px] font-semibold text-gray">Multi-select</p>
        <p className="text-[12px] text-semigray">
          Players can select multiple answers
          <br />
          before submitting
        </p>
      </div>
    ),
    key: "2",
  },
];

export const convertSecondsToMinutes = (seconds: number) => {
  if (seconds < 0 || !Number.isInteger(seconds)) {
    return `0 seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${seconds} seconds`;
  } else if (remainingSeconds === 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${minutes} minute${
      minutes > 1 ? "s" : ""
    } ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
  }
};

export const modalVariants = {
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

export const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};