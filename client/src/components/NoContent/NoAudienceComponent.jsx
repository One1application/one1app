/* eslint-disable react/prop-types */
const NoAudienceComponent = ({ title, description, buttonTitle }) => {
    return (
      <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
        <img
          src="https://oneapp.bio/_next/static/media/share-page-image.5a174200.png"
          alt="logo"
          className="w-32 h-32 sm:w-32 sm:h-32 md:w-32 md:h-32 mb-4 object-contain"
        />
        <h1 className="text-xl sm:text-xl md:text-xl font-semibold mb-3 text-center text-gray-800">
          {title}
        </h1>
        <ul className="mb-5 text-left list-disc space-y-1 sm:space-y-2 md:space-y-3">
          {description.map((desc, index) => (
            <li
              key={index}
              className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
            >
              {desc}
            </li>
          ))}
        </ul>
        {buttonTitle && (
          <button
            type="button"
            className="bg-orange-600 text-white rounded-full text-xs sm:text-sm md:text-base px-4 py-2 md:px-6 md:py-3 transition duration-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
            aria-label="Action Button"
          >
            {buttonTitle}
          </button>
        )}
      </div>
    );
  };
  
  export default NoAudienceComponent;
  