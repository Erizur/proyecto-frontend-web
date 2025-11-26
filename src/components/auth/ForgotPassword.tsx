import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../api/auth.service";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await authService.forgotPassword(email);
            // Mensaje de éxito seguro (incluso si el correo no existe, para no revelar usuarios)
            setMessage({ 
                type: 'success', 
                text: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.' 
            });
        } catch (error) {
            console.error(error);
            setMessage({ 
                type: 'error', 
                text: 'Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-base-100 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Recuperar Contraseña</h2>
                        <p className="text-sm opacity-60 mt-2">
                            Ingresa tu correo y te enviaremos un enlace para volver a entrar.
                        </p>
                    </div>

                    {message && (
                        <div role="alert" className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2 mb-4`}>
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label cursor-pointer pb-1">
                                <span className="label-text font-medium">Correo Electrónico</span>
                            </label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="input input-bordered w-full focus:input-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full"
                            disabled={loading || message?.type === 'success'}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : 'Enviar Enlace'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link to="/auth/login" className="link link-hover text-sm">
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}