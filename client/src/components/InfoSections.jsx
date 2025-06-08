import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Phone,
  FileText,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

function InfoSections({ payingUpDetails }) {
  const [activeTab, setActiveTab] = useState("faqs");
  const [openFaq, setOpenFaq] = useState(-1);

 
  const faqs = payingUpDetails?.faqs?.faQMetaData || [];
  const terms = payingUpDetails?.tacs?.termAndConditionsMetaData || [];
  const refundPolicies =
    payingUpDetails?.refundPolicies?.refundPoliciesMetaData || [];
  const contactEmail =
    payingUpDetails?.paymentDetails?.ownerEmail || "support@example.com";
  const contactPhone =
    payingUpDetails?.paymentDetails?.ownerPhone || "+1 (555) 123-4567";

  const tabs = [
    { id: "faqs", label: "FAQs", icon: <HelpCircle size={18} /> },
    { id: "terms", label: "Terms & Policies", icon: <FileText size={18} /> },
    { id: "contact", label: "Contact", icon: <Mail size={18} /> },
  ];

  return (
    <div className="bg-gray-950 text-gray-100 relative py-16 px-4 sm:px-6 ">
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
                  <div className="text-center py-12 text-gray-400">
                    No FAQs available at the moment
                  </div>
                )}
              </motion.div>
            )}

            {/* Terms & Policies Section */}
            {activeTab === "terms" && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Terms & Conditions */}
                <motion.div
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-orange-400" size={20} />
                    <h3 className="text-xl font-semibold text-white">
                      Terms & Conditions
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {terms.length > 0 ? (
                      terms.map((term, i) => (
                        <p
                          key={i}
                          className="text-gray-300 text-sm pl-2 border-l border-orange-400/30"
                        >
                          {term}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400">No terms available</p>
                    )}
                  </div>
                </motion.div>

                {/* Refund Policies */}
                <motion.div
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="text-orange-400" size={20} />
                    <h3 className="text-xl font-semibold text-white">
                      Refund Policies
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {refundPolicies.length > 0 ? (
                      refundPolicies.map((policy, i) => (
                        <p
                          key={i}
                          className="text-gray-300 text-sm pl-2 border-l border-orange-400/30"
                        >
                          {policy}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400">
                        No refund policies available
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Contact Section */}
            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <motion.div
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <Mail className="text-orange-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Email Support
                      </h3>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      <Phone className="text-orange-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Phone Support
                      </h3>
                      <a
                        href={`tel:${contactPhone}`}
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        {contactPhone}
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default InfoSections;
