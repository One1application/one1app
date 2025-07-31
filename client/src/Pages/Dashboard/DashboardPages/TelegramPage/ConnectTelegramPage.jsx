import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animation from "../../../../assets/connecting.json";
import TelegramHeader from "./TelegramHeader";
import { motion } from "framer-motion";
import {
  Shield,
  Key,
  MessageSquare,
  Lock,
  Zap,
  Phone,
  AlertCircle,
  Mail,
  RotateCw,
} from "lucide-react";
import {
  sendTelegramLoginCode,
  signInTelegramClient,
  fetchOwnedGroups,
} from "../../../../services/auth/api.services.js";
import toast from "react-hot-toast";

const ConnectTelegramPage = ({ onAuthenticated }) => {
  const [step, setStep] = useState(0);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [loginSessionString, setLoginSessionString] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [finalSessionString, setFinalSessionString] = useState("");
  const otpInputRefs = useRef([]);

  const float = {
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      otpInputRefs.current[index + 1].focus();
    }

    // Use newOtp directly instead of outdated state
    if (index === 4 && value && newOtp.every((digit) => digit !== "")) {
      handleVerifyCode(newOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleConnectClick = () => {
    setStep(1);
  };

  const handleSendCode = async () => {
    if (!mobileNumber) return;
    setSendingCode(true);
    try {
      const res = await sendTelegramLoginCode(`+91 ${mobileNumber}`);
      setPhoneCodeHash(res.data.payload.phoneCodeHash);
      setLoginSessionString(res.data.payload.sessionString);

      toast.success("Code sent");
      setStep(2);
    } catch {
      toast.error("Failed to send code");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (code) => {
    const fullOtp = code.join("");
    if (!fullOtp) {
      toast.error("Please enter the verification code.");
      return;
    }
    setVerifyingCode(true);

    try {
      const response = await signInTelegramClient({
        phoneNumber: `91 ${mobileNumber}`,
        phoneCodeHash,
        code: fullOtp,
        sessionString: loginSessionString,
      });
      if (response.data.success && response.data.sessionString) {
        setFinalSessionString(response.data.sessionString);
        localStorage.setItem('telegramSession', response.data.sessionString);
        toast.success("Successfully logged in to Telegram!");
        // Notify parent component that authentication is complete
        if (onAuthenticated) {
          onAuthenticated();
        }
        // Refresh the page to show the authenticated state
        window.location.reload();
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      const errorMessage =
        error.response?.data?.message || "Verification failed.";
      toast.error(errorMessage);
      if (errorMessage.includes("PHONE_CODE_EXPIRED")) {
        setStep(1);
        setPhoneCodeHash("");
        setLoginSessionString("");
      }
    } finally {
      setVerifyingCode(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Main Card */}
      <div className="w-2/3 h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relative z-10">
        <TelegramHeader />

        <div className="py-8 px-4 sm:px-8 max-w-md mx-auto relative overflow-hidden">
          {/* Floating decorative icons */}
          <motion.div
            className="absolute top-20 left-10 text-orange-400 opacity-20"
            variants={float}
            animate="float"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10 text-orange-300 opacity-20"
            variants={float}
            animate="float"
          >
            <Key className="w-8 h-8" />
          </motion.div>

          <motion.div
            className="relative z-10"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {step === 0 && (
              <motion.div
                className="flex flex-col items-center"
                variants={container}
              >
                <div className="mb-8 text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mb-4"
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                  >
                    <MessageSquare className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.p
                    className="text-gray-400 mb-6 px-4"
                    variants={item}
                  >
                    Securely connect your Telegram account to access premium
                    features on OneApp
                  </motion.p>
                </div>

                <motion.button
                  onClick={handleConnectClick}
                  className="w-full sm:w-3/4 py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  variants={item}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect Accounts
                </motion.button>

                <motion.div
                  className="mt-6 text-xs text-gray-500 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4"
                  variants={item}
                >
                  <motion.span
                    className="flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    End-to-end encrypted
                  </motion.span>
                  <motion.span
                    className="flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Instant setup
                  </motion.span>
                </motion.div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                className="flex flex-col items-center"
                variants={container}
              >
                <div className="mb-8 text-center">
                  <motion.div
                    className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700"
                    variants={item}
                    whileHover={{ rotate: 10 }}
                  >
                    <Phone className="w-6 h-6 text-orange-500" />
                  </motion.div>
                  <motion.p
                    className="text-gray-400 mb-6 px-4"
                    variants={item}
                  >
                    Enter your Telegram mobile number to receive a
                    verification code
                  </motion.p>
                </div>

                <div className="w-full sm:w-3/4 space-y-4">
                  <motion.div className="relative" variants={item}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-300">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Mobile number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                    />
                  </motion.div>
                  {error && (
                    <motion.div
                      className="text-red-400 text-sm flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </motion.div>
                  )}
                  <motion.button
                    onClick={handleSendCode}
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                    variants={item}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sendingCode ? "Sending" : "Send OTP"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                className="flex flex-col items-center"
                variants={container}
              >
                <div className="mb-8 text-center">
                  <motion.div
                    className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700"
                    variants={item}
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                  >
                    <Mail className="w-6 h-6 text-orange-500" />
                  </motion.div>
                  <motion.p className="text-gray-400" variants={item}>
                    Enter the 6-digit code sent to
                  </motion.p>
                  <motion.p
                    className="text-orange-400 font-medium mt-1"
                    variants={item}
                    animate={{
                      scale: [1, 1.05, 1],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                  >
                    +91 ••• ••• {mobileNumber.slice(-4)}
                  </motion.p>
                </div>

                <div className="w-full sm:w-3/4 space-y-4">
                  <motion.div
                    className="flex justify-center space-x-3"
                    variants={item}
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <motion.input
                        key={index}
                        style={{
                          color: "white",
                        }}
                        type="tel"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        className="w-12 h-12 text-center text-xl bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                        whileFocus={{ scale: 1.05 }}
                        variants={item}
                        transition={{ delay: index * 0.1 }}
                      />
                    ))}
                  </motion.div>

                  {error && (
                    <motion.div
                      className="text-red-400 text-sm flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    disabled={
                      verifyingCode || otp.some((digit) => digit === "")
                    }
                    className={`w-full py-3 px-6 text-white font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${verifyingCode || otp.some((digit) => digit === "")
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                      }`}
                    variants={item}
                    whileTap={{ scale: verifyingCode ? 1 : 0.98 }}
                  >
                    {verifyingCode ? (
                      <div className="flex items-center justify-center">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        </motion.span>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Continue"
                    )}
                  </motion.button>

                  <motion.div
                    className="text-center pt-4 border-t border-gray-700"
                    variants={item}
                  >
                    <p className="text-gray-500 text-sm">
                      {countdown > 0 ? (
                        <span>
                          Resend code in{" "}
                          <span className="text-orange-400">
                            {countdown}s
                          </span>
                        </span>
                      ) : (
                        <button
                          className="text-orange-400 hover:text-orange-300 transition-colors flex items-center justify-center mx-auto"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Resend Verification Code
                        </button>
                      )}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        {/* Card Footer */}
        <div className="bg-gray-850 py-4 px-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} COHTPL •
            <a
              href="#"
              className="text-orange-500 hover:text-orange-300 transition-colors mx-1"
            >
              Privacy Policy
            </a>{" "}
            •
            <a
              href="#"
              className="text-orange-500 hover:text-orange-300 transition-colors mx-1"
            >
              Terms
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectTelegramPage;
