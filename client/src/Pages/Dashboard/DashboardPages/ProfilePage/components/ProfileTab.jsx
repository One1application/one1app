import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SigninModal from "../../../../../components/Modal/SigninModal.jsx";
import SupportModal from "../../../../../components/Modal/SupportModal.jsx";
import { useAuth } from "../../../../../context/AuthContext.jsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { updateUserProfile } from "../../../../../services/auth/api.services.js";
import Emailchange from "../../../../../components/Modal/Emailchange.jsx";
import { Loader2 } from "lucide-react";

const ProfileTab = () => {
  const { userDetails, userdetailloading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [modalLabel, setModalLabel] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [currentField, setCurrentField] = useState("");
  const [otpModel, setOtpModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const [edit, setEdit] = useState({
    username: false,
    email: false,
  });

  const [tempValues, setTempValues] = useState({
    username: userDetails?.name || "",
    email: userDetails?.email || "",
    phone: userDetails?.phone || "",
  });

  const getInitials = (name) => {
    if (!name) return "USER";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const handleEditClick = (field) => {
    setEdit({
      username: field === "username",
      email: field === "email",
    });
  };

  const handleSave = (field) => {
    setEdit({ ...edit, [field]: false });
  };

  const handleCancel = (field) => {
    setTempValues({
      ...tempValues,
      [field]:
        field === "username"
          ? userDetails?.name
          : field === "email"
          ? userDetails?.email
          : userDetails?.phone,
    });
    setEdit({ ...edit, [field]: false });
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageConfirm, setShowImageConfirm] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setShowImageConfirm(true);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      setLoading(true);
      const res = await updateUserProfile(formData);
     
      toast.success("Profile picture updated!");
      setShowImageConfirm(false);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setTempValues({ ...tempValues, [field]: value });
  };

  const handleSubmit = async () => {
    if (!tempValues.username || !tempValues.email) {
      toast.error("Please enter both username and email");
      return;
    }

    if (edit.email && tempValues.email === userDetails?.email) {
      toast.error("New email is the same as current email");
      return;
    }
    const updatedData = {};

    if (edit.username) updatedData.name = tempValues.username;
    if (edit.email) updatedData.email = tempValues.email;

    try {
      const res = await updateUserProfile(updatedData);

      if (edit.username) toast.success("Username updated!");

      if (edit.email && res?.data?.requiresOtp) {
        toast.success("Verification code has been sent !");
        setOtpModel(true);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (userdetailloading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto p-4 relative md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-6"
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : userDetails?.userImage ? (
              <img
                src={userDetails.userImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(userDetails?.name || tempValues.username)
            )}
          </motion.div>

          {/* Hidden file input for image selection */}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
 
          <motion.label
            htmlFor="imageUpload"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center border-2 border-gray-700 shadow-md cursor-pointer"
          >
            <EditIcon className="text-orange-400" fontSize="small" />
          </motion.label>

          {/* ✅ Confirm icon to upload image */}
          {showImageConfirm && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -bottom-1 -left-1 bg-green-700 rounded-full h-8 w-8 flex items-center justify-center border-2 border-gray-700 shadow-md"
              onClick={handleImageUpload}
            >
              {loading ? (
                <Loader2  className="animate-spin"/>
              ) : (
                <CheckIcon className="text-white" fontSize="small" />
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-orange-400">
            Basic Information
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User Name
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={!edit.username}
                value={tempValues.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                placeholder="Enter your name"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {edit.username ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                      onClick={() => {
                        handleSave("username");
                        handleSubmit();
                      }}
                    >
                      <CheckIcon className="text-green-400 cursor-pointer" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                      onClick={() => handleCancel("username")}
                    >
                      <CloseIcon className="text-red-400 cursor-pointer" />
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                    onClick={() => handleEditClick("username")}
                  >
                    <EditIcon className="text-orange-400 cursor-pointer" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 relative"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
          <h2 className="text-lg font-semibold text-orange-400">
            Signin Information
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registered Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={tempValues.email}
                readOnly={!edit.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {edit.email ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                      onClick={() => {
                        handleSave("email");
                        handleSubmit();
                      }}
                    >
                      <CheckIcon className="text-green-400 cursor-pointer" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                      onClick={() => handleCancel("email")}
                    >
                      <CloseIcon className="text-red-400 cursor-pointer" />
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-600"
                    onClick={() => handleEditClick("email")}
                  >
                    <EditIcon className="text-orange-400 cursor-pointer" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Registered Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={tempValues.phone}
                readOnly
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                placeholder="Add phone number"
              />
            </div>
          </div>
        </div>

        {otpModel && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Emailchange
              email={tempValues.email}
              handleClose={() => setOtpModel(false)}
            />
          </div>
        )}
      </motion.div>

      <SigninModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        label={modalLabel}
        value={modalValue}
      />
      <SupportModal
        open={isSupportModalOpen}
        handleClose={() => setIsSupportModalOpen(false)}
        label={modalLabel}
        value={modalValue}
      />
    </div>
  );
};

export default ProfileTab;
