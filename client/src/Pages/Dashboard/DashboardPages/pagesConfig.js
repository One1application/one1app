import { GoPlus } from "react-icons/go";
import {
  FaCalendarAlt,
  FaDiscord,
  FaLock,
  FaChartBar,
  FaWhatsapp,
} from "react-icons/fa";

export const pagesConfig = {
  webinarPage: {
    title: "Webinar Page",
    button: {
      label: "Create Webinar",
      icon: GoPlus,
      ariaLabel: "Create Webinar",
    },
    bgGradient: "bg-gradient-to-b from-[#ADD8E6] to-[#FFD700]",
    coverImage : "https://media.discordapp.net/attachments/1368862317877530684/1385627622121148569/webinar.png?ex=6856c1c8&is=68557048&hm=31728eb660bf6698b9d827f3bf5c38028f6633de83ef53aa27850eeef21fa819&=&format=webp&quality=lossless&width=1728&height=286" ,
    noContent: [
      {
        title: "No Published webinar yet",
        description:
          "No event yet? No problem! Create a new event now and start generating income.",
        buttonTitle: "Create Webinar",
        isButton: true,
      },
      {
        title: "No unpublished webinar yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No draft webinar yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "0",
        content: [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      {
        title: "Draft webinar",
        value: "0",
        content: [],
      },
      // {
      //   title: "Draft webinar",
      //   value: "0",
      //   content: [],
      // },
    ],
    icon: FaCalendarAlt,
    cardData: [
      { date: "24 Jan", value: "0" },
      { date: "25 Jan", value: "1500" },
      { date: "26 Jan", value: "0" },
      { date: "27 Jan", value: "18000" },
      { date: "28 Jan", value: "0" },
      { date: "29 Jan", value: "0" },
      { date: "30 Jan", value: "300" },
    ],
    path: "/app/create-webinar",
  },

  discordPage: {
    title: "Discord Page",
    button: {
      label: "Create Discord Group",
      icon: GoPlus,
      ariaLabel: "Create Discord Group",
    },
    bgGradient: "bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]",
    noContent: [
      {
        title: "No published discord yet!",
        description:
          "No discord yet? No problem! Create a new discord now and start generating income.",
        buttonTitle: "Create Discord Group",
        isButton: true,
      },
      {
        title: "No unpublished discord yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No draft discord yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "0",
        content: [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      // { title: "Unpublished Discord", value: "1", content: [] },
      { title: "Draft Discord", value: "0", content: [] },
    ],
    icon: FaDiscord,
  
  },

  lockedContentPage: {
    title: "Premium Content",
    button: {
      label: "Create Premium Content",
      icon: GoPlus,
      ariaLabel: "Create Premium Content",
    },
    bgGradient: "bg-gradient-to-b from-[#FFD700] to-[#FF8C00]",
    noContent: [
      {
        title: "No Published Premium Content yet",
        description:
          "No locked content yet? No problem! Create a new locked content now and start generating income.",
        buttonTitle: "Create Premium Content",
        isButton: true,
      },
      {
        title: "No Unpublished Premium Content",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No Draft Premium Content",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "0",
        content: [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      // { title: "Unpublished Locked Items", value: "1", content: [] },
      { title: "Draft Premium Content", value: "2", content: [] },
    ],
    icon: FaLock,
    path: "/app/create-premium-content",
    cardData: [
      { date: "24 Jan", value: "0" },
      { date: "25 Jan", value: "0" },
      { date: "26 Jan", value: "0" },
      { date: "27 Jan", value: "0" },
      { date: "28 Jan", value: "0" },
      { date: "29 Jan", value: "0" },
      { date: "30 Jan", value: "0" },
    ],
  },

  telegramPage: {
    title: "Telegram Page",
    button: {
      label: "Create Telegram",
      icon: GoPlus,
      ariaLabel: "Create Telegram",
    },
    bgGradient: "bg-gradient-to-b from-[#40E0D0] to-[#48D1CC]",
    noContent: [
      {
        title: "No Published telegram yet",
        description:
          "No telegram yet? No problem! Create a new telegram now and start generating income.",
        buttonTitle: "Create Telegram",
        isButton: true,
      },
      {
        title: "No unpublished telegram yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No draft telegram yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "0",
        content: [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      // { title: "Unpublished Telegram", value: "1", content: [] },
      { title: "Draft Telegram", value: "0", content: [] },
    ],
    icon: FaWhatsapp,
    cardData: [
      { date: "24 Jan", value: "0" },
      { date: "25 Jan", value: "0" },
      { date: "26 Jan", value: "0" },
      { date: "27 Jan", value: "0" },
      { date: "28 Jan", value: "0" },
      { date: "29 Jan", value: "0" },
      { date: "30 Jan", value: "0" },
    ],
  },

  payingUp: {
    title: "Paying Up",
    button: {
      label: "Create paying up",
      icon: GoPlus,
      ariaLabel: "Create paying up",
    },
    bgGradient: "bg-gradient-to-b from-[#87CEEB] to-[#4682B4]",
    noContent: [
      {
        title: "No Published paying up yet",
        description:
          "No paying up yet? No problem! Create a new paying up now and start generating income.",
        buttonTitle: "Create paying up",
        isButton: true,
      },
      {
        title: "No unpublished paying up yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No draft paying up yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "1",
        content:  [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      // { title: "Unpublished paying ups", value: "1", content: [] },
      { title: "Draft Paying up", value: "2", content: [] },
    ],
    icon: FaChartBar,
    path: "/app/create-pay-up",
    cardData: [
      { date: "24 Jan", value: "0" },
      { date: "25 Jan", value: "0" },
      { date: "26 Jan", value: "0" },
      { date: "27 Jan", value: "0" },
      { date: "28 Jan", value: "0" },
      { date: "29 Jan", value: "0" },
      { date: "30 Jan", value: "0" },
    ],
  },

  coursesPage: {
    title: "Courses",
    button: {
      label: "Create Course",
      icon: GoPlus,
      ariaLabel: "Create Course",
    },
    bgGradient: "bg-gradient-to-b from-[#8A2BE2] to-[#9370DB]",
    noContent: [
      {
        title: "No Published courses yet!",
        description:
          "No course yet? No problem! Create a new course now and start generating income.",
        buttonTitle: "Create Course",
        isButton: true,
      },
      {
        title: "No unpublished courses yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No draft courses yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "0",
        content: [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      // { title: "Unpublished Courses", value: "1", content: [] },
      { title: "Draft Courses", value: "0", content: [] },
    ],
    icon: GoPlus,
    path: "/app/create-course",
    cardData: [
      { date: "24 Jan", value: "0" },
      { date: "25 Jan", value: "0" },
      { date: "26 Jan", value: "0" },
      { date: "27 Jan", value: "0" },
      { date: "28 Jan", value: "0" },
      { date: "29 Jan", value: "0" },
      { date: "30 Jan", value: "0" },
    ],
  },

  whatsAppPage: {
    title: "WhatsApp Page",
    button: {
      label: "Create WhatsApp",
      icon: GoPlus,
      ariaLabel: "Create WhatsApp",
    },
    bgGradient: "bg-gradient-to-b from-[#075E54] to-[#128C7E]",
    noContent: [
      {
        title: "No Published WhatsApp yet",
        description:
          "No WhatsApp yet? No problem! Create a new WhatsApp now and start generating income.",
        buttonTitle: "Create WhatsApp",
        isButton: true,
      },
      {
        title: "No unpublished WhatsApp yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
      {
        title: "No draft WhatsApp yet!",
        description: "",
        buttonTitle: "",
        isButton: false,
      },
    ],
    tabs: [
      {
        title: "Live",
        value: "0",
        content: [
          { title: "Event 1", price: "Rs 100", sale: 50, revenue: "Rs 5000", paymentEnabled: true, shareLink:"" }
        ],
      },
      // { title: "Unpublished WhatsApp", value: "1", content: [] },
      { title: "Draft WhatsApp", value: "0", content: [] },
    ],
    icon: FaWhatsapp,
    cardData: [
      { date: "24 Jan", value: "36000" },
      { date: "25 Jan", value: "18000" },
      { date: "26 Jan", value: "16000" },
      { date: "27 Jan", value: "19000" },
      { date: "28 Jan", value: "22000" },
      { date: "29 Jan", value: "24000" },
      { date: "30 Jan", value: "21000" },
    ],
  },
};

export default pagesConfig;
