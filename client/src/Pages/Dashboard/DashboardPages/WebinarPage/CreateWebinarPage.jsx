import { ChevronLeft, Video, Upload, Calendar, Clock, IndianRupee, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Pencil, Trash2, Plus } from 'lucide-react';
import  toast  from "react-hot-toast";
import {
  createNewWebinarRequest,
  handelUplaodFile,
  fetchWebinar,
  editWebinar
} from "../../../../services/auth/api.services";

const CreateWebinarPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const webinarId = queryParams.get("id");
  const isEditMode = !!webinarId;

  const todayDate = dayjs().format("YYYY-MM-DD");
  const [EventDetails, setEventDetails] = useState({
    title: "",
    category: "Finance",
    isOnline: true,
    venue: "",
    link: "",
    isPaid: false,
    quantity: 0,
    amount: 0,
    startDateTime: "",
    occurrence: "",
    endDateTime: "",
    coverImage: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Finance");
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabPay, setActiveTabPay] = useState(0);
  const [eventTab, setEventTab] = useState(0);
  const [occurDropdownOpen, setOccurDropdownOpen] = useState(false);
  const [selectedOccurrence, setSelectedOccurrence] = useState("weekly");
  const [showDiscount, setShowDiscount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    discountCode: '',
    discountPercent: '',
    discountExpiry: ''
  });

  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // Load webinar data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchWebinarData(webinarId);
    }
  }, [isEditMode, webinarId]);

  const fetchWebinarData = async (id) => {
    try {
      const response = await fetchWebinar(id);
      if (response.status === 200) {
        const webinarData = response.data.payload.webinar;
                
        // Set all the fields from the fetched data
        setEventDetails({
          title: webinarData.title || "",
          category: webinarData.category || "Finance",
          isOnline: webinarData.isOnline,
          venue: webinarData.venue || "",
          link: webinarData.link || "",
          isPaid: webinarData.isPaid,
          quantity: webinarData.quantity || 0,
          amount: webinarData.amount || 0,
          startDateTime: webinarData.startDate ? new Date(webinarData.startDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$3-$1-$2T$4:$5') : "",
          occurrence: webinarData.occurrence || "",
          endDateTime: webinarData.endDate ? new Date(webinarData.endDate).toLocaleString('en-US', {
            year: 'numeric', 
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$3-$1-$2T$4:$5') : "",
          coverImage: webinarData.coverImage || null,
        });

        // Set other state based on fetched data
        setSelectedOption(webinarData.category || "Finance");
        setActiveTab(webinarData.isOnline ? (webinarData.link.platformLink ? 1 : 0) : 2);
        setActiveTabPay(webinarData.isPaid ? 1 : 0);
        setEventTab(webinarData.occurrence ? 1 : 0);
        setSelectedOccurrence(webinarData.occurrence || "");
        
        // Load coupons if available
        if (webinarData.coupons && webinarData.coupons.length > 0) {
          setCoupons(webinarData.coupons.map(coupon => ({
            id: coupon.id,
            discountCode: coupon.discountCode,
            discountPercent: coupon.discountPercent,
            discountExpiry: coupon.discountExpiry
          })));
        }
        
        toast.success("Webinar data loaded successfully");
      } else {
        toast.error("Failed to load webinar data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error loading webinar data");
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      setCoupons(coupons.map(coupon => 
        coupon.id === editingCouponId 
          ? { ...formData, id: editingCouponId }
          : coupon
      ));
      setIsEditing(false);
      setEditingCouponId(null);
    } else {
      setCoupons([...coupons, { ...formData, id: Date.now() }]);
    }
    
    setFormData({
      discountCode: '',
      discountPercent: '',
      discountExpiry: ''
    });
    setShowDiscount(false);
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setIsEditing(true);
    setEditingCouponId(coupon.id);
    setShowDiscount(true);
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
  };

  // Create refs for datetime inputs
  const startDateTimeRef = useRef(null);
  const endDateTimeRef = useRef(null);

  const tabs = [{ title: "Zoom" }, { title: "Add link" }, { title: "Offline" }];
  const eventTabs = [{ title: "Single Event" }, { title: "Recurring Event" }];
  const costTab = [{ title: "Free" }, { title: "Paid" }];
  const eventCategory = ["Finance", "Education", "Astrology", "Others"];

  // Dropdown handlers
  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);
  const handleOptionSelect = (option) => {
    setEventDetails((prev) => ({ ...prev, category: option }));
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  // Occurrence dropdown handlers
  const handleOccurDropdownToggle = () =>
    setOccurDropdownOpen(!occurDropdownOpen);
  const handleOccurOptionSelect = (option) => {
    setEventDetails((prev) => ({ ...prev, occurrence: option }));
    setSelectedOccurrence(option);
    setOccurDropdownOpen(false);
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const filedata = new FormData();
    filedata.append("file", file);
    
    setIsUploading(true); // Start loading
    try {
      const response = await handelUplaodFile(filedata);
      if (response.status === 200) {
        setEventDetails((prev) => ({ ...prev, coverImage: response.data.url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false); // Stop loading
    }
  };

  // Date/Time picker handlers
  const handleIconClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  // Update handelCreateNewWebinar to handle both create and edit
  const handelCreateNewWebinar = async () => {
    try { 
           
      let response;
      // Prepare the payload
    const payload = {
      ...EventDetails,
      discount: coupons // Include the coupons array in the payload
    };
      
      if (isEditMode) {
        // Edit existing webinar
        response = await editWebinar(webinarId, payload);
        if (response.status === 200) {
          toast.success("Webinar updated successfully");
          navigate("/dashboard/webinar");
        } else {
          toast.error("Webinar update failed");
        }
      } else {
        // Create new webinar
        response = await createNewWebinarRequest(payload);
        if (response.status === 200) {
          toast.success("Webinar created successfully");
          navigate("/dashboard/webinar");
        } else {
          toast.error("Webinar creation failed");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-6xl px-6 py-8">
          {/* Navbar */}
          <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm mb-8 rounded-xl border border-orange-500/20">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <IoArrowBackCircleOutline
                  className="text-orange-500 w-8 h-8 hover:text-orange-400 transition-colors cursor-pointer"
                  onClick={() => navigate("/dashboard/webinar")}
                />
                <div className="w-px h-8 bg-orange-500/30"></div>
                <h2 className="text-2xl font-bold text-orange-500">
                  {isEditMode ? "Edit Webinar" : "New Webinar Page"}
                </h2>
              </div>
              <button
                onClick={handelCreateNewWebinar}
                type="button"
                className="bg-orange-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-700 transition duration-200 shadow-md hover:shadow-lg ml-auto"
              >
                {isEditMode ? "Update" : "Publish"}
              </button>
            </div>
          </div>

          {/* Upload Image Section */}
          <div className="space-y-8 bg-gray-900 rounded-xl p-8 border border-orange-500/20">
            <div
              className={`${
                imagePreview ? "h-auto" : "h-80"
              } w-full border-2 border-dashed overflow-hidden   border-orange-500/30 rounded-lg hover:border-orange-500 transition-all relative`}
            >
              {EventDetails.coverImage ? (
                <div className="w-full h-full  relative">
                  {/* Image Preview */}
                  <div className="relative w-full h-80 object-contain  ">
                    <img
                      src={EventDetails.coverImage}
                      alt="Event Cover Preview"
                      className="relative w-full h-full p-4 object-contain rounded-lg"
                    />
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      setEventDetails((prev) => ({
                        ...prev,
                        coverImage: null,
                      }))
                    } // Clear the preview
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {/* Cross Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center h-full space-y-4"
                >
                  <div className="bg-orange-500/10 p-4 rounded-full">
                    {isUploading ? (
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-orange-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">
                      {isUploading ? "Uploading..." : `Upload a cover image or video `}<span className="text-red-500">*</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      16:9 ratio recommended for best results
                    </p>
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Event Information Form */}
          <div className="space-y-4 p-6 rounded-xl bg-gray-900 border border-orange-500/20 mt-4 mb-4">
            {" "}
            {/* Added vertical margin here */}
            <div className="bg-black/50 rounded-lg p-6 shadow-lg space-y-6">
              <label className="text-orange-500 font-semibold">
                What is your event? <span className="text-red-500">*</span>
              </label>
              <hr className="border-orange-500/20" />

              <div className="space-y-4">
                <input
                  onChange={(e) =>
                    setEventDetails((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Event Title"
                  value={EventDetails.title}
                  className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className="w-full flex justify-between  bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-left text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                  >
                    {selectedOption}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute w-full bg-black/90 border-2 border-orange-500/30 rounded-lg mt-1 shadow-xl z-10">
                      {eventCategory.map((option) => (
                        <li
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className="px-4 py-2 hover:bg-orange-500/10 cursor-pointer text-sm text-white transition-colors"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="space-y-4 p-6 rounded-xl bg-gray-900 border border-orange-500/20">
            <div className="bg-black/50 rounded-lg p-6 shadow-lg space-y-6">
              <label className="text-orange-500 font-semibold">
                Event Information <span className="text-red-500">*</span>
              </label>

              <hr className="border-orange-500/20" />

              <div className="flex gap-4">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(index);
                      setEventDetails((prev) => ({
                        ...prev,
                        isOnline: index === 2 ? false : true,
                        link: {
                          meetingLink: "",
                          meetingId: "",
                          meetingPassword: "",
                          platformLink: "",
                        },
                        venue: "",
                      }));
                    }}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === index
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-black/40 text-gray-300 hover:bg-orange-500/10"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-black/40 rounded-lg">
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white">
                      Connect with Zoom to automatically generate Zoom meetings
                    </h3>
                    <button
                      type="button"
                      className="bg-orange-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-700 transition duration-200 flex items-center gap-2 shadow-md"
                    >
                      <Video className="w-4 h-4" />
                      Zoom
                    </button>
                    <p className="text-gray-400">
                      Or enter meeting information manually:
                    </p>
                    <div className="space-y-3">
                      <input
                        onChange={(e) =>
                          setEventDetails((prev) => ({
                            ...prev,
                            link: {
                              ...prev.link,
                              meetingLink: e.target.value,
                            },
                          }))
                        }
                        type="text"
                        value={EventDetails.link?.meetingLink || ""}
                        placeholder="Zoom Meeting Link"
                        className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                      <input
                        onChange={(e) =>
                          setEventDetails((prev) => ({
                            ...prev,
                            link: {
                              ...prev.link,
                              meetingId: e.target.value,
                            },
                          }))
                        }
                        type="text"
                        value={EventDetails.link?.meetingId || ""}
                        placeholder="Meeting ID"
                        className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                      <input
                        onChange={(e) => {
                          setEventDetails((prev) => ({
                            ...prev,
                            link: {
                              ...prev.link,
                              meetingPassword: e.target.value,
                            },
                          }));
                        }}
                        type="text"
                        value={EventDetails.link?.meetingPassword || ""}
                        placeholder="Meeting Password"
                        className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}
                {activeTab === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white">
                      Virtual Event Details
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Add URL of GMeet, YouTube, Microsoft Teams, or wherever it
                      will take place.
                    </p>
                    <input
                      onChange={(e) => {
                        setEventDetails((prev) => ({
                          ...prev,
                          link: {
                            ...prev.link,
                            platformLink: e.target.value,
                          },
                        }));
                      }}
                      type="text"
                      value={EventDetails.link?.platformLink || ""}
                      placeholder="Platform Link (e.g., Google Meet, Teams)"
                      className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white">
                      In-Person Event Location
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Enter the venue location to help attendees find their way
                      to your event.
                    </p>
                    <input
                      onChange={(e) => {
                        setEventDetails((prev) => ({
                          ...prev,
                          venue: e.target.value,
                        }));
                      }}
                      type="text"
                      value={EventDetails.venue || ""}
                      placeholder="Venue Location"
                      className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Timing */}
          <div className="space-y-4 p-6 rounded-xl bg-gray-900 border border-orange-500/20 mt-4 mb-4">
            <div className="bg-black/50 rounded-lg p-6 shadow-lg space-y-6">
              <label className="text-orange-500 font-semibold">
                Event Timing <span className="text-red-500">*</span>
              </label>

              <hr className="border-orange-500/20" />

              <div className="flex gap-4">
                {eventTabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setEventTab(index)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      eventTab === index
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-black/40 text-gray-300 hover:bg-orange-500/10"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="space-y-4 bg-black/40 p-6 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">
                    Event Start:
                  </label>
                  <div className="relative">
                    <input
                      ref={startDateTimeRef}
                      onChange={(e) => {
                        setEventDetails((prev) => ({
                          ...prev,
                          startDateTime: e.target.value,
                        }));
                      }}
                      type="datetime-local"
                      value={EventDetails.startDateTime}
                      className="w-full bg-black border border-orange-500 rounded-lg p-3 text-sm text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      onClick={() => handleIconClick(startDateTimeRef)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-400"
                    >
                      <Calendar size={20} />
                    </button>
                  </div>
                </div>

                {eventTab === 1 && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">
                      Repeat Every:
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={handleOccurDropdownToggle}
                        className="w-full flex justify-between bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-left text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                      >
                        {selectedOccurrence} <ChevronDown className="w-4 h-4" />
                      </button>
                      {occurDropdownOpen && (
                        <ul className="absolute w-full bg-black/90 border-2 border-orange-500/30 rounded-lg mt-1 shadow-xl z-10">
                          {["Daily", "Weekly", "Monthly"].map((option) => (
                            <li
                              key={option}
                              onClick={() => handleOccurOptionSelect(option)}
                              className="px-4 py-2 hover:bg-orange-500/10 cursor-pointer text-sm text-white transition-colors"
                            >
                              {option}  
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">
                    Event End:
                  </label>
                  <div className="relative">
                    <input
                      ref={endDateTimeRef}
                      onChange={(e) => {
                        setEventDetails((prev) => ({
                          ...prev,
                          endDateTime: e.target.value,
                        }));
                      }}
                      type="datetime-local"
                      value={EventDetails.endDateTime}
                      min={EventDetails.startDateTime}
                      className="w-full bg-black border border-orange-500 rounded-lg p-3 text-sm text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      onClick={() => handleIconClick(endDateTimeRef)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-400"
                    >
                      <Calendar size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="space-y-4 p-6 rounded-xl bg-gray-900 border border-orange-500/20">
            <h2 className="text-lg font-bold text-orange-500">
              Ticket Information <span className="text-red-500">*</span>
            </h2>
            <hr className="border-orange-500/30" />

            <div className="flex gap-4">
              {costTab.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveTabPay(index);
                    setEventDetails((prev) => ({
                      ...prev,
                      isPaid: index === 1,
                    }));
                  }}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTabPay === index
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-black/80 text-orange-400 hover:bg-orange-50"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="space-y-4 bg-black/80 p-6 rounded-lg">
              {activeTabPay === 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-orange-500">
                    Ticket Quantity:
                  </label>
                  <input
                    onChange={(e) => {
                      setEventDetails((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }));
                    }}
                    type="number"
                    value={EventDetails.quantity}
                    placeholder="Enter ticket quantity"
                    className="w-full border border-orange-500/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-black/70 text-orange-400 placeholder-orange-400"
                  />
                </div>
              )}
              {activeTabPay === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-orange-500">
                      Ticket Quantity:
                    </label>
                    <input
                      onChange={(e) => {
                        setEventDetails((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }));
                      }}
                      type="number"
                      value={EventDetails.quantity}
                      placeholder="Enter ticket quantity"
                      className="w-full border border-orange-500/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-black/70 text-orange-400 placeholder-orange-400"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-orange-500">
                      Ticket Price:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-orange-400">
                       <IndianRupee className="w-4 h-4" />
                        
                      </span>
                      <input
                        onChange={(e) => {
                          setEventDetails((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }));
                        }}
                        type="number"
                        value={EventDetails.amount}
                        placeholder="0.00"
                        className="w-full border border-orange-500/20 rounded-lg p-3 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-black/70 text-orange-400 placeholder-orange-400"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {/* Discount Section */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => {
                          setShowDiscount(prev => !prev);
                          if (!showDiscount) {
                            setIsEditing(false);
                            setEditingCouponId(null);
                            setFormData({
                              couponCode: '',
                              discountPercent: '',
                              discountExpiry: ''
                            });
                          }
                        }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Plus size={16} />
                        {showDiscount ? 'Cancel' : 'Add Coupon'}
                      </button>
                    </div>

                    {showDiscount && (
                      <div className="space-y-4 border border-orange-500/20 rounded-lg p-4 bg-black/40">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-orange-500">
                            Coupon Code:
                          </label>
                          <input
                            value={formData.discountCode}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                discountCode: e.target.value,
                              }));
                            }}
                            type="text"
                            placeholder="Enter coupon code"
                            className="w-full border border-orange-500/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-black/70 text-orange-400 placeholder-orange-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-orange-500">
                            Discount Percentage:
                          </label>
                          <div className="relative">
                            <input
                              value={formData.discountPercent}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  discountPercent: e.target.value,
                                }));
                              }}
                              type="number"
                              placeholder="Enter discount percentage"
                              className="w-full border border-orange-500/20 rounded-lg p-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-black/70 text-orange-400 placeholder-orange-400"
                              min="0"
                              max="100"
                            />
                            <span className="absolute right-3 top-3 text-orange-400">
                              %
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-orange-500">
                            Expiry Date:
                          </label>
                          <input
                            value={formData.discountExpiry}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                discountExpiry: e.target.value,
                              }));
                            }}
                            type="date"
                            className="w-full border border-orange-500/20 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-black/70 text-orange-400 placeholder-orange-400 [color-scheme:light]"
                          />
                        </div>

                        <button
                          onClick={handleSubmit}
                          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                          {isEditing ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                      </div>
                    )}

                    {coupons.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-orange-500">Active Coupons</h3>
                        <div className="space-y-2">
                          {coupons.map(coupon => (
                            <div key={coupon.id} className="flex items-center justify-between p-4 border border-orange-500/20 rounded-lg bg-black/40">
                              <div className="space-y-1">
                                <div className="font-semibold text-orange-400">{coupon.discountCode}</div>
                                <div className="text-sm text-orange-400/80">
                                  {coupon.discountPercent}% off • Expires: {coupon.discountExpiry}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(coupon)}
                                  className="p-2 hover:bg-orange-500/10 rounded-lg transition-colors duration-200"
                                >
                                  <Pencil size={16} className="text-orange-400" />
                                </button>
                                <button
                                  onClick={() => handleDelete(coupon.id)}
                                  className="p-2 hover:bg-orange-500/10 rounded-lg transition-colors duration-200"
                                >
                                  <Trash2 size={16} className="text-orange-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWebinarPage;