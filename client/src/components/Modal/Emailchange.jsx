import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateUserProfile } from "../../services/auth/api.services.js";
import toast from "react-hot-toast";

const Emailchange = ({ email, onClose }) => {
  const { userDetails } = useAuth();
  const [close, setClose] = useState(false);
  const [data, setData] = useState({
    email: email,
    otp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setData((prev) => ({ ...prev, email }));
  }, [email, onclose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await updateUserProfile(data);
      setData((prev) => ({ ...prev, otp: "" }));
      const message = res?.response?.data?.message;

      if (message === "Invalid OTP") {
        toast.error(message);
        return;
      }

      if (message === "OTP Expired") {
        toast.error(message);
        return;
      }

      if (res?.data?.success) {
        toast.success("Email changed successfully!");
        setSuccess(true);
        setClose(true);
        return;
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidOtp = data.otp.length === 6;

  if (close) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-orange-400"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 transition-colors"
      >
        <X size={20} onClick={() => setClose(true)} />
      </button>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600 mt-1">
          Enter the 6-digit code sent to {userDetails?.email}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={data.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setData({ ...data, otp: value });
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
            <AnimatePresence>
              {data.otp.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-3 top-3"
                >
                  {isValidOtp ? (
                    <Check className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-orange-500" size={20} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {data.otp.length > 0 && !isValidOtp && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-orange-500 mt-1"
            >
              OTP must be 6 digits
            </motion.p>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start"
            >
              <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={!isValidOtp || isSubmitting}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isValidOtp
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block"
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              </motion.span>
            </span>
          ) : success ? (
            <span className="flex items-center justify-center">
              <Check className="mr-2" size={18} /> Verified!
            </span>
          ) : (
            "Verify Email"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Emailchange;
