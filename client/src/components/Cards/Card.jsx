/* eslint-disable react/prop-types */
const Card = ({ title, value, description }) => {
    return (
      <div className="flex-none md:flex-1 flex flex-col border border-gray-300 bg-gray-100 p-4 gap-2 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 min-w-[200px] md:min-w-[250px] max-w-[350px] md:max-w-[400px]">
        <p className="font-bold text-sm">{title}</p>
        <p className="font-bold text-xl">{value}</p>
        <div className="border border-gray-100 rounded-sm p-2">{description}</div>
      </div>
    );
  };
  
  export default Card;
  