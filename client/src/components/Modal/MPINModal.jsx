import { useState } from "react";
import { MdOutlinePin } from "react-icons/md";

const MPINModal = () => {
  const [Mpin, setMpin] = useState()
  return (
    <div>
      <div className="flex flex-col gap-3 bg-white p-5 rounded-xl md:w-[550px] w-[400px] ">
        <div className="flex flex-row space-x-2 justify-center items-center pb-3">
          <MdOutlinePin className="text-[#FA6E25] size-5" />
          <h2 className="font-poppins tracking-tight font-semibold text-xl">
            MPIN Reset
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {/* Account Holder */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              Enter new MPIN
            </label>
            <input
            onChange={(e) => setMpin(e.target.value)}
              type="text"
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>

          <button
           className="font-poppins tracking-tight text-white bg-[#EA580C] rounded-lg py-3">
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default MPINModal;
