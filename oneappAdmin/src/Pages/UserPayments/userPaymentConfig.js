export const userPaymentConfig = {
  title: "User Payments",
  tableHeader: [
    { key: "AmountPaid", label: "Amount Paid" },
    { key: "PaymentMethod", label: "Payment Method" },
    { key: "CreatorsID", label: "Creator's ID" },
    { key: "ProductID", label: "Product ID" },
    { key: "ProductType", label: "Product Type" },
    { key: "UserNumber", label: "User Phone" },
    { key: "UserEmailID", label: "User Email" },
    { key: "Status", label: "Status" },
  ],
  config: {
    AmountPaid: (value) => `₹${value.toFixed(2)}`,
    PaymentMethod: (value) => value || "N/A",
    CreatorsID: (value) => value || "N/A",
    ProductID: (value) => value || "N/A",
    ProductType: (value) => value || "N/A",
    UserNumber: (value) => value || "N/A",
    UserEmailID: (value) => value || "N/A",
    Status: (value) => (value === "SUCCESS" ? "Completed" : "Pending"),
  },
};
