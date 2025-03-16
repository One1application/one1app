/* eslint-disable react/prop-types */
import { useState } from 'react';
import oneApp from "../../../../assets/oneapp.jpeg"

const NavBar = ({logo,profilePhoto}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#392C10] text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src={logo || oneApp} alt="Logo" className="h-8 w-8" />
      </div>
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
          <img
            src={ profilePhoto || oneApp}
            alt="Profile"
            className="h-8 w-8 rounded-full border-2 border-gray-200"
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
