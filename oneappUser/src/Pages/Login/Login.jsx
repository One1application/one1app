import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { userLogin, verifyLogin } from "../../Apicalls/authApis.js";
import toast from "react-hot-toast";
import logo from "../../assets/logo.webp";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loginMethod, setLoginMethod] = useState("phone");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (phoneNumber.length !== 10) {
      toast.error("Please enter a 10-digit phone number.");
      setIsLoading(false);
      return;
    }

    const formattedPhoneNumber = `+91${phoneNumber}`;
    const response = await userLogin({ phoneNumber: formattedPhoneNumber });
    if (!response.success) {
      toast.error(response.data.message || "login failed");
      setIsLoading(false);
      return;
    }

    toast.success("OTP sent! Redirecting...");
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpScreen(true);
    }, 1500);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const response = await userLogin({ email });
    if (!response.success) {
      toast.error(response.data.message || "login failed");
      setIsLoading(false);
      return;
    }

    toast.success("OTP sent! Redirecting...");
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpScreen(true);
    }, 1500);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const enteredOtp = {
      otp: otp.join(""),
      ...(loginMethod === "phone"
        ? { phoneNumber: `+91${phoneNumber}` }
        : { email }),
    };

    try {
      const response = await verifyLogin(enteredOtp);
      if (!response.success) {
        toast.error(response.data?.message || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("AuthToken", response.data.token);

      window.location.href = "/dashboard";
      
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input field
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const navigateToSignup = () => {
    navigate("/signup");
  };

  if (showOtpScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
        {/* OTP Verification Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl lg:max-w-4xl grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
        >
          {/* Left Side - OTP Form */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <div className="w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img src={logo} alt="Logo" className="h-16 w-auto" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Verify OTP
                </h1>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to{" "}
                  {loginMethod === "phone" ? `+91${phoneNumber}` : email}
                </p>
              </div>

              {/* OTP Form */}
              <div className="space-y-4">
                <motion.div
                  className="flex justify-center space-x-2 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  ))}
                </motion.div>

                <motion.button
                  onClick={handleOtpSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold text-md shadow-md hover:shadow-lg ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-orange-600 hover:to-red-600"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </motion.button>

                <div className="text-center space-y-2 text-sm">
                  <motion.button
                    onClick={() => setShowOtpScreen(false)}
                    whileHover={{ scale: 1.05 }}
                    className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-colors"
                  >
                    Change {loginMethod === "phone" ? "Number" : "Email"}
                  </motion.button>
                  <p className="text-gray-600">
                    Didn't receive code?{" "}
                    <button className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-colors">
                      Resend
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Animation */}
          <div className="hidden lg:flex bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-6">
            <div className="text-center">
              {/* Animated Security Icon */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative w-64 h-64 mx-auto mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-30 animate-ping"></div>
                <div className="absolute inset-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-40"></div>

                {/* Central Lightning Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 2,
                    }}
                    className="bg-white rounded-full p-6 shadow-xl"
                  >
                    <div className="text-4xl text-orange-500">⚡</div>
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-3 right-3 w-3 h-3 bg-orange-400 rounded-full"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-6 left-6 w-5 h-5 bg-red-400 rounded-full"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.5,
                  }}
                ></motion.div>
                <motion.div
                  className="absolute top-12 left-3 w-2 h-2 bg-pink-400 rounded-full"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1,
                  }}
                ></motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  Secure Verification
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your security is our priority.
                  <br />
                  Please verify your identity.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md md:max-w-2xl lg:max-w-4xl grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
      >
        {/* Left Side - Login Form */}
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img src={logo} alt="Logo" className="h-16 w-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in with your{" "}
                {loginMethod === "phone" ? "phone number" : "email"}
              </p>
            </div>

            {/* Login Method Toggle */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    loginMethod === "phone"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    loginMethod === "email"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Email
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                {loginMethod === "phone" ? (
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        +91
                      </span>

                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setPhoneNumber(value);
                        }}
                        className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm"
                        required
                      />

                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm"
                        required
                      />

                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.button
                onClick={
                  loginMethod === "phone"
                    ? handlePhoneSubmit
                    : handleEmailSubmit
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold text-md shadow-md hover:shadow-lg ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-orange-600 hover:to-red-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending OTP...
                  </div>
                ) : (
                  "Get OTP"
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex bg-gradient-to-br from-orange-50 to-red-50 items-center justify-center p-6">
          <div className="text-center">
            {/* Animated Login Illustration hai apna bhaii yoo malik */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative w-64 h-64 mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-30 animate-ping"></div>
              <div className="absolute inset-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-40"></div>

              {/* Central Lightning Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                  }}
                  className="bg-white rounded-full p-6 shadow-xl"
                >
                  <div className="text-4xl text-orange-500">⚡</div>
                </motion.div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-3 right-3 w-3 h-3 bg-orange-400 rounded-full"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              ></motion.div>
              <motion.div
                className="absolute bottom-6 left-6 w-5 h-5 bg-red-400 rounded-full"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 0.5,
                }}
              ></motion.div>
              <motion.div
                className="absolute top-12 left-3 w-2 h-2 bg-pink-400 rounded-full"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1,
                }}
              ></motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-3"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome Back!
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Continue your journey with us.
                <br />
                Quick and secure login!
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <motion.div whileHover={{ y: -3 }} className="text-center p-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Secure</p>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="text-center p-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Fast</p>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="text-center p-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg
                      className="w-5 h-5 text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Mobile</p>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className="text-center p-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Easy</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
