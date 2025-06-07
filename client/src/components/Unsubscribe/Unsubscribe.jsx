import {  useState } from "react";
import { motion } from "framer-motion";
import { MailX, Sparkles } from "lucide-react";
 
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { unSubscribeNewsLetter } from "../../services/auth/api.services.js";

function Unsubscribe() {
  
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email } = useParams();

  if (!email) {
    toast.error("Email not found");
  }

  

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      unSubscribeNewsLetter(email.trim());
      setUnsubscribed(true);
    } catch (error) {
      console.error("Unsubscribe failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 10 + 5 + "px",
                height: Math.random() * 10 + 5 + "px",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative z-10"
      >
        <motion.img
          src="https://cdn.discordapp.com/attachments/1368862317877530684/1373680257604915311/App_Icon__2_-removebg-preview.png?ex=682d452f&is=682bf3af&hm=e6f65a7ba97c7dcd68d784690a9598f7f61534bc0b5aafc35aa3d8b57e7025cd&"
          alt="App Logo"
          className="w-16 h-16 mx-auto absolute -top-8 left-1/2 -translate-x-1/2 rounded-full shadow-lg bg-white p-1 border-2 border-white/20"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        <div className="flex items-center justify-center gap-2 text-white mt-10">
          <MailX className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Unsubscribe from Newsletter</h1>
        </div>

        {!unsubscribed ? (
          <>
            <p className="mt-4 text-white/80">
              We're sad to see you go. Are you sure you want to unsubscribe?
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6"
            >
              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
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
                    Unsubscribing...
                  </span>
                ) : (
                  "Yes, Unsubscribe me"
                )}
              </button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-6"
          >
            <div className="text-emerald-300 font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Successfully unsubscribed!
            </div>
            <p className="mt-4 text-white/80 italic">"A warm goodbye and best wishes ahead."</p>
            <p className="mt-2 text-white/80">
              Thank you for being with us. We hope to cross paths again. 💖
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Unsubscribe;
