import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // For checkmark icon
import { IoIosArrowDown } from "react-icons/io"; // For dropdown arrow
import { MdOutlineAccountBalance } from "react-icons/md"; // Bank icon
import { HiOutlineOfficeBuilding } from "react-icons/hi"; // Placeholder icons

const Dropdown = ({ financeIds }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Not Added");
  useEffect(() => {
    setSelected(financeIds[0]);
  }, [financeIds]);

  const options = [
    <HiOutlineOfficeBuilding className="text-green-600" />,
    <MdOutlineAccountBalance className="text-orange-600" />,
  ];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative md:w-64 w-full">
      {/* Selected Item */}
      <button
        className="flex items-center justify-between w-full px-4 py-3 border rounded-md bg-white shadow-md text-sm font-medium cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 font-poppins tracking-tight">
          {selected.includes("@") ? options[0] : options[1]}
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
              onClick={() => handleSelect(financeId)}
            >
              <span className="flex items-center gap-2 text-sm font-poppins tracking-tight ">
                {financeId.includes("@") ? options[0] : options[1]}
                {financeId}
              </span>
              {selected === financeId && (
                <FaCheckCircle className="text-green-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
