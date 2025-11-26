import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { apiClient } from "../api/axios.config";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { userService } from "../api/user.service";

interface AuthResponse {
    token: string;
    userId: number;
    email: string;
    role: string;
}

export interface IAuthContext {
    userId: string;
    username: string;
    userEmail: string;
    role: string;
    profilePictureUrl: string;
    token: string;
    expiresOn: number;
    register: (u: string, e: string, p: string) => Promise<void>;
    login: (u: string, p: string) => Promise<void>;
    logout: () => void;
    updateSession: (data: { username?: string, userEmail?: string, profilePictureUrl?: string }) => void;
    loginWithToken: (token: string) => void;
}

export const AuthContext = createContext<IAuthContext>({
    userId: "",
    username: "",
    userEmail: "",
    role: "",
    profilePictureUrl: "",
    token: "",
    expiresOn: -1,
    register: async () => { },
    login: async () => { },
    logout: () => { },
    updateSession: () => { },
    loginWithToken: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useLocalStorage("session", "");
    
    const [authData, setAuthData] = useState({
        token: localStorage.getItem("token") || "",
        expiresOn: localStorage.getItem("expiresOn") || ""
    });

    const updateAuthData = (token: string, expiresOn: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("expiresOn", expiresOn);
        setAuthData({ token, expiresOn });
    };

    const updateSession = (newData: any) => {
        try {
            const currentSession = session ? JSON.parse(session) : {};
            const updatedSession = { ...currentSession, ...newData };
            setSession(JSON.stringify(updatedSession));
        } catch (error) {
            console.error("Error updating session", error);
        }
    };

    useEffect(() => {
        const checkUserProfile = async () => {
            if (!session || !authData.token) return;
            try {
                const sess = JSON.parse(session);
                if (sess.userId && !sess.profilePictureUrl) {
                    const userDetails = await userService.getById(sess.userId);
                    if (userDetails.profilePictureUrl) {
                        updateSession({ profilePictureUrl: userDetails.profilePictureUrl });
                    }
                }
            } catch (e) {
                console.error("Error sync profile pic", e);
            }
        };
        checkUserProfile();
    }, [authData.token]);

    const register = async (username: string, email: string, password: string) => {
        const { data } = await apiClient.post<AuthResponse>("/auth/register", { username, email, password });
        setSession(JSON.stringify({ 
            userId: data.userId, 
            username: username, 
            userEmail: data.email,
            role: data.role,
            profilePictureUrl: "" 
        }))
        const newExpiresOn = (new Date().getTime() + 15 * 60 * 1000).toString();
        updateAuthData(data.token, newExpiresOn);
    };

    const login = async (username: string, password: string) => {
        const { data } = await apiClient.post<AuthResponse>("/auth/login", { username, password });
        setSession(JSON.stringify({ 
            userId: data.userId, 
            username: username, 
            userEmail: data.email,
            role: data.role,
            profilePictureUrl: "" 
        }))
        const newExpiresOn = (new Date().getTime() + 15 * 60 * 1000).toString();
        updateAuthData(data.token, newExpiresOn);
    };

    const logout = () => {
        setSession("");
        localStorage.removeItem("token");
        localStorage.removeItem("expiresOn");
        localStorage.removeItem("session");
        setAuthData({ token: "", expiresOn: "" });
    };

    const loginWithToken = (token: string) => {
        const expiresOn = (new Date().getTime() + 15 * 60 * 1000).toString();
        updateAuthData(token, expiresOn);
    };

    const value = useMemo(() => {
        let sess;
        if (session) {
            try { sess = JSON.parse(session); } catch (e) { sess = {}; }
        }

        const token = authData.token || "";
        const isLoggedIn = !!token; 

        return {
            userId: isLoggedIn ? (sess?.userId || "") : "",
            username: isLoggedIn ? (sess?.username || "") : "",
            userEmail: isLoggedIn ? (sess?.userEmail || "") : "",
            role: isLoggedIn ? (sess?.role || "") : "",
            profilePictureUrl: isLoggedIn ? (sess?.profilePictureUrl || "") : "",
            token,
            expiresOn: authData.expiresOn ? parseInt(authData.expiresOn, 10) : -1,
            register,
            login,
            logout,
            updateSession,
            loginWithToken,
        }
    }, [session, authData]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    return useContext(AuthContext);
}