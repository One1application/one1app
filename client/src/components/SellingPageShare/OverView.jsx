import OverViewExploreData from "./OverViewExploreData"


function OverView() {
  return (
    <div className="bg-[#101727] rounded-[20px] px-10 py-10 tracking-wider">
        <div className="bg-[linear-gradient(93.43deg,_rgba(236,93,14,0.5)_0%,_rgba(255,255,255,0)_100%)]  
        backdrop-blur-sm flex justify-between rounded-lg h-14">
            <div className="flex items-center gap-10 w-full" >
                <div className="bg-[#EC5D0E] w-3 rounded-tl-lg rounded-bl-sm h-full">
                    
                </div>
                <div className="text-[#EC5D0E] font-semibold text-lg w-full">

                    At OneApp: "Elevating creators thrive and earn effortlessly."
                </div>
            </div>
            <div>
                <button className="px-20 text-xl rounded-xl uppercase py-2 bg-[#F8915E] text-white h-full">
                    category
                </button>
            </div>
        </div>
        <div className="text-md text-gray-300">

            <div className="pt-10 font-light">
                At OneApp, we are focused on elevating creators by offering a platform that makes the path from passion to profit effortless. Our tools promote growth, inspire creativity, and cultivate trust within your community, all while maintaining a user-friendly and mobile-optimized experience.
            </div>

            <div className="pt-10 grid gap-4">
                <div className="font-semibold text-lg">
                    Our vision :
                </div>
                <div>
                    We envision a world where creators have easy access to the tools they need to turn their passions into profit and scale their businesses, free from the constraints of complicated technology. OneApp is here to streamline that journey, enabling creators to take charge of their future.
                </div>
            </div>

            <div className="pt-10 flex flex-col gap-4">
                <div className="font-semibold text-lg text-[#EC5D0E]">
                    Explore our offering
                </div>
                <div>
                    "Unleash your potential with our all-inclusive range of creator services."
                </div>
                <div className="mt-4 flex flex-col gap-8">
                    <OverViewExploreData />
                    <OverViewExploreData />
                    <OverViewExploreData />
                </div>
            </div>
        </div>
    </div>
  )
}

export default OverView