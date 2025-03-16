import {MessageCircle, MinusCircle, Phone} from "lucide-react";
import {useState} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {BsPlusSquareDotted} from "react-icons/bs";
import {FaDesktop, FaMobileAlt, FaStar} from "react-icons/fa";
import {IoCloseCircleOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import Pattern from "../../../../assets/pattern.png";

const CreatePayUp = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [priceType, setPriceType] = useState("fixed");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: " ",
    description: "",
    paymentDetails: {
      currencySymbol: "IndianRupee",
      totalAmount: 0,
      paymentLink: "",
      paymentEnabled: true,
      paymentButtonTitle: "",
      ownerEmail: "",
      ownerPhone: "",
    },
    Category: {
      title: "Category",
      isActive: false,
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
      isActive: false,
      refundPoliciesMetaData: [],
    },
    termAndConditions: {
      title: "Terms & Conditions",
      isActive: false,
      termAndConditionsMetaData: [],
    },
    coverImage: {
      title: "Cover Image",
      isActive: false,
      value: "",
    },
    file: {
      title: "File Upload",
      isActive: false,
      value: "",
    },
  });

  const [faqVisibility, setFaqVisibility] = useState(formData.faQ.faQMetaData.map(() => false));

  const toggleFaqAnswer = (index) => {
    setFaqVisibility((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const toggleView = () => {
    setIsMobileView((prev) => !prev);
  };

  const handleInputChange = (e, section, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

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

  const handleAddField = (section, key) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: [...prevData[section][key], ""],
      },
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
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          coverImage: {
            ...prevData.coverImage,
            value: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => {
          const updatedTestimonials = [...prevData.testimonials.testimonialsMetaData];
          if (!updatedTestimonials[index]) updatedTestimonials[index] = {}; // Ensure the object exists
          updatedTestimonials[index].profilePic = reader.result;
          return {
            ...prevData,
            testimonials: {
              ...prevData.testimonials,
              testimonialsMetaData: updatedTestimonials,
            },
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaqChange = (e, index, field) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const updatedFaqs = prevData.faQ.faQMetaData.map((faq, i) => (i === index ? {...faq, [field]: value} : faq));
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
        faQMetaData: [...prevData.faQ.faQMetaData, {question: "", answer: ""}],
      },
    }));
    setFaqVisibility((prev) => [...prev, false]);
  };

  const handleRemoveFaq = (index) => {
    setFormData((prevData) => {
      const updatedFaqs = prevData.faQ.faQMetaData.filter((_, i) => i !== index);
      return {
        ...prevData,
        faQ: {
          ...prevData.faQ,
          faQMetaData: updatedFaqs,
        },
      };
    });
    setFaqVisibility((prev) => prev.filter((_, i) => i !== index));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => <FaStar key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />);
  };

  const handleRatingChange = (e, index) => {
    const value = parseInt(e.target.value);
    setFormData((prevData) => {
      const updatedTestimonials = prevData.testimonials.testimonialsMetaData.map((testimonial, i) => (i === index ? {...testimonial, rating: value} : testimonial));
      return {
        ...prevData,
        testimonials: {
          ...prevData.testimonials,
          testimonialsMetaData: updatedTestimonials,
        },
      };
    });
  };

  const fakeApiCall = () => {
    console.log("Sending data to API...");
    setTimeout(() => {
      console.log("API response:", formData);
    }, 1000);
  };

  const consoleFormData = () => {
    fakeApiCall();
  };

  return (
    <div className="max-w-full min-h-screen bg-white flex  flex-col md:flex-row">
      <div className="md:w-1/2 w:1/2 overflow-y-auto h-full">
        {/* Form Field */}
        {/* Checkout Navbar */}
        <div className="flex py-6 px-5 border-b-gray-200 border-b-2 w-full sticky top-0 bg-white z-10">
          <div className="flex gap-4 items-center">
            <IoCloseCircleOutline className="size-9" onClick={() => navigate("/dashboard/payingup")} />
            <div className="w-[2px] h-9 bg-gray-200"></div>
            <h2 className="font-poppins font-bold tracking-tight text-2xl text-gray-800">New PayUp page</h2>
          </div>
        </div>

        <div className="px-9 py-5 bg-gray-100">
          <form action="" className="flex flex-col gap-6">
            {/* For Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex gap-2 items-center">
                Checkout Title
              </label>
              <input
                type="text"
                onChange={(e) => handleInputChange(e, "formData", "title")}
                id="title"
                className="w-full max-w-md h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Welcome to my cooking course"
              />
            </div>

            {/* Payment */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="paymentEnabled" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                  Enable Payment
                </label>
                <input type="checkbox" checked={formData.paymentDetails.paymentEnabled} onChange={(e) => handleInputChange(e, "paymentDetails", "paymentEnabled")} />
              </div>
              {formData.paymentDetails.paymentEnabled && (
                <div className="flex gap-5 flex-col flex-wrap py-3">
                  {/* Price Type Selection */}
                  <div className="flex gap-4">
                    <a className={`px-4 py-2 font-poppins flex items-center rounded-lg ${priceType === "fixed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`} onClick={() => setPriceType("fixed")}>
                      Fixed Price
                    </a>
                    <a className={`px-4 py-2 font-poppins flex items-center rounded-lg ${priceType === "variable" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`} onClick={() => setPriceType("variable")}>
                      Variable Price
                    </a>
                  </div>

                  <div className="flex gap-2">
                    {/* Currency (set to Indian Rupees only) */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="currencySymbol" className="font-poppins font-normal text-sm tracking-tight text-gray-800 flex gap-2 items-center">
                        Currency
                      </label>
                      <select className="w-[150px] py-2 px-1 rounded-lg h-12 border-gray-300 border-2 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                        <option value="INR">Indian Rupees</option>
                      </select>
                    </div>

                    {/* Payment amount */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="totalAmount" className="font-poppins font-normal text-sm tracking-tight text-gray-800 flex gap-2 items-center">
                        Amount
                      </label>
                      <input
                        type="number"
                        onChange={(e) => handleInputChange(e, "paymentDetails", "totalAmount")}
                        id="totalAmount"
                        className="w-full max-w-md h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="200"
                      />
                    </div>

                    {/* Payment Button */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="paymentButtonTitle" className="font-poppins font-normal text-sm tracking-tight text-gray-800 flex gap-2 items-center">
                        Payment Button Title
                      </label>
                      <input
                        type="text"
                        onChange={(e) => handleInputChange(e, "paymentDetails", "paymentButtonTitle")}
                        id="paymentButtonTitle"
                        className="w-full max-w-md h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pay Now"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {/* Owner email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="ownerEmail" className="font-poppins font-normal text-sm tracking-tight text-gray-800 flex gap-2 items-center">
                        Owner Email
                      </label>
                      <input
                        type="email"
                        onChange={(e) => handleInputChange(e, "paymentDetails", "ownerEmail")}
                        id="ownerEmail"
                        className="w-[300px] h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Support email"
                      />
                    </div>
                    {/* Owner Phone number */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="ownerPhone" className="font-poppins font-normal text-sm tracking-tight text-gray-800 flex gap-2 items-center">
                        Owner Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.paymentDetails.ownerPhone}
                        onChange={(e) => handleInputChange(e, "paymentDetails", "ownerPhone")}
                        id="ownerPhone"
                        className="w-[300px] h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Support phone number"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="categoryEnabled" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                  Enable Category
                </label>
                <input type="checkbox" checked={formData.Category.isActive} onChange={(e) => handleInputChange(e, "Category", "isActive")} />
              </div>
              {formData.Category.isActive && (
                <div className="flex flex-col gap-2 py-3">
                  {formData.Category.categoryMetaData.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        onChange={(e) => {
                          const updatedCategories = [...formData.Category.categoryMetaData];
                          updatedCategories[index] = e.target.value;
                          setFormData((prevData) => ({
                            ...prevData,
                            Category: {
                              ...prevData.Category,
                              categoryMetaData: updatedCategories,
                            },
                          }));
                        }}
                        className="w-full max-w-md h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Category"
                      />
                      <MinusCircle className="text-red-500 cursor-pointer size-5" onClick={() => handleRemoveField("Category", "categoryMetaData", index)} />
                    </div>
                  ))}
                  <div className="mt-1">
                    <button type="button" className="bg-gray-300 font-poppins tracking-tight py-2 px-3 rounded-lg text-black cursor-pointer text-sm flex items-center gap-3" onClick={() => handleAddField("Category", "categoryMetaData")}>
                      <BsPlusSquareDotted /> Add Category
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="flex flex-col gap-2">
              <label htmlFor="overview" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                Overview
              </label>
              <ReactQuill
                value={formData.description} // Pass value prop to sync Quill editor with state
                onChange={handleOverviewChange} // Update the state on change
                theme="snow"
                className="quill-editor"
                modules={{
                  toolbar: [[{header: [1, 2, false]}], ["bold", "italic", "underline", "strike"], [{list: "ordered"}, {list: "bullet"}], ["link", "image"]],
                }}
              />
            </div>

            {/* Testimonials */}
            {/* Testimonials */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="testimonialsEnabled" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                  Enable Testimonials
                </label>
                <input type="checkbox" checked={formData.testimonials.isActive} onChange={(e) => handleInputChange(e, "testimonials", "isActive")} />
              </div>
              {formData.testimonials.isActive && (
                <div className="flex flex-col gap-2 py-3">
                  {formData.testimonials.testimonialsMetaData.map((testimonial, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <input
                        type="text"
                        onChange={(e) => {
                          const updatedTestimonials = [...formData.testimonials.testimonialsMetaData];
                          updatedTestimonials[index].name = e.target.value;
                          setFormData((prevData) => ({
                            ...prevData,
                            testimonials: {
                              ...prevData.testimonials,
                              testimonialsMetaData: updatedTestimonials,
                            },
                          }));
                        }}
                        className="w-full max-w-md h-12 rounded-lg text-gray-700 border-gray-300 border-2 px-4 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                      />
                      <div className="flex gap-4 items-center">
                        <textarea
                          onChange={(e) => {
                            const updatedTestimonials = [...formData.testimonials.testimonialsMetaData];
                            updatedTestimonials[index].description = e.target.value;
                            setFormData((prevData) => ({
                              ...prevData,
                              testimonials: {
                                ...prevData.testimonials,
                                testimonialsMetaData: updatedTestimonials,
                              },
                            }));
                          }}
                          className="w-full h-20 rounded-lg text-gray-700 border-gray-300 border-2 px-4 py-2 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Testimonial Description"
                        />
                        <MinusCircle className="text-red-500 cursor-pointer size-5" onClick={() => handleRemoveField("testimonials", "testimonialsMetaData", index)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor={`profilePic-${index}`} className="font-poppins font-normal text-sm tracking-tight text-gray-800">
                          Upload Profile Picture
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProfilePicUpload(e, index)}
                          id={`profilePic-${index}`}
                          className="w-full max-w-md h-12 text-gray-700 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-9 items-center">
                          {testimonial.profilePic && <img src={testimonial.profilePic} alt="Profile" className="w-16 h-16 rounded-full mt-2" />}
                          <div className="flex flex-col ">
                            <label htmlFor={`rating-${index}`} className="font-poppins font-normal text-sm tracking-tight text-gray-800">
                              Rating
                            </label>
                            <select onChange={(e) => handleRatingChange(e, index)} value={testimonial.rating} className="w-[150px] py-2 px-1 rounded-lg h-12 border-gray-300 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value={1}>1 Star</option>
                              <option value={2}>2 Stars</option>
                              <option value={3}>3 Stars</option>
                              <option value={4}>4 Stars</option>
                              <option value={5}>5 Stars</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-1">
                    <button type="button" className="bg-gray-300 font-poppins tracking-tight py-2 px-3 rounded-lg text-black cursor-pointer text-sm flex items-center gap-3" onClick={() => handleAddField("testimonials", "testimonialsMetaData")}>
                      <BsPlusSquareDotted /> Add Testimonial
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* FAQs */}
            {/* Enable FAQ Checkbox */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-poppins font-semibold text-md text-gray-800">Enable FAQs</label>
                <input type="checkbox" checked={formData.faQ.isActive} onChange={handleToggleFaq} />
              </div>
              {formData.faQ.isActive && (
                <div className="flex flex-col">
                  {/* FAQ Section in Form */}
                  <div className="flex flex-col gap-2">
                    {/* <h2 className="font-bold tracking-tight font-poppins">FAQs</h2> */}
                    {formData.faQ.faQMetaData.map((faq, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <input type="text" value={faq.question} onChange={(e) => handleFaqChange(e, index, "question")} className="w-full h-12 rounded-lg border-gray-300 border-2 px-4 text-sm shadow-sm" placeholder="FAQ Question" />
                        <textarea value={faq.answer} onChange={(e) => handleFaqChange(e, index, "answer")} className="w-full h-20 rounded-lg border-gray-300 border-2 px-4 text-sm shadow-sm" placeholder="FAQ Answer" />
                        <div className="flex justify-end">
                          <button type="button" onClick={() => handleRemoveFaq(index)} className="text-red-500 flex items-center gap-1 text-sm">
                            <MinusCircle /> Remove FAQ
                          </button>
                        </div>
                      </div>
                    ))}
                    <div>
                      <button type="button" onClick={handleAddFaq} className="bg-gray-300 font-poppins tracking-tight py-2 px-3 rounded-lg text-black cursor-pointer text-sm flex items-center gap-3">
                        <BsPlusSquareDotted /> Add FAQ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Refund Policies */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="refundPoliciesEnabled" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                  Enable Refund Policies
                </label>
                <input type="checkbox" checked={formData.refundPolicies.isActive} onChange={(e) => handleInputChange(e, "refundPolicies", "isActive")} />
              </div>
              {formData.refundPolicies.isActive && (
                <div className="flex flex-col gap-2 py-3">
                  {formData.refundPolicies.refundPoliciesMetaData.map((policy, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <textarea
                        onChange={(e) => {
                          const updatedPolicies = [...formData.refundPolicies.refundPoliciesMetaData];
                          updatedPolicies[index] = e.target.value;
                          setFormData((prevData) => ({
                            ...prevData,
                            refundPolicies: {
                              ...prevData.refundPolicies,
                              refundPoliciesMetaData: updatedPolicies,
                            },
                          }));
                        }}
                        className="w-full h-20 rounded-lg text-gray-700 border-gray-300 border-2 px-4 py-2 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Refund Policy"
                      />
                      <MinusCircle className="text-red-500 cursor-pointer size-5" onClick={() => handleRemoveField("refundPolicies", "refundPoliciesMetaData", index)} />
                    </div>
                  ))}
                  <div className="mt-1">
                    <button type="button" className="bg-gray-300 font-poppins tracking-tight py-2 px-3 rounded-lg text-black cursor-pointer text-sm flex items-center gap-3" onClick={() => handleAddField("refundPolicies", "refundPoliciesMetaData")}>
                      Add Refund Policy
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="termAndConditionsEnabled" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                  Enable Terms & Conditions
                </label>
                <input type="checkbox" checked={formData.termAndConditions.isActive} onChange={(e) => handleInputChange(e, "termAndConditions", "isActive")} />
              </div>
              {formData.termAndConditions.isActive && (
                <div className="flex flex-col gap-2 py-3">
                  {formData.termAndConditions.termAndConditionsMetaData.map((term, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <textarea
                        onChange={(e) => {
                          const updatedTerms = [...formData.termAndConditions.termAndConditionsMetaData];
                          updatedTerms[index] = e.target.value;
                          setFormData((prevData) => ({
                            ...prevData,
                            termAndConditions: {
                              ...prevData.termAndConditions,
                              termAndConditionsMetaData: updatedTerms,
                            },
                          }));
                        }}
                        className="w-full h-20 rounded-lg text-gray-700 border-gray-300 border-2 px-4 py-2 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Term & Condition"
                      />
                      <MinusCircle className="text-red-500 cursor-pointer size-5" onClick={() => handleRemoveField("termAndConditions", "termAndConditionsMetaData", index)} />
                    </div>
                  ))}
                  <div className="mt-1">
                    <button type="button" className="bg-gray-300 font-poppins tracking-tight py-2 px-3 rounded-lg text-black cursor-pointer text-sm flex items-center gap-3" onClick={() => handleAddField("termAndConditions", "termAndConditionsMetaData")}>
                      <BsPlusSquareDotted /> Add Term & Condition
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="coverImageEnabled" className="font-poppins font-semibold text-md tracking-tight text-gray-800 flex items-center gap-2">
                  Enable Cover Image
                </label>
                <input type="checkbox" checked={formData.coverImage.isActive} onChange={(e) => handleInputChange(e, "coverImage", "isActive")} />
              </div>
              {formData.coverImage.isActive && (
                <div className="flex flex-col gap-2 py-3">
                  <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full max-w-md h-12 text-gray-700 font-poppins text-sm tracking-tight shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {formData.coverImage.value && <img src={formData.coverImage.value} alt="Cover" className="w-32 h-32 max-w-md rounded-lg shadow-md mt-3" />}
                </div>
              )}
            </div>

            {/* Console Form Data Button */}
            <div className="mt-4">
              <button type="button" onClick={consoleFormData} className="bg-blue-500 text-white font-poppins tracking-tight py-2 px-4 rounded-lg cursor-pointer text-sm">
                Console Form Data
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Section */}
      <div
        className="md:w-1/2  h-screen  sticky top-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${Pattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* View Toggle Button */}
        <div className="absolute top-4 right-4 flex items-center justify-center bg-gray-800 text-white rounded-full p-2 cursor-pointer z-2" onClick={toggleView}>
          {isMobileView ? <FaDesktop className="text-xl" /> : <FaMobileAlt className="text-xl" />}
        </div>

        {/* Mock Browser Preview */}
        <div className={`relative bg-white rounded-lg overflow-y-auto mt-6  shadow-lg ${isMobileView ? "w-[60%] h-[90%]" : "w-[90%] h-[90%]"}`}>
          <div className="flex items-center bg-black p-2 rounded-t-lg justify-between">
            <div className="flex gap-2 ml-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="font-poppins text-sm ml-4 text-white px-8 rounded-full py-1 bg-gray-500">www.oneapp/create-paying-up</div>
            <div></div>
          </div>

          <div className="overflow-y-auto h-full">
            <div className="bg-gradient-to-r from-orange-300 to-orange-600 ">
              <div className="flex items-center flex-col py-2">
                {/* Checkout Title */}
                <h2 className="text-[13px] font-bold text-white font-poppins ">{formData.title === " " ? "Paying Title" : formData.title}</h2>
                {/* Categories */}
                <div className="flex items-center gap-1 mt-2">
                  {formData.Category.categoryMetaData.map((category, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 text-[8px] font-poppins px-1 py-1 rounded-full">
                      {category === "" ? "Categories" : category}
                    </span>
                  ))}
                </div>
                {/* Payment */}
                <div className="flex items-center gap-1 mt-2">
                  <button className="font-poppins text-[9px] px-3 py-1 rounded-full bg-black text-white flex gap-2">
                    {formData.paymentDetails.paymentButtonTitle}
                    <span> ₹ {formData.paymentDetails.totalAmount}</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Overview */}
            <div className="mt-2 px-8 text-center">
              <h2 className="font-bold tracking-tight font-poppins text-[12px]">Overview</h2>
              <div
                className="font-poppins text-[9px] px-4 py-2"
                dangerouslySetInnerHTML={{__html: formData.description}} // Render updated description
              />
            </div>
            {/* Testimonial */}
            <div className="mt-4 px-10 py-2 bg-gray-100 flex flex-col justify-center w-full">
              <h1 className="text-center font-bold tracking-tight font-poppins text-[12px]">Testimonials</h1>
              <div className="grid md:grid-cols-2 grid-cols-3 gap-2">
                {formData.testimonials.testimonialsMetaData.map((testimonial, index) => (
                  <div className=" bg-white rounded-lg p-2 shadow-md my-4 " key={index}>
                    <div className="flex gap-3">
                      <img src={testimonial.profilePic} alt="" className="w-8 h-8 rounded-full object-cover " />
                      <div>
                        <p className="text-[11px] font-poppins">{testimonial.name}</p>
                        <div className="flex text-[10px]">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 px-4 text-[9px] leading-3 font-poppins tracking-tight">{testimonial.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FaQ */}
            <div className="mt-2 px-10 py-2 w-full">
              <div className=" px-10 py-2  flex flex-col w-full">
                <h2 className="font-semibold text-center text-[12px] font-poppins">Frequently Asked Questions</h2>
                {formData.faQ.faQMetaData.map((faq, index) => (
                  <div key={index} className="mt-3  bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center bg-gray-100 p-2">
                      <h3 className="text-[11px] font-medium font-poppins tracking-tight">{faq.question}</h3>
                      <button onClick={() => toggleFaqAnswer(index)} className="text-blue-500 text-xs">
                        {faqVisibility[index] ? "Hide" : "Show"}
                      </button>
                    </div>
                    {faqVisibility[index] && <p className="text-[10px] text-gray-600  font-poppins tracking-tight p-2">{faq.answer}</p>}
                  </div>
                ))}
              </div>
            </div>
            {/* Refund Policies */}

            <div className="mt-4  w-full flex flex-col bg-gray-100 px-10 py-6">
              <h2 className="font-semibold text-center text-[12px] font-poppins">Refund Policies</h2>
              <div className="flex flex-col gap-2 mt-2">
                {formData.refundPolicies.refundPoliciesMetaData.map((refund, index) => (
                  <div key={index} className="bg-white rounded-md px-6 py-2 ">
                    <p className="font-poppins text-[10px] tracking-tight text-center">{refund}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & condition */}
            <div className="mt-4 w-full flex flex-col">
              <p className="font-semibold text-center text-[12px] font-poppins">Terms & Conditions</p>
              <div className="flex flex-col gap-2 mt-2">
                {formData.termAndConditions.termAndConditionsMetaData.map((terms, index) => (
                  <div key={index}>
                    <p className="font-poppins text-[10px] tracking-tight text-center">{terms}</p>
                    <hr className="mt-2 mx-16" />
                  </div>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="mt-4 flex flex-col px-10 py-6 gap-4 bg-gray-900 justify-center w-full">
              <h2 className="font-poppins text-white font-bold text-center text-[12px]">Need help?</h2>
              <div className="flex gap-4 justify-center">
                <a href="" className="flex items-center gap-1 text-white text-[10px] font-poppins">
                  <MessageCircle className="size-4" />
                  {formData.paymentDetails.ownerEmail}
                </a>
                <a href="" className="flex items-center gap-1 text-white text-[10px] font-poppins">
                  <Phone className="size-4" />
                  {formData.paymentDetails.ownerPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayUp;
