import toast from "react-hot-toast";
import NoContentComponent from "../../../../components/NoContent/NoContentComponent";
import Table from "../../../../components/Table/TableComponent";
import pagesConfig from "../pagesConfig";
import { useState, useEffect } from "react";
import PaymentGraph from "../../../../components/PaymentGraph/PaymentGraph";
import { Copy, Trash2, X } from "lucide-react";
import {
  fetchAllTelegramData,
  deleteTelegram,
} from "../../../../services/auth/api.services";
import { useNavigate } from "react-router-dom";
import { use } from "react";

const TelegramPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [telegramData, setTelegramData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [telegramToDelete, setTelegramToDelete] = useState(null);
  const navigate = useNavigate();

  const { title, button, bgGradient, noContent, tabs, cardData } =
    pagesConfig.telegramPage;

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev); // Toggle modal state
  };

  const handleSubmit = () => {
    if (!mobileNumber) {
      toast.error("Please enter a mobile number");
      return;
    }

    toast.success("OTP has been sent to your mobile number");
    handleModalToggle();
    setMobileNumber("");
  };

  const getTelegramData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllTelegramData();
      console.log(response);

      setTelegramData(response.data.payload.telegrams);
    } catch (error) {
      console.error("telegram", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (telegram) => {
    setTelegramToDelete(telegram);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!telegramToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTelegram(telegramToDelete.id);
      toast.success("Telegram channel deleted successfully");
      setTelegramData(prev => prev.filter(t => t.id !== telegramToDelete.id));
      setDeleteModalOpen(false);
      setTelegramToDelete(null);
    } catch (error) {
      console.error("Error deleting telegram:", error);
      toast.error("Failed to delete telegram channel");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTelegramToDelete(null);
  };

  useEffect(() => {
    getTelegramData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Telegram Channels
                </h1>
                <p className="text-orange-100 text-lg">
                  Manage your premium Telegram channels and subscriptions
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/app/create-telegram`
                  )
                }
                className=" bg-orange-600 text-white rounded-full text-xs md:text-sm px-4 md:px-6 py-2 transition duration-200 md:w-auto hover:bg-orange-700 fixed z-50 top-4 right-4 md:top-5 md:right-10 flex justify-center items-center gap-1"
                aria-label={button.ariaLabel}
              >
                <button.icon size={20} />
                {button.label}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-8 relative z-10 mb-8">
        <PaymentGraph cardData={cardData} />
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Content Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Telegram Channels
                </h2>
                <div className="text-sm text-gray-500">
                  {telegramData.length} channel{telegramData.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="py-4 flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                  <p className="text-gray-500">Loading your channels...</p>
                </div>
              ) : telegramData.length > 0 ? (
                <div className="w-full">
                  <div className="space-y-4 p-3">
                    {telegramData.map((telegram) => (
                      <div key={telegram.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-lg">
                                {telegram.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{telegram.title}</h3>
                              <p className="text-sm text-gray-500">{telegram.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  {telegram.genre}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {telegram._count?.telegramSubscriptions || 0} subscribers
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/app/telegram?id=${telegram.id}`
                                );
                                toast.success("Link copied to clipboard");
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <Copy className="h-4 w-4 ml-1" />
                            </button>
                            <button
                              onClick={() => navigate(`/app/edit-telegram?telegramId=${telegram.id}`, { state: { data: telegram } })}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(telegram)}
                              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center space-x-1"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12">
                  <NoContentComponent
                    title={noContent[activeTab].title}
                    description={noContent[activeTab].description}
                    isbutton={noContent[activeTab].isButton}
                    button_title={noContent[activeTab].buttonTitle}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {
        deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Telegram Channel</h3>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  Are you sure you want to delete "<span className="font-semibold">{telegramToDelete?.title}</span>"?
                  This action cannot be undone and will permanently remove all associated subscriptions and data.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default TelegramPage;
