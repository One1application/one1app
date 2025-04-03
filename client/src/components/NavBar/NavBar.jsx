/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/oneapp.png";
import { ImCross } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar({scrollToFeatures}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const closeMobileMenu = () => {
    setClicked(false);
  };

  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Section: Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-32" />
        </Link>

        {/* Middle Section: Nav Links (Hidden on mobile) */}
        <div className="hidden md:flex space-x-8">
          <NavLink className="text-lg hover:text-orange-500" to="/" onClick={closeMobileMenu}>
            Home
          </NavLink>
          <button
            className="text-lg hover:text-orange-500"
            onClick={() => {
              scrollToFeatures(); // Scrolls to Features
              closeMobileMenu();
            }}
          >
            Features
          </button>
          <NavLink className="text-lg hover:text-orange-500" to="/about-us" onClick={closeMobileMenu}>
            About Us
          </NavLink>
          <NavLink className="text-lg hover:text-orange-500" to="/hiring" onClick={closeMobileMenu}>
            Hiring
          </NavLink>
          <NavLink className="text-lg hover:text-orange-500" to="/plugins" onClick={closeMobileMenu}>
            Plugin
          </NavLink>
        </div>

        {/* Right Section: Get Started Button and Hamburger Icon */}
        <div className="flex items-center space-x-4">
          <NavLink className="hidden md:block bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg" to="/signup">
            Get Started
          </NavLink>
          {/* Hamburger Icon for Mobile */}
          <button className="md:hidden text-2xl" onClick={handleClick}>
            {!clicked ? <GiHamburgerMenu /> : <ImCross />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Visible when clicked state is true) */}
      {clicked && (
        <div className="md:hidden bg-black text-white py-4">
          <ul className="space-y-4 text-center">
            <li>
              <NavLink className="text-lg hover:text-orange-500" to="/" onClick={closeMobileMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <button
                className="text-lg hover:text-orange-500"
                onClick={() => {
                  scrollToFeatures(); // Scrolls to Features
                  closeMobileMenu();
                }}
              >
                Features
              </button>
            </li>
            <li>
              <NavLink className="text-lg hover:text-orange-500" to="/about-us" onClick={closeMobileMenu}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink className="text-lg hover:text-orange-500" to="/hiring" onClick={closeMobileMenu}>
                Hiring
              </NavLink>
            </li>
            <li>
              <Link to='/signup' className="w-fit bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg">
                Get started
              </Link>
            </li>
            <li>
                
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
