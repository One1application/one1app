/* eslint-disable react/no-unescaped-entities */
import toast from "react-hot-toast";
// import Card from "../../../../components/Cards/Card";
import NoContentComponent from "../../../../components/NoContent/NoContentComponent";
import Table from "../../../../components/Table/TableComponent";
import pagesConfig from "../pagesConfig";
import { useState, useEffect } from "react";
import PaymentGraph from "../../../../components/PaymentGraph/PaymentGraph";
 
import {
  fetchAllTelegramData,
  fetchTelegram,
} from "../../../../services/auth/api.services";
import { useNavigate } from "react-router-dom";
import { use } from "react";

const TelegramPage = () => {
   

  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [telegramData, setTelegramData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { title, button, bgGradient, noContent, tabs, cardData } =
    pagesConfig.telegramPage;

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev); // Toggle modal state
  };

  const handleSubmit = () => {
    if (!mobileNumber) {
      toast.error("Please enter a mobile number");
      return;
    }

    toast.success("OTP has been sent to your mobile number");
    handleModalToggle();
    setMobileNumber("");
  };

  const getTelegramData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllTelegramData();
      console.log(response);

      setTelegramData(response.data.payload.telegrams);
    } catch (error) {
      console.error("telegram", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTelegramData();
  }, []);

  return (
    <div className="min-h-screen">
      <div
        className={`w-full h-64 ${bgGradient} flex justify-center items-center relative`}
      >
        <h1 className="font-bold text-white text-3xl md:text-4xl">{title}</h1>
        <button
          type="button"
          onClick={() => navigate(`/app/create-telegram?chatid=${chatid}`)}
          className="bg-orange-600 text-white rounded-full text-xs md:text-sm px-4 md:px-6 py-2 transition duration-200 md:w-auto hover:bg-orange-700 absolute top-4 right-4 md:top-5 md:right-10 flex justify-center items-center gap-1"
          aria-label={button.ariaLabel}
        >
          <button.icon className="font-bold" />
          {button.label}
        </button>
      </div>

      <PaymentGraph cardData={cardData} />

      {/* <div className="flex md:justify-center items-center gap-6 p-6 overflow-x-auto md:overflow-visible flex-nowrap w-full relative -mt-24 z-10 scrollbar-hide">
        {cardData.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} description={card.description} />
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
            {tab.title}({tab.value})
          </div>
        ))}
      </div> */}

      {/* Tab Content */}
      <div className="p-6 h-full w-full flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : tabs[activeTab].content && telegramData.length > 0 ? (
          <Table data={telegramData} />
        ) : (
          <NoContentComponent
            title={noContent[activeTab].title}
            description={noContent[activeTab].description}
            isbutton={noContent[activeTab].isButton}
            button_title={noContent[activeTab].buttonTitle}
          />
        )}
      </div>
    </div>
  );
};

export default TelegramPage;
