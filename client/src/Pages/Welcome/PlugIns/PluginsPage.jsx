import { useState } from "react";
import { CheckCheck, IndianRupee, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pluginConfig } from "../../Dashboard/DashboardPages/PluginPage/pluginConfig";
import Navbar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import toast from "react-hot-toast";

const PluginsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    purpose: "",
    websitelink: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleButtonClick = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      contact: "",
      purpose: "",
      websitelink: "",
    });
    setError("");
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const submissionData = {
      ...formData,
      planType: selectedPlan?.planType || "",
      price: selectedPlan?.price || "",
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxD2ZqR1PUe5CGOLpjW-I7TzGt2rgSDsEs4otrqLUmugLo5qI1PgJ_jII99UdwrICbe0g/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to submit form. Please try again later.");
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-0 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 mt-4 animate-fade-in">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white mb-4 animate-fade-in">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {pluginConfig.map((plan, index) => (
            <div
              key={index}
              className="relative w-72 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-300"
            >
              {plan.cardHighlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium animate-pulse">
                  {plan.cardHighlight}
                </div>
              )}

              <div className="p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4 animate-slide-in">
                  {plan.planType}
                </h2>

                <div className="flex items-center justify-center gap-1 mb-4">
                  <IndianRupee className="w-5 h-5 animate-bounce-slow" />
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.timeFrame}</span>
                </div>

                <p className="text-center text-gray-600 mb-6">
                  {plan.description}
                </p>

                <button
                  className={`${plan.buttonColor} w-full py-3 px-4 rounded-lg 
                    ${
                      plan.buttonColor === "bg-white"
                        ? "border-2 border-gray-200 text-gray-800"
                        : "text-white"
                    } 
                    font-semibold hover:scale-105 transition-all`}
                  onClick={() => handleButtonClick(plan)}
                >
                  {plan.buttonText}
                </button>

                <div className="mt-6">
                  {plan.feature.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 mb-3 transition-opacity duration-500 ease-in-out transform hover:translate-x-1"
                    >
                      <CheckCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-96 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 p-1 rounded-full bg-orange-500 hover:bg-orange-700 text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {!isSubmitted ? (
                <>
                  <h3 className="text-xl font-bold mb-4 text-center">
                    {selectedPlan?.planType} Plan
                  </h3>
                  <p className="text-gray-700 text-center mb-6">
                    You have selected the{" "}
                    <strong>{selectedPlan?.planType}</strong> plan for{" "}
                    <strong>₹{selectedPlan?.price}</strong>/
                    {selectedPlan?.timeFrame}.
                  </p>

                  {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Contact Number*
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Purpose*
                      </label>
                      <textarea
                        name="purpose"
                        placeholder="Tell us about your project..."
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                        rows={4}
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Website Link (if available)
                      </label>
                      <input
                        type="url"
                        name="websitelink"
                        value={formData.websitelink}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-700 text-white"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Thank You!</h3>
                  <p className="text-gray-700 mb-6">
                    Your submission has been received. Our team will contact you
                    soon!
                  </p>
                  <button
                    className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PluginsPage;
