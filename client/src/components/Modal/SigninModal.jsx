/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal } from "@mui/material";
import  toast  from "react-hot-toast";

import { 
  Smartphone, 
  Mail, 
  X,
  Github
} from "lucide-react";
import { signInUser, verifyLoginUser } from "../../services/auth/api.services";

const SigninModal = ({ open, handleClose, onSuccessfulLogin  , onSwitchToSignup}) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isUsingEmail, setIsUsingEmail] = useState(true);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setIsPhoneNumberValid(phoneNumber.length >= 10);
  }, [phoneNumber]);

  const handleCloseModal = () => {
    // Reset form
    setEmail("");
    setPhoneNumber("");
    setOtp("");
    setShowOTPInput(false);
    handleClose();
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    const userData = isUsingEmail ? { email } : { phoneNumber };

    try {
      const { data } = await signInUser(userData);
      if (data.success) {
        toast.success(
          isUsingEmail ? "OTP Sent to Email!" : "OTP Sent to Phone Number!"
        );
        setShowOTPInput(true);
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    setIsOtpLoading(true);
    const otpData = { otp, ...(isUsingEmail ? { email } : { phoneNumber }) };
    
    try {
      const { data } = await verifyLoginUser(otpData);
      if (data.success) {
        toast.success("Signed in successfully!");
        localStorage.setItem("AuthToken", data.token);
        handleCloseModal();
        if (onSuccessfulLogin) onSuccessfulLogin(data);
      } else {
        toast.error("Invalid OTP. Please try again");
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <div className="flex items-center justify-center min-h-screen p-4 md:p-0">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
            <div
              className="text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={handleCloseModal}
            >
              <X size={24} />
            </div>
          </div>
          <hr className="border-gray-300 mb-4" />
          
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <p className="text-base text-gray-600 mb-2">
              Sign in to your oneapp account
            </p>

            {isUsingEmail ? (
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            {showOTPInput && (
              <div className="flex flex-col gap-1 w-full mt-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleOTPSubmit}
                  disabled={isOtpLoading}
                >
                  {isOtpLoading ? "Verifying..." : "Submit OTP"}
                </button>
              </div>
            )}

            {!showOTPInput && (
              <button
                className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  (isUsingEmail && !isEmailValid) ||
                  (!isUsingEmail && !isPhoneNumberValid) ||
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  (isUsingEmail && !isEmailValid) ||
                  (!isUsingEmail && !isPhoneNumberValid) ||
                  isLoading
                }
                onClick={handleSendOTP}
              >
                {isLoading ? "Sending..." : isUsingEmail ? "Send OTP to Email" : "Send OTP to Phone"}
              </button>
            )}

            <div className="flex items-center justify-between w-full mt-2 mb-2">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-3 text-sm text-gray-500">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <button
              className="w-full flex justify-center items-center gap-2 text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              onClick={() => {
                setIsUsingEmail(!isUsingEmail);
                setShowOTPInput(false);
              }}
            >
              {isUsingEmail ? <Smartphone size={20} /> : <Mail size={20} />}
              Continue with {isUsingEmail ? "Phone Number" : "Email"}
            </button>

            <button className="w-full flex justify-center items-center gap-2 text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300">
              <Github size={20} />
              Continue with Google
            </button>

            <p className="text-center text-gray-600 font-medium text-sm mt-4">
              Don't have an account?{" "}
              <button onClick={onSwitchToSignup} className="text-blue-500">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SigninModal;
