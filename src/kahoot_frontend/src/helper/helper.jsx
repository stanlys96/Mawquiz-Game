import { MdQuiz } from "react-icons/md";
import { VscSymbolBoolean } from "react-icons/vsc";
import { TiMessageTyping } from "react-icons/ti";

export const questionTypeItems = [
  {
    label: (
      <div className="the-gray mx-[8px] mt-[8px] rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center">
        <MdQuiz size="30px" />
        <p className="text-black">Quiz</p>
      </div>
    ),
    key: "0",
  },
  {
    label: (
      <div className="the-gray mx-[8px] mt-[8px] rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center">
        <VscSymbolBoolean size="30px" />
        <p className="text-black">True or False</p>
      </div>
    ),
    key: "1",
  },
  {
    label: (
      <div className="the-gray mx-[8px] mt-[8px] mb-[8px] rounded-[4px] p-[8px] flex flex-col gap-y-2 justify-center items-center">
        <TiMessageTyping size="30px" />
        <p className="text-black">Type Answer</p>
      </div>
    ),
    key: "3",
  },
];

export const timeLimitItems = [
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        5 seconds
      </p>
    ),
    key: "1",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        10 seconds
      </p>
    ),
    key: "2",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        20 seconds
      </p>
    ),
    key: "3",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        30 seconds
      </p>
    ),
    key: "4",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        45 seconds
      </p>
    ),
    key: "5",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        1 minute
      </p>
    ),
    key: "6",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        1 minute 30 seconds
      </p>
    ),
    key: "7",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        2 minutes
      </p>
    ),
    key: "8",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px]">
        3 minutes
      </p>
    ),
    key: "9",
  },
  {
    label: (
      <p className="text-time-limit p-[8px] z-100 rounded-[4px] mx-[8px] mt-[8px] mb-[8px]">
        4 minutes
      </p>
    ),
    key: "10",
  },
];

export const answerOptionsItems = [
  {
    label: (
      <div className="text-time-limit rounded-[4px] p-[8px] mx-[8px] mt-[8px]">
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
      <div className="text-time-limit rounded-[4px] p-[8px] mx-[8px] mb-[8px]">
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
