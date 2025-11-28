import { useState } from "react";
import { reportService } from "../api/report.service";
import type { ReportReason } from "../types/report.types";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    publicationId?: number; // Opcional, podría reportar usuario en el futuro
    reportedUserId?: number;
}

export default function ReportModal({ isOpen, onClose, publicationId, reportedUserId }: ReportModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Estado adicional para detalles si es 'OTHER' o para dar contexto
    const [details, setDetails] = useState("");
    const [showDetailsInput, setShowDetailsInput] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);

    const reasons: { value: ReportReason; label: string }[] = [
        { value: 'SPAM', label: 'Es spam' },
        { value: 'INAPPROPRIATE_CONTENT', label: 'Contenido inapropiado o explícito no marcado' },
        { value: 'COPYRIGHT', label: 'Infringe derechos de autor (Plagio)' },
        { value: 'HARASSMENT', label: 'Acoso o incitación al odio' },
        { value: 'UNMARKED_AI', label: 'Contenido generado por IA no etiquetado' },
        { value: 'OTHER', label: 'Otro problema' }
    ];

    const handleSubmit = async (reason: ReportReason) => {
        if (reason === 'OTHER' && !showDetailsInput) {
            setSelectedReason(reason);
            setShowDetailsInput(true);
            return;
        }
        
        if (reason === 'OTHER' && !details.trim()) {
            setError("Por favor describe el problema.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await reportService.create({
                publicationId,
                reportedUserId,
                reason,
                details: details || undefined
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setDetails("");
                setShowDetailsInput(false);
                onClose();
            }, 2000);
        } catch (err: any) {
            console.error("Error reporting:", err);
            setError("No se pudo enviar el reporte. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-base-100 rounded-xl max-w-md w-full p-6 shadow-2xl border border-base-200 transform transition-all">
                
                {success ? (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="font-bold text-xl mb-2">Reporte enviado</h3>
                        <p className="text-sm opacity-70">Gracias por ayudarnos a mantener segura la comunidad.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Reportar Contenido</h3>
                            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </div>

                        <p className="text-sm opacity-70 mb-6">
                            Si crees que este contenido infringe nuestras normas, por favor selecciona una razón.
                        </p>
                        
                        {error && (
                            <div className="alert alert-error text-sm py-2 mb-4 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {!showDetailsInput ? (
                            <div className="space-y-2">
                                {reasons.map((r) => (
                                    <button 
                                        key={r.value}
                                        className="btn btn-outline btn-sm justify-start w-full font-normal hover:bg-error hover:text-white hover:border-error transition-colors text-left"
                                        onClick={() => handleSubmit(r.value)}
                                        disabled={loading}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <label className="label">
                                    <span className="label-text font-bold">Cuéntanos más detalles</span>
                                </label>
                                <textarea 
                                    className="textarea textarea-bordered w-full h-32 mb-4"
                                    placeholder="Describe el problema..."
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    autoFocus
                                ></textarea>
                                <div className="flex justify-end gap-2">
                                    <button 
                                        className="btn btn-ghost" 
                                        onClick={() => setShowDetailsInput(false)}
                                        disabled={loading}
                                    >
                                        Atrás
                                    </button>
                                    <button 
                                        className="btn btn-error" 
                                        onClick={() => selectedReason && handleSubmit(selectedReason)}
                                        disabled={loading || !details.trim()}
                                    >
                                        {loading ? <span className="loading loading-spinner"></span> : 'Enviar Reporte'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {!showDetailsInput && (
                            <div className="mt-6 flex justify-center">
                                <button className="btn btn-ghost btn-sm text-base-content/50" onClick={onClose}>
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}