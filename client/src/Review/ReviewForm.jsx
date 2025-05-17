import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { writeReview } from "../services/auth/api.services.js";
import toast from "react-hot-toast";

const ReviewForm = () => {
  const { userDetails } = useAuth();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    if (!review) {
      toast.error("write a review");
      return;
    }

    setIsSubmitting(true);

    await writeReview({
      rating,
      review,
      userId: userDetails?.id,
      role: userDetails?.role,
      username: userDetails?.name,
      userimage:
        userDetails?.image ||
        `https://api.dicebear.com/6.x/personas/svg?seed=${encodeURIComponent(
          userDetails?.name
        )}`,
    });

    setRating(0);
    setReview("");

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        className="w-full max-w-lg bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl" />

        {submitted ? (
          <motion.div
            className="text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-white">Thank You!</h3>
            <p className="text-gray-300 text-base mt-2">
              Your review has been submitted.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-1">
                Rate Your Experience
              </h3>
              <p className="text-gray-400">
                How would you rate your experience?
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-4xl focus:outline-none"
                  >
                    <motion.span
                      className={`${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
                          : "text-gray-500"
                      }`}
                      animate={{
                        scale:
                          (hoverRating || rating) >= star ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {(hoverRating || rating) >= star ? "★" : "☆"}
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 text-base bg-gray-700/50 border border-gray-600/50 rounded-xl transition-all duration-300 text-white placeholder-gray-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Tell us about your experience..."
              />
            </motion.div>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3 px-6 text-base font-medium rounded-xl transition-all duration-300 flex items-center justify-center ${
                  rating === 0
                    ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30"
                }`}
                whileHover={rating === 0 ? {} : { scale: 1.02 }}
                whileTap={rating === 0 ? {} : { scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </motion.button>
            </motion.div>

            {rating === 0 && (
              <motion.p
                className="text-center text-sm text-amber-400 mt-3"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Please select a rating to submit.
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewForm;
