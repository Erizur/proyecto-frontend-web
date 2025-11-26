import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function OAuth2Redirect() {
    const [searchParams] = useSearchParams();
    const { loginWithToken } = useAuth(); // Necesitaremos agregar esto al hook
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            // Guardamos el token y redirigimos
            loginWithToken(token);
            navigate("/", { replace: true });
        } else {
            navigate("/auth/login");
        }
    }, [searchParams, loginWithToken, navigate]);

    return <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>;
}