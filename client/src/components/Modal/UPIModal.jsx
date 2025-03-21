import { useState } from "react";
import UPI from "../../assets/UPI.png";
import { saveSecondaryBankorUpiAccount } from "../../services/auth/api.services";
import  toast  from "react-hot-toast";
const UPIModal = () => {
  const [UPIid, setUPIid] = useState("");
  const addSecondaryUpi = async () => {
    try {
      const response = await saveSecondaryBankorUpiAccount({
        upiId: UPIid,
        type: "upi",
      });
      console.log(response);
      if (response.status === 200) {
        toast.success("UPI ID added successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-3 bg-white p-5 rounded-xl md:w-[550px] w-[400px] ">
        <div className="flex flex-row space-x-2 justify-center items-center pb-3">
          <img src={UPI} alt="" />
          <h2 className="font-poppins tracking-tight font-semibold text-xl">
            Add UPI ID
          </h2>
        </div>
        <div   className="flex flex-col gap-6">
          {/* Account Holder */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              Enter UPI ID
            </label>
            <input
              onChange={(e) => setUPIid(e.target.value)}
              type="text"
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>

          <button
            onClick={addSecondaryUpi}
            className="font-poppins tracking-tight text-white bg-[#EA580C] rounded-lg py-3"
          >
            Verify UPI ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default UPIModal;
