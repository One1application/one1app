
function TextBox({ dtype, color}) {
    const style = {
        orange : 'text-[#EC5D0E]',
        normal: ''
    }    
    return (
        <div className={`w-[460px] h-[55px] text-xl flex  items-center ps-5 uppercase ${style[color]}`}>
            TExtBox
        </div>
    )
}

export default TextBox