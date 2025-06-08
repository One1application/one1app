import OverViewExploreData from "./OverViewExploreData";

function OverView({ category, description }) {
  return (
    <div className="bg-gray-800 rounded-lg md:rounded-[20px] px-4 py-6 md:px-10 md:py-10 tracking-wider">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600/50 to-transparent backdrop-blur-sm flex flex-col sm:flex-row justify-between rounded-lg h-auto sm:h-14">
        <div className="flex items-center w-full">
          <div className="bg-[#EC5D0E] w-2 sm:w-3 h-8 sm:h-full rounded-l-lg"></div>
          <div className="text-[#EC5D0E] font-semibold text-base sm:text-lg px-4 py-2 sm:py-0 w-full">
            At OneApp: "Elevating creators thrive and earn effortlessly."
          </div>
        </div>
        <div className="px-4 pb-2 sm:pb-0 sm:px-0">
          <button className="w-full sm:w-auto text-sm sm:text-xl rounded-lg sm:rounded-xl uppercase px-4 sm:px-8 py-1 sm:py-2 bg-[#F8915E] text-white">
            {category}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="text-sm md:text-base text-gray-300">
        <div className="pt-6 md:pt-10 font-light">
          At OneApp, we are focused on elevating creators by offering a platform
          that makes the path from passion to profit effortless. Our tools
          promote growth, inspire creativity, and cultivate trust within your
          community, all while maintaining a user-friendly and mobile-optimized
          experience.
        </div>

        <div className="pt-6 md:pt-10 grid gap-3 md:gap-4">
          <div className="font-semibold text-base md:text-lg">Our vision :</div>
          <div>
            We envision a world where creators have easy access to the tools
            they need to turn their passions into profit and scale their
            businesses, free from the constraints of complicated technology.
            OneApp is here to streamline that journey, enabling creators to take
            charge of their future.
          </div>
        </div>

        <div className="pt-6 md:pt-10 flex flex-col gap-3 md:gap-4">
          <div className="font-semibold text-base md:text-lg text-[#EC5D0E]">
            Explore our offering
          </div>
          <div>
            "Unleash your potential with our all-inclusive range of creator
            services."
          </div>
          <div className="mt-3 md:mt-4 flex flex-col gap-4 md:gap-8">
            <OverViewExploreData />
            <OverViewExploreData />
            <OverViewExploreData />
            <div className="flex flex-col gap-3 md:gap-4 border-2 p-4 md:p-8 lg:p-[50px] rounded-lg md:rounded-[20px] border-[#4a4a4a]">
              <span className="font-semibold text-base md:text-lg text-[#EC5D0E]">
                Creator's Description for this Product
              </span>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverView;
