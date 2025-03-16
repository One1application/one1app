import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  fetchBusinessInformation,
  handelUplaodFile,
  saveBusinessInformation,
} from "../../../../../services/auth/api.services";

const BusinessInformationTab = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [BussinessStructure, setBussinessStructure] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [sebiNumber, setSebiNumber] = useState("");
  const [sebiCertificate, setSebiCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const businessStructure = [
    "Choose Business Structure",
    "sole proprietorship",
    "Limited Liability Company",
    "Corporation",
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

  const validateInputs = () => {
    if (!firstName.trim()) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last Name is required.");
      return false;
    }
    if (!/^\d+$/.test(gstNumber.trim())) {
      toast.error("GST Number must be a valid number.");
      return false;
    }
    if (!/^\d+$/.test(sebiNumber.trim())) {
      toast.error("SEBI Number must be a valid number.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await saveBusinessInformation({
        firstName,
        lastName,
        businessStructure: BussinessStructure,
        gstNumber,
        sebiNumber,
        sebiCertificate,
      });
      console.log(response);
      if (response.status === 200) {
        toast.success("Business information saved successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getBusinessInformation = async () => {
    try {
      const response = await fetchBusinessInformation();
      console.log(response);
      if (response.status === 200) {
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
          fileInputRef.current.value = sebiCertificate;
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
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500"
              placeholder="Enter your last name"
            />
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
              onChange={(e) => setBussinessStructure(e.target.value)}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
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
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              GST Number
            </label>
            <input
              type="number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="GST Number"
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* SEBI Number */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              SEBI Number
            </label>
            <input
              type="number"
              value={sebiNumber}
              onChange={(e) => setSebiNumber(e.target.value)}
              placeholder="SEBI Number"
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* SEBI Certificate */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              SEBI Certificate
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e)=>handleFileChange(e)}
                  className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
              </div>
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
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default BusinessInformationTab;
