export const walletConfig = {
    allWithdrawalPage: {
        title: "All Withdrawal Amounts",
        tableHeader: [
            "Date & Time",
            "Amount",
            "Mode of Withdrawal",
            "Status"
        ],
        tableData: [
            ["2022-01-01 10:00 AM", "500", "0000@ylb", "Success"],
            ["2022-01-02 11:30 AM", "1000", "0000@jkl", "Pending"]
        ]
        
    },
    allTransactionsPage:{
        title: "All Transactions",
        tableHeader: [
            "Sl No.",
            "Date & Time",
            "Amount",
            "Email Id",
            "Mobile Number",
            "product",
            "Mode of Payment",
            "Status"
        ],
        tableData: [
            [1, "2022-01-01 10:00 AM", "500", "john@example.com", "1234567890", "Product A", "Credit Card", "Success"],
            [2, "2022-01-02 11:30 AM", "1000", "jane@example.com", "9876543210", "Product B", "PayPal", "Failed"],
            [3, "2022-01-03 12:45 PM", "750", "manish@example.com", "9876543210", "Product C", "Google Pay", "Pending"],
        ]
    },
    walletPage:{
        amount: "12538",
        updatedAt: "2022-01-03 12:45 PM",
        bankMethods: [
            {
                label: "Add UPI ID",
                value: "UPI",
            },
            {
                label: "Add Bank Account",
                value: "Bank",
            },
            {
                label: "Add MPIN",
                value: "MPIN",
            }
        ],
        withDrawalMode: [
            {   
                label: "UPI",
                value: "12345@axl"
            },
            {
                label: "Bank",
                value: "1234567890"
            }
        ],
        totalEarnings: "1684580",
        totalWithDrawals: "125382",
        KYCStatus: false,
        recentWithdrawals: [
            {
                status: "paid",
                date: "2022-01-01 10:00 AM",
                amount: "500",
            },
            {
                status: "paid",
                date: "2022-01-02 11:30 AM",
                amount: "1000"
            },
            {
                status: "paid",
                date: "2022-01-02 1:30 AM",
                amount: "2000"
            },
            {
                status: "decline",
                date: "2022-01-02 2:30 AM",
                amount: "3000"
            },
            {
                status: "paid",
                date: "2022-01-02 5:30 AM",
                amount: "5000"
            },
            {
                status: "decline",
                date: "2022-01-02 5:30 AM",
                amount: "5000"
            },
            {
                date: "2022-01-02 5:30 AM",
                amount: "5000"
            },
        ],
        allTransactions: {
            tableHeader: [
                "Sl No.",
                "Date & Time",
                "Amount",
                "Email Id",
                "Mobile Number",
                "product",
                "Mode of Payment",
                "Status"
            ],
            tableData: [
                [1, "2022-01-01 10:00 AM", "500", "john@example.com", "1234567890", "Product A", "Credit Card", "Success"],
                [2, "2022-01-02 11:30 AM", "1000", "jane@example.com", "9876543210", "Product B", "PayPal", "Failed"],
                [3, "2022-01-03 12:45 PM", "750", "manish@example.com", "9876543210", "Product C", "Google Pay", "Pending"],
            ]
        }
    }
}
