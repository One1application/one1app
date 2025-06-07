import React from 'react';
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import {deleteSecondaryBankorUpiAccount} from "../../services/auth/api.services";

const DeleteBankOrUpi = ({onClose, accountId, accountType, onSuccess}) => {
  
    const handleDelete = async () => {
        try {
            const response = await deleteSecondaryBankorUpiAccount({
                id: accountId,
                type: accountType.includes("@") ? "upi": "bank"
        });
            console.log("DEBUG DELETE RESPONSE", response);
            if (response?.status === 200) {
                toast.success(response?.data?.message);
                onSuccess();
                
            }else{
                toast.error(response?.data?.message || "Failed to delete account!");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            onClose();
        }
    };


 return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] md:w-[450px]">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <MdDelete className="text-4xl" />
        </div>
        
        <h3 className="text-xl font-semibold mb-4 text-center font-poppins tracking-tight">
          Delete Confirmation
        </h3>
        
        <p className="mb-6 text-gray-600 text-center font-poppins tracking-tight">
          Are you sure you want to delete this account?
          <br />
          <span className="font-semibold text-gray-800">{accountId}</span>
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg font-poppins tracking-tight hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-poppins tracking-tight hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBankOrUpi;