import { useState } from "react";
import toast from "react-hot-toast";
import { sendWithdrawAmount } from "../../../../../services/auth/api.services";

function AmountWithdraw({ setIsModalOpen, accountNumbers = [], upiIds = [] }) {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank");
  const [withdrawFrom, setWithdrawFrom] = useState("wallet");
  const [mpin, setMpin] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }

    if (!mpin || mpin.length < 4) {
      toast.error("Enter a valid 4-digit MPIN!");
      return;
    }

    if (!selectedAccount) {
      toast.error(`Please select a ${withdrawalMethod === "upi" ? "UPI ID" : "Bank Account"}`);
      return;
    }

    try {
      setIsLoading(true);
      toast("Processing your withdrawal...");

      console.log({
        withdrawAmount: withdrawAmount,
        withdrawalMethod: withdrawalMethod,
        withdrawFrom: selectedAccount,
        mpin: mpin,
      })
      const response = await sendWithdrawAmount({
            withdrawAmount: withdrawAmount,
            withdrawalMethod: withdrawalMethod,
            withdrawFrom: selectedAccount,
            mpin: mpin,
      });

      toast.success(response.data.message || `Successfully withdrew Rs${withdrawAmount}!`);
      setWithdrawAmount("");
      setMpin("");
      setSelectedAccount("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Withdrawal failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1D21] rounded-lg p-6 w-96 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Withdraw Money</h2>

        {/* Amount */}
        <label className="block mb-2 text-gray-300">Enter amount to withdraw:</label>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-3 py-2 bg-[#1E2328] border border-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        {/* Withdrawal Method */}
        <label className="block mb-2 text-gray-300">Withdrawal Method:</label>
        <select
          value={withdrawalMethod}
          onChange={(e) => {
            setWithdrawalMethod(e.target.value);
            setSelectedAccount(""); // Reset on change
          }}
          className="w-full px-3 py-2 bg-[#1E2328] border border-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          <option value="bank">Bank</option>
          <option value="upi">UPI</option>
        </select>

        {/* Dynamic Account/UPI selection */}
        <label className="block mb-2 text-gray-300">
          {withdrawalMethod === "upi" ? "Select UPI ID:" : "Select Bank Account:"}
        </label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full px-3 py-2 bg-[#1E2328] border border-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          <option value="">-- Select --</option>
          {(withdrawalMethod === "upi" ? upiIds : accountNumbers).map((val, idx) => (
            <option key={idx} value={val}>
              {val}
            </option>
          ))}
        </select>


        {/* MPIN */}
        <label className="block mb-2 text-gray-300">Enter MPIN:</label>
        <input
          type="password"
          value={mpin}
          onChange={(e) => setMpin(e.target.value)}
          placeholder="4-digit MPIN"
          className="w-full px-3 py-2 bg-[#1E2328] border border-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md ${
              isLoading
                ? "bg-orange-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AmountWithdraw;
