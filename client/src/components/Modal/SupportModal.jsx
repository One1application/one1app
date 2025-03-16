/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal } from "@mui/material";
import { toast } from 'react-toastify';

const SupportModal = ({ open, handleClose,value,label, onSave }) => {
  console.log(label, value);
  
  const [tempValue, setTempValue] = useState(value);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const correctOtp = "000000";

  useEffect(() => {
    if (open) {
      setTempValue("");
      setIsOtpSent(false); 
      setOtpValue(""); 
    }
  }, [open]);

  const handleCloseModal = () => {
    setIsOtpSent(false);
    setOtpValue("");
    handleClose();
  };

  const handleSendOtp = () => {
    // Simulate sending OTP (replace with your actual API call)
    fakeApiCallToSendOtp().then(() => {
      setIsOtpSent(true);
      toast.success("OTP has been sent !");
    });
  };

  const handleOtpSubmit = () => {
    if (otpValue === correctOtp) {
      onSave(tempValue);
      handleCloseModal(); // Close modal after successful submission
      toast.success("Updated successfully!");
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
            <h1 className="text-2xl font-bold text-gray-800">Enter your support {label}</h1>
            <div
              className="text-gray-500 cursor-pointer text-xl hover:text-gray-800 transition-colors"
              onClick={handleCloseModal}
            >
              &times;
            </div>
          </div>
          <hr className="border-gray-300 mb-4" />

          {/* Email Input Field */}
          <div className="mb-6">
            <input
              type="email"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Support Email"
            />
          </div>

          {/* Send OTP Button */}
          {!isOtpSent ? (
            <button
              onClick={handleSendOtp}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Send OTP
            </button>
          ) : (
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
        </div>
      </div>
    </Modal>
  );
};

export default SupportModal;
