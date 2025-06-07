import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // For checkmark icon
import { IoIosArrowDown } from "react-icons/io"; // For dropdown arrow
import { MdAdd, MdOutlineAccountBalance, MdDelete } from "react-icons/md"; // Bank icon
import { HiOutlineOfficeBuilding } from "react-icons/hi"; // Placeholder icons
import SecondryBankDetailsPopUp from "./SecondryBankDetailsPopUp";
import DeleteBankOrUpi from "../Modal/DeleteBankOrUpi"; //for delete bank-or-upi
import toast from "react-hot-toast";

const Dropdown = ({ financeIds, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState("Not Added");
  const [deleteModal, setDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  useEffect(() => {
    setSelected(financeIds[0]);
  }, [financeIds]);

  const options = [
    <HiOutlineOfficeBuilding className="text-green-600" />,
    <MdOutlineAccountBalance className="text-orange-600" />,
    <MdAdd className="text-blue-600" />,
  ];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleAddMore = () => {
    setPopup(true);
    console.log(popup);
  };

  const handleDeleteClick = (e, financeId) => {
    e.stopPropagation();
    setDeleteModal(true);
    setAccountToDelete(financeId);
  };
  const handleDeleteSuccess = async () => {
    await onRefresh();
    if(accountToDelete === selected){
      const remainingAccounts = financeIds.filter(id => id !== accountToDelete && id !== 'Add More');
      setSelected(remainingAccounts.length > 0 ? remainingAccounts[0] : 'Not Added');
    }
    
    toast.success("Account Deleted Successfully!");
  };
  return (
    <div className="relative md:w-64 w-full z-30">
      {/* Selected Item */}
      <button
        className="flex items-center justify-between w-full px-4 py-3 border rounded-md bg-white shadow-md text-sm font-medium cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 font-poppins tracking-tight">
          {selected === "Add More"
            ? options[2]
            : selected.includes("@")
            ? options[0]
            : options[1]}
          {selected}
        </span>
        <IoIosArrowDown className="text-gray-500" />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg">
          {financeIds.map((financeId, index) => (
            <div
              key={financeId}
              className={`flex items-center justify-between px-4 py-2 font-poppins  hover:bg-gray-100 cursor-pointer ${
                selected === financeId ? "bg-gray-50" : ""
              }`}
              onClick={
                financeId === "Add More"
                  ? handleAddMore
                  : () => handleSelect(financeId)
              }
            >
              <span className="flex items-center gap-2 text-sm font-poppins tracking-tight ">
                {financeId === "Add More"
                  ? options[2]
                  : financeId.includes("@")
                  ? options[0]
                  : options[1]}
                {financeId}
              </span>
              {/* {selected === financeId && (
                <FaCheckCircle className="text-green-600" />
              )} */}
              <div className="flex items-center gap-2">
                {selected === financeId && (
                  <FaCheckCircle className="text-green-600" />
                )}

                {/* delete button */}
                {financeId !== "Add More" && (
                  <MdDelete
                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                    onClick={(e) => handleDeleteClick(e, financeId)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {popup && (
        <SecondryBankDetailsPopUp
          onClose={() => setPopup(false)}
          onRefresh={onRefresh}
        />
      )}

      {/* delete modal   */}
      {deleteModal && (
        <DeleteBankOrUpi
          onClose={() => setDeleteModal(false)}
          accountId={accountToDelete}
          accountType={accountToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Dropdown;
