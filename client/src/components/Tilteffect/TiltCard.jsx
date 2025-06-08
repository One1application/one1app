import { motion } from "framer-motion";
import { useRef } from "react";
import {
  useTransform,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";

const TiltCard = ({ testimonial, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // For tilt effect
  const xRotate = useTransform(x, [0, 300], [10, -10]);
  const yRotate = useTransform(y, [0, 300], [-10, 10]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${yRotate}deg) rotateY(${xRotate}deg) scale(1.05)`;

  // For gradient animation
  const gradientX = useMotionValue(0);
  const gradientY = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(150% 150% at ${gradientX}% ${gradientY}%, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.9), rgba(217, 119, 6, 0.9))`;

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    // Animate gradient position
    animate(gradientX, ((e.clientX - rect.left) / rect.width) * 100, {
      duration: 0.3,
    });
    animate(gradientY, ((e.clientY - rect.top) / rect.height) * 100, {
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    animate(xRotate, 0, { duration: 0.5 });
    animate(yRotate, 0, { duration: 0.5 });
    animate(gradientX, 50, { duration: 0.5 });
    animate(gradientY, 50, { duration: 0.5 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      style={{
        transform,
        background,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-8 rounded-3xl shadow-2xl border-2 border-white/20 relative overflow-hidden"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.15), transparent 40%)",
        }}
      />

      <div className="flex flex-col items-center mb-6 relative z-10">
        <motion.img
          src={testimonial.profilePic || oneApp}
          alt={testimonial.name}
          className="w-28 h-28 rounded-full object-cover border-4 border-white/80 shadow-lg"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
        <div className="text-center mt-4">
          <motion.h3
            className="font-bold text-white text-2xl"
            whileHover={{ scale: 1.05 }}
          >
            {testimonial.name}
          </motion.h3>
          <motion.div
            className="flex justify-center mt-2"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
          >
            {[...Array(5)].map((_, i) => (
              <Icons.Star
                key={i}
                className={`w-6 h-6 ${
                  i < testimonial.rating
                    ? "text-yellow-300 fill-current"
                    : "text-white/30 fill-current"
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <motion.p
        className="text-white/90 text-center text-lg font-medium italic relative z-10"
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
      >
        "{testimonial.statement}"
      </motion.p>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              opacity: 0.3,
            }}
            animate={{
              y: [null, Math.random() * 50 - 25],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TiltCard;
