import { useState, type SyntheticEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import constants from "../../components/common/constants";
import axios, { AxiosError } from "axios";

export default function Register() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const auth = useAuth();

    const handleRegister = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await auth.register(username, email, password).then(() => { navigate("/", { replace: true }); });
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                switch (err.response?.status) {
                    case 400:
                        setError("Revisa los campos del formulario e intenta de nuevo.");
                        break;
                    default:
                        setError("Ocurrió un error en la red. Intenta de nuevo mas tarde.");
                };
            } else {
                setError("Ocurrió un error inesperado al intentar registrarse. Intenta de nuevo mas tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${constants.API_HOST}/oauth2/authorization/google`;
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-base-100 px-4">
            <div className="card w-full max-w-lg bg-base-100 shadow-xl border border-base-200 rounded-md">
                <div className="card-body p-8">
                    
                    <div className="text-center mb-6">
                        <img src="/artpondo.svg" alt="Artpond" className="h-12 w-12 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold">Únete a Artpond</h2>
                        <p className="text-sm opacity-60">Comparte tu arte con el mundo</p>
                    </div>

                    <button 
                        type="button"
                        onClick={handleGoogleLogin} 
                        className="btn btn-outline w-full gap-3 rounded-md hover:bg-base-200 hover:text-base-content"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="divider text-xs opacity-50 my-6">O REGÍSTRATE CON CORREO</div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="alert alert-error text-sm py-2 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label cursor-pointer pb-1">
                                <span className="label-text font-medium">Nombre de Usuario</span>
                            </label>
                            <input
                                type="text"
                                placeholder="ej. picasso_2025"
                                className="input input-bordered w-full rounded-md"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer pb-1">
                                <span className="label-text font-medium">Correo Electrónico</span>
                            </label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="input input-bordered w-full rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer pb-1">
                                <span className="label-text font-medium">Contraseña</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered w-full rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <label className="label">
                                <span className="label-text-alt opacity-60">Mínimo 8 caracteres. <br/>Debe contener mayúsculas, minúsculas y números.</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full mt-4 rounded-md shadow-sm"
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : 'Crear Cuenta'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/auth/login" className="link link-primary font-bold">
                                Inicia Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};