import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.webp";
import { features } from "./Home.js";
const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo/Header */}
          <div className="flex justify-center mb-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <img
                src={logo}
                className="w-14 h-14 text-white"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100">
              Welcome to One1App
            </span>
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-orange-50">
            Your personal hub to learn, grow, and access everything you need —
            from courses and webinars to digital files. All in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-orange-50">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
