import { Toaster } from "react-hot-toast";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AuthenticatedRoutes from "./components/AuthenticatedRoutes/AuthenticatedRoutes";
import { useAuth } from "./context/AuthContext.jsx";
import SignInPage from "./Pages/Authentication/SigninPage/SignInPage";
import SignUpPage from "./Pages/Authentication/SignupPage/SignUpPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import AppointementPage from "./Pages/Dashboard/DashboardPages/AppointementPage/AppointementPage.jsx";
import ChatPage from "./Pages/Dashboard/DashboardPages/ChatPage/ChatPage.jsx";
import CoursesPage from "./Pages/Dashboard/DashboardPages/CoursesPage/CoursesPage.jsx";
import CreateCoursePage from "./Pages/Dashboard/DashboardPages/CoursesPage/CreateCoursePage.jsx";
import LessonsPage from "./Pages/Dashboard/DashboardPages/CoursesPage/LessonsPage.jsx";
import NewCourse from "./Pages/Dashboard/DashboardPages/CoursesPage/NewCourse.jsx";
import DiscordPage from "./Pages/Dashboard/DashboardPages/DiscordPage/DiscordPage.jsx";
import HomePage from "./Pages/Dashboard/DashboardPages/HomePage/HomePage.jsx";
import CreateLockedContentPage from "./Pages/Dashboard/DashboardPages/LockedContentPage/CreateLockedContentPage.jsx";
import LockedContentPage from "./Pages/Dashboard/DashboardPages/LockedContentPage/LockedContentPage.jsx";
import MyStorePage from "./Pages/Dashboard/DashboardPages/MyStorePage/MyStorePage.jsx";
import CreatePayUp from "./Pages/Dashboard/DashboardPages/PayingUpPage/CreatePayUp.jsx";
import PayingUpPage from "./Pages/Dashboard/DashboardPages/PayingUpPage/PayingUpPage.jsx";
import PayingUpPages from "./Pages/Dashboard/DashboardPages/PayingUpPage/PayingUpPages.jsx";
import PluginPage from "./Pages/Dashboard/DashboardPages/PluginPage/PluginPage.jsx";
import ProfilePage from "./Pages/Dashboard/DashboardPages/ProfilePage/ProfilePage.jsx";
import SuperLinkPage from "./Pages/Dashboard/DashboardPages/SuperLinkPage/SuperLinkPage.jsx";
import TelegramForm from "./Pages/Dashboard/DashboardPages/TelegramPage/TelegramForm";
import TelegramFormPrev from "./Pages/Dashboard/DashboardPages/TelegramPage/TelegramFormPrev";
import TelegramPage from "./Pages/Dashboard/DashboardPages/TelegramPage/TelegramPage.jsx";
import AllTransactionsPage from "./Pages/Dashboard/DashboardPages/WalletPage/SubWalletPages/AllTransactionsPage";
import KYCpage from "./Pages/Dashboard/DashboardPages/WalletPage/SubWalletPages/KYCpage";
import WithdrawalPage from "./Pages/Dashboard/DashboardPages/WalletPage/SubWalletPages/WithdrawalPage";
import WalletPage from "./Pages/Dashboard/DashboardPages/WalletPage/WalletPage.jsx";
import CreateWebinarPage from "./Pages/Dashboard/DashboardPages/WebinarPage/CreateWebinarPage.jsx";
import WebinarPage from "./Pages/Dashboard/DashboardPages/WebinarPage/WebinarPage.jsx";
import WebinarPages from "./Pages/Dashboard/DashboardPages/WebinarPage/WebinarPages";
import WhatsAppPage from "./Pages/Dashboard/DashboardPages/WhatsAppPage/WhatsAppPage.jsx";
import AudiencePage from "./Pages/Dashboard/DashboardPages/YourCustomerPage/YourCustomerPage.jsx";
import PaymentPage from "./Pages/payment/page.jsx";
import AboutUsPage from "./Pages/Welcome/AboutUsPage/AboutUsPage.jsx";
import ContactUsPage from "./Pages/Welcome/ContactUsPage/ContactUsPage.jsx";
import HiringPage from "./Pages/Welcome/HiringPage/HiringPage.jsx";
import HomePages from "./Pages/Welcome/HomePage/HomePages.jsx";
import PluginsPage from "./Pages/Welcome/PlugIns/PluginsPage.jsx";
import TelegramsPages from "./Pages/Welcome/Telegrams/TelegramsPages.jsx";
import Disclaimer from "./Pages/Welcome/Terms&Policy/Disclaimer.jsx";
import PrivacyPolicy from "./Pages/Welcome/Terms&Policy/PrivacyPolicy.jsx";
import TermCondition from "./Pages/Welcome/Terms&Policy/TermCondition.jsx";
import LockedContentDisplayPage from "./Pages/Dashboard/DashboardPages/LockedContentPage/LockedContentDisplayPage.jsx";
import Unsubscribe from "./components/Unsubscribe/Unsubscribe.jsx";

