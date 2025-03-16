import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoWallet } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { walletConfig } from "./WalletConfig";
import CountUp from "react-countup";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import Coin from "../../../../assets/coin.png";
import Cash from "../../../../assets/cash.png";
import { IoIosCloseCircle, IoIosWarning } from "react-icons/io";
import { MdKeyboardArrowRight, MdOutlinePin } from "react-icons/md";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import EarningsChart from "../../../../components/Charts/EarningsChart";
import WalletTableComponent from "../../../../components/Table/WalletTableComponent";
import WithdrawModal from "../../../../components/Modal/WithdrawModal";
import { PiIdentificationBadgeFill } from "react-icons/pi";
import { CiBank } from "react-icons/ci";
import UPIModal from "../../../../components/Modal/UPIModal";
import MPINModal from "../../../../components/Modal/MPINModal";
import { toast } from "react-toastify";
import { Calendar } from "lucide-react";
import { fetchBalanceDetails } from "../../../../services/auth/api.services";
import { StoreContext } from "../../../../context/StoreContext/StoreContext";

const WalletPage = () => {
  const {
    AllTransaction,
    getNextTransactionPage,
    CurrentTransactionPage,
    TotalTransactionPages,
    getNextWithdrawalPage,
  } = useContext(StoreContext);
  const [BalanceDetails, setBalanceDetails] = useState({
    balance: 0,
    totalEarnings: 0,
    totalWithdrawals: 0,
    lastModified: "",
    financeIds: [],
  });
  const [selectedDateRange, setSelectedDateRange] = useState("Last Year");
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [appliedDateRange, setAppliedDateRange] = useState(null);

  const dateOptions = ["Last Week", "Last Month", "Last Year", "Custom Range"];
  const [modal, setOpenModal] = useState(false);
  const [openWithdrawal, setOpenWithdrawal] = useState(false);
  const [openUPI, setOpenUPI] = useState(false);
  const [openMPIN, setOpenMPIN] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const toggleModal = () => {
    if (openWithdrawal || openUPI || openMPIN) {
      setOpenModal(false);
    } else {
      setOpenModal(!modal);
    }
  };

  const handleDateOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedDateRange(selected);
    setIsCustomRange(selected === "Custom Range");
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      setAppliedDateRange([startDate, endDate]);
      setSelectedDateRange(
        `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
      );
      setIsCustomRange(false);
      toast.success("Date range applied successfully!");
    } else {
      toast.error("Please select a valid date range");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }

    setIsModalOpen(false);
    toast.info("Processing your withdrawal...");

    setTimeout(() => {
      toast.success(`Successfully withdrew Rs${withdrawAmount}!`);
      setWithdrawAmount("");
    }, 2000);
  };

  const openWithdrawalModal = () => {
    setOpenWithdrawal(true);
    setOpenModal(false);
  };

  const openUPIModal = () => {
    setOpenUPI(true);
    setOpenModal(false);
  };

  const openMPINModal = () => {
    setOpenMPIN(true);
    setOpenModal(false);
  };

  const getWalletBalanceDetails = async () => {
    const response = await fetchBalanceDetails();
    console.log(response);
    if (response.data.success) {
      setBalanceDetails({
        balance: response.data.payload.balance,
        totalEarnings: response.data.payload.totalEarnings,
        totalWithdrawals: response.data.payload.totalWithdrawals,
        lastModified: response.data.payload.lastModified,
        financeIds: [
          ...response.data.payload.accountNumbers,
          ...response.data.payload.upiIds,
        ],
        // financeIds: ['65654',"kahusdkahs@kjabs","65464"],
      });
    }
  };

  useEffect(() => {
    getWalletBalanceDetails();
    getNextTransactionPage();
    getNextWithdrawalPage();
  }, []);

  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-[#0F1418]">
      {/* Wallet Section */}
      <div className="flex flex-col bg-[#1A1D21] md:py-3 md:px-4 py-3 px-2 rounded-md">
        <div className="flex bg-[#1E2328] py-6 px-3 rounded-md items-center justify-between">
          <div className="flex gap-3">
            <IoWallet className="md:size-8 size-5 text-orange-600" />
            <p className="font-poppins tracking-tight text-[16px] md:text-xl font-bold text-white">
              Wallet Section
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1A1D21] cursor-pointer flex items-center justify-center relative">
            <IoSettingsOutline
              onClick={() => toggleModal()}
              className="size-5 text-white"
            />
          </div>
          {modal && (
            <div className="bg-[#1A1D21] absolute z-20 top-36 right-[42px] md:top-20 md:right-14 w-60 py-1 pr-3 rounded-md shadow-md border border-gray-700">
              <a
                onClick={openUPIModal}
                className="cursor-pointer hover:bg-[#1E2328] transition-transform ease-out duration-300 transform hover:translate-x-2 font-poppins text-sm text-gray-300 py-2 px-3 tracking-tight flex gap-3 items-center"
              >
                <PiIdentificationBadgeFill className="size-5 text-orange-600" />
                Add UPI ID
              </a>
              <hr className="mx-3 border-gray-700" />
              <a
                onClick={openWithdrawalModal}
                className="cursor-pointer hover:bg-[#1E2328] transition-transform ease-in-out duration-300 transform hover:translate-x-2 font-poppins text-sm text-gray-300 py-2 px-3 tracking-tight flex gap-3 items-center"
              >
                <CiBank className="text-orange-600 size-5" />
                Add Bank Account
              </a>
              <hr className="mx-3 border-gray-700" />
              <a
                onClick={openMPINModal}
                className="cursor-pointer hover:bg-[#1E2328] transition-transform ease-in-out duration-300 transform hover:translate-x-2 font-poppins text-sm text-gray-300 py-2 px-3 tracking-tight flex gap-3 items-center"
              >
                <MdOutlinePin className="text-orange-600 size-5" />
                Set MPIN
              </a>
            </div>
          )}
        </div>

        {/* Wallet Content */}
        <div className="my-4 flex flex-col md:flex-row justify-between md:items-center gap-6">
          {/* Balance */}
          <div className="flex flex-col gap-1">
            <p className="font-poppins tracking-tight text-sm text-gray-400">
              Amount in Wallet
            </p>
            <h2 className="font-bold tracking-tight font-poppins text-3xl flex gap-1 text-white">
              ₹
              <CountUp start={0} end={BalanceDetails.balance} duration={2} />
            </h2>
            <p className="font-poppins tracking-tight text-sm text-gray-400">
              Last Updated on{" "}
              {new Date(BalanceDetails.lastModified).toDateString()}
            </p>
          </div>

          {/* Banks */}
          <div className="flex flex-col gap-3">
            <Dropdown
              financeIds={
                BalanceDetails.financeIds.length
                  ? BalanceDetails.financeIds
                  : ["Not Added"]
              }
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-3 bg-orange-600 hover:bg-orange-700 font-poppins text-white rounded-md"
            >
              Withdraw amount
            </button>
          </div>
        </div>
      </div>

      {/* Total Earning & Total Withdrawal */}
      <div className="flex flex-col md:flex-row gap-6 mt-7">
        {/* Total Earning */}
        <div className="py-8 relative px-3 flex justify-between w-full bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl">
          <div className="flex flex-col gap-3">
            <p className="font-poppins text-white tracking-tight text-lg">
              Total Earnings
            </p>
            <h2 className="font-bold text-3xl text-white tracking-tight">
              ₹
              <CountUp
                start={0}
                end={BalanceDetails.totalEarnings}
                duration={2}
              />
            </h2>
          </div>
          <img src={Coin} alt="" className="absolute bottom-0 right-0" />

          {/* Date Select */}
          <div className="absolute top-3 right-3">
            <div className="relative">
              <div className="bg-[#1A1D21] rounded-md border border-gray-700 py-2 px-3 flex items-center gap-2 cursor-pointer shadow-sm">
                <select
                  className="bg-transparent text-sm font-poppins cursor-pointer outline-none text-gray-300 w-full"
                  value={selectedDateRange}
                  onChange={handleDateOptionChange}
                >
                  {dateOptions.map((option) => (
                    <option key={option} value={option} className="bg-dark">
                      {option}
                    </option>
                  ))}
                </select>
                <Calendar className="text-gray-300 w-5 h-5" />
              </div>

              {isCustomRange && (
                <div className="absolute top-14 right-0 z-50 bg-white p-4 rounded-lg shadow-lg">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateRangeChange}
                    inline
                    className="custom-datepicker"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleApplyDateRange}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Total Withdrawal */}
        <div className="py-8 px-3 relative bg-gradient-to-r from-green-600 to-green-500 w-full rounded-2xl">
          <div className="flex flex-col gap-3">
            <p className="font-poppins text-white tracking-tight text-lg">
              Total Withdrawal
            </p>
            <h2 className="font-bold text-3xl text-white tracking-tight">
              ₹
              <CountUp
                start={0}
                end={BalanceDetails.totalWithdrawals}
                duration={2}
              />
            </h2>
          </div>
          <img src={Cash} alt="" className="absolute bottom-0 right-0" />

          {/* Date Select */}
          <div className="absolute top-3 right-3">
            <div className="relative bg-[#1A1D21] rounded-md border border-gray-700 py-2 px-3 flex items-center gap-2 cursor-pointer shadow-sm">
              <select
                className="bg-transparent text-sm font-poppins cursor-pointer outline-none text-gray-300"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                {dateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KYC */}
      {!walletConfig.walletPage.KYCStatus && (
        <div className="bg-[#1A1D21] w-full py-3 px-3 mt-5 rounded-xl">
          <div className="flex bg-[#1E2328] py-3 justify-between items-center rounded-xl px-3">
            <div className="flex gap-3 items-center">
              <IoIosWarning className="text-orange-600 size-8" />
              <p className="font-poppins text-sm md:text-md tracking-tight text-gray-300">
                Your KYC is Pending complete is asap to withdraw your wallet
                amount!
              </p>
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 py-2 px-3 text-sm rounded-md text-white font-poppins">
              Update
            </button>
          </div>
        </div>
      )}

      {/* Chart and graphs */}
      <div className="flex md:flex-row flex-col gap-4 w-full">
        {/* Recent Withdrawal */}
        <div className="md:w-1/3 w-full bg-[#1A1D21] py-3 px-3 mt-5 rounded-xl order-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-1 text-white">
              <p className="font-poppins tracking-tight">Recent Withdrawal</p>
              <MdKeyboardArrowRight className="size-5" />
            </div>
            <p className="font-poppins tracking-tight text-white">Amount</p>
          </div>
          <div className="flex flex-col gap-6 mt-3">
            {walletConfig.walletPage.recentWithdrawals.map(
              (withdrawal, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <a className="flex gap-3 items-center">
                    {withdrawal.status === "paid" ? (
                      <span className="w-7 h-7 bg-green-900 rounded flex items-center justify-center">
                        <FaLongArrowAltUp className="text-green-400" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 bg-red-900 rounded flex items-center justify-center">
                        <FaLongArrowAltDown className="text-red-400" />
                      </span>
                    )}
                    <p className="text-gray-300">{withdrawal.date}</p>
                  </a>
                  <p className="font-semibold font-poppins tracking-tight text-white">
                    ₹ {withdrawal.amount}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="md:w-2/3 w-full bg-[#1A1D21] py-3 px-3 mt-5 rounded-xl order-2">
          <EarningsChart />
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#1A1D21] mt-6 rounded-xl">
        <WalletTableComponent
          // data={walletConfig.walletPage.allTransactions.tableData}
          data={AllTransaction}
          title={<span className="text-white">All Transactions</span>}
          headers={walletConfig.walletPage.allTransactions.tableHeader}
          page="Wallet"
          CurrentPage={CurrentTransactionPage}
          TotalPages={TotalTransactionPages}
        />
      </div>

      {/* Modals */}
      {openWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="transform opacity-0 scale-95 transition-all duration-500 ease-out animate-fadeInUp relative">
            <WithdrawModal />
            <IoIosCloseCircle
              onClick={() => setOpenWithdrawal(false)}
              className="cursor-pointer text-red-600 absolute size-6 md:size-8 top-3 right-2"
            />
          </div>
        </div>
      )}

      {openUPI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="transform opacity-0 scale-95 transition-all duration-500 ease-out animate-fadeInUp relative">
            <UPIModal />
            <IoIosCloseCircle
              onClick={() => setOpenUPI(false)}
              className="cursor-pointer text-red-600 absolute size-6 md:size-8 top-3 right-2"
            />
          </div>
        </div>
      )}

      {openMPIN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full">
          <div className="transform opacity-0 scale-95 transition-all duration-500 ease-out animate-fadeInUp relative">
            <MPINModal />
            <IoIosCloseCircle
              onClick={() => setOpenMPIN(false)}
              className="cursor-pointer text-red-600 absolute size-6 md:size-8 top-3 right-2"
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1D21] rounded-lg p-6 w-96 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">
              Withdraw Money
            </h2>
            <label htmlFor="amount" className="block mb-2 text-gray-300">
              Enter amount to withdraw:
            </label>
            <input
              type="number"
              id="amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 bg-[#1E2328] border border-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
            <div className="flex justify-end gap-4">
              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
