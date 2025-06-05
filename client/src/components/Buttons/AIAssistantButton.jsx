import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { useEffect } from "react";

const AIAssistantButton = ({ cooldown, time }) => {
  useEffect(() => {}, [cooldown, time]);
  return (
    <motion.button
      className=" z-[100] flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white shadow-lg hover:shadow-xl"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      disabled={time}
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Bot size={20} />
      </motion.div>
      <span className="font-medium">
        {cooldown ? `${time} seconds` : "Ask me"}
      </span>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <Sparkles size={16} className="text-yellow-300" />
      </motion.div>
    </motion.button>
  );
};

export default AIAssistantButton;