const App = () => {
  const { userRole, authenticated, logout, loading } = useAuth();

  return (
    <>
      <Toaster reverseOrder={false} />

      <Routes>
        {/* Welcome Page */}
        <Route
          path="/"
          element={
            authenticated && userRole === "Creator" ? (
              <Navigate to="/dashboard" />
            ) : (
              <HomePages />
            )
          }
        />
        <Route path="plugins" element={<PluginsPage />} />
        <Route path="TelegramsPages" element={<TelegramsPages />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/hiring" element={<HiringPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/publicpolicy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        {/* <Route path="/refund-cancellation" element={<RefundCancellation />} /> */}
        <Route path="/TermCondition" element={<TermCondition />} />
        <Route path="/payment/verify" element={<PaymentPage />} />
        {/* Authentication Pages */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/" element={<AuthenticatedRoutes />}>
          {/* Dashboard Pages */}
          <Route path="dashboard" element={<DashboardPage />}>
            <Route path="" element={<HomePage />} />
            <Route path="mystore" element={<MyStorePage />} />
            <Route path="your-customers" element={<AudiencePage />} />
            <Route path="wallets" element={<WalletPage />} />
            <Route path="payingup" element={<PayingUpPage />} />
            <Route path="appointment" element={<AppointementPage />} />
            <Route path="webinar" element={<WebinarPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="telegram" element={<TelegramPage />} />
            <Route path="discord" element={<DiscordPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="superlinks" element={<SuperLinkPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="whatsapp" element={<WhatsAppPage />} />
            <Route path="plugin" element={<PluginPage />} />
            <Route path="withdrawal" element={<WithdrawalPage />} />
            <Route path="all-transactions" element={<AllTransactionsPage />} />
            <Route path="kyc-setting" element={<KYCpage />} />
            <Route path="premium-content" element={<LockedContentPage />} />
          </Route>

          {/* Sub-Pages for App-Specific Routes */}
          <Route path="app" element={<Outlet />}>
            <Route path="create-webinar" element={<CreateWebinarPage />} />
            <Route path="create-course" element={<CreateCoursePage />} />
            <Route path="create-pay-up" element={<CreatePayUp />} />
            <Route path="create-telegram" element={<TelegramForm />} />
            <Route
              path="create-premium-content"
              element={<CreateLockedContentPage />}
            />

            <Route path="edit-course" element={<CreateCoursePage />} />
            <Route path="edit-webinar" element={<CreateWebinarPage />} />
            <Route path="edit-payingup" element={<CreatePayUp />} />
          </Route>
        </Route>

        {/* </Route> */}
        <Route path="app" element={<Outlet />}>
          <Route path="paying-up" element={<PayingUpPages />} />
          <Route path="course" element={<NewCourse />} />
          <Route path="webinar" element={<WebinarPages />} />
          <Route path="telegram" element={<TelegramFormPrev />} />
          <Route
            path="premium-content"
            element={<LockedContentDisplayPage />}
          />

          <Route path="course/lessons" element={<LessonsPage />} />
        </Route>
        <Route path="/unsubscribe/:email" element={<Unsubscribe/>} />
      </Routes>
    
    </>
  );
};

export default App;
