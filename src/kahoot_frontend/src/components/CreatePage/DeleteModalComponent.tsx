interface Props {
  toggleModalJiggle: () => void;
  quizData: any;
  flexibleClickedQuizIndex: number;
  handleDeleteQuizModal: () => void;
}

export const DeleteModalComponent = ({
  toggleModalJiggle,
  quizData,
  flexibleClickedQuizIndex,
  handleDeleteQuizModal,
}: Props) => {
  return (
    <div className="relative">
      <button
        onClick={toggleModalJiggle}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-black">
        Delete {quizData?.[flexibleClickedQuizIndex]?.questionType} question
      </h2>
      <p className="text-gray-600 mb-4">
        Are you sure you want to delete this question? This action can’t be
        undone.
      </p>
      <div className="flex gap-x-2 items-center justify-center">
        <button onClick={toggleModalJiggle} className="cancel-btn">
          Cancel
        </button>
        <button onClick={handleDeleteQuizModal} className="delete-modal-btn">
          Delete
        </button>
      </div>
    </div>
  );
};
