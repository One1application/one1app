import { Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/Dashboard";
import Home from './Pages/Home/HomePage';
import LoginPage from './Pages/Login/LoginPage';
import { useEffect } from "react";
import { selfIdentification } from "./services/api-service";
import { useAuthStore } from "./store/authStore";
import FullScreenLoader from "./components/FullScreenLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportPage from "./Pages/Reports/ReportPage";
import UserPaymentsPage from "./Pages/UserPayments/UserPaymentsPage";
import StatisticsPage from "./Pages/Statistics/StatisticsPage";
import AdminAccessPage from "./Pages/AdminAccess/AdminAccessPage";
import EmployeesPage from "./Pages/Employees/EmployeesPage";
import UsersPage from "./Pages/Users/UsersPage";
import ProductsPage from "./Pages/Products/ProductsPage";
import OneLinkPage from "./Pages/OneLink/OneLinkPage";
import HelpPage from "./Pages/Help/HelpPage";
import LogoutPage from "./Pages/Logout/LogoutPage";
import { ROLES } from "./utils/constant";
import TransactionPage from "./Pages/TransactionManagement/TransactionPage";



const dashboardRoutesConfig = [
  {
    path: "/dashboard/report",
    element: <ReportPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/user-payments",
    element: <UserPaymentsPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/statistics",
    element: <StatisticsPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/admin-access",
    element: <AdminAccessPage />,
    roles: [ROLES.SuperAdmin], // Restricted to SuperAdmin
  },
  {
    path: "/dashboard/employees",
    element: <EmployeesPage />,
    roles: [ROLES.SuperAdmin], // Restricted to SuperAdmin
  },
  {
    path: "/dashboard/users",
    element: <UsersPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/transactions",
    element: <TransactionPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/products",
    element: <ProductsPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/one-link",
    element: <OneLinkPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/help",
    element: <HelpPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
  {
    path: "/dashboard/logout",
    element: <LogoutPage />,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
];

const App = () => {
  const navigate = useNavigate()
  const { isloading, setUser, setLoading } = useAuthStore()
  const getSelfDetails = async () => {

    setLoading(true)
    try {
      const data = await selfIdentification()
      if (data.success === true) {
        setUser(data.userDetails)
        navigate("/dashboard")
      } else {
        navigate('/')
      }

    } catch (error) {
      console.log("ERRROR", error);

    } finally {
      setLoading(false)
    }

  }
  useEffect(() => {
    getSelfDetails()
  }, [])
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isloading && <FullScreenLoader />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          {dashboardRoutesConfig.map(({ path, element, roles }, index) => (
            <Route
              key={index}
              path={path}
              element={
                roles?.length > 0 ? (
                  <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default App;
