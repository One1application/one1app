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
            "Transaction Id",
            "Date & Time",
            "Amount",
            "Email Id",
            "Mobile Number",
            "product",
            "Mode of Payment",
            "Status"
        ],
        tableData: [
                        {
                            "id": "2a184d90-5c40-4b0b-8aec-32627d3120bd",
                            "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
                            "amount": 100,
                            "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
                            "productType": "WEBINAR",
                            "buyerId": "26aa0689-21bc-4959-ac3d-747282944184",
                            "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "modeOfPayment": "CARD",
                            "status": "COMPLETED",
                            "createdAt": "2025-05-12T06:29:17.189Z",
                            "updatedAt": "2025-05-12T06:29:17.189Z"
                        },
                        {
                            "id": "49f26d7f-15bc-46e3-8b7a-758d42e7fdad",
                            "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
                            "amount": 100,
                            "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
                            "productType": "WEBINAR",
                            "buyerId": "26aa0689-21bc-4959-ac3d-747282944184",
                            "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "modeOfPayment": "upi",
                            "status": "success",
                            "createdAt": "2025-05-12T04:46:08.705Z",
                            "updatedAt": "2025-05-12T04:46:08.705Z"
                        },
                        {
                            "id": "65d645eb-387e-4fe0-925f-8038926cf457",
                            "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
                            "amount": 100,
                            "productId": "9d59ce5a-3b22-40ec-ab79-88fcfb02f027",
                            "productType": "PAYING_UP",
                            "buyerId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "modeOfPayment": "NET_BANKING",
                            "status": "COMPLETED",
                            "createdAt": "2025-05-12T17:32:45.224Z",
                            "updatedAt": "2025-05-12T17:32:45.224Z"
                        },
                        {
                            "id": "9cc02694-8a92-401d-8892-31c28792a9c9",
                            "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
                            "amount": 100,
                            "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
                            "productType": "WEBINAR",
                            "buyerId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "modeOfPayment": "CARD",
                            "status": "COMPLETED",
                            "createdAt": "2025-05-12T15:04:21.366Z",
                            "updatedAt": "2025-05-12T15:04:21.366Z"
                        },
                        {
                            "id": "a946fa50-8589-4aaf-a44f-ed7f9c62d701",
                            "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
                            "amount": 100,
                            "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
                            "productType": "WEBINAR",
                            "buyerId": "26aa0689-21bc-4959-ac3d-747282944184",
                            "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
                            "modeOfPayment": "upi",
                            "status": "success",
                            "createdAt": "2025-05-11T16:06:41.954Z",
                            "updatedAt": "2025-05-11T16:06:41.954Z"
                        }
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
