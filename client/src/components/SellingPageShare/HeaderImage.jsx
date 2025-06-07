 
function HeaderImage({ imageurl }) {
    return (
        <div className="max-h-[679px] pt-[18px] flex justify-center items-center">
             <img
                src={imageurl}
                alt="Course Cover"
                className="h-[300px] max-md:h-auto object-cover rounded-[25px] w-full"
            />

        </div>
    )
}

export default HeaderImage