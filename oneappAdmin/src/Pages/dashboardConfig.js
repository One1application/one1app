/* eslint-disable no-unused-vars */
import { FaHome, FaChartBar, FaUsers, FaCog, FaWallet, FaSignOutAlt, FaHandsHelping, FaLink, FaBoxOpen } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { HiOutlineCash } from "react-icons/hi";
import logo from '../assets/oneapp.png';

export const dashboardConfig = {
  logo: {
    src: logo,
    alt: "Logo",
    title: "MyApp",
  },
  generalItems: [
    { label: "Dashboard", icon: FaHome, path: "/dashboard", sublabels: [] },
    { label: "Report", icon: FaChartBar, path: "/dashboard/report", sublabels: [] },
    { label: "User Payments", icon: HiOutlineCash, path: "/dashboard/user-payments", sublabels: [] },
    // { label: "Statistics", icon: FaChartBar, path: "/statistics", sublabels: [] },
    { label: "Admin Access", icon: RiAdminFill, path: "/dashboard/admin-access", sublabels: [] },
    { label: "Employees", icon: BsPeopleFill, path: "/dashboard/employees", sublabels: [] },
    { label: "Users", icon: FaUsers, path: "/dashboard/users", sublabels: [] },
    { label: "Wallet", icon: FaWallet, path: "/dashboard/wallet", sublabels: [] },
    { label: "Products", icon: FaBoxOpen, path: "/dashboard/products", sublabels: [] },
    { label: "One Link", icon: FaLink, path: "/dashboard/one-link", sublabels: [] },
    { label: "Help", icon: FaHandsHelping, path: "/dashboard/help", sublabels: [] },
    { label: "Logout", icon: FaSignOutAlt, path: "/dashboard/logout", sublabels: [] },
  ],
  settingItems: [
    // { label: "Account Setting", icon: FaCog, path: "/account-settings" },
    // { label: "Sign Out", icon: FaSignOutAlt, path: "/sign-out" },
  ]
};
