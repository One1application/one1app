/* eslint-disable react/prop-types */
import { Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { X } from "lucide-react";
import {
  registerAndGetOTP,
  verifyEnteredOTP,
} from "../../services/auth/api.services";

const PaymentSignUpModel = ({
  open,
  handleClose,
  onSuccessfulSignup,
  onSwitchToSignin,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("instagram");

  const [otpScreen, setOtpScreen] = useState(false);

  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const containerRef = useRef(null);
  const heardFromRef = useRef(null);
  const countryCodes = ["+1", "+91", "+44", "+61"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        // This was previously referencing an undefined state setter
      }
      if (
        heardFromRef.current &&
        !heardFromRef.current.contains(event.target)
      ) {
        // This was previously referencing an undefined state setter
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseModal = () => {
    // Reset form
    setName("");
    setPhoneNumber("");
    setEmail("");
    setOtp("");
    setOtpScreen(false);
    handleClose();
  };

  const validateName = () => {
    if (name.trim() === "") {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleGetStarted = async () => {
    const isNameValid = validateName();
    const isPhoneValid = validatePhoneNumber();
    const isEmailValid = validateEmail();

    if (!isNameValid || !isPhoneValid || !isEmailValid) {
      toast.error("Please fix the errors");
      return;
    }

    setIsLoading(true);
    const userData = {
      email,
      phoneNumber: selectedCountryCode + phoneNumber,
      role: "User",
      name,
    };

    try {
      const { data, status } = await registerAndGetOTP(userData);
      if (status === 201) {
        setOtpScreen(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp || otp.trim() === "") {
      toast.error("Please enter the OTP");
      return;
    }

    setIsOtpLoading(true);
    try {
      console.log("Sending OTP data:", {
        otp,
        phoneNumber: selectedCountryCode + phoneNumber,
      });

      const { data } = await verifyEnteredOTP({
        otp,
        phoneNumber: selectedCountryCode + phoneNumber,
      });

      console.log("Response from OTP verification:", data);

      if (data && data.success) {
        localStorage.setItem("AuthToken", data.token);
        toast.success("Account created successfully!");
        handleCloseModal();
        if (onSuccessfulSignup) onSuccessfulSignup(data);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const isFormValid = () => {
    return name && phoneNumber && email;
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <div className="flex items-center justify-center min-h-screen p-4 md:p-0">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
            <div
              className="text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={handleCloseModal}
            >
              <X size={24} />
            </div>
          </div>
          <hr className="border-gray-300 mb-4" />

          {otpScreen ? (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="text-gray-600 mb-4">
                We've sent an OTP to your phone number. Please enter it below to
                verify your account.
              </p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <button
                onClick={handleOTPSubmit}
                disabled={isOtpLoading}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isOtpLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-gray-600 text-sm mt-2">
                Didn't receive the OTP?{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Resend
                </a>
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <p className="text-gray-600 mb-2">Create your oneapp account</p>

              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onBlur={validateName}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {nameError && (
                  <span className="text-red-500 text-xs">{nameError}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex border border-gray-300 rounded-lg">
                  <select
                    className="p-3 border-r border-gray-300 rounded-l-lg focus:outline-none"
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                  >
                    {countryCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onBlur={validatePhoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="p-3 flex-1 rounded-r-lg focus:outline-none"
                  />
                </div>
                {phoneError && (
                  <span className="text-red-500 text-xs">{phoneError}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onBlur={validateEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {emailError && (
                  <span className="text-red-500 text-xs">{emailError}</span>
                )}
              </div>

              <button
                onClick={handleGetStarted}
                className={`mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  !isFormValid() || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? "Processing..." : "Get Started"}
              </button>

              <p className="text-center text-gray-600 font-medium text-sm mt-2">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToSignin}
                  className="text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentSignUpModel;
