import Card from "../../../../components/Cards/Card";
import NoContentComponent from "../../../../components/NoContent/NoContentComponent";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchPremiumDashboardData,getRevenuePerDay } from "../../../../services/auth/api.services";
import pagesConfig from "../pagesConfig";
import Table from "../../../../components/Table/TableComponent";
import { useNavigate } from "react-router-dom";
import PaymentGraph from "../../../../components/PaymentGraph/PaymentGraph";
import LockedContentTable from "../../../../components/Table/LockedContentTable";

const LockedContentPage = () => {
  const [premiumContentData, setPremiumContentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [cardData, setCardData] = useState([]);

  const { title, button, bgGradient, noContent, tabs, path } = pagesConfig.lockedContentPage;
  const navigate = useNavigate()

  const getPremiumData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPremiumDashboardData();
      console.log(response.data.payload.premiumContent);
      
      setPremiumContentData(response.data.payload.premiumContent || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch locked content data."
      );
      console.error("Error fetching locked content:", error);
      setPremiumContentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPremiumData();
  }, []);

   useEffect(() => {
  async function fetchRevenue() {
    const daily = await getRevenuePerDay("PREMIUMCONTENT");
    setCardData(daily); // setChartData used in your <PaymentGraph />
  }

  fetchRevenue();
}, []);

  return (
    <div className="min-h-screen">
      <div className={`w-full h-64 ${bgGradient} flex justify-center items-center relative`}>
        <h1 className="font-bold text-white text-3xl md:text-4xl">{title}</h1>
        <button
          type="button"
          className="bg-orange-600 text-white rounded-full text-xs md:text-sm px-4 md:px-6 py-2 transition duration-200 md:w-auto hover:bg-orange-700 absolute top-4 right-4 md:top-5 md:right-10 flex justify-center items-center gap-1"
          aria-label={button.ariaLabel}
          onClick={() => navigate(path)}
        >
          <button.icon className="font-bold" /> 
          {button.label}
        </button>
      </div>

      <PaymentGraph  cardData={cardData}/>


      {/* <div className="flex md:justify-center items-center gap-6 p-6 overflow-x-auto md:overflow-visible flex-nowrap w-full relative -mt-24 z-10 scrollbar-hide">
        {cardData.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} description={card.description} />
        ))}
      </div> */}

      <div className="p-6 h-full w-full flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : premiumContentData && premiumContentData.length > 0 ? (
          <LockedContentTable data={premiumContentData} refreshData={getPremiumData} />
        ) : (
          <NoContentComponent
            title={noContent[0].title}
            description={noContent[0].description}
            isbutton={noContent[0].isButton}
            button_title={noContent[0].buttonTitle}
            path={path}
          />
        )}
      </div>
    </div>
  );
};

export default LockedContentPage;
