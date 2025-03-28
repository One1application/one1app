/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faTwitter,
  faFacebook,
  faTelegram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import  toast  from "react-hot-toast";
import SubscriptionPage from "./SubscriptionsPage";

// import Photo1 from "../../../assets/1.png";
// import Photo2 from "../../../assets/2.png";
// import Photo3 from "../../../assets/3.png";
// import Photo4 from "../../../assets/4.png";
// import Photo5 from "../../../assets/5.png";
// import Photo6 from "../../../assets/6.png";
import { faEarthOceania } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  registerAndGetOTP,
  verifyEnteredOTP,
} from "../../../services/auth/api.services";
import Lottie from "lottie-react";
import animation from "../../../assets/animation3.json";
import { useAuth } from "../../../context/AuthContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("instagram");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [otpScreen, setOtpScreen] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [subscriptionPage, setSubscriptionPage] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const containerRef = useRef(null);
  const heardFromRef = useRef(null);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [heardFromDropdownOpen, setHeardFromDropdownOpen] = useState(false);
  const [customHeardFrom, setCustomHeardFrom] = useState(false);

  const { verifyToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const countryCodes = ["+1", "+91", "+44", "+61"];
  const socialMediaOptions = [
    { value: "instagram", label: "Instagram", icon: faInstagram },
    { value: "twitter", label: "Twitter", icon: faTwitter },
    { value: "facebook", label: "Facebook", icon: faFacebook },
    { value: "telegram", label: "Telegram", icon: faTelegram },
    { value: "linkedin", label: "LinkedIn", icon: faLinkedin },
    { value: "website", label: "Website", icon: faEarthOceania },
  ];

  // const images = [Photo1, Photo2, Photo3, Photo4, Photo5, Photo6];

  const goals = [
    "Community Monetisation",
    "Event /webinar",
    "Course",
    "Digital product",
    "Website Api",
    "Appointment",
  ];

  const heardFromOptions = ["Facebook", "Instagram", "YouTube", "Other"];

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setFadeOut(true);
  //     setTimeout(() => {
  //       setCurrentImageIndex((prevIndex) =>
  //         prevIndex === images.length - 1 ? 0 : prevIndex + 1
  //       );
  //       setFadeOut(false);
  //     }, 300);
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, [images.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setGoalDropdownOpen(false);
      }
      if (
        heardFromRef.current &&
        !heardFromRef.current.contains(event.target)
      ) {
        setHeardFromDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    setIsLoading(true);
    try {
      const userData = {
        email,
        phoneNumber: selectedCountryCode + phoneNumber,
        username,
        role: "Creator",
        name,
        goals: selectedGoals,
        heardAboutUs: heardFrom,
        socialMedia: username,
      };
      const { data, status } = await registerAndGetOTP(userData);
      if (status === 201) {
        setOtpScreen(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    setIsOtpLoading(true);
    try {
      const enteredOtp = otp.join("");
      const { data } = await verifyEnteredOTP({
        otp: enteredOtp,
        phoneNumber: selectedCountryCode + phoneNumber,
      });
      if (data.success) {
        localStorage.setItem("AuthToken", data.token);
        toast.success("OTP verified successfully");
        await verifyToken();
        navigate("/dashboard");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
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

  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col justify-start"
      style={{
        backgroundImage:
          "url(https://d3qp9zvlyuxos1.cloudfront.net/Gradient+background.svg)",
      }}
    >
      {subscriptionPage ? (
        <SubscriptionPage />
      ) : (
        <div className="flex justify-center items-start min-h-screen pt-8">
          <div className="shadow-xl h-auto flex flex-col lg:flex-row bg-white rounded-[24px] w-full max-w-[1000px]  relative ">
            <div
              className="relative flex flex-col flex-1 lg:w-1/2 p-6 md:p-12 pb-6 rounded-tl-[24px] rounded-bl-[24px] w-full"
              style={{ paddingBottom: "24px" }}
            >
              {otpScreen ? (
                <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Verify Your Phone Number
                  </h2>
                  <p className="text-gray-500">
                    We've sent an OTP to your phone number
                  </p>

                  <div className="flex space-x-2 justify-center mt-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-input-${i}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>

                  <button
                    className="mt-6 w-[85%] bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-semibold active:bg-orange-600 transition duration-200"
                    onClick={handleOTPSubmit}
                    disabled={isOtpLoading}
                  >
                    {isOtpLoading ? "Verifying..." : "Confirm OTP"}
                  </button>

                  <p className="text-gray-600 text-sm mt-4">
                    Didn't receive the OTP?{" "}
                    <a href="#" className="text-blue-500 hover:underline">
                      Resend
                    </a>
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h2 className="text-xl md:text-xl font-bold">
                      Welcome you all on OneApp profile Creation
                    </h2>
                    <p className="text-base font-semibold text-gray-500">
                      Let's starts your New journey with OneApp{" "}
                      <span className="text-xl font-bold›">⚡️</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 w-[85%]">
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onBlur={validateName}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {nameError && (
                      <span className="text-red-500 text-xs">{nameError}</span>
                    )}

                    <div className="flex border border-gray-300 rounded mt-2.5 text-sm">
                      <select
                        className="p-2"
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
                        className="p-2 flex-1"
                      />
                    </div>
                    {phoneError && (
                      <span className="text-red-500 text-xs">{phoneError}</span>
                    )}

                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onBlur={validateEmail}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-2.5 text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {emailError && (
                      <span className="text-red-500 text-xs">{emailError}</span>
                    )}

                    <div className="flex items-center justify-start border border-gray-300 rounded-lg relative w-full mt-2.5 text-sm">
                      <button
                        type="button"
                        className="flex items-center p-2"
                        onClick={handleDropdownToggle}
                      >
                        {selectedSocialMedia ? (
                          <FontAwesomeIcon
                            icon={
                              socialMediaOptions.find(
                                (option) => option.value === selectedSocialMedia
                              )?.icon
                            }
                            className="text-xl"
                          />
                        ) : (
                          <span>Select Platform</span>
                        )}
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2.5 text-sm w-full">
                          {socialMediaOptions.map((platform) => (
                            <div
                              key={platform.value}
                              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() =>
                                handleSelectSocialMedia(platform.value)
                              }
                            >
                              <FontAwesomeIcon
                                icon={platform.icon}
                                className="mr-2"
                              />
                              {platform.label}
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="@username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 flex-1 rounded-r-lg w-[80%]"
                      />
                    </div>

                    <div className="relative mt-2.5" ref={containerRef}>
                      <button
                        type="button"
                        className="w-full p-2 border border-gray-300 rounded-lg flex justify-between items-center"
                        onClick={toggleGoalDropdown}
                      >
                        {selectedGoals.length > 0
                          ? `${selectedGoals.length} goals selected`
                          : "select goals"}
                      </button>

                      {goalDropdownOpen && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2.5 w-full">
                          {goals.map((goal) => (
                            <div
                              key={goal}
                              className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                                selectedGoals.includes(goal)
                                  ? "bg-gray-100"
                                  : ""
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

                    <div className="relative mt-2.5" ref={heardFromRef}>
                      <button
                        type="button"
                        className="w-full p-2 border border-gray-300 rounded-lg flex justify-between items-center"
                        onClick={toggleHeardFromDropdown}
                      >
                        <span>{heardFrom || "How did you hear about us?"}</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="text-gray-400"
                        />
                      </button>

                      {heardFromDropdownOpen && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2.5 w-full">
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
                        className="w-full mt-2.5 text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <button
                    className={`w-[85%] flex justify-center text-sm items-center gap-2 bg-orange-600 text-white py-2 px-4 rounded-full ${
                      !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleGetStarted}
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? "Loading..." : "Get Started"}
                  </button>

                  <p className="text-center text-gray-600 font-medium text-sm mt-2">
                    Already have an account?{" "}
                    <a href="/signin" className="text-blue-500">
                      Sign in
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-r-[24px] bg-white relative overflow-hidden">
              <Lottie
                animationData={animation}
                loop={true}
                autoplay={true}
                className="w-full h-[40em]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
