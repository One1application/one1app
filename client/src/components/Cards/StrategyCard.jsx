/* eslint-disable react/prop-types */

const StrategyCard = ({ image, title, description }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm border-[3px] border-white rounded-xl opacity-100 flex flex-col items-center mx-auto">
      {/* Image Section */}
      <div className="w-full h-auto">
        <img
          src={image}
          alt="Card Visual"
          className="rounded-t-xl w-full h-[200px] object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 text-white text-center">
        <h1 className="text-lg sm:text-xl font-bold mb-4">{title}</h1>
        <p className="text-sm sm:text-base leading-6">{description}</p>
      </div>
    </div>
  );
};

export default StrategyCard;
