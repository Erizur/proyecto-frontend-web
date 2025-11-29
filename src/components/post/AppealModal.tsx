import { useState } from "react";
import { apiClient } from "../../api/axios.config";

interface AppealModalProps {
    isOpen: boolean;
    onClose: () => void;
    publicationId: number;
}

export default function AppealModal({ isOpen, onClose, publicationId }: AppealModalProps) {
    const [justification, setJustification] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

    const handleSubmit = async () => {
        if (!justification.trim()) return;
        setLoading(true);
        setMessage(null);

        try {
            await apiClient.post('/appeal', {
                publicationId,
                justification
            });
            setMessage({ type: 'success', text: 'Apelación enviada. Un moderador la revisará pronto.' });
            setTimeout(() => {
                onClose();
                setMessage(null);
                setJustification("");
            }, 2000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || "Error al enviar la apelación." });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-base-100 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="font-bold text-lg mb-2">Apelar etiqueta de IA</h3>
                <p className="text-sm opacity-70 mb-4">
                    Si crees que tu obra ha sido marcada incorrectamente como Inteligencia Artificial, 
                    explícanos por qué (puedes incluir links a timelapses o sketches).
                </p>

                {message && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2 mb-4`}>
                        {message.text}
                    </div>
                )}

                <textarea 
                    className="textarea textarea-bordered w-full h-32 mb-4"
                    placeholder="Describe tu proceso o provee pruebas..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                ></textarea>

                <div className="flex justify-end gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancelar</button>
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={handleSubmit}
                        disabled={loading || !justification.trim()}
                    >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Enviar Apelación'}
                    </button>
                </div>
            </div>
        </div>
    );
}