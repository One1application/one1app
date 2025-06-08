import { motion } from "framer-motion";
import {
  Construction,
  HardHat,
  AlertTriangle,
  Mail,
  Hammer,
  Wrench,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
const HelpCenterComingSoon = () => {
  const { userDetails } = useAuth();

  const username = userDetails?.name || "Creator";
  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-6 rounded-lg bg-gray-900 border border-gray-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-600 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex-shrink-0"
            >
              <Construction className="h-8 w-8 text-white" />
            </motion.div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <HardHat className="h-6 w-6 text-orange-400" />
                Hey {username}, our Creator Help Center is coming soon!
              </h2>
              <p className="mt-3 text-gray-300 text-lg">
                We're building a dedicated space where you can:
              </p>
              <ul className="mt-3 space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  Report issues with screenshots and descriptions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  Get faster support from our team
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  Access creator resources and guides
                </li>
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-700 rounded-lg cursor-pointer shadow-lg hover:shadow-orange-500/20 transition-all"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium text-white text-lg">
                  You Will Get Notified!
                </span>
              </motion.button>
            </div>

            <motion.div
              animate={{ opacity: [0.8, 1, 0.8], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hidden md:flex items-center justify-center p-3 rounded-full bg-red-900/20 border border-red-900/50 flex-shrink-0"
            >
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-4">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Hammer className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Under Construction</h3>
              <p className="mt-1 text-sm text-gray-400">
                We're actively building this feature
              </p>
            </div>
          </div>

          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-4">
            <div className="p-2 bg-red-500/10 rounded-full">
              <Wrench className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Custom Solutions</h3>
              <p className="mt-1 text-sm text-gray-400">
                Tailored for creator needs
              </p>
            </div>
          </div>

          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-4">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Quick Reporting</h3>
              <p className="mt-1 text-sm text-gray-400">
                Submit issues with screenshots
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          We appreciate your patience while we build the best help center
          experience for creators.
        </motion.p>
      </div>
    </div>
  );
};

export default HelpCenterComingSoon;
