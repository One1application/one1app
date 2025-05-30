import { useEffect, useState } from "react";
import  toast  from "react-hot-toast";
import {
  fetchPrimaryPaymentInformation,
  fetchVerificationInformation,
  handelUplaodFile,
  savePrimaryPaymentInformation,
  updatePrimaryPaymentInformation,
} from "../../../../../services/auth/api.services";
import { Loader2 } from "lucide-react";

const BankDetailsTab = ({ setVal }) => {
  const [loading, setLoading] = useState(false);
  const [BankingInfo, setBankingInfo] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankDocument: null,
    upiId: "",
  });
  const [update, setUpdate] = useState(false);
  const [bankDetailsId, setBankDetailsId] = useState(null);

  const handleBankingInfoChange = (e) => {
    const { name, value } = e.target;
    setBankingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteDocument = () => {
    if (fileInput) {
      fileInput.value = "";
    }
    setBankingInfo((prev) => ({ ...prev, bankDocument: null }));
  };

  const validateInputs = () => {
    if (!BankingInfo.accountHolderName.trim()) {
      toast.error("Account Holder Name is required.");
      return false;
    }
    if (!BankingInfo.accountNumber.trim()) {
      toast.error("Account Number is required.");
      return false;
    }
    if (!BankingInfo.ifscCode.trim()) {
      toast.error("IFSC Code is required.");
      return false;
    }

    // banck document
    if (!BankingInfo.bankDocument) {
      toast.error("Please Upload Bank Passbook / Statement (Any One).");
      return false;
    }

    // UPI ID
    if(!update){
      if (!BankingInfo.upiId) {
      toast.error("UPI ID is required.");
      return false;
    }
    }
    return true;
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filedata = new FormData();
      filedata.append("file", file);
      const response = await handelUplaodFile(filedata);
      console.log(response);
      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setBankingInfo((prev) => {
          return { ...prev, bankDocument: response.data.url };
        });
      } else {
        toast.error("Failed to upload file. Please try again later.");
      }
    } else {
      toast.error("Failed to upload file. Please try again later.");
    }
  };

 

  const getPrimaryPaymentInformation = async () => {
    try {
      const response = await fetchPrimaryPaymentInformation();

      if (response?.status === 200) {
        setUpdate(true);
        setBankDetailsId(response?.data?.payload?.bankDetails.id);
        console.log("bankDetailsdawg", response.data.payload.bankDetails);
        const upiData = response.data.payload.bankDetails.upiIds;
        let upiIdValue = upiData[0].upiId;
        console.log("upiIdValue", upiIdValue);
        const {
          accountHolderName,
          accountNumber,
          ifscCode,
          bankDocument,
          
          } = response.data.payload.bankDetails;

          

        setBankingInfo({
          accountHolderName: accountHolderName || "",
          accountNumber: accountNumber || "",
          ifscCode: ifscCode || "",
          bankDocument: bankDocument || null,
          upiId: upiIdValue || [],
        });
      }
    } catch (error) {
      console.error("Error fetching payment information:", error);
    }
  };

   const handleBankDetails = async () => {
    if (!validateInputs()) return;
    const bankingInfo = {
      bankingInfo: {
        ...BankingInfo,
      },
    };
    try {
      setLoading(true);
      let response;
      if(update){
        response = await updatePrimaryPaymentInformation(bankDetailsId,bankingInfo);
      }else{
        response = await savePrimaryPaymentInformation(bankingInfo);
      }
      console.log(response);
      if (response.status === 200) {
        toast.success("Banking Information saved successfully!");
        setVal("4");
      } else {
        toast.error(
          "Failed to save Banking Information. Please try again later."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally{
      setLoading(false);
    }
  };



  const getVerificationInformation = async () => {
    try {
      const response = await fetchVerificationInformation();
      if (response.status === 400) { 
        toast.error(response.data.message);
        setVal("2");
      }
    } catch (error) {
      setVal("2");
      toast.error("Add verification information", {
        iconTheme: {
          primary: "#FF0000",
          secondary: "#FF0000",
        },  
      });
      console.error("Error fetching verification information:", error);
    } 
  }

  useEffect(() => {
    getVerificationInformation();
    getPrimaryPaymentInformation();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0F1418] mt-12">
      <div className="bg-[#1A1D21] p-6 rounded-lg shadow-md w-full max-w-4xl">
        {/* Banking Information */}
        <h1 className="text-lg font-semibold mb-4 text-orange-500">
          Banking Information
        </h1>
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={BankingInfo.accountHolderName}
              onChange={handleBankingInfoChange}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
              placeholder="Enter Account Holder Name"
            />
          </div>

          {/* Primary Account Number */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Primary Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={BankingInfo.accountNumber}
              onChange={handleBankingInfoChange}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
              placeholder="Enter Account Number"
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              name="ifscCode"
              value={BankingInfo.ifscCode}
              onChange={handleBankingInfoChange}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
              placeholder="Enter IFSC Code"
            />
          </div>

          {/* Bank Passbook / Statement */}
          <div>
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Bank Passbook / Statement (Any One)
            </label>
            <div className="flex gap-2">
              { BankingInfo.bankDocument ? <a target="_blank" href={BankingInfo.bankDocument}
                className="w-full truncate text-white focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none"
                >{BankingInfo.bankDocument}</a> :
              <input
                type="file"
                name="bankDocument"
                onChange={(e) => handleFileChange(e)}
                className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              /> }
              {BankingInfo.bankDocument && (
                <button
                  onClick={handleDeleteDocument}
                  className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring focus:ring-orange-700 focus:ring-opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Add UPI ID */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Add UPI ID
            </label>
            <input
              type="text"
              name="upiId"
              value={BankingInfo.upiId}
              onChange={handleBankingInfoChange}
              className="w-full bg-[#1E2328] border border-orange-500 text-white rounded-lg p-2 focus:ring focus:ring-orange-500 focus:ring-opacity-50 focus:outline-none placeholder-gray-400"
              placeholder="Enter UPI ID"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={handleBankDetails}
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

export default BankDetailsTab;
