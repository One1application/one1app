import { useState } from "react";
import { MdOutlinePin } from "react-icons/md";
import { saveMpin } from "../../services/auth/api.services";
import VerifyOtp from "./VerifyOtp";
import toast from "react-hot-toast";

const MPINModal = ({ setOpen, setMpinSt }) => {
  const [Mpin, setMpin] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isSending, setIsSending] = useState(false); 


  const onSubmit = async (e) => {
    e.preventDefault();

     if (!Mpin || !phoneNumber) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSending(true);
    try {

      const response = await saveMpin({
        phone: phoneNumber,
        mpin: Mpin,
      });
      console.log(response);
      setShowOTPInput(true);
    } catch (error) {
      toast.error("Error saving MPIN");
      console.error("Error saving MPIN:", error);
    } finally {
      setIsSending(false);
    }
  }
  return (
    <div>
      <div className="flex flex-col gap-3 bg-white p-5 rounded-xl md:w-[550px] w-[400px] ">
        {!showOTPInput ?  (
          <>
        <div className="flex flex-row space-x-2 justify-center items-center pb-3">

          <MdOutlinePin className="text-[#FA6E25] size-5" />
          <h2 className="font-poppins tracking-tight font-semibold text-xl">
            MPIN Set
          </h2>
        </div>
        <div className="flex flex-col gap-6">

          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              Enter your phone number <span className={"text-red-600"}>*</span>
            </label>
            <input
            onChange={(e) => setPhoneNumber(e.target.value)}
              type="number"
              placeholder="e.g +91 1234325423"
              value={phoneNumber}
              required
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>

          {/* Account Holder */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              Enter new MPIN <span className={"text-red-600"}>*</span>
            </label>
            <input
            onChange={(e) => setMpin(e.target.value)}
              type="number"
              maxLength={"4"}
              value={Mpin}
              required
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>

          <button
           className="font-poppins tracking-tight text-white bg-[#EA580C] rounded-lg py-3"
          onClick={onSubmit}
           >
            {isSending ? "Sending..." : "Send OTP"}
          </button>
        </div> </> ) : (
          <div className="flex flex-col gap-6">
            <VerifyOtp mpin={Mpin} phoneNumer={phoneNumber} setOpen={setOpen} setMpinSt={setMpinSt}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default MPINModal;
