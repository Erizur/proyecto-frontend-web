import { useState, type SyntheticEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../../api/auth.service";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get("token"); // Obtenemos el token de la URL
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!token) {
            setError("Token inválido o expirado");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);
            // Redirigir al login después de 3 segundos
            setTimeout(() => navigate("/auth/login"), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "El enlace ha expirado o es inválido.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-error">Enlace inválido</h2>
                    <p className="mb-4">Falta el token de seguridad.</p>
                    <Link to="/auth/login" className="btn btn-primary btn-sm">Ir al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-base-100 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Nueva Contraseña</h2>
                        <p className="text-sm opacity-60 mt-2">Ingresa tu nueva contraseña segura</p>
                    </div>

                    {success ? (
                        <div className="alert alert-success">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                                <h3 className="font-bold">¡Contraseña actualizada!</h3>
                                <div className="text-xs">Redirigiendo al login...</div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="alert alert-error text-sm py-2">
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label pb-1"><span className="label-text">Nueva contraseña</span></label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pb-1"><span className="label-text">Confirmar contraseña</span></label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-full mt-2"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Cambiar Contraseña'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}