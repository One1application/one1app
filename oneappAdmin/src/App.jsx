import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/Dashboard";
import ReportPage from "./Pages/Reports/ReportPage";
import Home from './Pages/Home/HomePage';
import UserPaymentsPage from './Pages/UserPayments/UserPaymentsPage';
import StatisticsPage from './Pages/Statistics/StatisticsPage';
import AdminAccessPage from './Pages/AdminAccess/AdminAccessPage';
import EmployeesPage from './Pages/Employees/EmployeesPage';
import UsersPage from './Pages/Users/UsersPage';
import WalletPage from './Pages/Wallet/WalletPage';
import ProductsPage from './Pages/Products/ProductsPage';
import OneLinkPage from './Pages/OneLink/OneLinkPage';
import HelpPage from './Pages/Help/HelpPage';
import LogoutPage from "./Pages/Logout/LogoutPage";
import LoginPage from './Pages/Login/LoginPage';

const App = () => {
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

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="/dashboard/report" element={<ReportPage />} />
          <Route path="/dashboard/user-payments" element={<UserPaymentsPage />} />
          <Route path="/dashboard/statistics" element={<StatisticsPage />} />
          <Route path="/dashboard/admin-access" element={<AdminAccessPage />} />
          <Route path="/dashboard/employees" element={<EmployeesPage />} />
          <Route path="/dashboard/users" element={<UsersPage />} />
          <Route path="/dashboard/wallet" element={<WalletPage />} />
          <Route path="/dashboard/products" element={<ProductsPage />} />
          <Route path="/dashboard/one-link" element={<OneLinkPage />} />
          <Route path="/dashboard/help" element={<HelpPage />} />
          <Route path="/dashboard/logout" element={<LogoutPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
