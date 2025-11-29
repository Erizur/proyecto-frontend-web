import { AxiosError } from "axios";

interface ErrorMessageProps {
    message?: string;
    errorObject?: unknown;
    onRetry?: () => void;
}

export default function ErrorMessage({ message, errorObject, onRetry }: ErrorMessageProps) {
    let title = "Ocurrió un error";
    let detail = message || "Algo salió mal. Por favor intenta de nuevo.";
    let isWarning = false;

    // Lógica para detectar tipos de error
    if (errorObject instanceof AxiosError) {
        if (errorObject.response) {
            const status = errorObject.response.status;
            const data = errorObject.response.data;

            if (status >= 400 && status < 500) {
                // Errores 4xx (Cliente/Validación)
                isWarning = true; // Amarillo/Naranja en lugar de Rojo
                title = "No se pudo completar la acción";
                
                // Intentar extraer mensaje del backend (ApiErrorDto)
                detail = data?.message || data?.error || detail;

                // Si hay errores de validación específicos
                if (data?.validationErrors) {
                    const validations = Object.values(data.validationErrors).join(". ");
                    detail = `${detail}: ${validations}`;
                }
            } else if (status >= 500) {
                // Errores 5xx (Servidor)
                title = "Error del Servidor";
                detail = "Nuestros servidores tienen problemas. El equipo técnico ha sido notificado.";
            }
        } else if (errorObject.request) {
            title = "Problema de Conexión";
            detail = "No pudimos contactar con el servidor. Revisa tu internet.";
        }
    }

    return (
        <div className={`alert ${isWarning ? 'alert-warning' : 'alert-error'} shadow-lg my-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isWarning ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
            </svg>
            <div>
                <h3 className="font-bold">{title}</h3>
                <div className="text-xs">{detail}</div>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-sm btn-ghost">
                    Reintentar
                </button>
            )}
        </div>
    );
}