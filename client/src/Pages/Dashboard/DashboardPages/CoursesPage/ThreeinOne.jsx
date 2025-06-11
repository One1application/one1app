import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles, Star } from "lucide-react";
import { useState } from "react";

function ThreeinOne({ courseDetails }) {
  const [activeTab, setActiveTab] = useState("faqs");
  const [openFaq, setOpenFaq] = useState(-1);

  const faqs = courseDetails?.faqs?.faQMetaData || [];
  const benefits = courseDetails?.courseBenefits?.benefitsMetaData || [];
  const features = courseDetails?.aboutThisCourse?.features || [];

  const tabs = [
    { id: "features", label: "Key Features", icon: <Sparkles size={18} /> },
    { id: "faqs", label: "FAQs", icon: <HelpCircle size={18} /> },
    { id: "benefits", label: "Course Benefits", icon: <Star size={18} /> },
  ];

  return (
    <div className="bg-gray-950 text-gray-100 relative py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "text-white bg-orange-600 shadow-lg shadow-orange-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* FAQs Section */}
            {activeTab === "faqs" && (
              <motion.div
                key="faqs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {faqs.length > 0 ? (
                  faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() =>
                          setOpenFaq(openFaq === index ? -1 : index)
                        }
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-lg font-medium text-white">
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{ rotate: openFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="text-orange-400" size={20} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 pb-4 overflow-hidden"
                          >
                            <div className="pt-2 border-t border-gray-800">
                              <p className="text-gray-300">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
                    No FAQs available for this course
                  </div>
                )}
              </motion.div>
            )}

            {/* Course Benefits Section */}
            {activeTab === "benefits" && (
              <motion.div
                key="benefits"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {benefits.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {benefits.map(
                      (benefit, index) =>
                        benefit.title && (
                          <motion.div
                            key={index}
                            className="p-6 bg-gray-900 rounded-xl shadow-lg border border-orange-500/20"
                            whileHover={{ y: -3 }}
                            transition={{ type: "spring" }}
                          >
                            <div className="text-lg font-semibold text-white">
                              <span className="mr-2">{benefit.emoji}</span>
                              {benefit.title}
                            </div>
                          </motion.div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
                    No benefits information available for this course
                  </div>
                )}
              </motion.div>
            )}

            {/* Key Features Section */}
            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {features.length > 0 ? (
                  <ul className="space-y-4">
                    {features.map(
                      (feature, index) =>
                        feature && (
                          <li
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gray-800/40 rounded-lg hover:bg-gray-800/60 transition-all duration-200 group"
                          >
                            <Sparkles className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                            <span className="text-lg text-gray-200 group-hover:text-white">
                              {feature}
                            </span>
                          </li>
                        )
                    )}
                  </ul>
                ) : (
                  <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
                    No key features available for this course
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ThreeinOne;
