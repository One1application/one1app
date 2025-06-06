import { useState } from "react"
import { deletePremiumContentById } from "../../../../services/auth/api.services";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

function Option({ selectId, setOptionPopUp,refreshData }) {
    const [deleteShow, setDeleteShow] = useState(false);
    const navigate = useNavigate();

    function ShowDeletePoPUp() {
        setDeleteShow(true);
    }

    async function handleDelete() {
        try {
            const response = await deletePremiumContentById(selectId);
            toast.success(response.data.message)
            setOptionPopUp(false)
             refreshData();
        } catch(e) {
            console.log(e);
        }
    }

   

    return (
        <div className="fixed -inset-10 bg-[#0F1418] bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setOptionPopUp(false)}>
            <div className="bg-[#1A1D21] p-6 flex flex-col gap-3 justify-center rounded-lg w-full max-w-md" onClick={(e) =>   e.stopPropagation()}>

              {!deleteShow ?  
                
                <>
                   <div className="flex justify-center items-center gap-3 flex-col text-white">
                    Do you want to delete ?
                    <div className="flex gap-2">
                        <button className="px-3 bg-red-700 text-white py-4" onClick={handleDelete}> Delete</button>
                        <button className="px-3 bg-red-700 text-white py-4" onClick={() => setOptionPopUp(false)}> close</button>
                     </div>
                </div> 
                 {/* <div className="flex justify-center items-center gap-3">

                        <button className="p-4 bg-green-600 text-white" onClick={(e) => handleEdit(e, selectId)}>Edit</button> 
                        <button className="p-4 bg-red-500 text-white" onClick={ShowDeletePoPUp}>Delete</button> 
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        <button className="px-3 bg-red-700 text-white py-4" onClick={() => setOptionPopUp(false)}> close</button>
                    </div> */}
                </> : <></>
               }
            </div>


            
        </div>
    )
}

export default Option