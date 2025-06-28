// import Card from "../../../../components/Cards/Card";
import NoContentComponent from "../../../../components/NoContent/NoContentComponent";
import { useEffect, useState } from "react";
import pagesConfig from "../pagesConfig";
import CourseTable from "../../../../components/Table/CourseTable";
import { useNavigate } from "react-router-dom";
import PaymentGraph from "../../../../components/PaymentGraph/PaymentGraph";
import { fetchAllCoursesData,getRevenuePerDay } from "../../../../services/auth/api.services";

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState([]);

  const { title, button, bgGradient, noContent, tabs, path } = pagesConfig.coursesPage;
  const navigate = useNavigate();

  const [AllCourses, setAllCourses] = useState([]);

  const getAllCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllCoursesData();
      setAllCourses(response.data.payload.courses);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

   useEffect(() => {
  async function fetchRevenue() {
    const daily = await getRevenuePerDay("COURSE");
    setCardData(daily); // setChartData used in your <PaymentGraph />
  }

  fetchRevenue();
}, []);

  return (
    <div className="min-h-screen">
      <div
        className={`w-full h-64 ${bgGradient} flex justify-center items-center relative`}
      >
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

      {/* <div className="flex md:justify-center items-center gap-6 p-6 overflow-x-auto md:overflow-visible flex-nowrap w-full relative -mt-24 z-10 scrollbar-hide">
        {cardData.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} description={card.description} />
        ))}
      </div> */}
{/* 
      <div className="flex justify-start items-center gap-4 p-6">
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
        ) : tabs[activeTab].content && tabs[activeTab].content.length > 0 ? (
          <CourseTable data={AllCourses} />
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

export default CoursesPage;
