function ReportModal({ isOpen, onClose, onSubmit }) {
    if (!isOpen) return null;

    const reasons = ['Spam', 'Contenido inapropiado', 'Plagio', 'Acoso', 'Otro'];

    return <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-lg max-w-md w-full p-6">
                <h3 className="font-bold text-lg mb-4">Reportar Publicación</h3>
                <p className="text-sm opacity-70 mb-4">
                    ¿Por qué estás reportando esta publicación?
                </p>
                
                <div className="space-y-2">
                    {reasons.map((reason) => (
                        <button 
                            key={reason}
                            className="btn btn-ghost justify-start w-full"
                            onClick={() => onSubmit(reason)}
                        >
                            {reason}
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex justify-end">
                    <button className="btn" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </>
}
export default ReportModal;