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
  verifyInviteLink,
  fetchOwnedGroups,
} from "../../../../services/auth/api.services.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Discount Percent
            </label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
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
              onSubmit({
                code: discountCode,
                percent: parseInt(discountPercent),
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

import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";
import ConnectPage from "./ConnectTelegramPage.jsx"
import TelegramHeader from "./TelegramHeader.jsx";

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
  const [freeDays, setFreeDays] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [gstInfoRequired, setGstInfoRequired] = useState(false);
  const [courseAccess, setCourseAccess] = useState(false);
  const [enableAffiliate, setEnableAffiliate] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteLinkData, setInviteLinkData] = useState(null);
  const [isFetchingInviteLink, setIsFetchingInviteLink] = useState(false);
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

  // new screen states

  const [step, setStep] = useState(0);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);

  const [error, setError] = useState("");
  const otpInputRefs = useRef([]);

  // Telegram login states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [loginSessionString, setLoginSessionString] = useState("");
  const [code, setCode] = useState("");
  const [loginStage, setLoginStage] = useState("enterPhone"); // enterPhone, enterCode
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

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

  const float = {
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      otpInputRefs.current[index + 1].focus();
    }

    // ✅ Use newOtp directly instead of outdated state
    if (index === 4 && value && newOtp.every((digit) => digit !== "")) {
      handleVerifyCode(newOtp); // ✅ Pass newOtp, not otp
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
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

  const handleConnectClick = () => {
    setStep(1);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
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

  const handleInviteLinkBlur = async () => {
    try {
      if (inviteLink === "") return;
      const match = inviteLink.match(
        /^(https?:\/\/t\.me\/(\+?[a-zA-Z0-9_-]+))$/
      );

      if (!match) {
        toast("Invalid Invite Link.");
        return;
      }

      if (inviteLink === "") return;
      const response = await verifyInviteLink(inviteLink);
      setInviteLinkData(response.data.channelDetails);
      console.log(response);
    } catch (error) {
      console.error("Error in verify invite link.", error);
    }
  };

  const loadGroups = async () => {
    setLoadingGroups(true);
    try {
      const telegramSession = localStorage.getItem('telegramSession');
      const groupsResponse = await fetchOwnedGroups(telegramSession);
      const groups = groupsResponse.data.payload.groups || [];
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
    // On initial mount, try to load groups to check for an existing session.
    loadGroups();
  }, []);

  const handleSubmit = async () => {
    console.log("discounts=-=>", discounts);
    try {
      setIsSubmitting(true);

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
      if (imageFile) {
        const imagePic = new FormData();
        imagePic.append("file", imageFile);
        response = await handelUplaodFile(imagePic);
        console.log(response);
      }

      const body = {
        title: telegramTitle,
        description: telegramDescription,
        subscriptions,
        coverImage: response?.data?.url || "",
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
        sessionString: finalSessionString, // <-- include session string
      };

      console.log("formBody==>", body);
      const telegramSession = localStorage.getItem('telegramSession');
      await createTelegram(body, telegramSession);
      window.location.href = "/dashboard/telegram";
      toast.success("Telegram Is in the Development Phase");
    } catch (error) {
      console.log("Error in creating telegram.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    if (!mobileNumber) return;
    //console.log("phoneNumber==>", mobileNumber);
    setSendingCode(true);
    try {
      const res = await sendTelegramLoginCode(`+91 ${mobileNumber}`);
      setPhoneCodeHash(res.data.payload.phoneCodeHash);
      setLoginSessionString(res.data.payload.sessionString);

      toast.success("Code sent");
      setStep(2);
    } catch {
      toast.error("Failed to send code");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (code) => {
    const fullOtp = code.join("");
    console.log(fullOtp, phoneCodeHash, loginSessionString);
    if (!fullOtp) {
      toast.error("Please enter the verification code.");
      return;
    }
    setVerifyingCode(true);

    try {
      const response = await signInTelegramClient({
        phoneNumber: `91 ${mobileNumber}`,
        phoneCodeHash,
        code: fullOtp,
        sessionString: loginSessionString,
      });
      if (response.data.success && response.data.sessionString) {
        setFinalSessionString(response.data.sessionString); // <-- store session string
        localStorage.setItem('telegramSession', response.data.sessionString); // <-- store in localStorage
        setIsTelegramAuthenticated(true);
      }
      toast.success("Successfully logged in to Telegram!");
      setOwnedGroups([]); // Clear the list before fetching new groups
      loadGroups(); // Fetch groups directly after successful login
    } catch (error) {
      console.error("Error verifying code:", error);
      const errorMessage =
        error.response?.data?.message || "Verification failed.";
      toast.error(errorMessage);
      if (errorMessage.includes("PHONE_CODE_EXPIRED")) {
        setLoginStage("enterPhone");
        setPhoneCodeHash("");
        setLoginSessionString("");
      }
    } finally {
      setVerifyingCode(false);
    }
  };

  if (loadingGroups) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  // If not logged in, show login UI
  if (!isTelegramAuthenticated) {
    return (
      <>
        {/* new opt screen starts here */}
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6">
          {/* Main Card */}
          <div className="w-2/3 h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relative z-10">

            <TelegramHeader />

            <div className="py-8 px-4 sm:px-8 max-w-md mx-auto relative overflow-hidden">
              {/* Floating decorative icons */}
              <motion.div
                className="absolute top-20 left-10 text-orange-400 opacity-20"
                variants={float}
                animate="float"
              >
                <Shield className="w-8 h-8" />
              </motion.div>
              <motion.div
                className="absolute bottom-20 right-10 text-orange-300 opacity-20"
                variants={float}
                animate="float"
              >
                <Key className="w-8 h-8" />
              </motion.div>

              <motion.div
                className="relative z-10"
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {step === 0 && (
                  <motion.div
                    className="flex flex-col items-center"
                    variants={container}
                  >
                    <div className="mb-8 text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mb-4"
                        variants={item}
                        whileHover={{ scale: 1.05 }}
                      >
                        <MessageSquare className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.p
                        className="text-gray-400 mb-6 px-4"
                        variants={item}
                      >
                        Securely connect your Telegram account to access premium
                        features on OneApp
                      </motion.p>
                    </div>

                    <motion.button
                      onClick={handleConnectClick}
                      className="w-full sm:w-3/4 py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                      variants={item}
                      whileTap={{ scale: 0.98 }}
                    >
                      Connect Accounts
                    </motion.button>

                    <motion.div
                      className="mt-6 text-xs text-gray-500 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4"
                      variants={item}
                    >
                      <motion.span
                        className="flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        End-to-end encrypted
                      </motion.span>
                      <motion.span
                        className="flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Instant setup
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    className="flex flex-col items-center"
                    variants={container}
                  >
                    <div className="mb-8 text-center">
                      <motion.div
                        className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700"
                        variants={item}
                        whileHover={{ rotate: 10 }}
                      >
                        <Phone className="w-6 h-6 text-orange-500" />
                      </motion.div>
                      <motion.p
                        className="text-gray-400 mb-6 px-4"
                        variants={item}
                      >
                        Enter your Telegram mobile number to receive a
                        verification code
                      </motion.p>
                    </div>

                    <div className="w-full sm:w-3/4 space-y-4">
                      <motion.div className="relative" variants={item}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-300">+91</span>
                        </div>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="Mobile number"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                        />
                      </motion.div>
                      {error && (
                        <motion.div
                          className="text-red-400 text-sm flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {error}
                        </motion.div>
                      )}
                      <motion.button
                        //   onClick={handleSendOtp}
                        onClick={handleSendCode}
                        className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        variants={item}
                        whileTap={{ scale: 0.98 }}
                      >
                        {sendingCode ? "Sending" : "Send OTP"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    className="flex flex-col items-center"
                    variants={container}
                  >
                    <div className="mb-8 text-center">
                      <motion.div
                        className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700"
                        variants={item}
                        animate={{
                          rotate: [0, 10, -10, 0],
                          transition: { duration: 2, repeat: Infinity },
                        }}
                      >
                        <Mail className="w-6 h-6 text-orange-500" />
                      </motion.div>
                      <motion.p className="text-gray-400" variants={item}>
                        Enter the 6-digit code sent to
                      </motion.p>
                      <motion.p
                        className="text-orange-400 font-medium mt-1"
                        variants={item}
                        animate={{
                          scale: [1, 1.05, 1],
                          transition: { duration: 2, repeat: Infinity },
                        }}
                      >
                        +91 ••• ••• {mobileNumber.slice(-4)}
                      </motion.p>
                    </div>

                    <div className="w-full sm:w-3/4 space-y-4">
                      <motion.div
                        className="flex justify-center space-x-3"
                        variants={item}
                      >
                        {[0, 1, 2, 3, 4].map((index) => (
                          <motion.input
                            key={index}
                            style={{
                              color: "white",
                            }}
                            type="tel"
                            maxLength={1}
                            value={otp[index]}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => (otpInputRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-xl bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                            whileFocus={{ scale: 1.05 }}
                            variants={item}
                            transition={{ delay: index * 0.1 }}
                          />
                        ))}
                      </motion.div>

                      {error && (
                        <motion.div
                          className="text-red-400 text-sm flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {error}
                        </motion.div>
                      )}

                      <motion.button
                        //    onClick={handleOtpSubmit}
                        disabled={
                          isSubmitting || otp.some((digit) => digit === "")
                        }
                        className={`w-full py-3 px-6 text-white font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${isSubmitting || otp.some((digit) => digit === "")
                          ? "bg-gray-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                          }`}
                        variants={item}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        {verifyingCode ? (
                          <div className="flex items-center justify-center">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                            </motion.span>
                            Verifying...
                          </div>
                        ) : (
                          "Verify & Continue"
                        )}
                      </motion.button>

                      <motion.div
                        className="text-center pt-4 border-t border-gray-700"
                        variants={item}
                      >
                        <p className="text-gray-500 text-sm">
                          {countdown > 0 ? (
                            <span>
                              Resend code in{" "}
                              <span className="text-orange-400">
                                {countdown}s
                              </span>
                            </span>
                          ) : (
                            <button
                              // onClick={handleResendOtp}
                              className="text-orange-400 hover:text-orange-300 transition-colors flex items-center justify-center mx-auto"
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Resend Verification Code
                            </button>
                          )}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            {/* Card Footer */}
            <div className="bg-gray-850 py-4 px-6 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} COHTPL •
                <a
                  href="#"
                  className="text-orange-500 hover:text-orange-300 transition-colors mx-1"
                >
                  Privacy Policy
                </a>{" "}
                •
                <a
                  href="#"
                  className="text-orange-500 hover:text-orange-300 transition-colors mx-1"
                >
                  Terms
                </a>
              </p>
            </div>
          </div>
        </div>

      </>
    );
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
                        newSubs[index].cost = parseInt(e.target.value);
                        setSubscriptions(newSubs);
                      }}
                      className="w-32 px-4 py-2 pl-16 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                    />
                    <span className="absolute left-4 top-2 text-gray-400">
                      INR
                    </span>
                  </div>

                  {sub.hasThirdBox && (
                    <input
                      type="number"
                      placeholder="Number of Days"
                      value={sub.days}
                      onChange={(e) => {
                        const newSubs = [...subscriptions];
                        newSubs[index].days = parseInt(e.target.value);
                        setSubscriptions(newSubs);
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
                          onChange={(e) => {
                            const newSubs = [...subscriptions];
                            newSubs[index].isLifetime = e.target.checked;
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
                <input
                  type="text"
                  placeholder="Enter GST Information"
                  className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                />
              )}

              {/* Course Access */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-500">
                  Give course access to members
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
              Create Subscription Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telgrampage;
