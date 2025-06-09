/* eslint-disable no-unused-vars */
import { FaHome, FaChartBar, FaUsers, FaCog, FaShoppingCart,FaWhatsapp,FaRocketchat,FaWallet, FaCalendarAlt, FaBookOpen, FaLock, FaTelegramPlane, FaDiscord, FaLink } from "react-icons/fa";
import { BsPlugin } from "react-icons/bs";
import logo from '../../assets/oneapp.png';
import { RiPresentationFill } from "react-icons/ri";
import { HiOutlineCash } from "react-icons/hi";
import { PiHandWithdraw } from "react-icons/pi";
import { LiaIdCardSolid } from "react-icons/lia";
import { HelpCircle } from "lucide-react";

export const dashboardConfig = {
  logo: {
    src: logo,
    alt: "Logo",
    title: "MyApp",
  },
  generalItems: [
    { label: "Home", icon: FaHome, path: "/" , sublabels:[] },
    // { label: "One Link", icon: FaLink, path: "/mystore" ,sublabels:[]},
    { label: "Your Customers", icon: FaUsers, path: "/your-customers",sublabels:[] },
    { label: "Wallets", icon: FaWallet, path: "/wallets", sublabels: [
      {label: "Withdrawal Amount", icon: PiHandWithdraw, path: "/withdrawal" },
      {label: "All Transactions", icon: HiOutlineCash, path: "/all-transactions" },
      {label: "KYC Setting", icon: LiaIdCardSolid, path: "/kyc-setting" },
    ] },
    // commented out for now, as we don't have a superlinks dashboard yet
    // { label: "SuperLinks", icon: FaLink, path: "/superlinks" }
  ],
  
  appItems: [
    { label: "Paying Up", icon: FaChartBar, path: "/payingup" },
    // { label: "Appointment", icon: FaCalendarAlt, path: "/appointment" },
    { label: "Webinar", icon: RiPresentationFill, path: "/webinar" },
    { label: "Courses", icon: FaBookOpen, path: "/courses" },
    { label: "Telegram", icon: FaTelegramPlane, path: "/telegram" },
    { label: "Premium Content", icon: FaLock, path: "/premium-content" },
    // { label: "Discord", icon: FaDiscord, path: "/discord" },
    // { label: "Chat", icon: FaRocketchat, path: "/chat" },
    // { label: "WhatsApp", icon: FaWhatsapp, path: "/whatsapp" },
    // { label: "Plugin", icon: BsPlugin, path: "/plugin" },
  ],
  settingItems: [
    { label: "Account Setting", icon: FaCog, path: "/profile" },
    { label: "Help Center" , icon : HelpCircle , path: "/help-center" },
    // commented out for now, as we don't have a superlinks dashboard yet
    // { label: "Feature Requests", icon: FaChartBar, path: "https://www.google.com" },
    // { label: "Help Center", icon: FaUsers, path: "https://www.google.com" },
    { label: "Sign Out", icon: FaCog, path: "/signin" , action: "signout"},
  ]
};
