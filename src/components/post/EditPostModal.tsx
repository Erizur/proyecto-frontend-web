import { useState } from "react";
import { publicationService } from "../../api/publication.service";
import type { Publication } from "../../types/publication.types";

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Publication;
    onSuccess: () => void;
}

export default function EditPostModal({ isOpen, onClose, post, onSuccess }: EditPostModalProps) {
    const [description, setDescription] = useState(post.description || "");
    // Simplificación: Tags como string separado por comas
    const [tagsInput, setTagsInput] = useState(post.tags.map(t => t.name).join(", "));
    const [contentWarning, setContentWarning] = useState(post.contentWarning);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== "");
            
            await publicationService.update(post.id, {
                description,
                tags,
                contentWarning
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar la publicación");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-base-100 rounded-xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="font-bold text-lg mb-4">Editar Publicación</h3>
                
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Descripción</span></label>
                    <textarea 
                        className="textarea textarea-bordered h-24"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Etiquetas (separadas por coma)</span></label>
                    <input 
                        type="text" 
                        className="input input-bordered"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                    />
                </div>

                <div className="form-control mb-6">
                    <label className="label cursor-pointer justify-start gap-4">
                        <input 
                            type="checkbox" 
                            className="checkbox checkbox-warning"
                            checked={contentWarning}
                            onChange={(e) => setContentWarning(e.target.checked)}
                        />
                        <span className="label-text">Contenido Sensible (NSFW)</span>
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}