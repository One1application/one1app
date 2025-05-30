import { useState, useEffect } from "react";
import NoAudienceComponent from "../../../../components/NoContent/NoAudienceComponent";
import yourCustomerConfig from "./yourCustomerConfig";
import AudienceTableComponent from "../../../../components/Table/AudienceTableComponent";
import { PiUsers } from "react-icons/pi"; // Added for user icon
import { fetchCustomers } from "../../../../services/auth/api.services";
import { useAuth } from "../../../../context/AuthContext";

const AudiencePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    customers,
    updateCustomers,
    currentPage,
    setCurrentPage,
    hasMore,
    setHasMore,
  } = useAuth();

  const currentTab = yourCustomerConfig.tabs[activeTab];

  // Modified fetch function to handle pagination
  const fetchCustomerData = async (page) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetchCustomers(page);
      if (response.data.success) {
        const formattedCustomers = response.data.customers.map(
          (customer, idx) => ({
            name: customer.name || "N/A",
            email: customer.email || "N/A",
            phone: customer.phone || "N/A",
            purchasedProducts: customer.product ? [customer.product] : [],
            amountSpent: customer.amountSpent || 0,
            activeSubscriptions:
              typeof customer.activeSubscriptions === "boolean"
                ? customer.activeSubscriptions
                  ? "Yes"
                  : "No"
                : customer.activeSubscriptions || "No",
            rawData: customer,
          })
        );

        console.log("formattedCustomer", formattedCustomers);

        // Update context with new customers
        updateCustomers(formattedCustomers);

        // Check if we have more data to load
        setHasMore(formattedCustomers.length === 20);

        // Update tab content with total customers count
        yourCustomerConfig.tabs.forEach((tab, index) => {
          if (index === 0) {
            tab.value = customers.length + formattedCustomers.length;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomerData(1);
    }
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCustomerData(nextPage);
  };

  return (
    <div className="p-6 space-y-6 bg-[#0F1418] min-h-screen">
      {/* Header Section - Styled like AllTransactionsPage */}
      <section className="flex justify-between items-center bg-[#1A1D21] p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex items-center space-x-2">
          <PiUsers className="text-orange-600 h-6 w-6" />
          <h1 className="text-lg font-semibold text-white">
            {yourCustomerConfig.title}
          </h1>
        </div>
      </section>

      {/* Tabs - Restyled to match dark theme */}
      <div className="flex justify-start items-center gap-4 px-4">
        {yourCustomerConfig.tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`cursor-pointer rounded-full text-xs md:text-sm px-4 py-2 transition duration-200 
              ${
                activeTab === index
                  ? "bg-orange-600 text-white"
                  : "bg-[#1A1D21] text-gray-300 hover:bg-[#252A2E] border border-gray-700"
              }`}
          >
            {tab.title} ({tab.value})
          </div>
        ))}
      </div>

      {/* Content Section - Styled like AllTransactionsPage */}
      <section className="bg-[#1A1D21] rounded-lg border border-gray-700">
        <div className="p-6 h-full w-full">
          {customers.length > 0 ? (
            <>
              <AudienceTableComponent data={customers} className="text-white" />
              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full text-white 
                      ${
                        loading
                          ? "bg-gray-600"
                          : "bg-orange-600 hover:bg-orange-700"
                      }
                      transition duration-200`}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : loading ? (
            <div className="text-white text-center py-10">
              Loading customers...
            </div>
          ) : (
            <NoAudienceComponent
              title={
                yourCustomerConfig.noContentData[currentTab.title.toLowerCase()]
                  .title
              }
              description={
                Array.isArray(
                  yourCustomerConfig.noContentData[
                    currentTab.title.toLowerCase()
                  ].description
                )
                  ? yourCustomerConfig.noContentData[
                      currentTab.title.toLowerCase()
                    ].description
                  : [
                      yourCustomerConfig.noContentData[
                        currentTab.title.toLowerCase()
                      ].description,
                    ]
              }
              buttonTitle={
                yourCustomerConfig.noContentData[currentTab.title.toLowerCase()]
                  .buttonTitle
              }
              className="text-white"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AudiencePage;
