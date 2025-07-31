
import { useState, useEffect, useRef, useCallback } from "react";
import {
  PlusCircle,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  createTelegram,
  editTelegram,
  handelUplaodFile,
  verifyInviteLink,
  fetchOwnedGroups,
  editTelegramDiscount,
  deleteTelegramDiscount,
  editTelegramSubscription,
  deleteTelegramSubscription,
  createTelegramDiscount,
  createTelegramSubscription,
  getCreatorTelegramById,
} from "../../../../services/auth/api.services.js";
import toast from "react-hot-toast";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 rounded-lg transition duration-200 ${type === "danger"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
          >
            {type === "danger" ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Discount Form Component
const DiscountForm = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // Update form fields when editData changes
  useEffect(() => {
    if (editData) {
      setDiscountCode(editData.code || "");
      setDiscountPercent(editData.percent?.toString() || "");
      setExpiryDate(editData.expiry ? new Date(editData.expiry).toISOString().split('T')[0] : "");
      setSelectedPlan(editData.plan || "");
    } else {
      // Reset form for new discount
      setDiscountCode("");
      setDiscountPercent("");
      setExpiryDate("");
      setSelectedPlan("");
    }
  }, [editData]);

  const isEditing = !!editData;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Edit Discount" : "Create New Discount"}
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
              Discount Percent (1-99%)
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
                id: editData?.id,
                code: discountCode,
                percent: parseFloat(discountPercent),
                expiry: expiryDate,
                plan: selectedPlan,
              });
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Subscription Edit Form Component
const SubscriptionEditForm = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [subscriptionType, setSubscriptionType] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [subscriptionDays, setSubscriptionDays] = useState("");
  const [isLifetime, setIsLifetime] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const predefinedTypes = [
    "Weekly",
    "Monthly",
    "Bimonthly",
    "Quarterly",
    "Quadrimester",
    "Half Yearly",
    "Yearly",
  ];

  const predefinedDays = {
    Weekly: 7,
    Monthly: 30,
    Bimonthly: 60,
    Quarterly: 90,
    Quadrimester: 120,
    "Half Yearly": 180,
    Yearly: 365,
  };

  // Update form fields when editData changes
  useEffect(() => {
    if (editData) {
      setSubscriptionType(editData.type || "");
      setSubscriptionPrice(editData.price?.toString() || "");
      setSubscriptionDays(editData.validDays?.toString() || "");
      setIsLifetime(editData.isLifetime || false);
    } else {
      // Reset form for new subscription
      setSubscriptionType("");
      setSubscriptionPrice("");
      setSubscriptionDays("");
      setIsLifetime(false);
    }
  }, [editData]);

  const handleTypeInputChange = (value) => {
    setSubscriptionType(value);
    setShowDropdown(true);
    setShowCreate(
      !predefinedTypes.some((type) =>
        type.toLowerCase().includes(value.toLowerCase())
      ) && value.length > 0
    );
  };

  const handleOptionClick = (option) => {
    setSubscriptionType(option);
    setSubscriptionDays(predefinedDays[option]?.toString() || "");
    setShowDropdown(false);
    setShowCreate(false);
    setIsLifetime(false);
  };

  const handleCreateClick = () => {
    setShowCreate(false);
    setShowDropdown(false);
    setSubscriptionDays("");
  };

  const isEditing = !!editData;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Edit Subscription" : "Create New Subscription"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Subscription Type
            </label>
            <div className="relative">
              <input
                type="text"
                value={subscriptionType}
                onChange={(e) => handleTypeInputChange(e.target.value)}
                onClick={() => setShowDropdown(true)}
                onBlur={(e) => {
                  // Delay to allow click on dropdown options
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                className="w-full px-4 py-2 pr-8 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
                placeholder="Select or type subscription type"
              />
              <ChevronDown
                className={`absolute right-2 top-3 w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? "transform rotate-180" : ""
                  }`}
              />
            </div>

            {(showDropdown || showCreate) && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-orange-600 rounded-lg shadow-lg">
                {showCreate && (
                  <div
                    onClick={handleCreateClick}
                    className="px-4 py-3 text-sm text-orange-500 bg-gray-900 cursor-pointer hover:bg-gray-700"
                  >
                    Create "{subscriptionType}"
                  </div>
                )}

                {predefinedTypes.filter((type) =>
                  type.toLowerCase().includes(subscriptionType.toLowerCase())
                ).length > 0 && (
                    <div className="max-h-48 overflow-auto">
                      {predefinedTypes
                        .filter((type) =>
                          type.toLowerCase().includes(subscriptionType.toLowerCase())
                        )
                        .map((option) => (
                          <div
                            key={option}
                            className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-700"
                            onClick={() => handleOptionClick(option)}
                          >
                            {option}
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-500 mb-2">
              Price (INR)
            </label>
            <input
              type="number"
              value={subscriptionPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || parseFloat(value) >= 0) {
                  setSubscriptionPrice(value);
                }
              }}
              min="0"
              className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
              placeholder="Enter price"
            />
          </div>

          {/* Only show lifetime option for custom types, not predefined ones */}
          {!predefinedTypes.includes(subscriptionType) && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-500">
                Lifetime Subscription
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isLifetime}
                  onChange={(e) => {
                    setIsLifetime(e.target.checked);
                    if (e.target.checked) {
                      setSubscriptionDays("");
                    }
                  }}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          )}

          {!isLifetime && (showCreate || !predefinedTypes.includes(subscriptionType)) && (
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Valid Days
              </label>
              <input
                type="number"
                value={subscriptionDays}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || parseInt(value) >= 1) {
                    setSubscriptionDays(value);
                  }
                }}
                min="1"
                className="w-full px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white"
                placeholder="Enter number of days"
              />
            </div>
          )}
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
              if (!subscriptionType.trim()) {
                toast.error("Please enter a subscription type");
                return;
              }
              if (!subscriptionPrice || parseFloat(subscriptionPrice) <= 0) {
                toast.error("Please enter a valid price greater than 0");
                return;
              }
              // For predefined types, days are auto-set and lifetime is not allowed. For custom types, user must enter days.
              const isPredefinedType = predefinedTypes.includes(subscriptionType);
              let finalDays;
              let finalIsLifetime = false;

              if (isPredefinedType) {
                finalDays = predefinedDays[subscriptionType];
                finalIsLifetime = false; // Predefined types cannot be lifetime
              } else {
                finalDays = isLifetime ? null : parseInt(subscriptionDays);
                finalIsLifetime = isLifetime;
              }

              if (!finalIsLifetime && (!finalDays || finalDays <= 0)) {
                toast.error("Please enter valid days for non-lifetime subscription");
                return;
              }

              onSubmit({
                id: editData?.id,
                type: subscriptionType,
                price: parseFloat(subscriptionPrice),
                validDays: finalIsLifetime ? null : finalDays,
                isLifetime: finalIsLifetime,
              });
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

import { useLocation, useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";


const TelegramsPages = () => {
  const telegramId = useSearchParams()[0].get("telegramId");

  const { userDetails } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [gstInfoRequired, setGstInfoRequired] = useState(false);
  const [gstDetails, setGstDetails] = useState("");
  const [courseAccess, setCourseAccess] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [imageAspectRatio, setImageAspectRatio] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatid, setChatid] = useState("");
  const [ownedGroups, setOwnedGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [isTelegramAuthenticated, setIsTelegramAuthenticated] = useState(false);
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

  const handleDiscountSubmit = async (discountData) => {
    try {
      if (discountData.id) {
        // Edit existing discount
        await editTelegramDiscount(userData.id, discountData.id, discountData);
        setExistingDiscounts(prev => prev.map(d => d.id === discountData.id ? discountData : d));
        toast.success("Discount updated successfully");
        setEditingDiscount(null);
      } else {
        // Create new discount
        const response = await createTelegramDiscount(userData.id, discountData);
        const newDiscount = response.data.discount || {
          id: Date.now(), // Temporary ID
          ...discountData
        };
        setExistingDiscounts(prev => [...prev, newDiscount]);
        toast.success("Discount created successfully");
      }
      loadTelegramData()
    } catch (error) {
      console.error("Error with discount:", error);
      toast.error(discountData.id ? error?.response?.data?.message || `Failed to update discount` : error?.response?.data?.message || "Failed to create discount");
    }
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setIsDiscountModalOpen(true);
  };

  const handleDeleteDiscount = (discount) => {
    if (!discount?.id) {
      toast.error("Cannot delete discount: Invalid discount data");
      return;
    }

    setDeleteConfirmModal({
      isOpen: true,
      type: 'discount',
      item: discount,
      title: 'Delete Discount',
      message: `Are you sure you want to delete the discount "${discount.code}"? This action cannot be undone.`
    });
  };

  const confirmDeleteDiscount = async () => {
    const discountId = deleteConfirmModal.item?.id;

    if (!discountId) {
      toast.error("Cannot delete discount: Invalid discount ID");
      return;
    }

    try {
      await deleteTelegramDiscount(userData.id, discountId);
      setExistingDiscounts(prev => prev.filter(d => d.id !== discountId));
      toast.success("Discount deleted successfully");
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Failed to delete discount");
    }
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setIsSubscriptionModalOpen(true);
  };

  const handleSubscriptionSubmit = async (subscriptionData) => {
    try {
      if (subscriptionData.id) {
        // Edit existing subscription
        await editTelegramSubscription(userData.id, subscriptionData.id, subscriptionData);
        setExistingSubscriptions(prev => prev.map(s => s.id === subscriptionData.id ? subscriptionData : s));
        toast.success("Subscription updated successfully");
        setEditingSubscription(null);
      } else {
        // Create new subscription
        const response = await createTelegramSubscription(userData.id, subscriptionData);
        const newSubscription = response.data.subscription || {
          id: Date.now(), // Temporary ID
          ...subscriptionData
        };
        setExistingSubscriptions(prev => [...prev, newSubscription]);
        toast.success("Subscription created successfully");
      }
      loadTelegramData()
    } catch (error) {
      console.error("Error with subscription:", error);
      toast.error(subscriptionData.id ? "Failed to update subscription" : "Failed to create subscription");
    }
  };

  const handleDeleteSubscription = (subscription) => {
    if (!subscription?.id) {
      toast.error("Cannot delete subscription: Invalid subscription data");
      return;
    }

    setDeleteConfirmModal({
      isOpen: true,
      type: 'subscription',
      item: subscription,
      title: 'Delete Subscription',
      message: `Are you sure you want to delete the "${subscription.type}" subscription? This action cannot be undone.`
    });
  };

  const confirmDeleteSubscription = async () => {
    const subscriptionId = deleteConfirmModal.item?.id;

    if (!subscriptionId) {
      toast.error("Cannot delete subscription: Invalid subscription ID");
      return;
    }

    try {
      await deleteTelegramSubscription(userData.id, subscriptionId);
      setExistingSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));
      toast.success("Subscription deleted successfully");
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    }
  };

  const [userData, setUserData] = useState({
    title: "",
    description: "",
    genre: "education",
    subscriptions: [],
    discounts: [],
    coverImage: "",
    chatId: ""
  });

  const [existingDiscounts, setExistingDiscounts] = useState([]);
  const [existingSubscriptions, setExistingSubscriptions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: '',
    item: null,
    title: '',
    message: ''
  });

  const loadTelegramData = async () => {
    if (!telegramId) return

    try {
      setIsLoadingData(true);
      const response = await getCreatorTelegramById(telegramId);
      const telegramData = response.data.payload.telegram;

      // Set the main user data
      setUserData({
        id: telegramData.id,
        title: telegramData.title || "",
        description: telegramData.description || "",
        genre: telegramData.genre || "education",
        subscriptions: telegramData.subscriptions || [],
        discounts: telegramData.discounts || [],
        coverImage: telegramData.coverImage || "",
        chatId: telegramData.chatId || "",
        gstDetails: telegramData.gstDetails || "",
        courseDetails: telegramData.courseDetails || "",
      });

      // Set existing discounts and subscriptions
      setExistingDiscounts(telegramData.discounts || []);
      setExistingSubscriptions(telegramData.subscriptions || []);

      // Set GST and course states
      if (telegramData.gstDetails) {
        setGstInfoRequired(true);
        setGstDetails(telegramData.gstDetails);
      }

      if (telegramData.courseDetails) {
        setCourseAccess(true);
        setCourseDetails(telegramData.courseDetails);
      }

      // Set uploaded image if exists
      if (telegramData.coverImage) {
        setUploadedImage(telegramData.coverImage);
      }

    } catch (error) {
      console.error("Error loading telegram data:", error);
      toast.error("Failed to load telegram data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadTelegramData();
  }, [telegramId]);

  useEffect(() => {
    if (!userData?.subscriptions || userData.subscriptions.length === 0) {
      setUserData(prev => ({
        ...prev,
        subscriptions: [{
          type: "",
          price: "",
          validDays: "",
          isLifetime: false
        }]
      }));
    }
  }, [userData?.subscriptions]);



  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingImage(true);
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
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error while uploading image:", error);
        toast.error("Failed to upload image");
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


  const loadGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await fetchOwnedGroups();
      const groups = res.data.payload.groups || [];
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


  const handleUpdateTelegram = async () => {
    try {
      setIsSubmitting(true);

      if (!userData?.title?.trim()) {
        toast.error("Please enter a title for your telegram channel");
        setIsSubmitting(false);
        return;
      }

      if (!userData?.description?.trim()) {
        toast.error("Please enter a description for your telegram channel");
        setIsSubmitting(false);
        return;
      }

      const updateData = {
        title: userData.title,
        description: userData.description,
        genre: userData.genre,
        coverImage: userData.coverImage,
        gstDetails: gstInfoRequired ? gstDetails : null,
        courseDetails: courseAccess ? courseDetails : null,
        subscriptions: userData.subscriptions?.filter(sub =>
          (sub.type || sub.inputValue) && (sub.price !== undefined && sub.price !== '') &&
          (sub.isLifetime || (sub.validDays !== undefined && sub.validDays !== ''))
        ).map(sub => ({
          type: sub.type || sub.inputValue,
          cost: sub.price,
          price: sub.price,
          days: sub.validDays,
          validDays: sub.validDays,
          isLifetime: sub.isLifetime || false,
        })) || [],
      };

      await editTelegram(userData.id, updateData);
      toast.success("Telegram channel updated successfully!");

      setTimeout(() => {
        window.location.href = "/dashboard/telegram";
      }, 500);
    } catch (error) {
      console.error("Error updating telegram:", error);
      toast.error("Failed to update telegram channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
        <p className="text-white ml-4">Loading telegram data...</p>
      </div>
    );
  }

  if (!userData.id && !isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">No telegram data found</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header Section */}
      <div className="w-full h-64 bg-gradient-to-r from-orange-500 to-orange-600 flex justify-center items-center relative">
        <h1 className="font-bold text-white text-3xl md:text-4xl mb-8">
          Edit Subscription
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="max-w-4xl mx-auto -mt-24 bg-slate-900 rounded-xl shadow-lg z-10 relative border border-gray-700">
        <div className="p-6">
          {/* Cover Picture */}
          <div className=" flex items-center justify-between gap-2.5 flex-wrap">
            <div className="mb-4  flex-1">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Telegram Group
              </label>
              {ownedGroups.length > 0 ? (
                <select
                  value={userData?.chatId}
                  disabled={true}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-400 cursor-not-allowed"
                >
                  <option value="" disabled>
                    Choose from your owned groups
                  </option>

                  <option key={userData?.chatId} value={userData?.chatId}>
                    {userData.title} (Group ID: {userData?.chatId})
                  </option>
                </select>
              ) : (
                <input
                  type="text"
                  value={userData?.chatId || chatid}
                  readOnly={true}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-400 cursor-not-allowed placeholder-gray-500"
                  placeholder="Telegram Group ID (Cannot be changed)"
                />
              )}
            </div>
            <div className="mb-8 ">
              <label className="block text-sm font-medium text-orange-500 mb-2">
                Cover Picture
              </label>
              <div className="flex items-center gap-4 flex-wrap">
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

              {existingDiscounts.length > 0 && (
                <div className="space-y-2 mb-4">
                  {existingDiscounts.map((discount, index) => (
                    <div
                      key={discount.id || index}
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
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-400 text-sm">
                          Expires:{" "}
                          {new Date(discount.expiry).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => handleEditDiscount(discount)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mr-2"
                          title="Edit discount"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(discount)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete discount"
                        >
                          <X size={16} />
                        </button>
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
                onClose={() => {
                  setIsDiscountModalOpen(false);
                  setEditingDiscount(null);
                }}
                onSubmit={handleDiscountSubmit}
                editData={editingDiscount}
              />
            </div>

            {/* Existing Subscriptions */}
            {existingSubscriptions.length > 0 && (
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-orange-500 mb-2">
                  Current Subscriptions
                </label>
                {existingSubscriptions.map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-orange-600">
                    <div>
                      <span className="text-white font-medium">{sub.type}</span>
                      <span className="text-gray-400 ml-2">₹{sub.price}</span>
                      {sub.isLifetime ? (
                        <span className="text-green-400 ml-2">(Lifetime)</span>
                      ) : (
                        <span className="text-gray-400 ml-2">({sub.validDays} days)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSubscription(sub)}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Edit subscription"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubscription(sub)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete subscription"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create New Subscription */}
            <div className="flex gap-4 ">
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
              >
                Create New Subscription
              </button>
            </div>

            <SubscriptionEditForm
              isOpen={isSubscriptionModalOpen}
              onClose={() => {
                setIsSubscriptionModalOpen(false);
                setEditingSubscription(null);
              }}
              onSubmit={handleSubscriptionSubmit}
              editData={editingSubscription}
            />

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
              onClick={handleUpdateTelegram}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Telegram Channel"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ ...deleteConfirmModal, isOpen: false })}
        onConfirm={deleteConfirmModal.type === 'discount' ? confirmDeleteDiscount : confirmDeleteSubscription}
        title={deleteConfirmModal.title}
        message={deleteConfirmModal.message}
        type="danger"
      />
    </div>
  );
};

export default TelegramsPages;
