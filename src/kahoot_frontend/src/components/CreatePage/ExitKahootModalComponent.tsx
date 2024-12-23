interface Props {
  toggleModalExitKahoot: () => void;
  navigate: any;
  state: any;
}

export const ExitKahootModalComponent = ({
  toggleModalExitKahoot,
  navigate,
  state,
}: Props) => {
  return (
    <div className="relative">
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
            navigate("/profile", {
              state: {
                routerPrincipal: state.routerPrincipal,
              },
            });
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
    </div>
  );
};
