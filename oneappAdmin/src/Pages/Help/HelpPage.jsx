import Header from "../../components/Header/Header";
import { FaEnvelope, FaHandsHelping, FaPhoneAlt } from "react-icons/fa"; 
import Helpimg from "../../assets/helpimg.png";

const HelpPage = () => {
  return (
    <div className="max-w-full min-h-screen px-4 py-4 bg-gradient-to-b from-gray-100 to-white space-y-6">
      <Header title="Help" IconComponent={FaHandsHelping} />
      <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Section */}
        <div className="flex flex-col items-start w-full md:w-1/2">
          <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Contact Information</h1>
          <div className="flex items-center mb-4">
            <FaEnvelope className="w-5 h-5 text-orange-500 mr-4" />
            <span className="text-sm md:text-md text-gray-600 break-all">support@gmail.com</span>
          </div>
          <div className="flex items-center">
            <FaPhoneAlt className="w-5 h-5 text-orange-500 mr-4" />
            <span className="text-sm md:text-md text-gray-600">+91 8523697412</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-lg"
            src={Helpimg}
            alt="Help Page"
          />
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
