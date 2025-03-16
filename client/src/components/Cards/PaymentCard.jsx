/* eslint-disable react/prop-types */
const PaymentCard = ({ icon, title, description }) => {
    return (
      <div className='flex flex-col border border-gray-300 p-4 gap-1 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200'>
        <div>{icon}</div>
        <p className='font-bold text-sm'>{title}</p>
        <p className='hidden md:block text-xs text-gray-500'>{description}</p>
      </div>
    );
};
  
export default PaymentCard;
