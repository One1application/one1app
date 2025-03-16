import { useState } from "react";
import NoAudienceComponent from "../../../../components/NoContent/NoAudienceComponent";
import yourCustomerConfig from "./yourCustomerConfig";
import AudienceTableComponent from "../../../../components/Table/AudienceTableComponent";
import { PiUsers } from "react-icons/pi"; // Added for user icon

const AudiencePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = yourCustomerConfig.tabs[activeTab];

  return (
    <div className="p-6 space-y-6 bg-[#0F1418] min-h-screen">
      {/* Header Section - Styled like AllTransactionsPage */}
      <section className="flex justify-between items-center bg-[#1A1D21] p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center space-x-2">
          <PiUsers className="text-orange-600 h-6 w-6" />
          <h1 className="text-lg font-semibold text-white">{yourCustomerConfig.title}</h1>
        </div>
      </section>

      {/* Tabs - Restyled to match dark theme */}
      <div className="flex justify-start items-center gap-4 px-4">
        {yourCustomerConfig.tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`cursor-pointer rounded-full text-xs md:text-sm px-4 py-2 transition duration-200 
              ${
                activeTab === index
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#1A1D21] text-gray-300 hover:bg-[#252A2E] border border-gray-700'
              }`}
          >
            {tab.title} ({tab.value})
          </div>
        ))}
      </div>

      {/* Content Section - Styled like AllTransactionsPage */}
      <section className="bg-[#1A1D21] rounded-lg border border-gray-700">
        <div className="p-6 h-full w-full">
          {currentTab.content.length > 0 ? (
            <AudienceTableComponent 
              data={currentTab.content}
              className="text-white" 
            />
          ) : (
            <NoAudienceComponent
              title={yourCustomerConfig.noContentData[currentTab.title.toLowerCase()].title}
              description={
                Array.isArray(yourCustomerConfig.noContentData[currentTab.title.toLowerCase()].description)
                  ? yourCustomerConfig.noContentData[currentTab.title.toLowerCase()].description
                  : [yourCustomerConfig.noContentData[currentTab.title.toLowerCase()].description]
              }
              buttonTitle={yourCustomerConfig.noContentData[currentTab.title.toLowerCase()].buttonTitle}
              className="text-white" 
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AudiencePage;