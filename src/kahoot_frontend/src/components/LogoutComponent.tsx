interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export const LogoutComponent = ({ onClose, onLogout }: Props) => {
  return (
    <div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-black">Logout</h2>
      <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
      <div className="flex gap-x-2 items-center justify-center">
        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
        <button onClick={onLogout} className="delete-modal-btn">
          Logout
        </button>
      </div>
    </div>
  );
};
