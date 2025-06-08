import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const CoolLoader = ({ size = "default" }) => {
  const sizes = {
    small: { icon: 12, text: "xs" },
    default: { icon: 16, text: "sm" },
    large: { icon: 20, text: "base" },
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated sparkle core */}
      <motion.div className="relative">
        <Sparkles
          className={`text-purple-400 opacity-30`}
          size={sizes[size].icon}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <Loader2 className={`text-purple-400`} size={sizes[size].icon} />
        </motion.div>
      </motion.div>

      {/* AI pulse text */}
      <motion.div
        className="flex items-center gap-1"
        animate={{
          opacity: [0.8, 1, 0.8],
          transition: {
            duration: 2,
            repeat: Infinity,
          },
        }}
      >
        <span
          className={`text-${sizes[size].text} font-medium text-purple-300`}
        >
          AI Cooking
        </span>
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="inline-block w-1 h-1 rounded-full bg-purple-400"
              animate={{
                y: [0, -2, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoolLoader;
