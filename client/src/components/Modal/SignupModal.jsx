/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Modal } from "@mui/material";
import { toast } from 'react-toastify';
import { 
  ChevronDown, 
  Instagram, 
  Twitter, 
  Facebook, 
  MessageSquare, 
  Linkedin, 
  Globe,
  X 
} from "lucide-react";
import { registerAndGetOTP, verifyEnteredOTP } from "../../services/auth/api.services";

const SignupModal = ({ open, handleClose, onSuccessfulSignup, onSwitchToSignin }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("instagram");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [heardFromDropdownOpen, setHeardFromDropdownOpen] = useState(false);
  const [otpScreen, setOtpScreen] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [customHeardFrom, setCustomHeardFrom] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const containerRef = useRef(null);
  const heardFromRef = useRef(null);
  const countryCodes = ["+1", "+91", "+44", "+61"];
  
  const socialMediaOptions = [
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "twitter", label: "Twitter", icon: Twitter },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "telegram", label: "Telegram", icon: MessageSquare },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "website", label: "Website", icon: Globe },
  ];

  const goals = [
    "Community Monetisation",
    "Event /webinar",
    "Course",
    "Digital product",
    "Website Api",
    "Appointment",
  ];

  const heardFromOptions = ["Facebook", "Instagram", "YouTube", "Other"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setGoalDropdownOpen(false);
      }
      if (heardFromRef.current && !heardFromRef.current.contains(event.target)) {
        setHeardFromDropdownOpen(false);
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
    setUsername("");
    setHeardFrom("");
    setSelectedGoals([]);
    setOtp("");
    setOtpScreen(false);
    handleClose();
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectSocialMedia = (platform) => {
    setSelectedSocialMedia(platform);
    setDropdownOpen(false);
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
    
    const userData = {
      email,
      phoneNumber: selectedCountryCode + phoneNumber,
      username,
      role: "User",
      name,
      goals: selectedGoals,
      heardAboutUs: heardFrom,
      socialMedia: username,
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
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const { data } = await verifyEnteredOTP({
        otp,
        phoneNumber: selectedCountryCode + phoneNumber,
      });
      
      if (data.success) {
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
    }
  };

  const handleGoalToggle = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleGoalDropdown = () => {
    setGoalDropdownOpen((prev) => !prev);
  };

  const toggleHeardFromDropdown = () => {
    setHeardFromDropdownOpen((prev) => !prev);
  };

  const handleHeardFromSelection = (option) => {
    if (option === "Other") {
      setCustomHeardFrom(true);
      setHeardFrom("");
    } else {
      setCustomHeardFrom(false);
      setHeardFrom(option);
    }
    setHeardFromDropdownOpen(false);
  };

  const isFormValid = () => {
    return (
      name &&
      phoneNumber &&
      email &&
      username &&
      selectedGoals.length > 0 &&
      heardFrom
    );
  };

  // Helper function to render the selected social media icon
  const renderSocialIcon = () => {
    const option = socialMediaOptions.find(opt => opt.value === selectedSocialMedia);
    if (!option) return null;
    
    const IconComponent = option.icon;
    return <IconComponent size={20} />;
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
                We've sent an OTP to your phone number. Please enter it below to verify your account.
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
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Verify OTP
              </button>
              
              <p className="text-gray-600 text-sm mt-2">
                Didn't receive the OTP? <a href="#" className="text-blue-500 hover:underline">Resend</a>
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <p className="text-gray-600 mb-2">
                Create your oneapp account
              </p>
              
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

              <div className="flex flex-col gap-1">
                <div className="flex items-center border border-gray-300 rounded-lg relative">
                  <button
                    type="button"
                    className="flex items-center p-3 border-r border-gray-300"
                    onClick={handleDropdownToggle}
                  >
                    {selectedSocialMedia ? renderSocialIcon() : <span>Select</span>}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-12 left-0 w-36">
                      {socialMediaOptions.map((platform) => {
                        const IconComponent = platform.icon;
                        return (
                          <div
                            key={platform.value}
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectSocialMedia(platform.value)}
                          >
                            <IconComponent size={16} className="mr-2" />
                            {platform.label}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="@username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-3 flex-1 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1" ref={containerRef}>
                <button
                  type="button"
                  className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center"
                  onClick={toggleGoalDropdown}
                >
                  <span>
                    {selectedGoals.length > 0
                      ? `${selectedGoals.length} goals selected`
                      : "Select goals"}
                  </span>
                  <ChevronDown size={20} />
                </button>

                {goalDropdownOpen && (
                  <div className="bg-white border border-gray-300 rounded-lg shadow-md mt-1 absolute z-10 w-[calc(100%-3rem)]">
                    {goals.map((goal) => (
                      <div
                        key={goal}
                        className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                          selectedGoals.includes(goal) ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleGoalToggle(goal)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedGoals.includes(goal)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {goal}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1" ref={heardFromRef}>
                <button
                  type="button"
                  className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center"
                  onClick={toggleHeardFromDropdown}
                >
                  <span>{heardFrom || "How did you hear about us?"}</span>
                  <ChevronDown size={20} />
                </button>

                {heardFromDropdownOpen && (
                  <div className="bg-white border border-gray-300 rounded-lg shadow-md mt-1 absolute z-10 w-[calc(100%-3rem)]">
                    {heardFromOptions.map((option) => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleHeardFromSelection(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {customHeardFrom && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={heardFrom}
                  onChange={(e) => setHeardFrom(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}

              <button
                onClick={handleGetStarted}
                className={`mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 w-full rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid()}
              >
                Get Started
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

export default SignupModal; 