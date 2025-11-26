import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        console.debug("Logging out user");
        logout();

        // this will navigate to the main page, and because the main page is protected
        // it will redirect to the login
        console.debug("Redirecting to main page");
        navigate("/auth/login", { replace: true });
    }, [])

    return (
        <div>
            Logging out...
        </div>
    );
};
