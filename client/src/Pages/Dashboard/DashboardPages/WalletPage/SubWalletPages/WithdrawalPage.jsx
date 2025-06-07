import { useEffect, useContext, useState } from "react";
import { PiHandWithdraw } from "react-icons/pi";
import WalletTableComponent from "../../../../../components/Table/WalletTableComponent";
import { StoreContext } from "../../../../../context/StoreContext/StoreContext";
import { fetchWithdrawalPage } from "../../../../../services/auth/api.services";
import { walletConfig } from "../WalletConfig";
import toast from "react-hot-toast";

const WithdrawalPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    AllWithdrawals,
    CurrentWithdrawalPage,
    TotalWithdrawalPages,
    setAllWithdrawals,
    getNextWithdrawalPage
  } = useContext(StoreContext);
 console.log("withdrawals dogggg:::", AllWithdrawals);
  const { title, tableHeader } = walletConfig.allWithdrawalPage;
   const handleWithdrawPageChange = (page) => {
    console.log("Changing to withdraw page:", page);
    getNextWithdrawalPage(page);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
       setIsLoading(true);
      const data = {
        page: CurrentWithdrawalPage,
      }
      try {
        const res = await fetchWithdrawalPage(data);
        setAllWithdrawals(res?.data?.payload?.withdrawals || [] );
        toast.success(res.data.message);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        toast.error(res.data.message)
      }finally{
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [CurrentWithdrawalPage, setAllWithdrawals]);

  return (
    <div className="p-6 space-y-6 bg-[#0F1418] min-h-screen">
      <section className="flex justify-between items-center bg-[#1A1D21] p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center space-x-2">
          <PiHandWithdraw className="text-orange-600 h-6 w-6" />
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      </section>

      <section className="bg-[#1A1D21] rounded-lg border border-gray-700">
        <WalletTableComponent
          title={<h1 className="text-lg font-semibold text-white">{title}</h1>}
          headers={tableHeader}
          data={AllWithdrawals}
          type="withdrawals"
          CurrentPage={CurrentWithdrawalPage}
          onPageChange={handleWithdrawPageChange}
          TotalPages={TotalWithdrawalPages}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default WithdrawalPage;