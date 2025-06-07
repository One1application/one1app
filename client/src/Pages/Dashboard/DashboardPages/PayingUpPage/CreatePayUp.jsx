import { Loader2, MinusCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { BsPlusSquareDotted } from "react-icons/bs";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  createPayUpContent,
  handelUplaodFile,
  fetchPayingUp,
  editPayingUp,
  generativeDescription,
} from "../../../../services/auth/api.services.js";
import axios from "axios";
import toast from "react-hot-toast";
import { PlusCircle, Upload, ChevronDown } from "lucide-react";
import { X, Edit, Trash } from "lucide-react";
import AIAssistantButton from "../../../../components/Buttons/AIAssistantButton";

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
  const [selectedPlan, setSelectedPlan] = useState(editingDiscount?.plan || "");

  useEffect(() => {
    if (editingDiscount) {
      setDiscountCode(editingDiscount.code);
      setDiscountPercent(editingDiscount.percent);
      setExpiryDate(editingDiscount.expiry);
      setSelectedPlan(editingDiscount.plan);
    } else {
      setDiscountCode("");
      setDiscountPercent("");
      setExpiryDate("");
      setSelectedPlan("");
    }
  }, [editingDiscount, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {editingDiscount ? "Edit Discount" : "Create New Discount"}
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
              const discountPayload = {
                id: editingDiscount?.id,
                code: discountCode,
                percent: discountPercent,
                expiry: expiryDate,
              };
              onSubmit(discountPayload);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
          >
            {editingDiscount ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePayUp = () => {
  const formRef = useRef();
  const [priceType, setPriceType] = useState("fixed");
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [payUpId, setPayUpId] = useState(null);
  const [formData, setFormData] = useState({
    title: " ",
    description: "",
    paymentDetails: {
      currencySymbol: "IndianRupee",
      paymentEnabled: true,
      paymentLink: "",
      totalAmount: 0,
      paymentButtonTitle: "",
      ownerEmail: "",
      ownerPhone: "",
    },
    Category: {
      title: "Category",
      isActive: true,
      categoryMetaData: [""],
    },
    testimonials: {
      title: "Testimonials",
      isActive: false,
      testimonialsMetaData: [],
    },
    faQ: {
      title: "Frequently Asked Questions",
      isActive: false,
      faQMetaData: [],
    },
    refundPolicies: {
      title: "Refund Policies",
      isActive: true,
      refundPoliciesMetaData: [],
    },
    termAndConditions: {
      title: "Terms & Conditions",
      isActive: true,
      termAndConditionsMetaData: [],
    },
    coverImage: {
      title: "Cover Image",
      isActive: true,
      value: "",
    },
    file: {
      title: "File Upload",
      isActive: true,
      value: "",
    },
  });

  const [discounts, setDiscounts] = useState([]);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wait, setWait] = useState(false);

  let cooldowntime = 30; // maan lete hai suppoose malik

  const [cooldown, setCooldown] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  // chalak user hote soopose refresh karde fir ? that's what i want
  useEffect(() => {
    const savedCooldown = localStorage.getItem("aiCooldown");
    if (savedCooldown) {
      const remaining = Math.max(
        0,
        cooldowntime - Math.floor((Date.now() - parseInt(savedCooldown)) / 1000)
      );
      if (remaining > 0) {
        setIsCooldownActive(true);
        setCooldown(remaining);
        startCountdown(remaining);
      }
    }
  }, []);

  const startCountdown = (seconds) => {
    let remaining = seconds;

    const timer = setInterval(() => {
      remaining -= 1;
      setCooldown(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setIsCooldownActive(false);
        localStorage.removeItem("aiCooldown");
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  // Check if we're in edit mode by looking for id in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    if (id) {
      setIsEditMode(true);
      setPayUpId(id);
      fetchPayUpData(id);
    }
  }, []);

  const generateDescription = async (e) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.title.trim()) {
        toast.error("Please enter a title to generate description", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        return;
      }

      setWait(true);
      setIsCooldownActive(true);
      setCooldown(cooldowntime);
      localStorage.setItem("aiCooldown", Date.now().toString());

      toast.success("Generating AI description...", {
        toastId: "generating-description",
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: false,
      });

      const data = {
        prompt: formData.title.trim(),
      };

      const res = await generativeDescription(data);

      if (res?.data?.success) {
        setFormData({
          ...formData,
          description: res.data.description,
        });
      } else {
        throw new Error(res?.data?.message || "Failed to generate description");
      }
    } catch (error) {
      console.error("Error generating description:", error);

      toast.error(error.message || "Failed to generate description");
    } finally {
      setWait(false);
    }
  };
  // Function to fetch existing PayUp data
  const fetchPayUpData = async (id) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Loading PayUp data...");

      // Fetch the data from API
      const response = await fetchPayingUp(id);

      if (response.status === 200) {
        const payUpData = response.data.payload.payingUp;

        let discountData = [];
        if (payUpData.discount) {
          if (Array.isArray(payUpData.discount)) {
            discountData = payUpData.discount;
          }
          // If it's an object, make it an array with one element
          else if (typeof payUpData.discount === "object") {
            discountData = [payUpData.discount];
          }
        }

        setDiscounts(discountData);
        // Update form data with fetched data
        setFormData({
          title: payUpData.title || " ",
          description: payUpData.description || "",
          paymentDetails: {
            currencySymbol:
              payUpData.paymentDetails?.currencySymbol || "IndianRupee",
            totalAmount: payUpData.paymentDetails?.totalAmount || 0,
            paymentLink: payUpData.paymentDetails?.paymentLink || "",
            paymentEnabled: payUpData.paymentDetails?.paymentEnabled,
            paymentButtonTitle:
              payUpData.paymentDetails?.paymentButtonTitle || "",
            ownerEmail: payUpData.paymentDetails?.ownerEmail || "",
            ownerPhone: payUpData.paymentDetails?.ownerPhone || "",
          },
          Category: {
            title: payUpData.category?.title || "Category",
            isActive: payUpData.category?.isActive || true,
            categoryMetaData: payUpData.category?.categoryMetaData || [""],
          },
          testimonials: {
            title: payUpData.testimonials?.title || "Testimonials",
            isActive: payUpData.testimonials?.isActive || false,
            testimonialsMetaData:
              payUpData.testimonials?.testimonialsMetaData || [],
          },
          faQ: {
            title: payUpData.faqs?.title || "Frequently Asked Questions",
            isActive: payUpData.faqs?.isActive || false,
            faQMetaData: payUpData.faqs?.faQMetaData || [],
          },
          refundPolicies: {
            title: payUpData.refundPolicies?.title || "Refund Policies",
            isActive: payUpData.refundPolicies?.isActive || true,
            refundPoliciesMetaData:
              payUpData.refundPolicies?.refundPoliciesMetaData || [],
          },
          termAndConditions: {
            title: payUpData.tacs?.title || "Terms & Conditions",
            isActive: payUpData.tacs?.isActive || true,
            termAndConditionsMetaData:
              payUpData.tacs?.termAndConditionsMetaData || [],
          },
          coverImage: {
            title: payUpData.coverImage?.title || "Cover Image",
            isActive: payUpData.coverImage?.isActive || true,
            value: payUpData.coverImage?.value || "",
          },
          file: {
            title: payUpData.files?.title || "File Upload",
            isActive: payUpData.files?.isActive || true,
            value: payUpData.files?.value || "",
          },
        });

        // Set discounts if available
        if (payUpData.discounts && Array.isArray(payUpData.discounts)) {
          setDiscounts(payUpData.discounts);
        }

        // Set price type based on totalAmount format
        if (payUpData.paymentDetails?.totalAmount) {
          const amount = payUpData.paymentDetails.totalAmount.toString();
          if (amount.includes("+")) {
            setPriceType("variable");
          } else {
            setPriceType("fixed");
          }
        }

        toast.dismiss(loadingToast);
        toast.success("PayUp data loaded successfully");
      } else {
        throw new Error("Failed to load PayUp data");
      }
    } catch (error) {
      console.error("Error fetching PayUp data:", error);
      toast.error("Failed to load PayUp data. Please try again.");
    }
  };

  const handleDiscountSubmit = (discountData) => {
    const updatedData = {
      ...discountData,
      id: discountData.id || Date.now(),
    };

    if (editingDiscount) {
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.id === updatedData.id ? updatedData : discount
        )
      );
    } else {
      setDiscounts((prevDiscounts) => [...prevDiscounts, updatedData]);
    }
    setEditingDiscount(null);
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setIsDiscountModalOpen(true);
  };

  const handleDelete = (discountId) => {
    setDiscounts((prevDiscounts) =>
      prevDiscounts.filter((discount) => discount.id !== discountId)
    );
  };

  const handleInputChange = (e, section, field) => {
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (
      section === "paymentDetails" &&
      field === "totalAmount" &&
      priceType === "variable"
    ) {
      value = value ? `${value}+` : value; // Append '+' if value exists
    }

    if (section === "formData") {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }));
    }
  };

  const handleOverviewChange = (htmlContent) => {
    setFormData((prevData) => ({
      ...prevData,
      description: htmlContent,
    }));
  };

  const handleRemoveField = (section, key, index) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData[section][key]];
      updatedArray.splice(index, 1);
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          [key]: updatedArray,
        },
      };
    });
  };

  const [isProfilePicUploading, setIsProfilePicUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const coverImageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const profilePicInputRefs = useRef({});

  const handleProfilePicUpload = async (e, id) => {
    const testimonialPic = e.target.files[0];
    let profilePicUrl = "";

    // Store reference to the current input element
    const currentInput = e.target;

    // Set loading state to true
    setIsProfilePicUploading(true);

    try {
      const testimonialProfilePic = new FormData();
      testimonialProfilePic.append("file", testimonialPic);
      const response = await handelUplaodFile(testimonialProfilePic);
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Profile Picture Uploaded Successfully");
        profilePicUrl = response.data.url;
      } else {
        throw new Error("Profile Picture Upload Failed");
      }
    } catch (error) {
      toast.error("Profile Picture Upload Failed");
      console.error(error);
      profilePicUrl = "";

      // Reset the file input so the same file can be selected again
      if (currentInput) {
        currentInput.value = "";
      }
    } finally {
      // Set loading state to false when done
      setIsProfilePicUploading(false);
    }

    console.log(formData);
    setFormData((prevData) => {
      const updatedTestimonials =
        prevData.testimonials.testimonialsMetaData.map((testimonial) =>
          testimonial.id === id
            ? { ...testimonial, profilePic: profilePicUrl }
            : testimonial
        );
      return {
        ...prevData,
        testimonials: {
          ...prevData.testimonials,
          testimonialsMetaData: updatedTestimonials,
        },
      };
    });
  };

  const handelCoverImageupload = async (e) => {
    const coverImage = e.target.files[0];
    let coverImageUrl = null;

    // Set loading state to true
    setIsCoverImageUploading(true);

    try {
      const coverImageFile = new FormData();
      coverImageFile.append("file", coverImage);
      coverImageFile.append("isPrivateFile", false);
      const response = await handelUplaodFile(coverImageFile);
      // console.log(response.data);
      if (response.status === 200) {
        toast.success("Cover Image Uploaded Successfully");
        coverImageUrl = response.data.url;
      } else {
        throw new Error("Cover Image Upload Failed");
      }
    } catch (error) {
      toast.error("Cover Image Upload Failed");
      console.error(error);
      coverImageUrl = "";

      // Reset the file input so the same file can be selected again
      if (coverImageInputRef.current) {
        coverImageInputRef.current.value = "";
      }
    } finally {
      // Set loading state to false when done
      setIsCoverImageUploading(false);
    }
    setFormData((prevData) => ({
      ...prevData,
      coverImage: {
        ...prevData.coverImage,
        value: coverImageUrl,
      },
    }));
  };

  const handleAddTestimonial = () => {
    setFormData((prevData) => ({
      ...prevData,
      testimonials: {
        ...prevData.testimonials,
        testimonialsMetaData: [
          ...prevData.testimonials.testimonialsMetaData,
          {
            name: "",
            statement: "",
            profilePic: "",
            rating: 1,
            id: Date.now().toString(),
          },
        ],
      },
    }));
    console.log(formData);
  };

  const handleTestimonialDataChange = (e, id) => {
    const value = e.target.value;
    const field = e.target.name.toLowerCase();
    setFormData((prevData) => {
      const updatedTestimonials =
        prevData.testimonials.testimonialsMetaData.map((testimonial) =>
          testimonial.id === id
            ? { ...testimonial, [field]: value }
            : testimonial
        );
      return {
        ...prevData,
        testimonials: {
          ...prevData.testimonials,
          testimonialsMetaData: updatedTestimonials,
        },
      };
    });
  };

  const removeTestimonial = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      testimonials: {
        ...prevData.testimonials,
        testimonialsMetaData: prevData.testimonials.testimonialsMetaData.filter(
          (testimonial) => testimonial.id !== id
        ),
      },
    }));
  };

  const handleAddFieldtoCategory = () => {
    setFormData((prevData) => ({
      ...prevData,
      Category: {
        ...prevData.Category,
        categoryMetaData: [...prevData.Category.categoryMetaData, ""],
      },
    }));
  };

  const handelCatagoryChange = (e, index) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedCategories = prevData.Category.categoryMetaData.map(
        (category, i) => (i === index ? value : category)
      );
      return {
        ...prevData,
        Category: {
          ...prevData.Category,
          categoryMetaData: updatedCategories,
        },
      };
    });
  };

  const handleFaqChange = (e, index, field) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedFaqs = prevData.faQ.faQMetaData.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      );
      return {
        ...prevData,
        faQ: {
          ...prevData.faQ,
          faQMetaData: updatedFaqs,
        },
      };
    });
  };

  const handleToggleFaq = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      faQ: {
        ...prevData.faQ,
        isActive: e.target.checked,
      },
    }));
  };

  const handleAddFaq = () => {
    setFormData((prevData) => ({
      ...prevData,
      faQ: {
        ...prevData.faQ,
        faQMetaData: [
          ...prevData.faQ.faQMetaData,
          { question: "", answer: "" },
        ],
      },
    }));
  };

  const handleRemoveFaq = (index) => {
    setFormData((prevData) => {
      const updatedFaqs = prevData.faQ.faQMetaData.filter(
        (_, i) => i !== index
      );
      return {
        ...prevData,
        faQ: {
          ...prevData.faQ,
          faQMetaData: updatedFaqs,
        },
      };
    });
  };

  const handleRatingChange = (e, id) => {
    const value = parseInt(e.target.value);
    setFormData((prevData) => {
      const updatedTestimonials =
        prevData.testimonials.testimonialsMetaData.map((testimonial) =>
          testimonial.id === id
            ? { ...testimonial, rating: value }
            : testimonial
        );
      return {
        ...prevData,
        testimonials: {
          ...prevData.testimonials,
          testimonialsMetaData: updatedTestimonials,
        },
      };
    });
  };

  const handelAddRefundPolicy = () => {
    setFormData((prevData) => ({
      ...prevData,
      refundPolicies: {
        ...prevData.refundPolicies,
        refundPoliciesMetaData: [
          ...prevData.refundPolicies.refundPoliciesMetaData,
          "",
        ],
      },
    }));
  };

  const handelRefundPolicyDataChange = (e, index) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedRefundPolicies =
        prevData.refundPolicies.refundPoliciesMetaData.map((policy, i) =>
          i === index ? value : policy
        );
      return {
        ...prevData,
        refundPolicies: {
          ...prevData.refundPolicies,
          refundPoliciesMetaData: updatedRefundPolicies,
        },
      };
    });
  };

  const handelAddTermsAndConditions = () => {
    setFormData((prevData) => ({
      ...prevData,
      termAndConditions: {
        ...prevData.termAndConditions,
        termAndConditionsMetaData: [
          ...prevData.termAndConditions.termAndConditionsMetaData,
          "",
        ],
      },
    }));
  };

  const handelTermsAndConditionsDataChange = (e, index) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedTermsAndConditions =
        prevData.termAndConditions.termAndConditionsMetaData.map((term, i) =>
          i === index ? value : term
        );
      return {
        ...prevData,
        termAndConditions: {
          ...prevData.termAndConditions,
          termAndConditionsMetaData: updatedTermsAndConditions,
        },
      };
    });
  };

  const uploadDigitalFile = async (file) => {
    let fileUrl = "";

    // We don't need to set loading state here as it will be set in handelFileChanges

    try {
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("isPrivateFile", true);
      const response = await handelUplaodFile(fileData);
      console.log(response.data);
      if (response.status === 200) {
        // toast.success("File Uploaded Successfully");
        fileUrl = response.data.url;
      } else {
        throw new Error("File Upload Failed");
      }
    } catch (error) {
      toast.error("File Upload Failed");
      console.error(error);
      fileUrl = "";
    }

    return fileUrl;
  };

  const handelFileChanges = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Set loading state to true
      setIsFileUploading(true);

      const newFiles = Array.from(files);
      const addFiles = [];
      let hasFailure = false;

      try {
        for (const newFilesr of newFiles) {
          const url = await uploadDigitalFile(newFilesr);
          if (url)
            addFiles.push({
              name: newFilesr.name,
              id: Date.now().toString(36).substr(2, 9), // Unique ID for each file
              url: url,
            });
          else hasFailure = true;
        }

        setFormData((prevData) => ({
          ...prevData,
          file: {
            ...prevData.file,
            value: [...prevData.file.value, ...addFiles],
          },
        }));
      } catch (error) {
        hasFailure = true;
      } finally {
        // Reset the file input if there was an upload failure
        if (hasFailure && fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Set loading state to false when done
        setIsFileUploading(false);
      }
    }
  };

  const isQuillContentEmpty = (html) => {
    if (!html) return true;

    const text = html.replace(/<[^>]*>/g, "").trim();

    if (text === "") return true;

    const emptyPatterns = ["<p><br></p>", "<p></p>", "<br>", "<p>&nbsp;</p>"];

    return emptyPatterns.includes(html.trim());
  };

  const validateForm = () => {
    // Check if all required fields are filled
    return (
      formData.title.trim() !== "" &&
      !isQuillContentEmpty(formData.description) &&
      formData.Category.categoryMetaData.some(
        (category) => category.trim() !== ""
      ) &&
      formData.refundPolicies.refundPoliciesMetaData.some(
        (policy) => policy.trim() !== ""
      ) &&
      formData.termAndConditions.termAndConditionsMetaData.some(
        (term) => term.trim() !== ""
      ) &&
      formData.coverImage.value !== "" &&
      Array.isArray(formData.file.value) &&
      formData.file.value.length > 0 &&
      // Add validation for payment details
      formData.paymentDetails.totalAmount > 0 &&
      formData.paymentDetails.paymentButtonTitle.trim() !== "" &&
      formData.paymentDetails.ownerEmail.trim() !== "" &&
      formData.paymentDetails.ownerPhone.trim() !== ""
    );
  };

  const handleCreatePayUpForm = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields before submitting");
      return; // Stop execution if validation fails
    }

    // Set loading state to true
    setIsSubmitting(true);

    const data = {
      title: formData.title,
      description: formData.description,
      paymentDetails: formData.paymentDetails,
      category: formData.Category,
      testimonials: formData.testimonials,
      faqs: formData.faQ,
      refundPolicies: formData.refundPolicies,
      coverImage: formData.coverImage,
      tacs: formData.termAndConditions,
      files: formData.file,
      discount: discounts,
    };

    try {
      let response;

      if (isEditMode) {
        // Update existing PayUp
        response = await editPayingUp(payUpId, data);
        if (response.status === 200) {
          toast.success("PayUp Page Updated Successfully");
          navigate("/dashboard/payingup");
        } else {
          throw new Error("PayUp Page Update Failed");
        }
      } else {
        // Create new PayUp
        response = await createPayUpContent(data);
        if (response.status === 200) {
          toast.success("PayUp Page Created Successfully");
          formRef.current.reset();
          navigate("/dashboard/payingup");
        } else {
          throw new Error(error.response?.data?.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message);
    } finally {
      // Set loading state back to false
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-6xl px-6 py-8">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm mb-8 rounded-xl border border-orange-500/20">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <IoArrowBackCircleOutline
                  className="text-orange-500 w-8 h-8 hover:text-orange-400 transition-colors cursor-pointer"
                  onClick={() => navigate("/dashboard/payingup")}
                />
                <div className="w-px h-8 bg-orange-500/30"></div>
                <h2 className="text-2xl font-bold text-orange-500">
                  {isEditMode ? "Edit PayingUp Page" : "New PayingUp Page"}
                </h2>
              </div>
            </div>
          </div>

          <form
            ref={formRef}
            className="space-y-8 bg-gray-900 rounded-xl p-8 border border-orange-500/20"
          >
            {/* Title Section */}
            <div className="space-y-2">
              <label className="text-orange-500 font-semibold">
                Checkout Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange(e, "formData", "title")}
                className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="Welcome to my cooking course"
              />
            </div>

            {/* Payment Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">
                  Payment <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="space-y-6 mt-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      priceType === "fixed"
                        ? "bg-orange-500 text-white"
                        : "bg-black/50 text-orange-500 border-2 border-orange-500/30 hover:border-orange-500"
                    }`}
                    onClick={() => setPriceType("fixed")}
                  >
                    Fixed Price
                  </button>
                  {/* <button
                      type="button"
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        priceType === "variable"
                          ? "bg-orange-500 text-white"
                          : "bg-black/50 text-orange-500 border-2 border-orange-500/30 hover:border-orange-500"
                      }`}
                      onClick={() => setPriceType("variable")}
                    >
                      Variable Price
                    </button> */}
                </div>

                <div>
                  <div className="mb-4">
                    <label className="block text-m font-medium text-orange-500 mt-4">
                      Discounts
                    </label>
                  </div>

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
                        {discount.plan && (
                          <span className="text-gray-400 ml-2">
                            - {discount.plan}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-gray-400 text-sm">
                          Expires:{" "}
                          {new Date(discount.expiry).toLocaleDateString()}
                        </div>
                        <button
                          type="button" // Add this
                          onClick={(e) => {
                            e.preventDefault(); // Add this
                            handleEdit(discount);
                          }}
                          className="text-orange-500 hover:text-orange-400 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          type="button" // Add this
                          onClick={(e) => {
                            e.preventDefault(); // Add this
                            handleDelete(discount.id);
                          }}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        setEditingDiscount(null);
                        setIsDiscountModalOpen(true);
                      }}
                      type="button" // Add this
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-orange-500">
                      Payment Button Title
                    </label>
                    <input
                      type="text"
                      value={formData.paymentDetails.paymentButtonTitle}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          "paymentDetails",
                          "paymentButtonTitle"
                        )
                      }
                      className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      placeholder="Pay Now"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-orange-500">Amount</label>
                    <input
                      type="number"
                      value={
                        priceType === "variable"
                          ? formData.paymentDetails.totalAmount
                              .toString()
                              .replace("+", "")
                          : formData.paymentDetails.totalAmount
                      }
                      onChange={(e) =>
                        handleInputChange(e, "paymentDetails", "totalAmount")
                      }
                      className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      placeholder="200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-orange-500">Support Email</label>
                    <input
                      type="email"
                      value={formData.paymentDetails.ownerEmail}
                      onChange={(e) =>
                        handleInputChange(e, "paymentDetails", "ownerEmail")
                      }
                      className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      placeholder="support@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-orange-500">Support Phone</label>
                    <input
                      type="text"
                      value={formData.paymentDetails.ownerPhone}
                      onChange={(e) =>
                        handleInputChange(e, "paymentDetails", "ownerPhone")
                      }
                      className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                      placeholder="+91 1234567898"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">
                  Category <span className="text-red-500">*</span>
                </label>
                {/* <input
                  type="checkbox"
                  checked={formData.Category.isActive}
                  onChange={(e) => handleInputChange(e, "Category", "isActive")}
                  className="w-5 h-5 rounded border-orange-500 text-orange-500 focus:ring-orange-500"
                /> */}
              </div>

              {formData.Category.isActive && (
                <div className="space-y-4 mt-4">
                  {formData.Category.categoryMetaData.map((category, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => handelCatagoryChange(e, index)}
                        className="flex-1 h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="Category name"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveField(
                            "Category",
                            "categoryMetaData",
                            index
                          )
                        }
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <MinusCircle className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddFieldtoCategory()}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add Category
                  </button>
                </div>
              )}
            </div>

            {/* Overview Section */}

            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20 relative">
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
                  value={formData.description}
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
                      ["link"],
                      [{ size: ["small", false, "large", "huge"] }],
                      [{ color: [] }, { background: [] }],
                      [{ font: [] }],
                      [{ align: [] }],
                    ],
                  }}
                />
              </div>

              {/* AI Assistant Button with Loading State */}
              <div className="absolute bottom-8 right-10">
                {wait ? (
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    onClick={generateDescription}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    
                  >
                    <AIAssistantButton
                      cooldown={isCooldownActive}
                      time={cooldown}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">
                  Testimonials
                </label>
                <input
                  type="checkbox"
                  checked={formData.testimonials.isActive}
                  onChange={(e) =>
                    handleInputChange(e, "testimonials", "isActive")
                  }
                  className="w-5 h-5 rounded border-orange-500 text-orange-500 focus:ring-orange-500"
                />
              </div>

              {formData.testimonials.isActive && (
                <div className="space-y-6 mt-4">
                  {formData.testimonials.testimonialsMetaData.map(
                    (testimonial) => (
                      <div
                        key={testimonial.id}
                        className="space-y-4 p-4 bg-black/30 rounded-lg border border-orange-500/10"
                      >
                        <input
                          type="text"
                          name="name"
                          onChange={(e) => {
                            handleTestimonialDataChange(e, testimonial.id);
                          }}
                          className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                          placeholder="Name"
                        />

                        <div className="flex gap-3">
                          <textarea
                            name="statement"
                            onChange={(e) => {
                              handleTestimonialDataChange(e, testimonial.id);
                            }}
                            className="flex-1 h-24 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                            placeholder="Testimonial text"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              removeTestimonial(testimonial.id);
                            }}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <MinusCircle className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-orange-500">
                              Profile Picture
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleProfilePicUpload(e, testimonial.id)
                              }
                              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20 cursor-pointer"
                            />
                            {isProfilePicUploading ? (
                              <div className="flex items-center gap-2 text-orange-500 mt-2">
                                <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                <span>Uploading profile picture...</span>
                              </div>
                            ) : (
                              testimonial.profilePic && (
                                <img
                                  src={testimonial.profilePic}
                                  alt="Profile"
                                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/30"
                                />
                              )
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-orange-500">Rating</label>
                            <select
                              onChange={(e) =>
                                handleRatingChange(e, testimonial.id)
                              }
                              value={testimonial.rating}
                              className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white focus:border-orange-500 focus:ring-2focus:ring-orange-500/20 transition-all"
                            >
                              <option value={1}>1 Star</option>
                              <option value={2}>2 Stars</option>
                              <option value={3}>3 Stars</option>
                              <option value={4}>4 Stars</option>
                              <option value={5}>5 Stars</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    onClick={handleAddTestimonial}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add Testimonial
                  </button>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">FAQs</label>
                <input
                  type="checkbox"
                  checked={formData.faQ.isActive}
                  onChange={handleToggleFaq}
                  className="w-5 h-5 rounded border-orange-500 text-orange-500 focus:ring-orange-500"
                />
              </div>

              {formData.faQ.isActive && (
                <div className="space-y-6 mt-4">
                  {formData.faQ.faQMetaData.map((faq, index) => (
                    <div
                      key={index}
                      className="space-y-4 p-4 bg-black/30 rounded-lg border border-orange-500/10"
                    >
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(e, index, "question")}
                        className="w-full h-12 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="FAQ Question"
                      />
                      <div className="flex gap-3">
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(e, index, "answer")}
                          className="flex-1 h-24 rounded-lg bg-black/50 border-2 border-orange-500/30 px-4 py-2 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                          placeholder="FAQ Answer"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <MinusCircle className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add FAQ
                  </button>
                </div>
              )}
            </div>

            {/* Refund Policies Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">
                  Refund Policies <span className="text-red-500">*</span>
                </label>
              </div>

              {formData.refundPolicies.isActive && (
                <div className="space-y-4 mt-4">
                  {formData.refundPolicies.refundPoliciesMetaData.map(
                    (policy, index) => (
                      <div key={index} className="flex gap-3">
                        <textarea
                          value={policy}
                          onChange={(e) => {
                            handelRefundPolicyDataChange(e, index);
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
                    onClick={() => handelAddRefundPolicy()}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add Refund Policy
                  </button>
                </div>
              )}
            </div>

            {/* Terms & Conditions Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">
                  Terms & Conditions <span className="text-red-500">*</span>
                </label>
              </div>

              {formData.termAndConditions.isActive && (
                <div className="space-y-4 mt-4">
                  {formData.termAndConditions.termAndConditionsMetaData.map(
                    (term, index) => (
                      <div key={index} className="flex gap-3">
                        <textarea
                          value={term}
                          onChange={(e) => {
                            handelTermsAndConditionsDataChange(e, index);
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
                    onClick={() => handelAddTermsAndConditions()}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 transition-all"
                  >
                    <BsPlusSquareDotted />
                    Add Term & Condition
                  </button>
                </div>
              )}
            </div>

            {/* Cover Image Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <div className="flex justify-between items-center">
                <label className="text-orange-500 font-semibold">
                  Cover Image <span className="text-red-500">*</span>
                </label>
              </div>

              {formData.coverImage.isActive && (
                <div className="space-y-4 mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handelCoverImageupload(e);
                    }}
                    ref={coverImageInputRef}
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500/10 file:text-orange-500 hover:file:bg-orange-500/20 cursor-pointer"
                  />
                  {isCoverImageUploading ? (
                    <div className="flex items-center gap-2 text-orange-500 mt-2">
                      <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      <span>Uploading cover image...</span>
                    </div>
                  ) : (
                    formData.coverImage.value && (
                      <div className="relative w-full max-w-md">
                        {/* Image Preview */}
                        <img
                          src={formData.coverImage.value}
                          alt="Cover"
                          className="w-full rounded-lg border-2 border-orange-500/30 shadow-lg shadow-orange-500/10"
                        />
                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            handleInputChange(
                              { target: { value: "" } },
                              "coverImage",
                              "value"
                            );
                            document.querySelector('input[type="file"]').value =
                              ""; // Clear file input
                          }}
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
                    )
                  )}
                </div>
              )}
            </div>

            {/* File Upload Section */}
            <div className="space-y-4 p-6 rounded-xl bg-black/30 border border-orange-500/20">
              <h3 className="text-lg font-semibold text-orange-500">
                Upload your Digital Files{" "}
                <span className="text-red-500">*</span>
              </h3>
              <div className="p-8 border-2 border-dashed border-orange-500/30 rounded-lg bg-black/20 relative group hover:border-orange-500/50 transition-all">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-8 h-8 text-orange-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400">Browse files from your system</p>
                  {isFileUploading && (
                    <div className="flex items-center gap-2 text-orange-500 mt-2">
                      <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      <span>Uploading files...</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={(e) => {
                    handelFileChanges(e);
                  }}
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  multiple
                  disabled={isFileUploading}
                />
              </div>
              {formData.file.value.length > 0 && (
                <div className="p-4 rounded-lg bg-black/20 border border-orange-500/20">
                  <p className="text-orange-500 font-medium">Uploaded Files:</p>
                  <ul className="mt-2 space-y-2">
                    {formData.file.value.map((file) => (
                      <li
                        key={file.id}
                        className="flex justify-between items-center text-gray-300"
                      >
                        <span>{file.name}</span>
                        <button
                          onClick={() => {
                            const updatedFiles = formData.file.value.filter(
                              (item) => item.id !== file.id
                            );
                            handleInputChange(
                              { target: { value: updatedFiles } },
                              "file",
                              "value"
                            );
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {!validateForm() && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm">
                  Please fill in all required fields marked with * before
                  submitting:
                </p>
              </div>
            )}
            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={handleCreatePayUpForm}
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
                    {isEditMode ? "Update PayUp Page" : "Create PayUp Page"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePayUp;
