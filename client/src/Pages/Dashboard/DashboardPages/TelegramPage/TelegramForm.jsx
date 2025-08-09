/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  AlertCircle,
  ChevronDown,
  Key,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  PlusCircle,
  RotateCw,
  Shield,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createTelegram,
  fetchOwnedGroups,
  handelUplaodFile,
} from "../../../../services/auth/api.services.js";

import {
  sendTelegramLoginCode,
  signInTelegramClient,
} from "../../../../services/auth/api.services.js";
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
              placeholder="Enter discount code (3-20 characters)"
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
              required
            />
            <div className="text-xs text-gray-400 mt-1">
              {discountCode.length}/20 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Discount Percent
            </label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              min="1"
              max="99"
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
              placeholder="Enter percentage (1-99)"
              required
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
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
              min={new Date().toISOString().split('T')[0]}
              required
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
              // Validate before submitting
              if (!discountCode.trim() || discountCode.trim().length < 3) {
                toast.error('Discount code must be at least 3 characters long');
                return;
              }
              if (!/^[a-zA-Z0-9_-]+$/.test(discountCode.trim())) {
                toast.error('Discount code can only contain letters, numbers, hyphens, and underscores');
                return;
              }
              if (!discountPercent || parseFloat(discountPercent) <= 0 || parseFloat(discountPercent) > 100) {
                toast.error('Discount percentage must be between 1 and 100');
                return;
              }
              if (!expiryDate) {
                toast.error('Expiry date is required');
                return;
              }
              const expiry = new Date(expiryDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (expiry <= today) {
                toast.error('Expiry date must be in the future');
                return;
              }

              onSubmit({
                code: discountCode.trim(),
                percent: parseFloat(discountPercent),
                expiry: expiryDate,
                plan: selectedPlan,
              });

              // Reset form
              setDiscountCode('');
              setDiscountPercent('');
              setExpiryDate('');
              setSelectedPlan('');
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

import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";
import TelegramHeader from "./TelegramHeader.jsx";
import ConnectTelegramPage from "./ConnectTelegramPage.jsx";

// Main TelegramsPages Component
const Telgrampage = () => {
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

  const chatId = useSearchParams()[0].get("chatid");
  console.log("chatId", chatId);
  const { userDetails } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [gstDetails, setGstDetails] = useState("");
  const [gstInfoRequired, setGstInfoRequired] = useState(false);
  const [courseAccess, setCourseAccess] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteLinkData, setInviteLinkData] = useState(null);
  const [telegramTitle, setTelegramTitle] = useState("");
  const [telegramDescription, setTelegramDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [genre, setGenre] = useState("Education");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatid, setChatid] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [ownedGroups, setOwnedGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true); // Start with loading true
  const [isTelegramAuthenticated, setIsTelegramAuthenticated] = useState(false);
  const [finalSessionString, setFinalSessionString] = useState("");
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

  const loadGroups = async () => {
    setLoadingGroups(true);
    try {

      const res = await fetchOwnedGroups();
      const groups = res.data.payload.groups || [];
      // The backend already sends a unique list, so no client-side deduplication is needed.
      setOwnedGroups(groups);
      setIsTelegramAuthenticated(true);
    } catch (error) {
      console.error(
        "Failed to load groups, user likely not authenticated.",
        error
      );
      setIsTelegramAuthenticated(false);
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  // Validation helper functions
  const validateTitle = (title) => {
    if (!title.trim()) {
      return "Title is required";
    }
    if (title.trim().length < 3) {
      return "Title must be at least 3 characters long";
    }
    if (title.trim().length > 75) {
      return "Title must not exceed 75 characters";
    }
    return null;
  };

  const validateDescription = (description) => {
    if (!description.trim()) {
      return "Description is required";
    }
    if (description.trim().length < 10) {
      return "Description must be at least 10 characters long";
    }
    if (description.trim().length > 500) {
      return "Description must not exceed 500 characters";
    }
    return null;
  };

  const validateSubscriptions = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) {
      return "At least one subscription plan is required";
    }

    for (let i = 0; i < subscriptions.length; i++) {
      const sub = subscriptions[i];

      if (!sub.selectedValue && !sub.inputValue) {
        return `Subscription ${i + 1}: Type is required`;
      }

      if (!sub.cost || parseFloat(sub.cost) <= 0) {
        return `Subscription ${i + 1}: Cost must be greater than 0`;
      }

      if (parseFloat(sub.cost) > 100000) {
        return `Subscription ${i + 1}: Cost cannot exceed ₹100,000`;
      }

      if (!sub.isLifetime && (!sub.days || parseInt(sub.days) <= 0)) {
        return `Subscription ${i + 1}: Valid days must be greater than 0`;
      }

      if (!sub.isLifetime && parseInt(sub.days) > 3650) {
        return `Subscription ${i + 1}: Valid days cannot exceed 3650 (10 years)`;
      }
    }

    // Check for duplicate subscription types
    const types = subscriptions.map(sub => (sub.selectedValue || sub.inputValue).toLowerCase());
    const duplicates = types.filter((type, index) => types.indexOf(type) !== index);
    if (duplicates.length > 0) {
      return `Duplicate subscription types found: ${[...new Set(duplicates)].join(', ')}`;
    }

    return null;
  };

  const validateDiscounts = (discounts) => {
    for (let i = 0; i < discounts.length; i++) {
      const discount = discounts[i];

      if (!discount.code || discount.code.trim().length < 3) {
        return `Discount ${i + 1}: Code must be at least 3 characters long`;
      }

      if (discount.code.trim().length > 20) {
        return `Discount ${i + 1}: Code must not exceed 20 characters`;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(discount.code.trim())) {
        return `Discount ${i + 1}: Code can only contain letters, numbers, hyphens, and underscores`;
      }

      if (!discount.percent || discount.percent <= 0 || discount.percent > 100) {
        return `Discount ${i + 1}: Percentage must be between 1 and 100`;
      }

      if (!discount.expiry) {
        return `Discount ${i + 1}: Expiry date is required`;
      }

      const expiryDate = new Date(discount.expiry);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiryDate <= today) {
        return `Discount ${i + 1}: Expiry date must be in the future`;
      }
    }

    // Check for duplicate discount codes
    const codes = discounts.map(discount => discount.code.toLowerCase());
    const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
    if (duplicateCodes.length > 0) {
      return `Duplicate discount codes found: ${[...new Set(duplicateCodes)].join(', ')}`;
    }

    return null;
  };

  const validateGSTDetails = (gstDetails, gstInfoRequired) => {
    if (gstInfoRequired && (!gstDetails || gstDetails.trim().length === 0)) {
      return "GST details are required when GST info is enabled";
    }

    if (gstDetails && gstDetails.trim().length > 200) {
      return "GST details must not exceed 200 characters";
    }

    return null;
  };

  const validateCourseDetails = (courseDetails, courseAccess) => {
    if (courseAccess && (!courseDetails || courseDetails.trim().length === 0)) {
      return "Course access details are required when course access is enabled";
    }

    if (courseDetails && courseDetails.trim().length > 500) {
      return "Course access details must not exceed 500 characters";
    }

    return null;
  };

  const handleSubmit = async () => {
    console.log("discounts=-=>", discounts);
    try {
      setIsSubmitting(true);

      // Comprehensive validation
      const titleError = validateTitle(telegramTitle);
      if (titleError) {
        toast.error(titleError);
        setIsSubmitting(false);
        return;
      }

      const descriptionError = validateDescription(telegramDescription);
      if (descriptionError) {
        toast.error(descriptionError);
        setIsSubmitting(false);
        return;
      }

      // Group/Chat validation
      if (!selectedGroup && !inviteLink) {
        toast.error("Please select a group or provide an invite link.");
        setIsSubmitting(false);
        return;
      }

      // Subscription validation
      const subscriptionError = validateSubscriptions(subscriptions);
      if (subscriptionError) {
        toast.error(subscriptionError);
        setIsSubmitting(false);
        return;
      }

      // Discount validation
      if (discounts.length > 0) {
        const discountError = validateDiscounts(discounts);
        if (discountError) {
          toast.error(discountError);
          setIsSubmitting(false);
          return;
        }
      }

      // GST validation
      const gstError = validateGSTDetails(gstDetails, gstInfoRequired);
      if (gstError) {
        toast.error(gstError);
        setIsSubmitting(false);
        return;
      }

      // Course details validation
      const courseError = validateCourseDetails(courseDetails, courseAccess);
      if (courseError) {
        toast.error(courseError);
        setIsSubmitting(false);
        return;
      }

      // Genre validation
      if (!genre || genre.trim().length === 0) {
        toast.error("Please select a genre");
        setIsSubmitting(false);
        return;
      }

      if (selectedGroup) {
        console.log("Selected Group Details:", selectedGroup);
      } else if (inviteLink) {
        console.log("Using invite link.");
      } else {
        toast.error("Please select a group or provide an invite link.");
        setIsSubmitting(false);
        return;
      }

      let response;
      let uploadedImageUrl = null
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
        chatId: selectedGroup ? selectedGroup.id : inviteLinkData?.chatId || "",
        channelName: selectedGroup
          ? selectedGroup.title
          : inviteLinkData?.title || "",
        channelLink:
          selectedGroup && selectedGroup.username
            ? `https://t.me/${selectedGroup.username}`
            : inviteLink,
        discounts,
        sessionString: finalSessionString,
        gstDetails,
        courseDetails,
      };

      console.log("formBody==>", body);
      await createTelegram(body);
      window.location.href = "/dashboard/telegram";
      toast.success("Telegram Is in the Development Phase");
    } catch (error) {
      toast.error(error?.response.data?.message || "Something Went Wrong")
      console.log("Error in creating telegram.", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loadingGroups) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  // If not logged in, show ConnectTelegramPage
  if (!isTelegramAuthenticated) {
    return <ConnectTelegramPage />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Section */}
      <div className="w-full h-64 bg-gradient-to-r from-orange-500 to-orange-600 flex justify-center items-center relative">
        <h1 className="font-bold text-white text-3xl md:text-4xl mb-8">
          Create Subscription
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="max-w-4xl mx-auto -mt-24 bg-slate-900 rounded-xl shadow-lg z-10 relative border border-gray-700">
        <div className="p-6">
          {/* Cover Picture */}
          <div className=" flex items-center justify-between gap-2.5">
            <div className="mb-4  flex-1">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Telegram Group
              </label>
              {ownedGroups.length > 0 ? (
                <select
                  value={chatid}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const group = ownedGroups.find((g) => g.id === selectedId);
                    setChatid(selectedId);
                    setSelectedGroup(group);
                  }}
                  className="w-full px-4 py-2 border border-orange-600 rounded-lg bg-gray-900 text-white"
                >
                  <option value="" disabled>
                    Choose from your owned groups
                  </option>
                  {ownedGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.title} (Group ID: {group.id})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={chatid}
                  onChange={(e) => setChatid(e.target.value)}
                  className="w-full px-4 py-2 border border-orange-600 rounded-lg bg-gray-900 text-white placeholder-orange-400"
                  placeholder="Enter Telegram Group ID"
                />
              )}
            </div>
            <div className="mb-8 ">
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
                    <div className="w-full h-full flex items-center justify-center  text-white text-2xl font-bold shadow-lg">
                      {getInitials(userDetails?.name)}
                    </div>
                  )}
                </div>

                <label className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer transition duration-200">
                  Upload Image
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
          {/* Form Fields */}
          <div className="space-y-1">
            {/* Session loaded from cookie; no input required */}

            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Provide Public Group Invite Link
              </label>
              <input
                type="text"
                value={inviteLink}
                onChange={(e) => {
                  setInviteLink(e.target.value);
                  setChatid(""); // Clear selected group when typing invite link
                  setSelectedGroup(null);
                }}
                onBlur={handleInviteLinkBlur}
                disabled={!!chatid} // Disable if a group is selected from dropdown
                className="w-full px-4 py-2 border border-orange-600 rounded-lg bg-gray-900 text-white disabled:bg-gray-700"
                placeholder="e.g., https://t.me/yourchannel"
              />
              {isFetchingInviteLink && (
                <p className="text-orange-400 mt-1">Verifying link...</p>
              )}
              {inviteLinkData && (
                <p className="text-green-500 mt-1">
                  Verified: {inviteLinkData.title}
                </p>
              )}
            </div> */}

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
                placeholder="Enter page title (3-75 characters)"
                required
              />
              <div className="text-xs text-gray-400 mt-1">
                {telegramTitle.length}/75 characters
              </div>
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
                placeholder="Enter description (10-500 characters)"
                maxLength={500}
                required
              />
              <div className="text-xs text-gray-400 mt-1">
                {telegramDescription.length}/500 characters
              </div>
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
                      min="1"
                      max="100000"
                      onChange={(e) => {
                        const newSubs = [...subscriptions];
                        newSubs[index].cost = e.target.value === '' ? '' : parseInt(e.target.value);
                        setSubscriptions(newSubs);
                      }}
                      className="w-32 px-4 py-2 pl-16 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                      required
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
                      min="1"
                      max="3650"
                      onChange={(e) => {
                        const newSubs = [...subscriptions];
                        newSubs[index].days = e.target.value === '' ? '' : parseInt(e.target.value);
                        setSubscriptions(newSubs);
                      }}
                      className="w-64 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                      required
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
                            newSubs[index].days = null;

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
                <>
                  <input
                    type="text"
                    value={gstDetails}
                    onChange={(e) => setGstDetails(e.target.value)}
                    placeholder="Enter GST Information"
                    maxLength={200}
                    className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                    required={gstInfoRequired}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {gstDetails.length}/200 characters
                  </div>
                </>
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
                <>
                  <input
                    type="text"
                    value={courseDetails}
                    onChange={(e) => setCourseDetails(e.target.value)}
                    placeholder="Enter course access details"
                    maxLength={500}
                    className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                    required={courseAccess}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {courseDetails.length}/500 characters
                  </div>
                </>
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
              Create Subscription Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telgrampage;
