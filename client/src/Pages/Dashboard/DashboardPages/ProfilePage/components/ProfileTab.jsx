import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SigninModal from "../../../../../components/Modal/SigninModal";
import SupportModal from "../../../../../components/Modal/SupportModal";
import { useAuth } from "../../../../../context/AuthContext";

const ProfileTab = () => {

  const { userDetails , userdetailloading } = useAuth();

  const [firstName, setFirstName] = useState("Manish");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("manish@example.com");
  const [phone, setPhone] = useState("9876543210");

  const [isLastNameChanged, setIsLastNameChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [modalLabel, setModalLabel] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [currentField, setCurrentField] = useState("");

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    setIsLastNameChanged(true);
  };

  const handleSave = () => {
    console.log("Saved:", { firstName, lastName });
    setIsLastNameChanged(false);
  };

  const handleEditClick = (field) => {
    setModalLabel(
      field === "email" ? "Registered Email" : "Registered Phone Number"
    );
    setModalValue(field === "email" ? email : phone);
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleModalSave = (newValue) => {
    if (currentField === "email") {
      setEmail(newValue);
    } else {
      setPhone(newValue);
    }
  };

  const handleSupportModalSave = (newEmail, newPhone) => {
    setEmail(newEmail);
    setPhone(newPhone);
    setIsSupportModalOpen(false);
  };

  if (userdetailloading) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      <div className="shadow-md rounded-lg p-6 w-full">
        <h2 className="text-sm font-semibold mb-4 text-orange-500">
          Basic Information
        </h2>
        <hr className="border-gray-600 mb-4" />
        <div className="flex gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              User Name
            </label>
            <input
              type="text"
              disabled
              value={userDetails.name}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 rounded-full border bg-gray-400 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
              placeholder="Enter your First name"
            />
          </div>
          {/* <div className="w-1/2">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              className="w-full p-2 rounded-full border bg-gray-400 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
              placeholder="Enter your last name"
            />
          </div> */}
        </div>
        {isLastNameChanged && (
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-orange-600 text-white rounded-full text-xs p-2 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="shadow-md rounded-lg p-6 w-full">
        <h2 className="text-sm font-semibold mb-4 text-orange-500">
          Signin Information
        </h2>
        <hr className="border-gray-600 mb-4" />
        <div className="flex flex-col gap-6">
          <div className="w-full relative">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Registered Email
            </label>
            <input
              type="text"
              value={userDetails.email}
              disabled
              readOnly
              className="w-full p-2 rounded-full border bg-gray-400 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
            />
            {/* <div className="absolute right-2 top-5 bottom-0 flex items-center gap-2">
              <EditIcon
                className="cursor-pointer text-orange-700"
                onClick={() => handleEditClick("email")}
              />
              <span
                className="text-sm mr-1 text-orange-700 cursor-pointer"
                onClick={() => handleEditClick("email")}
              >
                Edit
              </span>
            </div> */}
          </div>
          <div className="w-full relative">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Registered Phone Number
            </label>
            <input
              type="text"
              disabled
              value={userDetails.phone}
              readOnly
              className="w-full p-2 rounded-full border bg-gray-400 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
            />
            {/* <div className="absolute right-2 top-5 bottom-0 flex items-center gap-2">
              <EditIcon
                className="cursor-pointer text-orange-700"
                onClick={() => handleEditClick("phone")}
              />
              <span
                className="text-sm mr-1 text-orange-700 cursor-pointer"
                onClick={() => handleEditClick("phone")}
              >
                Edit
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* <div className="shadow-md rounded-lg p-6 w-full">
        <h2 className="text-sm font-semibold mb-4 text-orange-500">
          Support Channel
        </h2>
        <hr className="border-gray-600 mb-4" />
        <div className="flex flex-col gap-6">
          <div className="w-full relative">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Support Email
            </label>
            <input
              type="text"
              value={email}
              className="w-full p-2 rounded-full border bg-gray-400 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
            />
            <button
              className="absolute bg-orange-700 right-2 top-7 text-white text-xs rounded-xl p-2 transition duration-200"
              onClick={() => setIsSupportModalOpen(true)}
            >
              Set up
            </button>
          </div>
          <div className="w-full relative">
            <label className="block text-sm font-medium text-orange-500 mb-1">
              Support Phone Number
            </label>
            <input
              type="text"
              value={phone}
              className="w-full p-2 rounded-full border bg-gray-400 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-black"
            />
            <button
              className="absolute bg-orange-700 right-2 top-7 text-white text-xs rounded-xl p-2 transition duration-200"
              onClick={() => setIsSupportModalOpen(true)}
            >
              Set up
            </button>
          </div>
        </div>
      </div> */}

      <SigninModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        label={modalLabel}
        value={modalValue}
        onSave={handleModalSave}
      />
      <SupportModal
        open={isSupportModalOpen}
        handleClose={() => setIsSupportModalOpen(false)}
        label={modalLabel}
        value={modalValue}
        onSave={handleSupportModalSave}
      />
    </div>
  );
};

export default ProfileTab;
