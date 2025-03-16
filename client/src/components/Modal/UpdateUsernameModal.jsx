/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { toast } from "react-toastify";

const UpdateUsernameModal = ({ open, handleClose, label, value, onSave }) => {
  const [tempValue, setTempValue] = useState(value);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const correctOtp = "000000";

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleCloseModal = () => {
    setIsOtpSent(false);
    setOtpValue("");
    handleClose();
  };

  const handleSave = () => {
    // Simulate sending OTP
    fakeApiCallToSendOtp().then(() => {
      setIsOtpSent(true);
      toast.success("OTP has been sent!");
    });
  };

  const handleOtpSubmit = () => {
    if (otpValue === correctOtp) {
      onSave(tempValue); // Pass the updated username back to the parent
      handleCloseModal();
      toast.success("Username updated successfully!");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const fakeApiCallToSendOtp = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <div className="flex items-center justify-center min-h-screen p-4 md:p-0">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{label}</h1>
            <div
              className="text-gray-500 cursor-pointer text-xl hover:text-gray-800 transition-colors"
              onClick={handleCloseModal}
            >
              &times;
            </div>
          </div>
          <hr className="border-gray-300 mb-4" />

          <div className="mb-6">
            <span className="block text-sm text-gray-700 mb-4">Changing your username will change your site’s URL - including oneapp and the dashboard your customers access after a purchase. We recommend not doing this unless it’s extremely important for you.</span>
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your new username"
            />
            <span className="text-xs">Usernames can contain letters, numbers and hyphens.</span>
          </div>

          {isOtpSent && (
            <div className="mb-6">
              <span className="block text-gray-700 mb-2">Enter OTP</span>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter OTP"
              />
              <button
                onClick={handleOtpSubmit}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Submit OTP
              </button>
            </div>
          )}

          {!isOtpSent && (
            <button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Verify and update your username
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UpdateUsernameModal;
