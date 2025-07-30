
import { useState, useEffect, useRef, useCallback } from "react";
import {
  PlusCircle,
  X,
  ChevronDown,
  Loader2,

} from "lucide-react";
import {
  createTelegram,
  handelUplaodFile,
  verifyInviteLink,
  fetchOwnedGroups,
} from "../../../../services/auth/api.services.js";
import toast from "react-hot-toast";

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
                percent: discountPercent,
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

import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";


// Main TelegramsPages Component
const TelegramsPages = () => {
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

  const location = useLocation();
  const { state } = location;

  const [userData, setUserData] = useState(state?.data);
  const [subDropdown, setSubDropDown] = useState(null);
  console.log("location==>", userData);

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
    setSubDropDown(index);
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

  const handleOptionClick = (option, id) => {
    setUserData((prev) => {
      const updatedData = prev?.subscriptions?.map((data, index) => {
        if (index == id) {
          return {
            ...data,
            type: option,
            isLifetime: false,
            validDays: subscriptionDays[option],
          };
        }
        return data;
      });
      return { ...prev, subscriptions: updatedData };
    });
    setSubDropDown(null);
    console.log(userData.subscriptions);
  };

  const addSubscription = () => {
    setUserData((prev) => {
      return {
        ...prev,
        subscriptions: [
          ...prev.subscriptions,
          {
            isLifetime: "",
            price: "",
            type: "",
            validDays: "",
          },
        ],
      };
    });
  };

  const [showDrop, setShowDrop] = useState(false);

  const filterData = useCallback(
    (value) => {
      const valid =
        !predefinedTypes.some((type) =>
          type.toLowerCase().includes(value?.toLowerCase())
        ) && value?.length > 0;

      setShowDrop(valid);
    },
    [userData]
  );

  const deleteSubscription = (index) => {
    const updatedSubscriptions = subscriptions.filter((_, i) => i !== index);
    setSubscriptions(updatedSubscriptions);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    // setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
      const imagePic = new FormData();
      imagePic.append("file", file);
      try {
        let response = await handelUplaodFile(imagePic);
        setUserData((prev) => {
          return { ...prev, coverImage: response?.data?.url };
        });
      } catch (error) {
        console.log("error while uploading image");
      }
    }
  };
  console.log(uploadedImage);
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageAspectRatio(naturalWidth / naturalHeight);
  };

  const handleClickOutside = (e, index) => {
    setSubDropDown(null);
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


  const handleSubmit = async () => {
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
        discount: discounts,
      };

      await createTelegram(body);
      window.location.href = "/dashboard/telegram";
      toast.success("Telegram Is in the Development Phase");
    } catch (error) {
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
                  value={userData?.chatId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const group = ownedGroups.find((g) => g.id === selectedId);
                    setUserData({
                      ...userData,
                      chatId: selectedId,
                    });
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
                  {userData?.coverImage ? (
                    <img
                      src={userData?.coverImage}
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
                value={userData?.title}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    title: e.target.value,
                  })
                }
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
                value={userData?.description}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    description: e.target.value,
                  })
                }
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
                value={userData?.genre}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    genre: e.target.value,
                  })
                }
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

              {userData?.subscriptions?.map((sub, index) => (
                <div key={index} className="flex gap-4 items-start relative">
                  <div className="relative subscription-dropdown">
                    <div className="relative">
                      <input
                        type="text"
                        value={sub?.type}
                        onChange={(e) => {
                          setUserData((prev) => {
                            const updatedData = prev?.subscriptions?.map(
                              (data, i) => {
                                if (index == i) {
                                  return {
                                    ...data,
                                    type: e.target.value,
                                  };
                                }
                                return data;
                              }
                            );
                            return { ...prev, subscriptions: updatedData };
                          });
                          filterData(e.target.value);
                        }}
                        onClick={() => toggleDropdown(index)}
                        //onBlur={(e) => handleClickOutside(e, index)}
                        placeholder="Select type"
                        className="w-64 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white pr-8"
                      />
                      <ChevronDown
                        className={`absolute right-2 top-3 w-4 h-4 text-gray-400 transition-transform duration-200 ${sub.showDropdown ? "transform rotate-180" : ""
                          }`}
                      />
                    </div>

                    {subDropdown === index && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-orange-600 rounded-lg shadow-lg">
                        {showDrop && (
                          <div
                            onClick={() => handleCreateClick(index)}
                            className="px-4 py-3 text-sm text-orange-500 bg-gray-900 cursor-pointer hover:bg-gray-700"
                          >
                            Create "{sub?.type}"
                          </div>
                        )}

                        {predefinedTypes.filter((type) =>
                          type.toLowerCase().includes(sub?.type.toLowerCase())
                        ).length > 0 && (
                            <div className="max-h-48 overflow-auto">
                              {predefinedTypes
                                .filter((type) =>
                                  type
                                    .toLowerCase()
                                    .includes(sub?.type.toLowerCase())
                                )
                                .map((option) => (
                                  <div
                                    key={option}
                                    className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-700"
                                    onClick={() => {
                                      handleOptionClick(option, index);
                                    }}
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
                      value={sub?.price}
                      onChange={(e) => {
                        setUserData((prev) => {
                          const updatedData = prev?.subscriptions?.map(
                            (data, i) => {
                              if (index == i) {
                                return {
                                  ...data,
                                  price: parseInt(e.target.value),
                                };
                              }
                              return data;
                            }
                          );
                          return { ...prev, subscriptions: updatedData };
                        });
                      }}
                      className="w-32 px-4 py-2 pl-16 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                    />
                    <span className="absolute left-4 top-2 text-gray-400">
                      INR
                    </span>
                  </div>

                  {(!predefinedTypes.some(
                    (type) => type.toLowerCase() === sub?.type.toLowerCase()
                  ) ||
                    sub?.type === "") && (
                      <input
                        type="number"
                        placeholder="Number of Days"
                        value={sub?.validDays}
                        onChange={(e) => {
                          setUserData((prev) => {
                            const updatedData = prev?.subscriptions?.map(
                              (data, i) => {
                                if (index == i) {
                                  return {
                                    ...data,
                                    validDays: parseInt(e.target.value),
                                  };
                                }
                                return data;
                              }
                            );
                            return { ...prev, subscriptions: updatedData };
                          });
                        }}
                        className="w-64 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-900 text-white"
                      />
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

export default TelegramsPages;
