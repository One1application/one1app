function OverView({ category, description }) {
  const colors = [
    "bg-red-600",
    "bg-green-600",
    "bg-blue-600",
    "bg-purple-600",
    "bg-yellow-600",
    "bg-pink-600",
  ];

  return (
    <div className="bg-gray-800 rounded-lg md:rounded-[20px] px-4 py-6 md:px-10 md:py-10 tracking-wider">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600/50 to-transparent backdrop-blur-sm flex flex-col sm:flex-row justify-between rounded-lg h-auto sm:h-14">
        <div className="flex items-center w-full">
          <div className="bg-[#EC5D0E] w-2 sm:w-3 h-8 sm:h-full rounded-l-lg"></div>
          <div className="text-[#EC5D0E] font-semibold text-base sm:text-lg px-4 py-2 sm:py-0 w-full">
            Every file you save is a step closer to your goal
          </div>
        </div>
        <div className="px-4 pb-2 flex items-center sm:pb-0 sm:px-0">
          <button className="w-full sm:w-auto text-xs sm:text-sm rounded-lg sm:rounded-xl px-2 sm:px-4 py-1 bg-transparent text-white flex flex-row gap-2 overflow-x-auto whitespace-nowrap">
            {category.map((item, index) => (
              <span
                key={index}
                className={`inline-block px-2 py-[2px] rounded-full text-[10px] sm:text-xs font-medium ${
                  colors[index % colors.length]
                } text-white`}
              >
                {item}
              </span>
            ))}
          </button>
        </div>
      </div>

    

        <div className="pt-6 md:pt-10 flex flex-col gap-3 md:gap-4">
          <div className="mt-3 md:mt-4 flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-3 md:gap-4 border-2 p-4 md:p-8 lg:p-[50px] rounded-lg md:rounded-[20px] border-[#4a4a4a]">
              <span className="font-semibold text-base md:text-lg text-[#EC5D0E]">
                Creator's Description for this Product
              </span>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
      </div>
  
  );
}

export default OverView;
