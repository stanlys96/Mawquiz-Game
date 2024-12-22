import { MdQuiz } from "react-icons/md";
import { VscSymbolBoolean } from "react-icons/vsc";
import { TiMessageTyping } from "react-icons/ti";
import { CSSProperties } from "react";
import { Question } from "../../../declarations/kahoot_backend/kahoot_backend.did";
import axios from "axios";
import { io } from "socket.io-client";

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

export function generateRandomString(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export const checkQuizData = (
  quizData: Question[]
): { index: number; messages: string[] }[] => {
  const result = [];
  for (let i = 0; i < quizData?.length; i++) {
    const quiz = quizData[i];
    const messages = [];
    if (!quiz?.question?.trim()) {
      messages.push("Question missing");
    }
    if (quiz?.questionType === "Quiz") {
      let numberMissing = 0;
      if (!quiz?.text1?.trim()) {
        numberMissing++;
      }
      if (!quiz?.text2?.trim()) {
        numberMissing++;
      }
      if (numberMissing > 0) {
        messages.push(`${numberMissing} answers missing`);
      }
      if (
        !quiz?.answer1Clicked &&
        !quiz?.answer2Clicked &&
        !quiz?.answer3Clicked &&
        !quiz?.answer4Clicked
      ) {
        messages.push("Correct answer not selected");
      }
    } else if (quiz?.questionType === "True or false") {
      if (!quiz?.trueOrFalseAnswer) {
        messages.push("Correct answer not selected");
      }
    } else if (quiz?.questionType === "Type answer") {
      if (!quiz?.text1) {
        messages.push("1 answer missing");
      }
    }
    if (messages.length > 0) {
      result.push({ index: i, messages });
    }
  }
  return result;
};

export const getCurrentFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

export const uploadImageToIPFS = async (imageFile: any) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post(
      `https://mawquiz-backend-production.up.railway.app/pinFileToIPFS`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (e) {
    console.log(e);
  }
};

let socket: any;
export const getSocket = () => {
  if (!socket) {
    socket = io("https://mawquiz-backend-production.up.railway.app/", {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const getScoreLeaderboardHeight = (allScores: any, answer: number) => {
  try {
    if (!Array.isArray(allScores) || allScores.length === 0) return "0"; // Handle invalid or empty input

    let totalCount = 0;
    for (let i = 0; i < allScores.length; i++) {
      if (allScores[i]?.answer?.toString() === answer?.toString()) {
        totalCount++;
      }
    }

    const percentage = (totalCount / allScores.length) * 100;

    return percentage.toFixed(2);
  } catch (e) {
    console.error("Error calculating star ratings width:", e);
    return "0";
  }
};

export const getOrdinalSuffix = (number: number): string => {
  if (number % 100 >= 11 && number % 100 <= 13) {
    return `${number}th`;
  }

  switch (number % 10) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
};

export const getUserNickname = (
  nickname: string,
  principal: string
): string => {
  return nickname
    ? nickname?.length > 20
      ? nickname?.slice(0, 20) + "..."
      : nickname ?? ""
    : principal?.slice(0, 20) + "...";
};
