import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BillingTab = () => {
  const [isBill] = useState(true);
  const navigate = useNavigate();

  const billingHistory = [
    // { id: 1, amount: "Rs 10.00", date: "2024-10-01", status: "Paid" },
    // { id: 2, amount: "Rs 15.00", date: "2024-09-15", status: "Paid" },
    // { id: 3, amount: "Rs 20.00", date: "2024-08-30", status: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="shadow-md rounded-lg p-4 md:p-6 w-full flex flex-col gap-3">
        <h2 className="text-sm md:text-base font-semibold text-orange-500 mb-2">
          Your oneapp subscription
        </h2>
        <hr className="border-gray-600 mb-4" />
        <div className="flex flex-col gap-3 bg-[#1A1D21] shadow-md rounded-lg p-4 md:p-6 w-full">
          <p className="text-sm text-orange-500">
            To ensure that the sales on your products are not interrupted after
            your free-trial ends, subscribe to oneapp today.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="bg-orange-500 text-white rounded-full border border-black text-sm p-2 transition duration-200 hover:bg-orange-700 w-full sm:w-auto"
              onClick={() => navigate("/dashboard/plugin")}
            >
              View all plans
            </button>
            {/* <button className="bg-orange-500 text-white rounded-full text-sm p-2 transition duration-200 w-full sm:w-auto hover:bg-orange-700">
              Buy Plan
            </button> */}
          </div>
        </div>
      </div>

      {/* Billing History Section */}
      {/* <div className="shadow-md rounded-lg p-4 md:p-6 w-full flex flex-col gap-3">
        <h2 className="text-sm md:text-base font-semibold text-orange-500 mb-2">
          Billing history
        </h2>
        <hr className="border-gray-600 mb-4" />
        {isBill ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 bg-white">
              <thead className="bg-orange-500">
                <tr>
                  <th className="border border-gray-300 p-2 text-left text-sm font-semibold">
                    SL
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-semibold">
                    Amount
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="border border-gray-300 p-2 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      Currently nothing to show here
                    </td>
                  </tr>
                ) : (
                  billingHistory.map((bill) => (
                    <tr key={bill.id} className="hover:bg-orange-300">
                      <td className="border border-gray-300 p-2 text-sm">
                        {bill.id}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {bill.amount}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        {bill.date}
                      </td>
                      <td
                        className={`border border-gray-300 p-2 text-sm ${
                          bill.status === "Paid"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {bill.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="text-sm text-gray-600">No billing history yet</span>
        )}
      </div> */}
    </div>
  );
};

export default BillingTab;
