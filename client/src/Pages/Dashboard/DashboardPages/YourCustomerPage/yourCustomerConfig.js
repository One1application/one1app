const yourCustomerConfig = {
  title: "Your Customer Page",
  tabs: [
    {
      title: "Customers",
      value: 2,
      content: [
        {
          name: "John Doe",
          email: "johndoe@example.com",
          phone: "123-456-7890",
          purchasedProducts: ["Product A", "Product B"],
          amountSpent: "Rs 500",
          activeSubscriptions: "2",
          path: ""
        },
        {
          name: "Jane Smith",
          email: "janesmith@example.com",
          phone: "987-654-3210",
          purchasedProducts: ["Product C"],
          amountSpent: "Rs 300",
          activeSubscriptions: "1",
          path: ""
        },
      ],
    },
    // {
    //   title: "Followers",
    //   value: 0,
    //   content: [],
    // },
  ],
  noContentData: {
    customers: {
      title: "One place to view, manage, and know your customers",
      description: [
        "Find customers giving you the maximum revenue",
        "Assess the best performing marketing campaigns",
        "Filter out the customers whose subscriptions are ending in a click",
      ],
      buttonTitle: "Watch how it works",
    },
    followers: {
      title: "Build your own audience with followers on OneApp",
      description: [
        "Visitors to your oneapp can now follow you for email or SMS updates",
        "Export your follower list with ease to send out emails or WhatsApp messages",
        "Easily convert your followers into paid customers and track conversion",
      ],
      buttonTitle: "Enable followers",
    },
  },
};

export default yourCustomerConfig;
