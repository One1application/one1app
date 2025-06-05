import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register, userRegistration } from "../../Apicalls/authApis.js";
import toast from "react-hot-toast";
import { emailValidator } from "../../utils/validateEmail.js";
const Signup = () => {
  const [countryCode, setCountryCode] = useState("+91");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "User",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: userDetails?.name,
      email: userDetails?.email,
      phoneNumber: countryCode + userDetails?.phoneNumber,
      role: userDetails?.role,
    };

    if (!emailValidator(userDetails?.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (userDetails?.phoneNumber?.length !== 10) {
      toast.error("Please enter a 10-digit phone number.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Register(data);

      if (!response.success) {
        toast.error(response.data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      toast.success("OTP sent! Redirecting...");
      setTimeout(() => {
        setIsLoading(false);
        setRegistrationSuccess(true);
      }, 1000);
    } catch (error) {
      toast.error("Unexpected error during registration.");
      console.error("Registration failed:", error);
      setIsLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    console.log("OTP submitted:", enteredOtp);
    setOtpError("");

    const otpdata = {
      otp: otp.join(""),
      phoneNumber: countryCode + userDetails?.phoneNumber,
    };

    const response = await userRegistration(otpdata);
    console.log(response);
    if (response?.data?.message !== "User verified successfully") {
      toast.error(response?.data?.message);
      return;
    }
    setIsLoading(true);

    toast.success(response?.data?.message);
    localStorage.setItem("AuthToken", response?.data?.token);

    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 min-h-[550px]">
        {/* Left Side - Form */}
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src="https://cdn.discordapp.com/attachments/1368862317877530684/1373680257604915311/App_Icon__2_-removebg-preview.png?ex=6837d12f&is=68367faf&hm=38ad802cc3edf3ff928ed96fe4bf3fd171a2470b0f395ad99994405176e46b39&"
                  alt="Logo"
                  className="h-16 w-auto"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {registrationSuccess ? "Verify Your Email" : "Join Us Today"}
              </h1>
              <p className="text-gray-600 text-sm">
                {registrationSuccess
                  ? `We've sent a verification code to ${
                      countryCode + userDetails?.phoneNumber
                    }`
                  : "Create your account and get started on your journey"}
              </p>
            </div>

            {!registrationSuccess ? (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={userDetails.name}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm"
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      +91
                    </span>

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={userDetails.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10); // Allow only digits
                        setUserDetails({ ...userDetails, phoneNumber: value });
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

                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${
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
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-xs">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              /* OTP Verification Form */
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-6">
                    Enter the 6-digit code sent to your Phone Number
                  </p>

                  <div className="flex justify-center space-x-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-14 h-14 text-center text-xl font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="mt-2 text-sm text-red-500">{otpError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${
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
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-xs">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side - Animation/Illustration */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-6 lg:p-8 hidden lg:flex">
          <div className="text-center">
            {/* Animated Geometric Shapes */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-30 animate-ping"></div>
              <div className="absolute inset-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-40"></div>

              {/* Central Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-6 shadow-xl">
                  <svg
                    className={`w-12 h-12 ${
                      registrationSuccess ? "text-green-500" : "text-orange-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {registrationSuccess ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-3 right-3 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
              <div
                className="absolute bottom-6 left-6 w-4 h-4 bg-red-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-12 left-3 w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {registrationSuccess ? "Almost There!" : "Welcome Aboard!"}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {registrationSuccess
                  ? "Just one more step to complete your registration. Check your email for the verification code."
                  : "Join thousands of users who trust us with their journey. Start your adventure today!"}
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="text-center p-2">
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
                  <p className="text-xs font-medium text-gray-700">Secure</p>
                </div>
                <div className="text-center p-2">
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
                  <p className="text-xs font-medium text-gray-700">Fast</p>
                </div>
                <div className="text-center p-2">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Loved</p>
                </div>
                <div className="text-center p-2">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
