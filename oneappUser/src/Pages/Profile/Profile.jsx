import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowBigRight,
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { useUserAuth } from "../../Context/AuthenticationContext.jsx";

const Profile = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const { userDetails, logoutUser } = useUserAuth();

  const profileData = [
    { label: "Name", icon: User, text: userDetails?.name },
    { label: "Email", icon: Mail, text: userDetails?.email },
    { label: "Phone", icon: Phone, text: userDetails?.phone },
   
  ];

  return (
    <motion.div
      className="w-full relative p-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(51, 65, 85, 0.9) 100%)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
      }}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: 360,
          }}
          transition={{
            scale: { duration: 0.3 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: -360,
          }}
          transition={{
            scale: { duration: 0.3 },
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
        />
      </div>

      {/* Shield icon above the header */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
      </motion.div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <motion.div
          className="relative p-2 rounded-xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)",
            boxShadow:
              "0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          }}
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            scale: { type: "spring", stiffness: 400 },
            rotate: { duration: 0.6 },
          }}
        >
          <User className="text-white w-5 h-5 relative z-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.h1
            className="text-2xl font-bold tracking-wide relative"
            style={{
              background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
            whileHover={{ scale: 1.05 }}
          >
            Personal Info
          </motion.h1>
        <ShieldCheck className="w-6 h-6 text-green-400" strokeWidth={2.5} />
         
        </div>
      </div>

      {/* Profile Items */}
      <div className="space-y-3 mb-6 relative z-10">
        <AnimatePresence>
          {profileData.map((item, index) => {
            const Icon = item.icon;
            const isItemHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                style={{
                  background: isItemHovered
                    ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)"
                    : "rgba(51, 65, 85, 0.3)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: isItemHovered
                    ? "1px solid rgba(99, 102, 241, 0.3)"
                    : "1px solid rgba(148, 163, 184, 0.1)",
                  padding: "16px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  x: 8,
                  scale: 1.02,
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative p-2 rounded-lg overflow-hidden"
                    style={{
                      background: isItemHovered
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)"
                        : "rgba(71, 85, 105, 0.5)",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                    }}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isItemHovered ? "text-indigo-300" : "text-slate-300"
                      }`}
                    />
                    {isItemHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <motion.p
                      className="text-xs font-medium tracking-wider uppercase"
                      style={{ color: isItemHovered ? "#a78bfa" : "#94a3b8" }}
                    >
                      {item.label}
                    </motion.p>
                    <motion.p
                      className="text-sm font-semibold mt-1"
                      style={{
                        color: isItemHovered ? "#f1f5f9" : "#e2e8f0",
                        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      {item.text || "Not available"}
                    </motion.p>
                  </div>

                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ scale: isItemHovered ? 1 : 0.8 }}
                  >
                    <ArrowBigRight className="w-4 h-4 text-indigo-400" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Logout Button */}
      <motion.button
        onClick={logoutUser}
        className="w-full relative overflow-hidden group"
        style={{
          background:
            "linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 50%, rgba(236, 72, 153, 0.9) 100%)",
          padding: "14px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow:
            "0 12px 40px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8 }}
        />
        <div className="flex items-center justify-center gap-2 relative z-10">
          <span className="font-medium text-white tracking-wide drop-shadow-md">
            Logout
          </span>
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ArrowBigRight size={16} className="text-white drop-shadow-md" />
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default Profile;
