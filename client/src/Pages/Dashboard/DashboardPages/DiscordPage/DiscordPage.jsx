// import Card from "../../../../components/Cards/Card";
import NoContentComponent from "../../../../components/NoContent/NoContentComponent";
import { useState } from "react";
import pagesConfig from "../pagesConfig"; 
import Table from "../../../../components/Table/TableComponent";
import PaymentGraph from "../../../../components/PaymentGraph/PaymentGraph";


const DiscordPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Fetch Discord page configuration from pagesConfig
  const { title, button, bgGradient, noContent, tabs, cardData } = pagesConfig.discordPage;

  return (
    <div className="min-h-screen">
      {/* Background Section */}
      <div className={`w-full h-64 ${bgGradient} flex justify-center items-center relative`}>
        <h1 className="font-bold text-white text-3xl md:text-4xl">{title}</h1>
        <button
          type="button"
          className="bg-orange-600 text-white rounded-full text-xs md:text-sm px-4 md:px-6 py-2 transition duration-200 md:w-auto hover:bg-orange-700 absolute top-4 right-4 md:top-5 md:right-10 flex justify-center items-center gap-1"
          aria-label={button.ariaLabel}
        >
          <button.icon className="font-bold" /> {/* Use the icon from the button object */}
          {button.label}
        </button>
      </div>

      <PaymentGraph  cardData={cardData}/>

      {/* <div className="flex md:justify-center items-center gap-6 p-6 overflow-x-auto md:overflow-visible flex-nowrap w-full relative -mt-24 z-10 scrollbar-hide">
        {cardData.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} description={card.description} />
        ))}
      </div> */}

      {/* Tabs */}
      <div className="flex justify-start items-center gap-4 p-6">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`cursor-pointer rounded-full text-xs md:text-sm px-4 py-2 transition duration-200 
              ${activeTab === index ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-200'}`}
          >
            {tab.title}({tab.value})
          </div>
        ))}
      </div>

      <div className="p-6 h-full w-full flex items-center justify-center">
        {tabs[activeTab].content && tabs[activeTab].content.length > 0 ? (
          <Table data={tabs[activeTab].content} />
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

export default DiscordPage;
