import { PiHandWithdraw } from "react-icons/pi";
import { walletConfig } from "../WalletConfig";
import { fetchTransactionsPage} from "../../../../../services/auth/api.services"
// import { FaCog } from "react-icons/fa";
import WalletTableComponent from "../../../../../components/Table/WalletTableComponent";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../../../context/StoreContext/StoreContext";

const AllTransactionsPage = () => {
  const { AllTransaction, CurrentTransactionPage, TotalTransactionPages, setAllTransaction, getNextTransactionPage } = useContext(StoreContext);


  const [isLoading, setIsLoading] = useState(true);
 
  const { title, tableHeader} = walletConfig.allTransactionsPage;

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      const data = {
         page: CurrentTransactionPage
      }
      try {
        const res = await fetchTransactionsPage(data);
        setAllTransaction(res.data.payload.transactions);

          
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      } 
    };

    fetchTransactions();
  }, [CurrentTransactionPage]);

  
  useEffect(() => {
    getNextTransactionPage(1)
    
  }, [])

  const handlePageChange = (page) => {
    console.log("fetching page cat", page)
      getNextTransactionPage(page);
  }
 

  return (
    <div className="p-6 space-y-6 bg-[#0F1418] min-h-screen">
      <section className="flex justify-between items-center bg-[#1A1D21] p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center space-x-2">
          <PiHandWithdraw className="text-orange-600 h-6 w-6" />
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
        {/* <FaCog className="text-gray-400 h-6 w-6 cursor-pointer hover:text-gray-300" /> */}
      </section>

      <section className="bg-[#1A1D21] rounded-lg border border-gray-700">
        <WalletTableComponent
          title={<h1 className="text-lg font-semibold text-white">{title}</h1>}
          headers={tableHeader}
          data={AllTransaction}
          type={"transactions"}
          CurrentPage={CurrentTransactionPage}
          TotalPages={TotalTransactionPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          // data={tableData}
        />
      </section>
    </div>
  );
};

export default AllTransactionsPage;
