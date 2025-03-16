/* eslint-disable react/prop-types */
import { GoPlus } from "react-icons/go";
import { Player } from '@lottiefiles/react-lottie-player';
import AnimationData from "../../assets/Rocket animation.json";
import { useNavigate } from "react-router-dom";

const NoContentComponent = ({ title, description, isbutton, button_title,path }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <div className="w-32 h-32 mb-4">
        <Player
          autoplay
          loop
          src={AnimationData}
          className="w-full h-full"
        />
      </div>

      <p className="text-lg font-bold mb-2">{title}</p>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {isbutton && (
        <button
          type="button"
          className="bg-orange-600 text-white rounded-full text-xs md:text-sm px-4 md:px-6 py-2 transition duration-200 hover:bg-orange-700 flex justify-center items-center gap-1"
          aria-label="Create Course"
          onClick={() => navigate(path)}
        >
          <GoPlus className="font-bold" />
          {button_title}
        </button>
      )}
    </div>
  );
};

export default NoContentComponent;
