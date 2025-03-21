import { CiBank } from "react-icons/ci";
import { saveSecondaryBankorUpiAccount } from "../../services/auth/api.services";
import { useState } from "react";
import  toast  from "react-hot-toast";
const WithdrawModal = () => {
  const [SecondaryBank, setSecondaryBank] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    type: "bank",
  });
  const addSecondaryBankAccount = async () => {
    if (
      !SecondaryBank.accountNumber ||
      !SecondaryBank.ifscCode ||
      !SecondaryBank.accountHolderName
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const response = await saveSecondaryBankorUpiAccount(SecondaryBank);
      console.log(response);
      if (response.status === 200) {
        toast.success("Bank Account added successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-3 bg-white p-5 rounded-xl md:w-[550px] w-[400px] ">
        <div className="flex flex-row space-x-2 justify-center items-center pb-3">
          <CiBank className="text-[#EA580C] size-8" />
          <h2 className="font-poppins tracking-tight font-semibold text-xl">
            Add Bank Account
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {/* Account Holder */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              Account Holder Name
            </label>
            <input
              onChange={(e) =>
                setSecondaryBank({
                  ...SecondaryBank,
                  accountHolderName: e.target.value,
                })
              }
              type="text"
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>
          {/* Account Number */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              Account Number
            </label>
            <input
              onChange={(e) =>
                setSecondaryBank({
                  ...SecondaryBank,
                  accountNumber: e.target.value,
                })
              }
              type="text"
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>
          {/* Account Number */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="" className="font-poppins tracking-tight">
              IFSC Number
            </label>
            <input
              onChange={(e) =>
                setSecondaryBank({ ...SecondaryBank, ifscCode: e.target.value })
              }
              type="text"
              className="h-10 border border-[#D1D5DB] rounded-lg px-3 ring-0 focus:ring-0 ring-orange-500 font-poppins tracking-tight text-sm"
            />
          </div>
          <button
            onClick={addSecondaryBankAccount}
            className="font-poppins tracking-tight text-white bg-[#EA580C] rounded-lg py-3"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
