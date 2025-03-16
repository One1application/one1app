/* eslint-disable react/prop-types */
import { Users, MessageCircle } from "lucide-react";

const getIcon = (iconName) => {
  const icons = {
    Users: Users,
    MessageCircle: MessageCircle
  };
  return icons[iconName] || Users;
};

const CommunityButton = ({ label, link, color }) => (
  <a 
    href={link} 
    className={`inline-block px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${color}`}
  >
    {label}
  </a>
);

const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 w-12 bg-gray-200 rounded-full mb-6 mx-auto" />
    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6" />
    <div className="h-10 bg-gray-200 rounded-md w-full" />
  </div>
);

const CommunityCard = ({ 
  icon, 
  title, 
  description, 
  link, 
  buttonLabel, 
  buttonColor,
  isLoading 
}) => {
  const Icon = getIcon(icon);

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="p-6 pb-0">
        <div className="flex items-center mb-4">
          <div className="bg-blue-50 p-3 rounded-full mr-4">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="pb-6 flex justify-center">
          <CommunityButton 
            label={buttonLabel} 
            link={link} 
            color={buttonColor}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;