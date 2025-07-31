/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Upload,
  X,
  ChevronDown,
  Loader2,
  Shield,
  Key,
  MessageSquare,
  Lock,
  Zap,
  Phone,
  AlertCircle,
  Mail,
  RotateCw,
} from "lucide-react";
import {
  createTelegram,
  handelUplaodFile,
} from "../../../../services/auth/api.services.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";

// Discount Form Component
const DiscountForm = ({ isOpen, onClose, onSubmit }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Create New Discount
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Discount Code
            </label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Discount Percent
            </label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseFloat(value) >= 1 && parseFloat(value) <= 99)) {
                  setDiscountPercent(value);
                }
              }}
              min="1"
              max="99"
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
              placeholder="Enter percentage (1-99)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              When does the discount expire?
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Select Plan (Leave it empty if you want this to be applied on all
              plans)
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
            >
              <option value="">All Plans</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Validation
              if (!discountCode.trim()) {
                toast.error("Please enter a discount code");
                return;
              }
              if (!discountPercent || parseFloat(discountPercent) < 1 || parseFloat(discountPercent) > 99) {
                toast.error("Please enter a valid discount percentage (1-99%)");
                return;
              }
              if (!expiryDate) {
                toast.error("Please select an expiry date");
                return;
              }
              if (new Date(expiryDate) <= new Date()) {
                toast.error("Expiry date must be in the future");
                return;
              }

              onSubmit({
                code: discountCode,
                percent: parseFloat(discountPercent),
                expiry: expiryDate,
                plan: selectedPlan,
              });
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

