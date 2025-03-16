/* eslint-disable react/prop-types */
import Profile from "../../assets/profile.svg";
const CardSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-12 w-12 bg-gray-200 rounded-full mb-6 mx-auto" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6" />
      <div className="h-10 bg-gray-200 rounded-md w-full" />
    </div>
  );

  
const InspiredCard = ({ image, text, isLoading }) => {
    if (isLoading) return <CardSkeleton />;
    
    return (
      <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all">
        <div className="aspect-w-16 aspect-h-9">
          <img 
            src={image || Profile} 
            alt={text}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm font-medium">{text}</p>
        </div>
      </div>
    );
  };

export default InspiredCard;
