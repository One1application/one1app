import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  fetchBusinessInformation,
  handelUplaodFile,
  saveBusinessInformation,
  updateBusinessInfo,
} from "../../../../../services/auth/api.services";
import { Loader2 } from "lucide-react";

const BusinessInformationTab = ({ setVal }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [BussinessStructure, setBussinessStructure] = useState(
    "Choose Business Structure"
  );
  const [gstNumber, setGstNumber] = useState("");
  const [sebiNumber, setSebiNumber] = useState("");
  const [sebiCertificate, setSebiCertificate] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    businessStructure: "",
    gstNumber: "",
    sebiNumber: "",
    sebiCertificate: "",
  });

  const validateInputs = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      businessStructure: "",
      gstNumber: "",
      sebiNumber: "",
      sebiCertificate: "",
    };
    let isValid = true;
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    }

    // Validate lastName
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    }

    if (
      !BussinessStructure ||
      BussinessStructure === "Choose Business Structure"
    ) {
      newErrors.businessStructure = "Please select a business structure";
      isValid = false;
    }

    // Validate business structure fields when not "Others"
    if (BussinessStructure !== "Others") {
      if (gstNumber.trim() === "") {
        newErrors.gstNumber = "GST Number is required.";
        isValid = false;
      } else if (!/^\d+$/.test(gstNumber.trim())) {
        newErrors.gstNumber = "GST Number must be a valid number.";
        isValid = false;
      }

      if (sebiNumber.trim() === "") {
        newErrors.sebiNumber = "SEBI Number is required.";
        isValid = false;
      } else if (!/^\d+$/.test(sebiNumber.trim())) {
        newErrors.sebiNumber = "SEBI Number must be a valid number.";
        isValid = false;
      }

     
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };
  const handleBusinessStructureChange = (e) => {
    const value = e.target.value;
    setBussinessStructure(value);
    
    // Clear business structure error
    if (value !== "Choose Business Structure") {
      setErrors(prev => ({...prev, BussinessStructure: ""}));
    }
    
    // Clear related fields when switching to "Others"
    if (value === "Others") {
      setGstNumber("");
      setSebiNumber("");
      setSebiCertificate("");
      setErrors(prev => ({
        ...prev, 
        gstNumber: "",
        sebiNumber: "",
        sebiCertificate: ""
      }));
    }
  };

  const handleGstNumberChange = (e) => {
    setGstNumber(e.target.value);
    if (e.target.value.trim() && /^\d+$/.test(e.target.value.trim())) {
      setErrors((prev) => ({ ...prev, gstNumber: "" }));
    }
  };

  const handleSebiNumberChange = (e) => {
    setSebiNumber(e.target.value);
    if (e.target.value.trim() && /^\d+$/.test(e.target.value.trim())) {
      setErrors((prev) => ({ ...prev, sebiNumber: "" }));
    }
  };

  const businessStructure = [
    "Choose Business Structure",
    "sole proprietorship",
    "Limited Liability Company",
    "sebi register",
    "Others",
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filedata = new FormData();
      filedata.append("file", file);
      const response = await handelUplaodFile(filedata);
      console.log(response);
      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setSebiCertificate(response.data.url);
      } else {
        toast.error("Failed to upload file. Please try again later.");
      }
    } else {
      toast.error("Failed to upload file. Please try again later.");
    }
  };

  const handleDeleteFile = () => {
    setSebiCertificate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const businessData = {
        firstName,
        lastName,
        businessStructure: BussinessStructure,
        gstNumber: BussinessStructure !== "Others" ? gstNumber : null,
        sebiNumber: BussinessStructure !== "Others" ? sebiNumber : null,
        sebiCertificate:
          BussinessStructure !== "Others" ? sebiCertificate : null,
      };
      let response;
      if (update) {
        response = await updateBusinessInfo(businessData);
      } else {
        response = await saveBusinessInformation(businessData);
      }
      console.log("business ", response);
      if (response?.status === 200) {
        toast.success(
          update
            ? "Business Information Updated Successfully!"
            : "Business Information Saved Successfully!"
        );
        setVal("2");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        console.log("1");
        toast.success(error.response.data.message, {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          icon: "",
        });
        setVal("2");
      } else {
        toast.error(error.response?.data?.message || "something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const getBusinessInformation = async () => {
    try {
      const response = await fetchBusinessInformation();
      console.log(response);

      if (response?.status === 200 && response?.data?.payload) {
        setUpdate(true);
        const {
          firstName,
          lastName,
          businessStructure,
          gstNumber,
          sebiNumber,
          sebiCertificate,
        } = response.data.payload;
        setFirstName(firstName);
        setLastName(lastName);
        setBussinessStructure(businessStructure);
        setGstNumber(gstNumber);
        setSebiNumber(sebiNumber);
        if (sebiCertificate) {
          setSebiCertificate(sebiCertificate);
          fileInputRef.current.value = sebiCertificate || "";
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBusinessInformation();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0F1418] py-10">
      {/* Personal Information Section */}
      <div className="bg-[#1A1D21] p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
        <h1 className="text-lg font-semibold mb-4 text-orange-500">
          Personal Information
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              className={`w-full bg-[#1E2328] border
               ${errors.firstName ? "border-red-500" : "border-orange-500"}
                text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              className={`w-full bg-[#1E2328] border ${
                errors.lastName ? "border-red-500" : "border-orange-500"
              } text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Information Section */}
      <div className="bg-[#1A1D21] p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
        <h1 className="text-lg font-semibold mb-4 text-orange-500">
          Business Information
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Business Structure */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Business Structure
            </label>
            <select
              value={BussinessStructure}
              onChange={handleBusinessStructureChange
              }
              className={`w-full bg-[#1E2328] border
               ${
                 errors.businessStructure
                   ? "border-red-500"
                   : "border-orange-500"
               }
               border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none`}
            >
              {businessStructure.map((structure, index) => (
                <option
                  disabled={index === 0}
                  selected={index === 0}
                  hidden={index === 0}
                  key={index}
                  value={structure}
                >
                  {structure}
                </option>
              ))}
            </select>
            {errors.businessStructure && (
              <p className="text-red-500 text-xs mt-1">
                {errors.businessStructure}
              </p>
            )}
          </div>

          {/* Conditional Fields */}
          {BussinessStructure !== "Others" && (
            <>
              {/* GST Number */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-1">
                  GST Number
                </label>
                <input
                  type="number"
                  value={gstNumber}
                  onChange={handleGstNumberChange}
                  placeholder="GST Number"
                  className={`w-full bg-[#1E2328] border ${
                    errors.gstNumber ? "border-red-500" : "border-orange-500"
                  } text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500`}
                />
                {errors.gstNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gstNumber}
                  </p>
                )}
              </div>

              {/* SEBI Number */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-1">
                  SEBI Number
                </label>
                <input
                  type="number"
                  value={sebiNumber}
                  onChange={handleSebiNumberChange}
                  placeholder="SEBI Number"
                  className={`w-full bg-[#1E2328] border ${
                    errors.sebiNumber ? "border-red-500" : "border-orange-500"
                  } text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500`}
                />
                {errors.sebiNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sebiNumber}
                  </p>
                )}
              </div>

              {/* SEBI Certificate */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-1">
                  SEBI Certificate
                </label>
                <div className="flex gap-2">
                  {sebiCertificate ? (
                    <a
                      target="_blank"
                      href={sebiCertificate}
                      className="w-full truncate text-white focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
                    >
                      {sebiCertificate}
                    </a>
                  ) : (
                    <input
                      type="file"
                      ref={fileInputRef}
                      value={sebiCertificate || ""}
                      onChange={(e) => handleFileChange(e)}
                      className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                    />
                  )}
                  {sebiCertificate && (
                    <button
                      onClick={handleDeleteFile}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSave}
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

export default BusinessInformationTab;
