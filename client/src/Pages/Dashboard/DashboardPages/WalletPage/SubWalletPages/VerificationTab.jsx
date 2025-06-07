import { useEffect, useState } from "react";
import  toast  from "react-hot-toast";
import {
  fetchVerificationInformation,
  handelUplaodFile,
  saveVerificationInformation,
  updateVerificationInformation,
} from "../../../../../services/auth/api.services";
import { Loader2 } from "lucide-react";

const VerificationTab = ({ setVal }) => {
  const [loading, setLoading] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
    telegram: "",
    discord: "",
    other: "",
  });

  const [idVerification, setIdVerification] = useState({
    aadhaarNumber: "",
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    selfie: null,
  });
  const [update, setUpdate] = useState(false);
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteFile = (fieldName) => {
    setIdVerification((prev) => ({ ...prev, [fieldName]: null }));
    if (fileInputs[fieldName]) {
      fileInputs[fieldName].value = "";
    }
  };

  const validateInputs = () => {

    // Social media links — at least one should be filled
    const hasAtLeastOneSocialLink = Object.values(socialMediaLinks).some(
      (link) => link.trim() !== ""
    );
    if (!hasAtLeastOneSocialLink) {
      toast.error("Please provide at least one social media link.");
      return false;
    }

    // Aadhaar validation
    if (
      !idVerification.aadhaarNumber.trim() ||
      !/^\d{12}$/.test(idVerification.aadhaarNumber)
    ) {
      toast.error("Aadhaar Number must be a 12-digit numeric value.");
      return false;
    }

    // Aadhaar card images
    if (!idVerification.aadhaarFront || !idVerification.aadhaarBack) {
      toast.error("Please upload Aadhaar Card Front & Back Image.");
      return false;
    }

    // PAN card
    if (!idVerification.panCard) {
      toast.error("Please upload your PAN Card.");
      return false;
    }

    // Selfie
    if (!idVerification.selfie) {
      toast.error("Please upload your selfie.");
      return false;
    }

    return true;
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const filedata = new FormData();
      filedata.append("file", file);
      const response = await handelUplaodFile(filedata);
      console.log(response);
      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setIdVerification((prev) => ({ ...prev, [type]: response.data.url }));
      } else {
        toast.error("Failed to upload file. Please try again later.");
      }
    } else {
      toast.error("Failed to upload file. Please try again later.");
    }
  };

  const handelVerificationDetails = async () => {
    if (!validateInputs()) return;
    const data = {
      socialMedia: socialMediaLinks,
      idVerification: idVerification,
    };

    try {
      setLoading(true);
      let response;
      if (update) {
        response = await updateVerificationInformation(data);
      }else{
        response = await saveVerificationInformation(data);
      }
      console.log(response);
      if (response?.status === 200) {
        toast.success(update ? "Verification details updated successfully!" : "Verification details saved successfully!");
        setVal("3");
      } else {
        toast.error(
          "Failed to save verification details. Please try again later."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally{
      setLoading(false);
    }
  };

  const getVerificationInformation = async () => {
    try {
      const response = await fetchVerificationInformation();
      console.log(response);

      if (response?.status === 200) {
        setUpdate(true);
        const {
          socialMedia,
          aadhaarNumber,
          aadhaarFront,
          aadhaarBack,
          panCard,
          selfie,
        } = response.data.payload;

        // Set social media links
        setSocialMediaLinks({
          instagram: socialMedia.instagram || "",
          facebook: socialMedia.facebook || "",
          youtube: socialMedia.youtube || "",
          twitter: socialMedia.twitter || "",
          telegram: socialMedia.telegram || "",
          discord: socialMedia.discord || "",
          other: socialMedia.other || "",
        });

        // Set ID verification details
        setIdVerification({
          aadhaarNumber: aadhaarNumber || "",
          aadhaarFront: aadhaarFront || null,
          aadhaarBack: aadhaarBack || null,
          panCard: panCard || null,
          selfie: selfie || null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVerificationInformation();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0F1418] py-10 px-4">
      {/* Social Media Links Section */}
      <div className="bg-[#1A1D21] p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
        <h1 className="text-lg font-semibold mb-4 text-orange-500">
          Social Media Links
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {[
            "instagram",
            "facebook",
            "youtube",
            "twitter",
            "telegram",
            "discord",
          ].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-orange-500 mb-1 capitalize">
                {platform}
              </label>
              <input
                type="text"
                name={platform}
                value={socialMediaLinks[platform]}
                onChange={handleSocialMediaChange}
                className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
                placeholder={`Enter your ${platform} link`}
              />
            </div>
          ))}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Other
            </label>
            <input
              type="text"
              name="other"
              value={socialMediaLinks.other}
              onChange={handleSocialMediaChange}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-3 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
              placeholder="Enter other social media links"
            />
          </div>
        </div>
      </div>

      {/* ID Verification Section */}
      <div className="bg-[#1A1D21] p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
        <h1 className="text-lg font-semibold mb-4 text-orange-500">
          ID Verification
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Aadhaar Number *
            </label>
            <input
              type="text"
              name="aadhaarNumber"
              value={idVerification.aadhaarNumber}
              onChange={(e) =>
                setIdVerification((prev) => ({
                  ...prev,
                  aadhaarNumber: e.target.value,
                }))
              }
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-700 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
              placeholder="Enter 12-digit Aadhaar Number"
              maxLength="12"
            />
          </div>

          {/* File Upload Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Aadhaar Front */}
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-1">
                Aadhaar Card Front Image *
              </label>
              <div className="flex gap-2">
                {idVerification.aadhaarFront ? <a target="_blank" href={idVerification.aadhaarFront}
                className="w-full text-white truncate focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
                >{idVerification.aadhaarFront}</a> :
                <input
                  onChange={(e) => handleFileChange(e, "aadhaarFront")}
                  type="file"
                  name="aadhaarFront"
                  accept="image/*"
                  className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />}
                {idVerification.aadhaarFront && (
                  <button
                    onClick={() => handleDeleteFile("aadhaarFront")}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Aadhaar Back */}
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-1">
                Aadhaar Card Back Image *
              </label>
              <div className="flex gap-2">

                {idVerification.aadhaarBack ? <a target="_blank" href={idVerification.aadhaarBack}
                className="w-full text-white truncate focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
                >{idVerification.aadhaarBack}</a> :
                <input
                  onChange={(e) => handleFileChange(e, "aadhaarBack")}
                  type="file"
                  name="aadhaarBack"
                  accept="image/*"
                  className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />}
                {idVerification.aadhaarBack && (
                  <button
                    onClick={() => handleDeleteFile("aadhaarBack")}
                    className="px-3 py-2 bg-[#FF5B22] text-white  rounded-lg hover:bg-orange-600 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* PAN Card */}
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-1">
                PAN Card *
              </label>
              <div className="flex gap-2">
                {idVerification.panCard ? <a target="_blank" href={idVerification.panCard}
                className="w-full text-white truncate focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
                >{idVerification.panCard}</a> :
                <input
                  onChange={(e) => handleFileChange(e, "panCard")}
                  type="file"
                  name="panCard"
                  accept="image/*"
                  className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                /> }
                {idVerification.panCard && (
                  <button
                    onClick={() => handleDeleteFile("panCard")}
                    className="px-3 py-2 bg-[#FF5B22] text-white rounded-lg hover:bg-orange-600 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-1">
                Your Selfie *
              </label>
              <div className="flex gap-2 ">
                {idVerification.selfie ? <a target="_blank" href={idVerification.selfie}
                className="w-full truncate text-white focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
                >{idVerification.selfie}</a> :
                <input
                  onChange={(e) => handleFileChange(e, "selfie")}
                  type="file"
                  name="selfie"
                  accept="image/*"
                  className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                /> }
                {idVerification.selfie && (
                  <button
                    onClick={() => handleDeleteFile("selfie")}
                    className="px-3 py-2 bg-[#FF5B22] text-white rounded-lg hover:bg-orange-600 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handelVerificationDetails}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          } text-white py-2 px-6 rounded-lg focus:ring focus:ring-orange-500 focus:ring-opacity-50`}
        >
         {loading ? (
                     <span className="flex items-center justify-center">
                       <Loader2 className="animate-spin mr-2" />
                       {update ? "Updating..." : "Saving..."}
                     </span>
                   ) : update ? (
                     "Update"
                   ) : (
                     "Save"
                   )}
        </button>
      </div>
    </div>
  );
};

export default VerificationTab;
