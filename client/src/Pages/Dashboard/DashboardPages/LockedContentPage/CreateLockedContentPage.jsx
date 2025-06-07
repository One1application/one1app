import React, { useState } from "react";
import { File, Image, Info, UploadCloud, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createLockedContent, handelUplaodFile } from "../../../../services/auth/api.services";
import * as Icons from "lucide-react";

const CreateLockedContentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    unlockPrice: "",
    contentText: "",
    contentImage: "",
    contentFile: "",
    code: "",
    percent: "",
    expiry: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e) => {
    setFormData((prev) => ({ ...prev, contentText: e.target.value }));
  };

  const handleFileUpload = async (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploaderStateSetter = type === "image" ? setIsUploadingImage : setIsUploadingFile;
    uploaderStateSetter(true);
    toast.loading(`Uploading ${type}...`);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const response = await handelUplaodFile(uploadFormData);
      const fileUrl = response.data.url;

      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "contentImage" : "contentFile"]: fileUrl,
      }));

      toast.dismiss();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
      console.log(`${type} URL:`, fileUrl);

    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.dismiss();
      toast.error(`Failed to upload ${type}. Please try again.`);
    } finally {
      uploaderStateSetter(false);
      event.target.value = null;
    }
  };

  const triggerFileInput = (type) => {
    document.getElementById(`${type}-upload-input`)?.click();
  };

  const closeDiscountModal = () => {
    setShowDiscountModal(false);
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    const discountCode = e.target.discountCode.value;
    const discountPercent = e.target.discountPercent.value;
    const expiryDate = e.target.expiryDate.value;

    if (discountPercent > 99) {
      toast.error("Discount Percent cannot be more than 99%");
      return;
    }

    setFormData(prev => ({
        ...prev,
          code: discountCode,
        percent: discountPercent,
        expiry: expiryDate
    }));

    console.log(
      `Discount Details Updated: ${discountCode}, ${discountPercent}%, Expires on: ${expiryDate}`
    );
    toast.success("Discount details applied.");
    closeDiscountModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading("Publishing content...");

    if (!formData.title || !formData.category || !formData.unlockPrice) {
        toast.dismiss();
        toast.error("Please fill in Title, Category, and Unlock Price.");
        setIsSubmitting(false);
        throw new error ("Please fill in Title, Category, and Unlock Price.");
        
    }
    if (!formData.contentText && !formData.contentImage && !formData.contentFile) {
        toast.dismiss();
        toast.error("Please provide content (text, image, or file).");
        setIsSubmitting(false);
        return;
    }
    
    const content={
      text:formData.contentText,
      image:formData.contentImage,
      file:formData.contentFile,
    }

    const discount={
      'code': formData.code,
      'percent': formData.percent,
      'expiry': formData.expiry,
    }

    const apiData = {
      title: formData.title,
      category: formData.category,
      unlockPrice: formData.unlockPrice,
      content:content,
      discount:discount
    };

    Object.keys(apiData).forEach(key => {
        if (apiData[key] === "" || apiData[key] === null || apiData[key] === undefined) {
            delete apiData[key];
        }
    });

    try {      
        const response = await createLockedContent(apiData);
        toast.dismiss();
        if(response?.data?.success){
             toast.success("Content published successfully!");
             navigate("/dashboard/premium-content");
        } else {
             toast.error(response.data.message || "Failed to publish content.");
             console.error("Error publishing content:", response.data.message);
        }

    } catch (error) {
        console.error("Error publishing content:", error);
        toast.dismiss();
        toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl flex">
        <div className="w-2/3 bg-gradient-to-br from-orange-600 to-black p-8 relative overflow-hidden flex items-center justify-center rounded-l-xl">
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-orange-500 opacity-50" />
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-orange-700 opacity-50" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-orange-400 opacity-30" />

          <div className="bg-gray-900/90 rounded-xl p-6 backdrop-blur-sm relative z-10 w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white text-sm">
                Write or Upload content you would like to sell
              </span>
              <button className="text-gray-400 hover:text-gray-300" title="This content will be hidden until payment is completed.">
                <Info size={16} />
              </button>
            </div>

            <textarea
              className="w-full h-32 bg-gray-800/50 rounded-lg p-4 text-gray-300 placeholder-gray-500 resize-none mb-4 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
              placeholder="Type your hidden message here..."
              value={formData.contentText}
              onChange={handleTextareaChange}
              name="contentText"
            />

            <input
                type="file"
                id="image-upload-input"
                accept="image/*"
                onChange={(e) => handleFileUpload('image', e)}
                style={{ display: 'none' }}
                disabled={isUploadingImage || isUploadingFile}
            />
            <input
                type="file"
                id="file-upload-input"
                onChange={(e) => handleFileUpload('file', e)}
                style={{ display: 'none' }}
                disabled={isUploadingImage || isUploadingFile}
            />

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
               <div className="flex-1 text-center">
                 <button
                   onClick={() => triggerFileInput('image')}
                   disabled={isUploadingImage || isUploadingFile}
                   className={`flex flex-col items-center justify-center w-full gap-2 px-4 py-3 rounded-lg ${isUploadingImage ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-800'} text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                 >
                   {isUploadingImage ? (
                     <Loader2 size={20} className="animate-spin" />
                   ) : (
                     <UploadCloud size={20} />
                   )}
                   <span>{formData.contentImage ? "Change Image" : "Upload Image"}</span>
                 </button>
                 {formData.contentImage && (
                    <div className="mt-2">
                       <img src={formData.contentImage} alt="Uploaded Preview" className="max-h-20 mx-auto rounded"/>
                       <p className="text-xs text-green-400 mt-1">Image uploaded</p>
                    </div>
                 )}
               </div>

               <div className="flex-1 text-center">
                 <button
                   onClick={() => triggerFileInput('file')}
                   disabled={isUploadingFile || isUploadingImage}
                    className={`flex flex-col items-center justify-center w-full gap-2 px-4 py-3 rounded-lg ${isUploadingFile ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-800'} text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed`}
                 >
                    {isUploadingFile ? (
                     <Loader2 size={20} className="animate-spin" />
                   ) : (
                     <UploadCloud size={20} />
                   )}
                   <span>{formData.contentFile ? "Change File" : "Upload File"}</span>
                 </button>
                  {formData.contentFile && (
                    <div className="mt-2">
                       <File size={20} className="mx-auto"/>
                       <p className="text-xs text-green-400 mt-1">File uploaded</p>
                    </div>
                 )}
               </div>
            </div>

            <p className="text-gray-500 text-xs mt-4">
              *Only content added here (text, image, or file) is locked behind the paywall.*
            </p>
          </div>
        </div>

        <div
          className="w-1/3 bg-black p-6 overflow-y-auto h-[80vh] rounded-r-xl"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.w-1\\/3::-webkit-scrollbar { width: 0; height: 0; }`}</style>

          <h2 className="text-orange-500 text-2xl font-medium mb-4">
            Publish Content
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Give your content a title and a price. You can then publish and share it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-orange-500 text-sm mb-2" htmlFor="title">
                Title *
                <button type="button" className="text-gray-400 hover:text-gray-300" title="The main title for your locked content.">
                    <Info size={14}/>
                </button>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Type your title here"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900 rounded-lg p-3 text-gray-300 placeholder-gray-600 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-orange-500 text-sm mb-2" htmlFor="category">
                Category *
                 <button type="button" className="text-gray-400 hover:text-gray-300" title="Select a category to help users find your content.">
                    <Info size={14}/>
                </button>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900 rounded-lg p-3 text-gray-300 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
              >
                <option value="">Select a category</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Food">Food</option>
                <option value="Jobs">Jobs</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-orange-500 text-sm mb-2" htmlFor="unlockPrice">
                Unlock Price (INR) *
                 <button type="button" className="text-gray-400 hover:text-gray-300" title="Set the price visitors pay to access the content. Minimum ₹1.">
                    <Info size={14}/>
                </button>
              </label>
              <input
                id="unlockPrice"
                name="unlockPrice"
                type="number"
                min="1"
                placeholder="e.g., 49"
                value={formData.unlockPrice}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900 rounded-lg p-3 text-gray-300 placeholder-gray-600 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
              />
            </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-gray-400 text-sm text-left flex items-center justify-between mb-4"
              >
                ADVANCED SETTINGS
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAdvanced && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500">
                      Set expiry for your locked content
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
              </div>
            )}
 <div className="mb-6 space-y-4">
                <h3 className="text-orange-500 text-sm">Discount Code</h3>
                <button
                  onClick={() => setShowDiscountModal(true)}
                  type="button"
                  className="w-full py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  <span>+</span> Add Discount Code
                </button>
              </div>
            <div className="pt-4 border-t border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage || isUploadingFile}
                className="w-full py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                    <Icons.Check className="h-5 w-5" />
                )}
                <span>Publish Content</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-orange-500/30 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-orange-500 text-lg font-medium">
                   Create/Edit Discount
                 </h3>
                 <button onClick={closeDiscountModal} className="text-gray-400 hover:text-white">
                     <Icons.X size={20}/>
                 </button>
            </div>

            <form onSubmit={handleDiscountSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-400 text-sm mb-1"
                  htmlFor="discountCodeModal"
                >
                  Discount Code (Optional)
                </label>
                <input
                  id="discountCodeModal"
                  name="discountCode"
                  type="text"
                  defaultValue={formData.code}
                  className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
                  placeholder="e.g., LAUNCH10"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 text-sm mb-1"
                  htmlFor="discountPercentModal"
                >
                  Discount Percent (Optional, 1-99)
                </label>
                <input
                  id="discountPercentModal"
                  name="discountPercent"
                  type="number"
                  defaultValue={formData.percent}
                  className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
                  placeholder="e.g., 10"
                  max="99"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 text-sm mb-1"
                  htmlFor="expiryDateModal"
                >
                  Discount Expiry Date (Optional)
                </label>
                <input
                  id="expiryDateModal"
                  name="expiryDate"
                  type="date"
                  defaultValue={formData.expiry}
                  className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border border-transparent focus:border-orange-500 focus:ring-0 outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDiscountModal}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 text-sm"
                >
                  Apply Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLockedContentPage;
