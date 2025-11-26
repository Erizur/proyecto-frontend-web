import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
    const { userId } = useAuth();

    if (!userId) {
        // user is not authenticated
        return <Navigate to="/auth/login" />;
    }

    // user is authenticated show whatever is nested
    return <Outlet />;
};
