import { useState } from "react"
import { deletePremiumContentById } from "../../../../services/auth/api.services";
import toast from "react-hot-toast";

function Option({ selectId, setOptionPopUp }) {
    const [deleteShow, setDeleteShow] = useState(false);

    function ShowDeletePoPUp() {
        setDeleteShow(true);
    }

    async function handleDelete() {
        try {
            const response = await deletePremiumContentById(selectId);
            toast.success(response.data.message)
            setOptionPopUp(false)
        } catch(e) {
            console.log(e);
        }
    }
    return (
        <div className="fixed -inset-10 bg-[#0F1418] bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setOptionPopUp(false)}>
            <div className="bg-[#1A1D21] p-6 flex flex-col gap-3 justify-center rounded-lg w-full max-w-md" onClick={(e) =>   e.stopPropagation()}>

              {!deleteShow ?  
                <>
                    <div className="flex justify-center items-center gap-3">

                        <button className="p-4 bg-green-600">Edit</button> 
                        <button className="p-4 bg-red-500" onClick={ShowDeletePoPUp}>Delete</button> 
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        <button className="px-3 bg-red-700 py-4" onClick={() => setOptionPopUp(false)}> close</button>
                    </div>
                </> : 
                <div className="flex justify-center items-center gap-3 flex-col">
                    are you want to delete
                    <div className="flex gap-2">
                        <button className="px-3 bg-red-700 py-4" onClick={() => setDeleteShow(false)}> close</button>
                        <button className="px-3 bg-red-700 py-4" onClick={handleDelete}> Delete</button>
                    </div>
                </div>}
            </div>


            
        </div>
    )
}

export default Option