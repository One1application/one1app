import { useNavigate } from "react-router-dom";
import Logout from "../../assets/Logoutimg.png";

const LogoutPage = () => {
  const navigate = useNavigate()
  const handleLogOut = () => {
    localStorage.removeItem("AuthToken")
    navigate('/')
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg text-center">
        <img
          src={Logout} // Path to your image
          alt="Logout Illustration"
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800">Comeback Soon!</h2>
        <p className="text-gray-600 mt-2 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-center space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-100"
            onClick={() => console.log("Cancel")}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={() => handleLogOut()}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
