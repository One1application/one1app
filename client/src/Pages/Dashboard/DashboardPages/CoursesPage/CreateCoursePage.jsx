import { useState, useEffect } from "react";
import {
  ArrowLeftCircleIcon,
  MinusCircle,
  Pencil,
  PlusCircle,
  XCircle,
  Edit2,
  X,
  Trash2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import ReactQuill from "react-quill";
import {
  createNewCourseRequest,
  handelUplaodFile,
  fetchCourse,
  editCourse,
  handelUplaodFileS3,
  getSignedVideoUrl,
} from "../../../../services/auth/api.services";
import { BsPlusSquareDotted } from "react-icons/bs";
const DiscountForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingDiscount = null,
}) => {
  const [discountCode, setDiscountCode] = useState(editingDiscount?.code || "");
  const [discountPercent, setDiscountPercent] = useState(
    editingDiscount?.percent || ""
  );
  const [expiryDate, setExpiryDate] = useState(editingDiscount?.expiry || "");

   useEffect(() => {
    if (editingDiscount) {
      setDiscountCode(editingDiscount.code || "");
      setDiscountPercent(editingDiscount.percent || "");
      setExpiryDate(editingDiscount.expiry || "");
    }
  }, [editingDiscount]);
  

  const handleSubmit = () => {
    onSubmit({
      id: editingDiscount?.id, // Pass through the ID if editing
      code: discountCode,
      percent: discountPercent,
      expiry: expiryDate,
      
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 bg-gray-900 rounded-lg p-4 sm:p-8 w-full border border-gray-700">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white">
          {editingDiscount ? "Edit Discount" : "Create New Discount"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-orange-500 mb-3">
            Discount Code
          </label>
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="w-full h-12 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white text-base"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-orange-500 mb-3">
            Discount Percent
          </label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            min="0"
            max="100"
            className="w-full h-12 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white text-base"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-orange-500 mb-3">
            When does the discount expire?
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full h-12 px-4 py-2 border border-orange-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-800 text-white text-base"
            placeholder="dd-mm-yyyy"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={onClose}
          className="w-full sm:flex-1 h-12 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-base font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full sm:flex-1 h-12 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 text-base font-medium"
        >
          {editingDiscount ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

const NewCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("id");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const languages = ["English", "Spanish", "French", "Hindi"];
  const validity = ["Monthly", "Half-Yearly", "Yearly", "Lifetime"];
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    validity: "",
    aboutThisCourse: {
      description: "",
      features: [""],
    },
    testimonials: {
      title: "Testimonials",
      isActive: false,
      testimonialsMetaData: [
        { name: "", profilePic: null, description: "", rating: "" },
      ],
    },
    courseBenefits: {
      title: "Course Benefits",
      benefitsActive: false,
      benefitsMetaData: [{ emoji: "", title: "" }],
    },
    faQ: {
      title: "Frequently Asked Questions",
      isActive: false,
      faQMetaData: [
        {
          question: "",
          answer: "",
        },
      ],
    },
    gallery: {
      title: "Gallery",
      isActive: false,
      imageMetaData: [
        { name: "", image: "" },
        { name: "", image: "" },
        { name: "", image: "" },
        { name: "", image: "" },
        { name: "", image: "" },
        { name: "", image: "" },
      ],
    },
    products: {
      title: "Products",
      isActive: false,
      productMetaData: [
        { name: "", price: "", productLink: "" },
        { name: "", price: "", productLink: "" },
      ],
    },
    language: {
      title: "Language",
      isActive: false,
      value: [],
    },
    coverImage: {
      value: "",
      isActive: true,
    },
    lessons: {
      isActive: true,
      lessonData: [
        {
          lessonName: "",
          videos: [""],
        },
      ],
    },
    // refundPolicies: {
    //   title: "Refund Policies",
    //   isActive: true,
    //   refundPoliciesMetaData: [],
    // },
    // termAndConditions: {
    //   title: "Terms & Conditions",
    //   isActive: true,
    //   termAndConditionsMetaData: [],
    // },
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [testimonialImagePreviews, setTestimonialImagePreviews] = useState({});
  const [videoPreviews, setVideoPreviews] = useState({});
  const [error, setError] = useState("");
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [testimonialImageUploading, setTestimonialImageUploading] = useState(
    {}
  );
  const [videoUploading, setVideoUploading] = useState({});
  // const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  // const [discounts, setDiscounts] = useState([]);
  // const handleDiscountSubmit = (discountData) => {
  //   setDiscounts([...discounts, discountData]);
  // };
  const [discounts, setDiscounts] = useState([]);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  // First, let's add a state for local video previews
  const [localVideoPreviews, setLocalVideoPreviews] = useState({});
  // Add a new state to track filenames
  const [videoFileNames, setVideoFileNames] = useState({});

  const handleDiscountSubmit = (discountData) => {
    if (discountData.id) {
      // Editing existing discount
      setDiscounts(
        discounts.map((discount) =>
          discount.id === discountData.id ? { ...discountData } : discount
        )
      );
    } else {
      // Creating new discount
      setDiscounts([...discounts, { ...discountData, id: Date.now() }]);
    }
    setEditingDiscount(null);
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setIsDiscountModalOpen(true);
  };

  const handleDelete = (discountId) => {
    setDiscounts(discounts.filter((discount) => discount.id !== discountId));
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      aboutThisCourse: {
        ...formData.aboutThisCourse,
        features: [...formData.aboutThisCourse.features, ""],
      },
    });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.aboutThisCourse.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      aboutThisCourse: {
        ...formData.aboutThisCourse,
        features: updatedFeatures,
      },
    });
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.aboutThisCourse.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      aboutThisCourse: {
        ...formData.aboutThisCourse,
        features: updatedFeatures,
      },
    });
  };

  const handleAddTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: {
        ...formData.testimonials,
        testimonialsMetaData: [
          ...formData.testimonials.testimonialsMetaData,
          { name: "", profilePic: null, description: "", rating: "" },
        ],
      },
    });
  };

  const handleRemoveTestimonial = (index) => {
    const updatedTestimonials = [...formData.testimonials.testimonialsMetaData];
    updatedTestimonials.splice(index, 1);
    setFormData({
      ...formData,
      testimonials: {
        ...formData.testimonials,
        testimonialsMetaData: updatedTestimonials,
      },
    });
  };

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...formData.testimonials.testimonialsMetaData];
    updatedTestimonials[index][field] = value;
    setFormData({
      ...formData,
      testimonials: {
        ...formData.testimonials,
        testimonialsMetaData: updatedTestimonials,
      },
    });
  };

  const handleAddBenefit = () => {
    setFormData({
      ...formData,
      courseBenefits: {
        ...formData.courseBenefits,
        benefitsMetaData: [
          ...formData.courseBenefits.benefitsMetaData,
          { emoji: "", title: "" },
        ],
      },
    });
  };

  const handleRemoveBenefit = (index) => {
    const updatedBenefits = [...formData.courseBenefits.benefitsMetaData];
    updatedBenefits.splice(index, 1);
    setFormData({
      ...formData,
      courseBenefits: {
        ...formData.courseBenefits,
        benefitsMetaData: updatedBenefits,
      },
    });
  };

  const handleBenefitChange = (index, field, value) => {
    const updatedBenefits = [...formData.courseBenefits.benefitsMetaData];
    updatedBenefits[index][field] = value;
    setFormData({
      ...formData,
      courseBenefits: {
        ...formData.courseBenefits,
        benefitsMetaData: updatedBenefits,
      },
    });
  };

  const handleDeleteImage = () => {
    setFormData({
      ...formData,
      coverImage: { value: "", isActive: true },
    });
    setImagePreview(null); // Reset the image preview
  };

  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const filedata = new FormData();
    filedata.append("file", file);

    const response = await handelUplaodFile(filedata);
    if (response.status === 200) {
      const updatedImages = [...formData.gallery.imageMetaData];
      updatedImages[index].image = response.data.url;
      updatedImages[index].name = file.name;
      setFormData((prevData) => ({
        ...prevData,
        gallery: { ...prevData.gallery, imageMetaData: updatedImages },
      }));
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        [index]: response.data.url,
      }));
      toast.success("Image uploaded successfully");
    } else {
      toast.error("Image upload failed");
    }
  };

  const handleTestimonialImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const filedata = new FormData();
    filedata.append("file", file);

    // Set uploading state for this specific testimonial image
    setTestimonialImageUploading((prev) => ({
      ...prev,
      [index]: true,
    }));

    try {
      const response = await handelUplaodFile(filedata);
      if (response.status === 200) {
        const updatedTestimonials = [
          ...formData.testimonials.testimonialsMetaData,
        ];
        updatedTestimonials[index].profilePic = response.data.url;
        setFormData({
          ...formData,
          testimonials: {
            ...formData.testimonials,
            testimonialsMetaData: updatedTestimonials,
          },
        });
        setTestimonialImagePreviews({
          ...testimonialImagePreviews,
          [index]: response.data.url,
        });
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");

        // Reset file input
        if (event.target) {
          event.target.value = "";
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");

      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    } finally {
      // Clear uploading state
      setTestimonialImageUploading((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  };

  const handleAddFAQ = () => {
    setFormData({
      ...formData,
      faQ: {
        ...formData.faQ,
        faQMetaData: [
          ...formData.faQ.faQMetaData,
          { question: "", answer: "" },
        ],
      },
    });
  };

  const handleRemoveFAQ = (index) => {
    const updatedFAQs = [...formData.faQ.faQMetaData];
    updatedFAQs.splice(index, 1);
    setFormData({
      ...formData,
      faQ: { ...formData.faQ, faQMetaData: updatedFAQs },
    });
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFAQs = [...formData.faQ.faQMetaData];
    updatedFAQs[index][field] = value;
    setFormData({
      ...formData,
      faQ: { ...formData.faQ, faQMetaData: updatedFAQs },
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.gallery.imageMetaData];
    updatedImages[index].image = null;
    setFormData({
      ...formData,
      gallery: { ...formData.gallery, imageMetaData: updatedImages },
    });

    const updatedPreviews = { ...imagePreviews };
    delete updatedPreviews[index];
    setImagePreviews(updatedPreviews);
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: {
        ...formData.products,
        productMetaData: [
          ...formData.products.productMetaData,
          { name: "", price: "", productLink: "" },
        ],
      },
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...formData.products.productMetaData];
    updatedProducts.splice(index, 1);
    setFormData({
      ...formData,
      products: { ...formData.products, productMetaData: updatedProducts },
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products.productMetaData];
    updatedProducts[index][field] = value;
    setFormData({
      ...formData,
      products: { ...formData.products, productMetaData: updatedProducts },
    });
  };

  const handleCoverImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoPreview = async (videoUrl) => {
    try {
      // If it's a local preview (blob URL), use it directly
      if (videoUrl.startsWith('blob:')) {
        setModalVideo(videoUrl);
        return;
      }

      // For API videos, get the signed URL first
      const response = await getSignedVideoUrl(videoUrl);
      if (response.status === 200) {
        setModalVideo(response.data.signedUrl);
      } else {
        toast.error("Failed to load video preview");
      }
    } catch (error) {
      console.error("Error getting signed URL:", error);
      toast.error("Failed to load video preview");
    }
  };

  const handleCloseModal = () => {
    setModalVideo(null);
  };

  const handleAddLesson = () => {
    setFormData((prevState) => ({
      ...prevState,
      lessons: {
        ...prevState.lessons,
        lessonData: [
          ...prevState.lessons.lessonData,
          { lessonName: "", videos: [""] },
        ],
      },
    }));
  };

  const handleAddVideo = (lessonIndex) => {
    setFormData((prevState) => {
      const updatedLessons = [...prevState.lessons.lessonData];
      updatedLessons[lessonIndex].videos.push("");
      return {
        ...prevState,
        lessons: { ...prevState.lessons, lessonData: updatedLessons },
      };
    });
  };

  const handleVideoUpload = async (lessonIndex, videoIndex, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store filename
    setVideoFileNames(prev => ({
      ...prev,
      [`${lessonIndex}-${videoIndex}`]: file.name
    }));

    // Create local preview URL
    const localPreviewUrl = URL.createObjectURL(file);
    
    // Update local video previews
    setLocalVideoPreviews((prev) => ({
      ...prev,
      [`${lessonIndex}-${videoIndex}`]: localPreviewUrl,
    }));

    // Set uploading state for this specific video
    setVideoUploading((prev) => ({
      ...prev,
      [`${lessonIndex}-${videoIndex}`]: true,
    }));

    try {
      // First get the upload URL from your backend
      const filedata = new FormData();
      filedata.append("fileName", file.name);
      filedata.append("fileType", file.type);

      const response = await handelUplaodFileS3(filedata);

      if (response.status === 200 && response.data.uploadURL) {
        const uploadResponse = await fetch(response.data.uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        // Update the form data with the video URL
        setFormData((prevState) => {
          const updatedLessons = [...prevState.lessons.lessonData];
          updatedLessons[lessonIndex].videos[videoIndex] = uploadResponse.url;
          return {
            ...prevState,
            lessons: { ...prevState.lessons, lessonData: updatedLessons },
          };
        });

        // // Update video previews with the uploaded URL
        // setVideoPreviews((prevPreviews) => ({
        //   ...prevPreviews,
        //   [`${lessonIndex}-${videoIndex}`]: uploadResponse.url,
        // }));

        toast.success("Video uploaded successfully");
      } else {
        throw new Error("Failed to get upload URL");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Video upload failed");

      // Clean up local preview on error
      setLocalVideoPreviews((prev) => {
        const updated = { ...prev };
        delete updated[`${lessonIndex}-${videoIndex}`];
        return updated;
      });

      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    } finally {
      // Clear uploading state
      setVideoUploading((prev) => {
        const updated = { ...prev };
        delete updated[`${lessonIndex}-${videoIndex}`];
        return updated;
      });
    }
  };

  const handleRemoveLesson = (lessonIndex) => {
    setFormData((prevState) => {
      const updatedLessons = [...prevState.lessons.lessonData];
      updatedLessons.splice(lessonIndex, 1);
      return {
        ...prevState,
        lessons: { ...prevState.lessons, lessonData: updatedLessons },
      };
    });

    setVideoPreviews((prevPreviews) => {
      const updatedPreviews = { ...prevPreviews };
      Object.keys(updatedPreviews).forEach((key) => {
        if (key.startsWith(`${lessonIndex}-`)) delete updatedPreviews[key];
      });
      return updatedPreviews;
    });
  };

  const handleRemoveVideo = (lessonIndex, videoIndex) => {
    const lessonVideos = formData.lessons.lessonData[lessonIndex].videos;
    
    // Remove the video from formData
    setFormData((prevState) => {
      const updatedLessons = [...prevState.lessons.lessonData];
      updatedLessons[lessonIndex].videos.splice(videoIndex, 1);
      return {
        ...prevState,
        lessons: { ...prevState.lessons, lessonData: updatedLessons },
      };
    });

    // Cleanup old preview URLs
    if (localVideoPreviews[`${lessonIndex}-${videoIndex}`]) {
      URL.revokeObjectURL(localVideoPreviews[`${lessonIndex}-${videoIndex}`]);
    }

    // Reindex filenames
    setVideoFileNames(prev => {
      const updated = {};
      // Copy all filenames except for the current lesson
      Object.keys(prev).forEach(key => {
        if (!key.startsWith(`${lessonIndex}-`)) {
          updated[key] = prev[key];
        }
      });
      
      // Reindex the remaining filenames for this lesson
      lessonVideos.forEach((_, index) => {
        if (index >= videoIndex) {
          const oldKey = `${lessonIndex}-${index + 1}`;
          const newKey = `${lessonIndex}-${index}`;
          if (prev[oldKey]) {
            updated[newKey] = prev[oldKey];
          }
        } else {
          const key = `${lessonIndex}-${index}`;
          if (prev[key]) {
            updated[key] = prev[key];
          }
        }
      });
      
      return updated;
    });

    // Similarly reindex the video previews
    setVideoPreviews((prev) => {
      const updated = {};
      // Copy all previews except for the current lesson
      Object.keys(prev).forEach(key => {
        if (!key.startsWith(`${lessonIndex}-`)) {
          updated[key] = prev[key];
        }
      });
      
      // Reindex the remaining previews for this lesson
      lessonVideos.forEach((_, index) => {
        if (index >= videoIndex) {
          const oldKey = `${lessonIndex}-${index + 1}`;
          const newKey = `${lessonIndex}-${index}`;
          if (prev[oldKey]) {
            updated[newKey] = prev[oldKey];
          }
        } else {
          const key = `${lessonIndex}-${index}`;
          if (prev[key]) {
            updated[key] = prev[key];
          }
        }
      });
      
      return updated;
    });
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...formData.language.value];
    updatedLanguages[index] = value;
    setFormData({
      ...formData,
      language: {
        ...formData.language,
        value: updatedLanguages,
      },
    });
  };

  const handleAddLanguage = () => {
    setFormData((prevData) => ({
      ...prevData,
      language: {
        ...prevData.language,
        value: [...prevData.language.value, ""],
      },
    }));
  };

  const handleRemoveLanguage = (index) => {
    const updatedLanguages = [...formData.language.value];
    updatedLanguages.splice(index, 1);
    setFormData({
      ...formData,
      language: {
        ...formData.language,
        value: updatedLanguages,
      },
    });
  };

  const handleCourseTitleChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, title: value });
      setError("");
    } else {
      setError("Only letters and spaces are allowed");
    }
  };

  const handleOverviewChange = (htmlContent) => {
    setFormData((prevData) => ({
      ...prevData,
      aboutThisCourse: {
        ...prevData.aboutThisCourse,
        description: htmlContent,
      },
    }));
  };

  const handelCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const coverImageFile = new FormData();
    coverImageFile.append("file", file);
    coverImageFile.append("isPrivateFile", false);

    setIsCoverImageUploading(true);

    try {
      const response = await handelUplaodFile(coverImageFile);

      if (response.status === 200) {
        setFormData((prev) => ({
          ...prev,
          coverImage: {
            ...prev.coverImage,
            value: response.data.url,
          },
        }));
        setImagePreview(response.data.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
      setImagePreview(null);

      // Reset file input
      if (e.target) {
        e.target.value = "";
      }
    } finally {
      setIsCoverImageUploading(false);
    }
  };

  const handelVideoTitleChange = async (e, index) => {
    const value = e.target.value;

    setFormData((prevData) => {
      const updatedLessons = [...prevData.lessons.lessonData];
      updatedLessons[index].lessonName = value;
      return {
        ...prevData,
        lessons: { ...prevData.lessons, lessonData: updatedLessons },
      };
    });
  };

  // Fetch course data if in edit mode
  useEffect(() => {
    const fetchCourseData = async () => {
      if (courseId) {
        setIsEditMode(true);
        setLoading(true);
        try {
          const response = await fetchCourse(courseId);
          if (response.status === 200) {
            const courseData = response.data.payload.course;
            
            // Update form data with existing course data
            setFormData({
              title: courseData.title || "",
              price: courseData.price || "",
              validity: courseData.validity || "",
              aboutThisCourse: {
                description: courseData.aboutThisCourse?.description || "",
                features: courseData.aboutThisCourse?.features || [""],
              },
              testimonials: {
                title: courseData.testimonials?.title || "Testimonials",
                isActive: courseData.testimonials?.isActive || false,
                testimonialsMetaData: courseData.testimonials
                  ?.testimonialsMetaData || [
                  { name: "", profilePic: null, description: "", rating: "" },
                ],
              },
              courseBenefits: courseData.courseBenefits || {
                title: "Course Benefits",
                benefitsActive: false,
                benefitsMetaData: [{ emoji: "", title: "" }],
              },
              // Fix for faQ vs faqs mismatch
              faQ: courseData.faqs ||
                courseData.faQ || {
                  title: "Frequently Asked Questions",
                  isActive: false,
                  faQMetaData: [{ question: "", answer: "" }],
                },
              gallery: courseData.gallery
                ? {
                    title: courseData.gallery.title || "Gallery",
                    isActive: courseData.gallery.isActive || false,
                    imageMetaData:
                      courseData.gallery.imageMetaData ||
                      Array(6).fill({ name: "", image: "" }),
                  }
                : {
                    title: "Gallery",
                    isActive: false,
                    imageMetaData: Array(6).fill({ name: "", image: "" }),
                  },
              // Fix for products structure
              products: {
                title: courseData.products?.[0]?.title || "Products",
                isActive: courseData.products?.[0]?.isActive || false,
                productMetaData: courseData.products?.[0]?.productMetaData || [
                  { name: "", price: "", productLink: "" },
                  { name: "", price: "", productLink: "" },
                ],
              },
              language: courseData.language || {
                title: "Language",
                isActive: false,
                value: [],
              },
              coverImage: courseData.coverImage || {
                value: "",
                isActive: false,
              },
              // Fix for lessons array structure
              lessons: {
                isActive: courseData.lessons?.[0]?.isActive || true,
                lessonData: courseData.lessons?.[0]?.lessonData || [
                  { lessonName: "", videos: [""] },
                ],
              },
            });

            // Set discounts if available
           if(courseData.discount){
             if(Array.isArray(courseData.discount)){
              setDiscounts(courseData.discount)
             }
             else if(typeof courseData.discount === 'object'){
               setDiscounts([{
                  id: courseData.discount.id,
                  code: courseData.discount.code || "",
                  percent: courseData.discount.percent || "",
                  expiry: courseData.discount.expiry || ""
                }]);
             }
           }

            // Set image preview if available
            if (courseData.coverImage?.value) {
              setImagePreview(courseData.coverImage.value);
            }

            // Populate image previews for gallery
            if (courseData.gallery?.imageMetaData) {
              const galleryPreviews = {};
              courseData.gallery.imageMetaData.forEach((img, index) => {
                if (img.image) {
                  galleryPreviews[index] = img.image;
                }
              });
              setImagePreviews(galleryPreviews);
            }

            // Populate testimonial image previews
            if (courseData.testimonials?.testimonialsMetaData) {
              const testimonialsImgPreviews = {};
              courseData.testimonials.testimonialsMetaData.forEach(
                (testimonial, index) => {
                  if (testimonial.profilePic) {
                    testimonialsImgPreviews[index] = testimonial.profilePic;
                  }
                }
              );
              setTestimonialImagePreviews(testimonialsImgPreviews);
            }

            // Populate video previews for lessons
            if (courseData.lessons?.[0]?.lessonData) {
              const videoPrevs = {};
              courseData.lessons[0].lessonData.forEach(
                (lesson, lessonIndex) => {
                  if (lesson.videos && Array.isArray(lesson.videos)) {
                    lesson.videos.forEach((video, videoIndex) => {
                      if (video) {
                        videoPrevs[`${lessonIndex}-${videoIndex}`] = video;
                      }
                    });
                  }
                }
              );
              setVideoPreviews(videoPrevs);
            }

            toast.success("Course data loaded successfully");
          } else {
            toast.error("Failed to load course data");
            navigate("/dashboard/courses");
          }
        } catch (error) {
          console.error("Error fetching course data:", error);
          toast.error("Error loading course data");
          navigate("/dashboard/courses");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  // Add this validation function before the handelCreateCourseRequest function
  const validateForm = () => {
    // Check if all required fields are filled
    return (
      formData.title !== "" &&
      formData.price !== "" &&
      !isNaN(Number(formData.price)) &&
      Number(formData.price) > 0 &&
      !isQuillContentEmpty(formData.aboutThisCourse.description) &&
      // Validate that there's at least one lesson with name and video
      formData.lessons.lessonData.some(
        (lesson) =>
          lesson.lessonName.trim() !== "" &&
          lesson.videos.some((video) => video !== "")
      )
      // &&
      // formData.refundPolicies.refundPoliciesMetaData.length > 0 &&
      // formData.termAndConditions.termAndConditionsMetaData.length > 0
    );
  };

  const isQuillContentEmpty = (html) => {
    if (!html) return true;

    const text = html.replace(/<[^>]*>/g, "").trim();

    if (text === "") return true;

    const emptyPatterns = ["<p><br></p>", "<p></p>", "<br>", "<p>&nbsp;</p>"];

    return emptyPatterns.includes(html.trim());
  };

  const handelCreateCourseRequest = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields before submitting");
      return; // Stop execution if validation fails
    }

    // Set loading state to true
    setIsSubmitting(true);

    try {
      // Create a copy of the form data to transform
      let transformedData = { ...formData };

      // Handle testimonials data - check if all fields are empty
      const hasAnyTestimonialData =
        formData.testimonials.testimonialsMetaData.some(
          (item) =>
            (item.name && item.name.trim() !== "") ||
            (item.description && item.description.trim() !== "") ||
            item.profilePic
        );

      if (!hasAnyTestimonialData) {
        // If all testimonials are empty, set to null
        transformedData.testimonials = {
          ...transformedData.testimonials,
          testimonialsMetaData: [],
        };
      }

      // Handle gallery data - check if all fields are empty
      const hasAnyGalleryData = formData.gallery.imageMetaData.some(
        (item) => (item.name && item.name.trim() !== "") || item.image
      );

      if (!hasAnyGalleryData) {
        // If all gallery items are empty, set to null
        transformedData.gallery = {
          ...transformedData.gallery,
          imageMetaData: [],
        };
      }

      // Add other transform properties
      transformedData.discount = discounts.length > 0 ? discounts : null;
      transformedData.lessons = {
        isActive: transformedData.lessons.isActive,
        lessonData: transformedData.lessons.lessonData,
      };
      transformedData.products = transformedData.products.isActive
        ? [
            {
              title: transformedData.products.title,
              isActive: transformedData.products.isActive,
              productMetaData: transformedData.products.productMetaData,
            },
          ]
        : [];
      transformedData.faqs = transformedData.faQ;

      let response;
      if (isEditMode) {
        response = await editCourse(courseId, transformedData);
        if (response.status === 200) {
          toast.success("Course updated successfully");
          navigate("/dashboard/courses");
        } else {
          toast.error("Course update failed");
        }
      } else {
        response = await createNewCourseRequest(transformedData);
        if (response.status === 200) {
          toast.success("Course created successfully");
          navigate("/dashboard/courses");
        } else {
          toast.error(error.response?.data?.message);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message
      );
    } finally {
      // Set loading state back to false
      setIsSubmitting(false);
    }
  };

  const handleLessonToggle = (e) => {
    setFormData({
      ...formData,
      lessons: {
        ...formData.lessons,
        isActive: e.target.checked,
        lessonData: formData.lessons.lessonData || [
          {
            lessonName: "",
            videos: [""],
          },
        ],
      },
    });
  };

  const handleProductToggle = (e) => {
    setFormData({
      ...formData,
      products: {
        ...formData.products,
        isActive: e.target.checked,
        productMetaData: formData.products.productMetaData || [
          { name: "", price: "", productLink: "" },
        ],
      },
    });
  };

  // const handleAddRefundPolicy = () => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     refundPolicies: {
  //       ...prevData.refundPolicies,
  //       refundPoliciesMetaData: [
  //         ...prevData.refundPolicies.refundPoliciesMetaData,
  //         "",
  //       ],
  //     },
  //   }));
  // };

  // const handleRefundPolicyDataChange = (e, index) => {
  //   const value = e.target.value;
  //   setFormData((prevData) => {
  //     const updatedRefundPolicies =
  //       prevData.refundPolicies.refundPoliciesMetaData.map((policy, i) =>
  //         i === index ? value : policy
  //       );
  //     return {
  //       ...prevData,
  //       refundPolicies: {
  //         ...prevData.refundPolicies,
  //         refundPoliciesMetaData: updatedRefundPolicies,
  //       },
  //     };
  //   });
  // };

  // const handleAddTermsAndConditions = () => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     termAndConditions: {
  //       ...prevData.termAndConditions,
  //       termAndConditionsMetaData: [
  //         ...prevData.termAndConditions.termAndConditionsMetaData,
  //         "",
  //       ],
  //     },
  //   }));
  // };

  // const handleTermsAndConditionsDataChange = (e, index) => {
  //   const value = e.target.value;
  //   setFormData((prevData) => {
  //     const updatedTermsAndConditions =
  //       prevData.termAndConditions.termAndConditionsMetaData.map((term, i) =>
  //         i === index ? value : term
  //       );
  //     return {
  //       ...prevData,
  //       termAndConditions: {
  //         ...prevData.termAndConditions,
  //         termAndConditionsMetaData: updatedTermsAndConditions,
  //       },
  //     };
  //   });
  // };

  // const handleRemoveField = (section, key, index) => {
  //   setFormData((prevData) => {
  //     const updatedArray = [...prevData[section][key]];
  //     updatedArray.splice(index, 1);
  //     return {
  //       ...prevData,
  //       [section]: {
  //         ...prevData[section],
  //         [key]: updatedArray,
  //       },
  //     };
  //   });
  // };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        {/* Left Side */}
        {/* Video Modal */}
        {modalVideo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
            <div className="bg-white p-4 sm:p-5 rounded-lg w-full max-w-3xl relative">
              <button
                className="absolute top-1 right-3 text-white bg-red-500 rounded-full cursor-pointer"
                onClick={() => {
                  setModalVideo(null);
                }}
              >
                <XCircle size={30} />
              </button>
              <video
                src={modalVideo}
                controls
                className="w-full h-auto rounded-md"
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[900px]">
            {/* Form sections */}
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm mb-8 rounded-xl border border-orange-500/20 w-full">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <IoArrowBackCircleOutline
                    className="text-orange-500 w-8 h-8 hover:text-orange-400 transition-colors cursor-pointer"
                    onClick={() => navigate("/dashboard/courses")}
                  />
                  <div className="w-px h-8 bg-orange-500/30"></div>
                  <h2 className="text-2xl font-bold text-orange-500">
                    {isEditMode ? "Edit Course" : "New Course"}
                  </h2>
                </div>
              </div>
            </div>

            {/* Update all form section containers to use responsive widths */}
            <div className="w-full space-y-6 mb-10">
              {/* Each form section */}
              <div className="bg-[#111827]/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-orange-500/20">
                {/* Event Title Section */}
                <div>
                  <label className="block text-orange-500 text-[15px] mb-4">
                    What is your event? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleCourseTitleChange}
                      className="w-full h-12 bg-[#1a1b1e] rounded-lg border border-orange-500/20 px-4 text-gray-300 text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="Event Title"
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full h-12 bg-[#1a1b1e] rounded-lg border border-orange-500/20 px-4 text-gray-300 text-sm focus:outline-none focus:border-orange-500/50"
                      placeholder="Price"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs mt-2">{error}</p>
                  )}
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-m font-medium text-orange-500 mt-4">
                      Discounts
                    </label>
                  </div>

                  {discounts.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {discounts.map((discount) => (
                        <div
                          key={discount.id}
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
                          <div className="flex items-center gap-4">
                            <div className="text-gray-400 text-sm">
                              Expires:{" "}
                              {new Date(discount.expiry).toLocaleDateString()}
                            </div>
                            <button
                              onClick={() => handleEdit(discount)}
                              className="text-orange-500 hover:text-orange-400 transition duration-200"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(discount.id)}
                              className="text-red-500 hover:text-red-400 transition duration-200"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        setEditingDiscount(null);
                        setIsDiscountModalOpen(true);
                      }}
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
                    editingDiscount={editingDiscount}
                  />
                </div>
              </div>

              {/* Cover Image Toggle */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  {/* Enable Cover Image Section */}
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Cover Image <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {formData.coverImage.isActive && (
                    <div className="mt-4 ">
                      <input
                        onChange={(e) => {
                          handelCoverImage(e);
                        }}
                        type="file"
                        accept="image/*"
                        className="w-full h-11 pt-2 bg-gray-800 rounded-lg border border-orange-500/20 px-4 text-gray-300 text-sm focus:outline-none focus:border-orange-500/50"
                      />
                      {isCoverImageUploading ? (
                        <div className="flex items-center gap-2 text-orange-500 mt-2">
                          <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                          <span>Uploading cover image...</span>
                        </div>
                      ) : (
                        imagePreview && (
                          <div className="mt-4 flex flex-col items-center">
                            {/* Image Preview */}
                            <img
                              src={imagePreview}
                              alt="Cover Preview"
                              className="w-32 h-32 rounded-lg border border-orange-500/20 mb-2"
                            />
                            {/* Delete Button */}
                            <button
                              onClick={handleDeleteImage}
                              className="text-sm text-orange-500 bg-[#1a1b1e] border border-orange-500/20 px-4 py-1 rounded-lg hover:bg-orange-500/20 transition-colors"
                            >
                              Delete Image
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Description */}
              <div className="space-y-4 p-6 rounded-xl bg-[#111827]/90 backdrop-blur-sm  border border-orange-500/20  mb-6">
                <label className="text-orange-500 font-semibold">
                  Overview <span className="text-red-500">*</span>
                </label>
                <div
                  className="quill-wrapper h-64 [&_.ql-toolbar.ql-snow]:border-orange-500 
                    [&_.ql-container.ql-snow]:border-orange-500
                    [&_.ql-snow_.ql-stroke]:!stroke-orange-500
                    [&_.ql-snow_.ql-fill]:!fill-orange-500
                    [&_.ql-snow_.ql-picker]:!text-orange-500
                    [&_.ql-snow_.ql-picker-options]:!bg-gray-900
                    [&_.ql-snow_.ql-picker-options]:!border-orange-500
                    [&_.ql-snow_.ql-picker-item]:!text-orange-500
                    [&_.ql-snow_.ql-picker-label]:!text-orange-500
                    [&_.ql-snow.ql-toolbar_button:hover]:!text-orange-500
                    [&_.ql-snow.ql-toolbar_button.ql-active]:!text-orange-500
                    [&_.ql-toolbar.ql-snow]:rounded-t-lg
                    [&_.ql-container.ql-snow]:rounded-b-lg
                    [&_.ql-container.ql-snow]:!h-[calc(100%-42px)]"
                >
                  <ReactQuill
                    value={formData.aboutThisCourse.description}
                    onChange={handleOverviewChange}
                    theme="snow"
                    className="bg-black/50 text-white rounded-lg h-full"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { list: "check" },
                        ],
                        // ["link", "image"],
                        ["link"],
                        [{ size: ["small", false, "large", "huge"] }],
                        [{ color: [] }, { background: [] }],
                        [{ font: [] }],
                        [{ align: [] }],
                      ],
                    }}
                  />
                </div>
              </div>

              {/* Refund Policies Section */}
              {/* <div className="space-y-4 p-6 rounded-xl bg-[#111827]/90 backdrop-blur-sm border border-orange-500/20 mb-6">
                <div className="flex justify-between items-center">
                  <label className="text-orange-500 font-semibold">
                    Refund Policies <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="space-y-4 mt-4">
                  {formData.refundPolicies.refundPoliciesMetaData.map(
                    (policy, index) => (
                      <div key={index} className="flex gap-3">
                        <textarea
                          value={policy}
                          onChange={(e) => {
                            handleRefundPolicyDataChange(e, index);
                          }}
                          className="flex-1 h-24 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                          placeholder="Enter refund policy"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveField(
                              "refundPolicies",
                              "refundPoliciesMetaData",
                              index
                            )
                          }
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <MinusCircle className="w-6 h-6" />
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={handleAddRefundPolicy}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add Refund Policy
                  </button>
                </div>
              </div> */}

              {/* Terms & Conditions Section */}
              {/* <div className="space-y-4 p-6 rounded-xl bg-[#111827]/90 backdrop-blur-sm border border-orange-500/20 mb-6">
                <div className="flex justify-between items-center">
                  <label className="text-orange-500 font-semibold">
                    Terms & Conditions <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="space-y-4 mt-4">
                  {formData.termAndConditions.termAndConditionsMetaData.map(
                    (term, index) => (
                      <div key={index} className="flex gap-3">
                        <textarea
                          value={term}
                          onChange={(e) => {
                            handleTermsAndConditionsDataChange(e, index);
                          }}
                          className="flex-1 h-24 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                          placeholder="Enter terms & conditions"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveField(
                              "termAndConditions",
                              "termAndConditionsMetaData",
                              index
                            )
                          }
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <MinusCircle className="w-6 h-6" />
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={handleAddTermsAndConditions}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add Term & Condition
                  </button>
                </div>
              </div> */}

              {/* Language Toggle */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  {/* Enable Language Selection Section */}
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Enable Language Selection
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.language.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          language: {
                            ...formData.language,
                            isActive: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    />
                  </div>

                  {formData.language.isActive && (
                    <div className="flex flex-col gap-4 mt-4">
                      {formData.language.value.map((language, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <select
                            value={language}
                            onChange={(e) =>
                              handleLanguageChange(index, e.target.value)
                            }
                            className="w-full h-11 bg-[#1a1b1e] rounded-lg border border-orange-500/20 px-4 text-gray-300 text-sm focus:outline-none focus:border-orange-500/50"
                          >
                            <option value="" className="text-gray-400">
                              Select Language
                            </option>
                            {languages.map((lang) => (
                              <option
                                key={lang}
                                value={lang}
                                className="text-gray-300"
                              >
                                {lang}
                              </option>
                            ))}
                          </select>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(index)}
                              className="text-red-500 hover:text-red-600"
                              aria-label={`Remove language ${index + 1}`}
                            >
                              <MinusCircle size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <div>
                        <button
                          type="button"
                          onClick={handleAddLanguage}
                          className="mt-1 mb-4 inline-flex items-center text-orange-500 text-sm px-4 py-2 bg-[#1a1b1e] rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Add Language
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lessons Toggle */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  {/* Enable Syllabus Section */}
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Enable Syllabus <span className="text-red-500">*</span>
                    </label>
                    {/* <input
                      type="checkbox"
                      checked={formData.lessons.isActive}
                      onChange={handleLessonToggle}
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    /> */}
                  </div>

                  {formData.lessons.isActive && (
                    <div className="mt-4 space-y-4">
                      {formData.lessons.lessonData.map(
                        (lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="bg-[#1a1b1e] p-4 rounded-lg border border-orange-500/20 space-y-3"
                          >
                            {/* Lesson Title Input */}
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Title of Video"
                                value={lesson.lessonName}
                                onChange={(e) => {
                                  handelVideoTitleChange(e, lessonIndex);
                                }}
                                className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveLesson(lessonIndex)}
                                className="ml-2 text-red-500 hover:text-red-600"
                              >
                                <MinusCircle size={18} />
                              </button>
                            </div>

                            {/* Video Upload Section */}
                            {lesson.videos.map((video, videoIndex) => (
                              <div
                                key={videoIndex}
                                className="flex flex-col w-full"
                              >
                                <div className="flex items-center w-full">
                                  <div className="relative w-full">
                                    <input
                                      type="file"
                                      accept="video/*"
                                    
                                      onChange={(e) => handleVideoUpload(lessonIndex, videoIndex, e)}
                                      className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                                    />
                                    {/* {videoFileNames[`${lessonIndex}-${videoIndex}`] && (
                                      <span className="absolute left-[110px] top-1/2 transform -translate-y-1/2 text-gray-400">
                                        {videoFileNames[`${lessonIndex}-${videoIndex}`]}
                                      </span>
                                    )} */}
                                  </div>
                                  {(localVideoPreviews[
                                    `${lessonIndex}-${videoIndex}`
                                  ] || 
                                  videoPreviews[`${lessonIndex}-${videoIndex}`]) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleVideoPreview(
                                          localVideoPreviews[
                                            `${lessonIndex}-${videoIndex}`
                                          ] || 
                                          videoPreviews[`${lessonIndex}-${videoIndex}`]
                                        )
                                      }
                                      className="ml-2 text-orange-500 hover:text-orange-400"
                                    >
                                      View
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveVideo(lessonIndex, videoIndex)
                                    }
                                    className="ml-2 text-red-500 hover:text-red-600"
                                  >
                                    <MinusCircle size={18} />
                                  </button>
                                </div>

                                {videoUploading[
                                  `${lessonIndex}-${videoIndex}`
                                ] && (
                                  <div className="flex items-center gap-2 text-orange-500 mt-2">
                                    <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                    <span>Uploading video...</span>
                                  </div>
                                )}
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => handleAddVideo(lessonIndex)}
                              className="mt-2 px-4 flex items-center py-2 bg-[#1a1b1e] text-orange-500 rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                            >
                              <PlusCircle size={16} className="mr-2" />
                              Add Video
                            </button>
                          </div>
                        )
                      )}

                      <button
                        type="button"
                        onClick={handleAddLesson}
                        className="flex items-center mt-4 text-sm px-4 py-2 bg-[#1a1b1e] text-orange-500 rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Lesson
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  {/* Validity Section */}
                  <div className="">
                    <label className="block text-orange-500 text-[15px] mb-4">
                      Validity
                    </label>
                    <select
                      value={formData.validity}
                      onChange={(e) =>
                        setFormData({ ...formData, validity: e.target.value })
                      }
                      className="w-full h-11 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 px-4 text-sm focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="">Select validity</option>
                      {validity.map((validityOption) => (
                        <option key={validityOption} value={validityOption}>
                          {validityOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[50px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-3 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  {/* Features Section */}
                  <div className="">
                    <label className="block text-orange-500 text-[15px] mb-4">
                      Features
                    </label>
                    <div className="space-y-3">
                      {formData.aboutThisCourse.features.map(
                        (feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <input
                              type="text"
                              defaultValue={feature}
                              onChange={(e) =>
                                handleFeatureChange(index, e.target.value)
                              }
                              placeholder={`Feature ${index + 1}`}
                              className="w-full h-11 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 px-4 text-sm focus:outline-none focus:border-orange-500/50"
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(index)}
                                className="text-red-500 hover:text-red-600"
                                aria-label={`Remove feature ${index + 1}`}
                              >
                                <MinusCircle size={18} />
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="mt-4 inline-flex items-center font-poppins cursor-pointer tracking-tight text-sm px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 shadow-sm hover:bg-[#333638]"
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* Testimonials*/}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Enable Testimonials
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.testimonials.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          testimonials: {
                            ...formData.testimonials,
                            isActive: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    />
                  </div>

                  {formData.testimonials.isActive && (
                    <div className="mt-4 space-y-4">
                      {formData.testimonials.testimonialsMetaData.map(
                        (testimonial, index) => (
                          <div
                            key={index}
                            className="bg-[#1a1b1e] p-4 rounded-lg border border-orange-500/20 space-y-3"
                          >
                            {/* Testimonial Name Input */}
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Name"
                                value={testimonial.name}
                                onChange={(e) =>
                                  handleTestimonialChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTestimonial(index)}
                                className="ml-2 text-red-500 hover:text-red-600"
                              >
                                <MinusCircle size={18} />
                              </button>
                            </div>

                            {/* Testimonial Description Input */}
                            <textarea
                              placeholder="Description"
                              value={testimonial.description}
                              onChange={(e) =>
                                handleTestimonialChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                            ></textarea>

                            {/* Testimonial Image Upload */}
                            <label className="block text-orange-500 text-sm mb-2">
                              Profile Image
                            </label>
                            <div className="flex items-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleTestimonialImageUpload(index, e)
                                }
                                className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                              />
                              {testimonialImagePreviews[index] && (
                                <img
                                  src={testimonialImagePreviews[index]}
                                  alt={`Testimonial ${index}`}
                                  className="w-16 h-16 rounded-full mt-2 ml-2"
                                />
                              )}
                            </div>

                            {testimonialImageUploading[index] && (
                              <div className="flex items-center gap-2 text-orange-500 mt-2">
                                <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                <span>Uploading image...</span>
                              </div>
                            )}
                          </div>
                        )
                      )}

                      <button
                        type="button"
                        onClick={handleAddTestimonial}
                        className="flex items-center mt-4 text-sm px-4 py-2 bg-[#1a1b1e] text-orange-500 rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Testimonial
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Benefits */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Enable Course Benefits
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.courseBenefits.benefitsActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          courseBenefits: {
                            ...formData.courseBenefits,
                            benefitsActive: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    />
                  </div>

                  {formData.courseBenefits.benefitsActive && (
                    <div className="mt-4 space-y-4">
                      {formData.courseBenefits.benefitsMetaData.map(
                        (benefit, index) => (
                          <div
                            key={index}
                            className="bg-[#1a1b1e] p-4 rounded-lg border border-orange-500/20 space-y-3"
                          >
                            {/* Emoji Picker Button */}
                            <div className="relative flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setEmojiPickerOpen(
                                    isEmojiPickerOpen === index ? null : index
                                  )
                                }
                                className="w-10 h-10 border px-2 text-center text-sm border-orange-500/20 rounded-lg bg-[#1a1b1e] text-gray-300 focus:outline-none focus:border-orange-500/50"
                              >
                                {benefit.emoji || ""}
                              </button>
                              {isEmojiPickerOpen === index && (
                                <div className="absolute z-10 left-0 sm:left-auto right-0 sm:right-auto">
                                  <EmojiPicker
                                    onEmojiClick={(emoji) => {
                                      handleBenefitChange(
                                        index,
                                        "emoji",
                                        emoji.emoji
                                      );
                                      setEmojiPickerOpen(null);
                                    }}
                                  />
                                </div>
                              )}

                              {/* Benefit Title Input */}
                              <input
                                type="text"
                                placeholder="Benefit Title"
                                value={benefit.title}
                                onChange={(e) =>
                                  handleBenefitChange(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-5/6 px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                              />

                              {/* Remove Benefit Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveBenefit(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <MinusCircle size={18} />
                              </button>
                            </div>
                          </div>
                        )
                      )}

                      {/* Add Benefit Button */}
                      <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="flex items-center mt-4 px-4 py-2 bg-[#1a1b1e] text-orange-500 rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Benefit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Enable Gallery
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.gallery.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gallery: {
                            ...formData.gallery,
                            isActive: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    />
                  </div>

                  {formData.gallery.isActive && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {formData.gallery.imageMetaData
                          .slice(0, 4)
                          .map((imageData, index) => (
                            <div
                              key={index}
                              className="relative w-full aspect-square border border-orange-500/20 rounded-lg bg-[#1a1b1e] flex items-center justify-center"
                            >
                              {imagePreviews[index] ? (
                                <img
                                  src={imagePreviews[index]}
                                  alt={`Gallery ${index}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-gray-500">
                                  Placeholder
                                </span>
                              )}
                              <label className="absolute top-2 right-2 cursor-pointer">
                                {imagePreviews[index] ? (
                                  <XCircle
                                    size={20}
                                    onClick={() => handleRemoveImage(index)}
                                    className="text-red-500 hover:text-red-600"
                                  />
                                ) : (
                                  <Pencil
                                    size={20}
                                    className="text-gray-300 hover:text-orange-500"
                                  />
                                )}
                                <input
                                  type="file"
                                  onChange={(e) => handleImageUpload(index, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Section */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  <div className="flex justify-between items-center">
                    <label className="block text-orange-500 text-[15px]">
                      Enable Products
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.products.isActive}
                      onChange={handleProductToggle}
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    />
                  </div>

                  {formData.products.isActive && (
                    <div className="mt-4 space-y-4">
                      {formData.products.productMetaData.map(
                        (product, index) => (
                          <div
                            key={index}
                            className="flex flex-col gap-3 bg-[#1a1b1e] p-4 rounded-lg border border-orange-500/20"
                          >
                            {/* Product Name Input */}
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                placeholder="Product Name"
                                value={product.name}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <MinusCircle size={18} />
                              </button>
                            </div>

                            {/* Product Price Input */}
                            <input
                              type="text"
                              placeholder="Product Price"
                              value={product.price}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                            />

                            {/* Product Link Input */}
                            <input
                              type="text"
                              placeholder="Product Link"
                              value={product.productLink}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "productLink",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                            />
                          </div>
                        )
                      )}

                      {/* Add Product Button */}
                      <button
                        type="button"
                        onClick={handleAddProduct}
                        className="flex items-center mt-4 text-sm px-4 py-2 bg-[#1a1b1e] text-orange-500 rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add Product
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="flex justify-center w-full">
                <div className="sticky top-[80px] z-[5] bg-[#111827]/90 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20 w-[900px] mb-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-orange-500 font-poppins tracking-tight">
                      Enable FAQ
                    </label>
                    <input
                      type="checkbox"
                      checked={formData.faQ.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          faQ: { ...formData.faQ, isActive: e.target.checked },
                        })
                      }
                      className="w-5 h-5 rounded cursor-pointer border border-orange-500/20 bg-[#1a1b1e] text-orange-500 focus:outline-none focus:ring-orange-500/50"
                    />
                  </div>

                  {formData.faQ.isActive && (
                    <div className="mt-4 space-y-4">
                      {formData.faQ.faQMetaData.map((faq, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-3 bg-[#1a1b1e] p-4 rounded-lg border border-orange-500/20"
                        >
                          {/* Question Input */}
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="Enter question"
                              value={faq.question}
                              onChange={(e) =>
                                handleFAQChange(
                                  index,
                                  "question",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFAQ(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <MinusCircle size={18} />
                            </button>
                          </div>

                          {/* Answer Input */}
                          <textarea
                            placeholder="Enter answer"
                            value={faq.answer}
                            onChange={(e) =>
                              handleFAQChange(index, "answer", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-[#1a1b1e] text-gray-300 rounded-lg border border-orange-500/20 focus:outline-none focus:border-orange-500/50 text-sm"
                          ></textarea>
                        </div>
                      ))}

                      {/* Add FAQ Button */}
                      <button
                        type="button"
                        onClick={handleAddFAQ}
                        className="flex items-center mt-4 text-sm px-4 py-2 bg-[#1a1b1e] text-orange-500 rounded-lg border border-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Add More Question & Answer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!validateForm() && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-500 text-sm">
                    Please fill in all required fields marked with * before
                    submitting:
                    <ul className="list-disc ml-5 mt-2">
                      {formData.title === "" && (
                        <li>Course title is required</li>
                      )}
                      {(formData.price === "" ||
                        isNaN(Number(formData.price)) ||
                        Number(formData.price) <= 0) && (
                        <li>Price must be a valid number greater than 0</li>
                      )}
                      {isQuillContentEmpty(
                        formData.aboutThisCourse.description
                      ) && <li>Course description is required</li>}
                      {!formData.lessons.lessonData.some(
                        (lesson) =>
                          lesson.lessonName.trim() !== "" &&
                          lesson.videos.some((video) => video !== "")
                      ) && (
                        <li>
                          At least one lesson with name and video is required
                        </li>
                      )}
                    </ul>
                  </p>
                </div>
              )}

              {/*  Button */}
              <div className="flex justify-center pt-8 mb-10 ">
                <button
                  type="button"
                  onClick={handelCreateCourseRequest}
                  className={`px-8 py-3 ${
                    validateForm() && !isSubmitting
                      ? "bg-orange-500 hover:bg-orange-600 text-white font-medium"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  } rounded-lg shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 flex items-center gap-2`}
                  disabled={!validateForm() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <span>
                      {isEditMode ? "Update Course" : "Create Course"}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCoursePage;
