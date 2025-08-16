import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Send, X } from "lucide-react";
import { raiseQuery } from "../../services/auth/api.services.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const RaiseQueryForm = () => {
  const { userDetails } = useAuth();
  const [query, setQuery] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (userDetails?.phone) {
      setPhone(userDetails.phone);
    }
  }, [userDetails]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (value && !/^\+91\d{10}$/.test(value)) {
      setPhoneError("Phone must be +91 followed by 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone && !/^\+91\d{10}$/.test(phone)) {
      setPhoneError("Phone must be +91 followed by 10 digits");
      return;
    }

    if (!query) {
      toast.error("Please Describe Your Query!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("query", query);
      formData.append("phone", phone);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await raiseQuery(formData);

      if (response.success) {
        toast.success("Query Submitted!");
        setQuery("");
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setImageFiles([]);
        setImagePreviews([]);
      } else {
        alert(response.message || "Failed to submit query");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("An error occurred while submitting your query");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="mt-6 space-y-4"
    >
      
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="+911234567890"
          pattern="\+91\d{10}"
        />
        {phoneError && (
          <p className="mt-1 text-sm text-red-400">{phoneError}</p>
        )}
      </div>

      {/* Query Field */}
      <div>
        <label
          htmlFor="query"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Describe your issue
        </label>
        <textarea
          id="query"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Be as detailed as possible..."
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Attach screenshots (optional)
        </label>
        <div className="flex items-center space-x-2">
          <label className="cursor-pointer">
            <div className="flex items-center justify-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
              <ImagePlus className="h-5 w-5 text-orange-400 mr-2" />
              <span>Add Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {imagePreviews.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt={`Attachment ${idx + 1}`}
                  className="h-16 w-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting || !query || phoneError}
        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium ${
          isSubmitting || !query || phoneError
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-600 to-red-700 text-white hover:shadow-lg"
        }`}
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Submit Query
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default RaiseQueryForm;
