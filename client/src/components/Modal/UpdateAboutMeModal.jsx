/* eslint-disable react/prop-types */
import { Modal } from "@mui/material";

const UpdateAboutMeModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">About Me Modal</h2>
            <span
              className="cursor-pointer text-gray-500 hover:text-gray-800 transition-colors text-xl"
              onClick={handleClose}
            >
              &times;
            </span>
          </div>
          <p className="text-gray-700 text-center">manish</p>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateAboutMeModal;