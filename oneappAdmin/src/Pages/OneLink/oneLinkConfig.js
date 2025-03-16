export const oneLinkConfig = {
    title: "One Link Data",
    buttonTitle: "ADD USER",
    tableHeader: [
      "ID",
      "Name",
      "Email",
      "Phone",
      "One Link Profile",
      "Chat Bot Data",
      "Subscription",
      "Non Subscription",
      "Free Trail",
      "Coupon Code",
    ],
    tableData: [
      {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+91992456789",
        oneLinkProfile: [
          { platform: "link", link: "https://facebook.com/johndoe" },
          { platform: "instagram", link: "https://www.instagram.com/johndoe/" },
        ],
        chatBotData: "Instagram Creator",
        subscription: "Monthly",
        nonSubscription: "Non Applicable",
        freeTrail: "Expired",
        couponCode: "ONEAPP100",
      },
      {
        id:2,
        name: "Jane Smith",
        email: "janesmith@example.com",
        phone: "+91887654321",
        oneLinkProfile: [
          { platform: "link", link: "https://twitter.com/janesmith" },
        ],
        chatBotData: "Twitter Creator",
        subscription: "Yearly",
        nonSubscription: "Non Applicable",
        freeTrail: "Expired",
        couponCode: "ONEAPP100",
      }
    ],
    config: {
      fields: [
        "id",
        "name",
        "email",
        "phone",
        "oneLinkProfile",
        "chatBotData",
        "subscription",
        "nonSubscription",
        "freeTrail",
        "couponCode",
      ],
    }
  };
  