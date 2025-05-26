
function CreatorInfo() {
  return (
    <div className=" relative -top-12 ms-5 rounded-[20px] w-full inset-0 bg-gradient-to-r from-[#EC5D0E]/80 to-[#101727]/80 h-24 backdrop-blur-sm">
        <div className="flex gap-5  text-white ps-10 h-full items-center px-10">
            <div className="h-14 w-14 bg-red-900 rounded-full flex justify-center items-center">
                a
            </div>
            <div className="flex justify-between w-full items-center">
                <div className="capitalize">

                    <div>
                        Created by
                    </div>
                    <div>
                        name
                    </div>
                </div>
                <div className="text-3xl font-semibold me-16">
                    Category
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreatorInfo