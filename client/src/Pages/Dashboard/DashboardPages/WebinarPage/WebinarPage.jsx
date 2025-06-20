import { useEffect, useState } from "react";
import pagesConfig from "../pagesConfig";
// import Card from "../../../../components/Cards/Card";
import NoContentComponent from "../../../../components/NoContent/NoContentComponent";
import Table from "../../../../components/Table/TableComponent";
import { useNavigate } from "react-router-dom";
import PaymentGraph from "../../../../components/PaymentGraph/PaymentGraph";
import {
  fetchAllWebinarsData,
  revenueOftheCreator,
} from "../../../../services/auth/api.services";
import WebinarTable from "../../../../components/Table/WebinarTable";
import { useAuth } from "../../../../context/AuthContext.jsx";

const WebinarPage = () => {
  const { customers } = useAuth();
  console.log(customers);
  const { title, button, bgGradient, noContent, tabs, path, coverImage } =
    pagesConfig.webinarPage;
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();
  const [AllWebinars, setAllWebinars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  // Function to format date as "DD MMM"

  async function revenueData() {
    try {
      const revenue = await revenueOftheCreator("WEBINAR");
      setData(revenue);
      console.log(revenue);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    revenueData();
  }, []);

  console.log(data);

  const getAllWebinars = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllWebinarsData();
      setAllWebinars(response.data.payload.createdWebinars);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllWebinars();
  }, []);

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = date.getDate();
  //   const month = date.toLocaleString("default", { month: "short" });
  //   return `${day} ${month}`;
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = MONTHS[date.getMonth()].substring(0, 3);
    return `${day} ${month}`;
  };

  // Transform the data
  const transformData = (data) => {
    // Group by date and sum the revenue
    const grouped = data.reduce((acc, transaction) => {
      const dateKey = formatDate(transaction.createdAt);
      const amount = parseFloat(transaction.amountAfterFee); // Correct key
      acc[dateKey] = (acc[dateKey] || 0) + amount;
      return acc;
    }, {});

    // Convert to array of objects
    return Object.entries(grouped).map(([date, value]) => ({
      date,
      value: parseFloat(value.toFixed(2)), // Keep decimals
    }));
  };

  // Get the transformed data
  const cardData = transformData(data);
  console.log(cardData);

  return (
    <div className="min-h-screen">
      {/* Background Section */}
      <div
        className="flex items-center justify-center flex-col relative"
      >
        <img
          src={coverImage}
          alt="cover"
          className="w-full h-48 object-cover rounded-lg"
        />

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

      <PaymentGraph cardData={cardData} />

      {/* Cards Section */}
      {/* <div className="flex md:justify-center items-center gap-6 p-6 overflow-x-auto md:overflow-visible flex-nowrap w-full relative -mt-24 z-10 scrollbar-hide">
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
          />
        ))}
      </div> */}

      {/* Tabs */}
      {/* <div className="flex justify-start items-center gap-4 p-6">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`cursor-pointer rounded-full text-xs md:text-sm px-4 py-2 transition duration-200 
              ${
                activeTab === index
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-200"
              }`}
          >
            {tab.title} ({tab.value})
          </div>
        ))}
      </div> */}

      {/* Tab Content */}
      <div className="p-6 h-full w-full flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : tabs[activeTab].content && tabs[activeTab].content.length > 0 ? (
          <WebinarTable data={AllWebinars} />
        ) : (
          <NoContentComponent
            title={noContent[activeTab].title}
            description={noContent[activeTab].description}
            isbutton={noContent[activeTab].isButton}
            button_title={noContent[activeTab].buttonTitle}
            path={path}
          />
        )}
      </div>
    </div>
  );
};

export default WebinarPage;
