import { useState, type SyntheticEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const auth = useAuth();

    const handleLogin = (e: SyntheticEvent) => {
        e.preventDefault();

        setError("");
        auth.register(username, email, password).then(() => {
            navigate("/", { replace: true })
        }).catch((err: Error) => {
            setError(err.message);
        });
    };
    return (
        <div className="flex items-center justify-center">
            <form className="bg-white p-8 rounded-lg shadow-md" onSubmit={handleLogin}>
                {error && <div className="p-3">
                    <p className="text-red-300">{error}</p>
                </div>}
                <div className="p-3">
                    <label className="input">
                        <span className="label">Username:</span>
                        <input
                            id="username"
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                </div>
                <div className="p-3">
                    <label className="input">
                        <span className="label">Email:</span>
                        <input
                            id="email"
                            type="text"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                </div>
                <div className="p-3">
                    <label className="input">
                        <span className="label">Password:</span>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                </div>
                <div className="p-3">
                    <button type="submit" className="btn btn-primary">Register</button>
                </div>
                <div className="p-3">
                    <p className="text-accent">If you are already registered, you can sign in <Link to="/auth/login" className="link">here</Link></p>
                </div>
            </form>
        </div>
    );
};
