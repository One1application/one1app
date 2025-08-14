/* eslint-disable no-unused-vars */
import {
  FaHome,
  FaChartBar,
  FaUsers,
  FaCog,
  FaWallet,
  FaSignOutAlt,
  FaHandsHelping,
  FaLink,
  FaBoxOpen,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { HiOutlineCash } from "react-icons/hi";
import logo from "../assets/oneapp.png";
import { ROLES } from "../utils/constant";

export const dashboardConfig = {
  logo: {
    src: logo,
    alt: "Logo",
    title: "MyApp",
  },
  generalItems: [
    {
      label: "Dashboard",
      icon: FaHome,
      path: "/dashboard",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "Creators Report",
      icon: FaChartBar,
      path: "/dashboard/report",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "User Payments",
      icon: HiOutlineCash,
      path: "/dashboard/user-payments",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    // { label: "Statistics", icon: FaChartBar, path: "/statistics", sublabels: [] },
    {
      label: "Admin Access",
      icon: RiAdminFill,
      path: "/dashboard/admin-access",
      sublabels: [],
      roles: [ROLES.SuperAdmin],
    },
    {
      label: "Employees",
      icon: BsPeopleFill,
      path: "/dashboard/employees",
      sublabels: [],
      roles: [ROLES.SuperAdmin],
    },
    {
      label: "Users",
      icon: FaUsers,
      path: "/dashboard/users",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "Transaction Management",
      icon: FaWallet,
      path: "/dashboard/transactions",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "Products",
      icon: FaBoxOpen,
      path: "/dashboard/products",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "One Link",
      icon: FaLink,
      path: "/dashboard/one-link",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "Help",
      icon: FaHandsHelping,
      path: "/dashboard/help",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
    {
      label: "Logout",
      icon: FaSignOutAlt,
      path: "/dashboard/logout",
      sublabels: [],
      roles: [ROLES.Admin, ROLES.SuperAdmin],
    },
  ],
  settingItems: [
    // { label: "Account Setting", icon: FaCog, path: "/account-settings" },
    // { label: "Sign Out", icon: FaSignOutAlt, path: "/sign-out" },
  ],
};