// Main AddTelegramForm Component
const AddTelegramForm = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      inputValue: "",
      showDropdown: false,
      showCreate: false,
      hasThirdBox: false,
      selectedValue: "",
      cost: "",
      days: "",
    },
  ]);

  const [searchParams] = useSearchParams();
  const [chatId, setChatId] = useState(searchParams.get("chatId") || "");

  const { userDetails } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [gstDetails, setGstDetails] = useState("");
  const [gstInfoRequired, setGstInfoRequired] = useState(false);
  const [courseAccess, setCourseAccess] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [telegramTitle, setTelegramTitle] = useState("");
  const [telegramDescription, setTelegramDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [genre, setGenre] = useState("Education");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const getInitials = (name) => {
    if (!name) return "USER";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const predefinedTypes = [
    "Weekly",
    "Monthly",
    "Bimonthly",
    "Quarterly",
    "Quadrimester",
    "Half Yearly",
    "Yearly",
  ];
  const subscriptionDays = {
    Weekly: 7,
    Monthly: 30,
    Bimonthly: 60,
    Quarterly: 90,
    Quadrimester: 120,
    "Half Yearly": 180,
    Yearly: 365,
  };

  const handleDiscountSubmit = (discountData) => {
    setDiscounts([...discounts, discountData]);
  };

  const handleInputChange = (value, index) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions[index] = {
      ...newSubscriptions[index],
      inputValue: value,
      showDropdown: true,
      showCreate:
        !predefinedTypes.some((type) =>
          type.toLowerCase().includes(value.toLowerCase())
        ) && value.length > 0,
      selectedValue: "",
      hasThirdBox: newSubscriptions[index].hasThirdBox,
    };
    setSubscriptions(newSubscriptions);
  };

  const toggleDropdown = (index) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions[index] = {
      ...newSubscriptions[index],
      showDropdown: !newSubscriptions[index].showDropdown,
      showCreate:
        newSubscriptions[index].inputValue.length > 0 &&
        !predefinedTypes.some((type) =>
          type
            .toLowerCase()
            .includes(newSubscriptions[index].inputValue.toLowerCase())
        ),
    };
    setSubscriptions(newSubscriptions);
  };

  const handleCreateClick = (index) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions[index] = {
      ...newSubscriptions[index],
      selectedValue: newSubscriptions[index].inputValue,
      showCreate: false,
      showDropdown: false,
      hasThirdBox: true,
      days: "",
    };
    setSubscriptions(newSubscriptions);
  };

  const handleOptionClick = (option, index) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions[index] = {
      ...newSubscriptions[index],
      selectedValue: option,
      inputValue: option,
      showDropdown: false,
      showCreate: false,
      hasThirdBox: false,
      days: subscriptionDays[option],
    };
    setSubscriptions(newSubscriptions);
  };

  const addSubscription = () => {
    setSubscriptions([
      ...subscriptions,
      {
        inputValue: "",
        showDropdown: false,
        showCreate: false,
        hasThirdBox: false,
        selectedValue: "",
        cost: "",
        days: "",
        isLifetime: false,
      },
    ]);
  };

  const deleteSubscription = (index) => {
    const updatedSubscriptions = subscriptions.filter((_, i) => i !== index);
    setSubscriptions(updatedSubscriptions);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsUploadingImage(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image directly
      try {
        const imagePic = new FormData();
        imagePic.append("file", file);
        const response = await handelUplaodFile(imagePic);

        if (response?.data?.url) {
          // Store the uploaded URL for later use
          setImageFile({ url: response.data.url, uploaded: true });
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        // Reset the file input on error
        setImageFile(null);
        setUploadedImage(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageAspectRatio(naturalWidth / naturalHeight);
  };

  const handleClickOutside = (e, index) => {
    if (!e.target.closest(".subscription-dropdown")) {
      const newSubscriptions = [...subscriptions];
      if (newSubscriptions[index]) {
        newSubscriptions[index].showDropdown = false;
        setSubscriptions(newSubscriptions);
      }
    }
  };

  const handleSubmit = async () => {
    console.log("discounts=-=>", discounts);
    try {
      setIsSubmitting(true);

      // Validation
      if (!chatId || !chatId.trim()) {
        toast.error("Chat ID is required.");
        setIsSubmitting(false);
        return;
      }

      if (!telegramTitle.trim()) {
        toast.error("Please enter a title for your Telegram channel.");
        setIsSubmitting(false);
        return;
      }

      if (!telegramDescription.trim()) {
        toast.error("Please enter a description for your Telegram channel.");
        setIsSubmitting(false);
        return;
      }

      // Validate subscriptions
      for (let i = 0; i < subscriptions.length; i++) {
        const sub = subscriptions[i];
        if (!sub.selectedValue && !sub.inputValue) {
          toast.error(`Please select a type for subscription ${i + 1}.`);
          setIsSubmitting(false);
          return;
        }
        if (!sub.cost || sub.cost === '' || sub.cost <= 0) {
          toast.error(`Please enter a valid cost for subscription ${i + 1}.`);
          setIsSubmitting(false);
          return;
        }
        if (sub.hasThirdBox && !sub.isLifetime && (!sub.days || sub.days === '' || sub.days <= 0)) {
          toast.error(`Please enter valid days for subscription ${i + 1}.`);
          setIsSubmitting(false);
          return;
        }
      }

      let uploadedImageUrl = "";
      if (imageFile) {
        if (imageFile.uploaded && imageFile.url) {
          // Image already uploaded during file selection
          uploadedImageUrl = imageFile.url;
        } else {
          // Fallback: upload during submit if not already uploaded
          try {
            const imagePic = new FormData();
            imagePic.append("file", imageFile);
            const response = await handelUplaodFile(imagePic);
            uploadedImageUrl = response?.data?.url || "";
            console.log("Image uploaded successfully:", uploadedImageUrl);
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            setIsSubmitting(false);
            return;
          }
        }
      }

      const body = {
        title: telegramTitle,
        description: telegramDescription,
        subscriptions,
        coverImage: uploadedImageUrl,
        genre,
        chatId: chatId.trim(),
        channelName: "", // Will be filled by backend if needed
        channelLink: "", // Will be filled by backend if needed
        discounts,
        sessionString: "", // Not needed for direct chatId approach
        gstDetails,
        courseDetails,
        inviteLink: null,
      };

      console.log("formBody==>", body);
      const telegramSession = localStorage.getItem('telegramSession');
      await createTelegram(body, telegramSession);
      window.location.href = "/dashboard/telegram";
      toast.success("Telegram subscription created successfully");
    } catch (error) {
      console.log("Error in creating telegram.", error);
      toast.error("Failed to create telegram subscription");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Section */}
      <div className="w-full h-64 bg-gradient-to-r from-orange-500 to-orange-600 flex justify-center items-center relative">
        <h1 className="font-bold text-white text-3xl md:text-4xl mb-8">
          Add Telegram Subscription
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="max-w-4xl mx-auto -mt-24 bg-slate-900 rounded-xl shadow-lg z-10 relative border border-gray-700">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-3">
            {/* Chat ID Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Telegram Chat ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white font-mono"
                placeholder="Enter Telegram Chat ID (e.g., -1001234567890)"
              />
              <p className="text-gray-400 text-sm mt-1">
                This subscription will be linked to the above chat ID.
              </p>
            </div>

            {/* Cover Picture */}
            <div className="flex items-center justify-between gap-2.5 mb-8">
              <div className="flex-1"></div>
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Cover Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-orange-600 flex items-center justify-center overflow-hidden bg-orange-500">
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Uploaded Cover"
                        className="w-full h-full object-cover"
                        onLoad={handleImageLoad}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {getInitials(userDetails?.name)}
                      </div>
                    )}
                  </div>

                  <label className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer transition duration-200 flex items-center gap-2 ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Uploading...
                      </>
                    ) : (
                      'Upload Image'
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </label>

                  {uploadedImage && (
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-1">
            {/* Page Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Page Title
              </label>
              <input
                type="text"
                maxLength={75}
                value={telegramTitle}
                onChange={(e) => setTelegramTitle(e.target.value)}
                className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                placeholder="Enter page title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Page Description
              </label>
              <textarea
                value={telegramDescription}
                onChange={(e) => setTelegramDescription(e.target.value)}
                className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32 bg-gray-900 text-white"
                placeholder="Enter description"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            {/* Discounts Section */}
            <div>
              <div className="mb-4">
                <label className="block text-m font-medium text-orange-500">
                  Discounts
                </label>
              </div>

              {discounts.length > 0 && (
                <div className="space-y-2 mb-4">
                  {discounts.map((discount, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-orange-600"
                    >
                      <div>
                        <span className="text-white font-medium">
                          {discount.code}
                        </span>
                        <span className="text-gray-400 ml-2">
                          ({discount.percent}% off)
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Expires:{" "}
                        {new Date(discount.expiry).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-start">
                <button
                  onClick={() => setIsDiscountModalOpen(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 w-50"
                >
                  Create Discount
                </button>
              </div>

              <DiscountForm
                isOpen={isDiscountModalOpen}
                onClose={() => setIsDiscountModalOpen(false)}
                onSubmit={handleDiscountSubmit}
              />
            </div>

            {/* Subscriptions */}
            <div className="space-y-6">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Subscriptions <span className="text-red-500">*</span>
              </label>

              {subscriptions.map((sub, index) => (
                <div key={index} className="flex gap-4 items-start relative">
                  <div className="relative subscription-dropdown">
                    <div className="relative">
                      <input
                        type="text"
                        value={sub.selectedValue || sub.inputValue}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index)
                        }
                        onClick={() => toggleDropdown(index)}
                        onBlur={(e) => handleClickOutside(e, index)}
                        placeholder="Select type"
                        className="w-64 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white pr-8"
                      />
                      <ChevronDown
                        className={`absolute right-2 top-3 w-4 h-4 text-gray-400 transition-transform duration-200 ${sub.showDropdown ? "transform rotate-180" : ""
                          }`}
                      />
                    </div>

                    {(sub.showDropdown || sub.showCreate) && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-orange-600 rounded-lg shadow-lg">
                        {sub.showCreate && (
                          <div
                            onClick={() => handleCreateClick(index)}
                            className="px-4 py-3 text-sm text-orange-500 bg-gray-900 cursor-pointer hover:bg-gray-700"
                          >
                            Create "{sub.inputValue}"
                          </div>
                        )}

                        {predefinedTypes.filter((type) =>
                          type
                            .toLowerCase()
                            .includes(sub.inputValue.toLowerCase())
                        ).length > 0 && (
                            <div className="max-h-48 overflow-auto">
                              {predefinedTypes
                                .filter((type) =>
                                  type
                                    .toLowerCase()
                                    .includes(sub.inputValue.toLowerCase())
                                )
                                .map((option) => (
                                  <div
                                    key={option}
                                    className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-700"
                                    onClick={() =>
                                      handleOptionClick(option, index)
                                    }
                                  >
                                    {option}
                                  </div>
                                ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Cost"
                      value={sub.cost}
                      onChange={(e) => {
                        const newSubs = [...subscriptions];
                        const value = e.target.value;
                        if (value === '' || parseFloat(value) >= 0) {
                          newSubs[index].cost = value === '' ? '' : parseFloat(value);
                          setSubscriptions(newSubs);
                        }
                      }}
                      className="w-32 px-4 py-2 pl-16 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                    />
                    <span className="absolute left-4 top-2 text-gray-400">
                      INR
                    </span>
                  </div>

                  {sub.hasThirdBox && !sub.isLifetime && (
                    <input
                      type="number"
                      placeholder="Number of Days"
                      value={sub.days}
                      onChange={(e) => {
                        const newSubs = [...subscriptions];
                        const value = e.target.value;
                        if (value === '' || parseInt(value) >= 1) {
                          newSubs[index].days = value === '' ? '' : parseInt(value);
                          setSubscriptions(newSubs);
                        }
                      }}
                      className="w-64 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                    />
                  )}
                  {sub.hasThirdBox && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-orange-500">
                        IsLifeTime
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={sub.isLifetime || false}
                          onChange={(e) => {
                            const newSubs = [...subscriptions];
                            newSubs[index].isLifetime = e.target.checked;
                            if (e.target.checked) {
                              newSubs[index].days = null;
                            }
                            setSubscriptions(newSubs);
                          }}
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  )}

                  <button
                    onClick={() => deleteSubscription(index)}
                    className="text-gray-400 hover:text-gray-200 transition duration-200 mt-1"
                  >
                    <X size={24} />
                  </button>
                </div>
              ))}

              <button
                onClick={addSubscription}
                className="flex items-center text-orange-500 hover:text-orange-400 text-sm transition duration-200"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Subscription
              </button>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-4">
              {/* GST Info Required */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-500">
                  GST Info Required
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={gstInfoRequired}
                    onChange={() => setGstInfoRequired(!gstInfoRequired)}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
              {gstInfoRequired && (
                <input
                  type="text"
                  value={gstDetails}
                  onChange={(e) => setGstDetails(e.target.value)}
                  placeholder="Enter GST Information"
                  className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                />
              )}

              {/* Course Access */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-500">
                  Enter course access details
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={courseAccess}
                    onChange={() => setCourseAccess(!courseAccess)}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
              {courseAccess && (
                <input
                  type="text"
                  value={courseDetails}
                  onChange={(e) => setCourseDetails(e.target.value)}
                  placeholder="Enter course access details"
                  className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 disabled:cursor-not-allowed"
            >
              Add Telegram Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTelegramForm;