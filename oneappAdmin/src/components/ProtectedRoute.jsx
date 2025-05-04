import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ROLES } from "../utils/constant";
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuthStore();

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute