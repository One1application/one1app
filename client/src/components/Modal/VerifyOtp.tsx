import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { verifyMpin } from "../../services/auth/api.services";

const VerifyOtp = ({ mpin, phoneNumer, setOpen , setMpinSt }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isSending, setIsSending] = useState(false); 

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async ({ setMpinStatus }) => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }

    console.log("Entered OTP:", enteredOtp);
    // OTP verification logic here
    setIsSending(true);
    console.log(phoneNumer + " " + mpin + " " + enteredOtp);
     setIsSending(true);
    try {
        const response = await verifyMpin({
            phone: phoneNumer,
            mpin: mpin,
            otp: enteredOtp,
        });
        console.log(response);
        if (response.status === 200) {
            toast.success("MPIN saved successfully");
            // Handle successful MPIN save
            setOpen(false);
            setMpinSt(true);
        } else {
            toast.error("Failed to save MPIN");
        }
    } catch (error) {
        toast.error("Error saving MPIN");
        console.error("Error saving MPIN:", error);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row space-x-2 justify-center items-center pb-3">
        <span className="text-[#FA6E25] text-xl font-semibold">🔒</span>
        <h2 className="font-poppins tracking-tight font-semibold text-xl">
          Verify OTP
        </h2>
      </div>

      <label className="font-poppins tracking-tight text-sm">
        Enter the 6-digit OTP sent to your phone
      </label>

      <div className="flex justify-center gap-3 flex-wrap">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-10 h-12 border border-[#D1D5DB] rounded-lg text-center text-lg font-semibold font-poppins tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>

      <button
        onClick={verifyOtp}
        className="font-poppins tracking-tight text-white bg-[#EA580C] rounded-lg py-3"
      >
        {isSending ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default VerifyOtp;
