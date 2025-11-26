import { useState, useRef, useEffect } from "react";
import type { CreatePublicationDto, PublicationType } from "../../types/publication.types";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePublicationDto, images: File[]) => Promise<void>;
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
    const [step, setStep] = useState<'TYPE_SELECT' | 'UPLOAD' | 'DETAILS'>('TYPE_SELECT');
    const [pubType, setPubType] = useState<PublicationType>('ILLUSTRATION');
    const [images, setImages] = useState<File[]>([]);
    
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    
    // Validaciones
    const [contentRating, setContentRating] = useState<'SAFE' | 'SENSITIVE' | null>(null);
    const [machineGenerated, setMachineGenerated] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset al cerrar
            setTimeout(() => {
                setStep('TYPE_SELECT');
                setImages([]);
                setDescription('');
                setTags([]);
                setContentRating(null);
                setMachineGenerated(false);
                setPubType('ILLUSTRATION');
            }, 300);
        }
    }, [isOpen]);

    const handleTypeSelect = (type: PublicationType) => {
        setPubType(type);
        if (type === 'TEXT') {
            setStep('DETAILS'); // Texto salta directo a detalles
        } else {
            setStep('UPLOAD'); // Ilustración pide imagen
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImages(Array.from(e.target.files));
            setTimeout(() => setStep('DETAILS'), 300);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && tags.length < 10) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleSubmit = async () => {
        if (!contentRating) return;

        setLoading(true);
        try {
            await onSubmit({
                description,
                pubType,
                tags: pubType === 'TEXT' ? [] : tags, // Tags vacíos si es texto
                contentWarning: contentRating === 'SENSITIVE',
                machineGenerated
            }, images);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className={`bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${step === 'DETAILS' ? 'h-auto scale-100' : 'scale-95'}`}>
                
                {/* Header */}
                <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-100/50">
                    <h3 className="font-bold text-lg">Nueva Publicación</h3>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>

                <div className="p-6">
                    {/* PASO 1: SELECCIÓN DE TIPO */}
                    {step === 'TYPE_SELECT' && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
                            <button 
                                onClick={() => handleTypeSelect('ILLUSTRATION')}
                                className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-base-200 hover:border-primary hover:bg-base-200 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="font-bold text-lg">Ilustración</span>
                            </button>

                            <button 
                                onClick={() => handleTypeSelect('TEXT')}
                                className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-base-200 hover:border-secondary hover:bg-base-200 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <span className="font-bold text-lg">Discusión</span>
                            </button>
                        </div>
                    )}

                    {/* PASO 2: SUBIR IMAGEN (Solo Ilustración) */}
                    {step === 'UPLOAD' && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-base-300 rounded-xl bg-base-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <h4 className="font-bold text-lg mb-2">Sube tu obra</h4>
                            <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary mt-2">
                                Seleccionar Archivo
                            </button>
                            <button onClick={() => setStep('TYPE_SELECT')} className="btn btn-ghost btn-sm mt-4">Volver</button>
                        </div>
                    )}

                    {/* PASO 3: DETALLES */}
                    {step === 'DETAILS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            
                            {/* Preview (Solo Visual) */}
                            {pubType !== 'TEXT' && images.length > 0 && (
                                <div className="flex items-center gap-4 bg-base-200 p-3 rounded-lg">
                                    <img src={URL.createObjectURL(images[0])} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <button onClick={() => setStep('UPLOAD')} className="text-xs text-primary hover:underline">Cambiar imagen</button>
                                    </div>
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold">Descripción</span></label>
                                <textarea 
                                    className="textarea textarea-bordered h-24"
                                    placeholder={pubType === 'TEXT' ? "Comparte tus ideas..." : "Describe tu obra..."}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Tags (Solo si NO es texto) */}
                            {pubType !== 'TEXT' && (
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-bold">Tags</span></label>
                                    <div className="flex gap-2 mb-2">
                                        <input 
                                            type="text"
                                            className="input input-bordered w-full input-sm"
                                            placeholder="Añadir tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <button onClick={handleAddTag} className="btn btn-sm btn-ghost">Agregar</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, i) => (
                                            <span key={i} className="badge badge-primary gap-1 pl-3 pr-1 py-3">
                                                #{tag}
                                                <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="btn btn-xs btn-circle btn-ghost text-white">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="divider"></div>

                            {/* Clasificación (Obligatorio) */}
                            <div className="form-control">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    Clasificación <span className="text-error">*</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border-2 rounded-lg p-3 flex items-center gap-3 ${contentRating === 'SAFE' ? 'border-success bg-success/10' : 'border-base-200'}`}>
                                        <input type="radio" name="rating" className="radio radio-success" checked={contentRating === 'SAFE'} onChange={() => setContentRating('SAFE')} />
                                        <span className="font-bold">Todo Público</span>
                                    </label>
                                    <label className={`cursor-pointer border-2 rounded-lg p-3 flex items-center gap-3 ${contentRating === 'SENSITIVE' ? 'border-warning bg-warning/10' : 'border-base-200'}`}>
                                        <input type="radio" name="rating" className="radio radio-warning" checked={contentRating === 'SENSITIVE'} onChange={() => setContentRating('SENSITIVE')} />
                                        <span className="font-bold">Sensible</span>
                                    </label>
                                </div>
                            </div>

                            {/* Checkbox IA (Solo Visual) */}
                            {pubType !== 'TEXT' && (
                                <div className="form-control">
                                    <label className="cursor-pointer flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-primary"
                                            checked={machineGenerated}
                                            onChange={(e) => setMachineGenerated(e.target.checked)}
                                        />
                                        <span className="label-text">Creado con IA</span>
                                    </label>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4">
                                <button onClick={() => setStep(pubType === 'TEXT' ? 'TYPE_SELECT' : 'UPLOAD')} className="btn btn-ghost">Atrás</button>
                                <button 
                                    className="btn btn-primary btn-wide"
                                    onClick={handleSubmit}
                                    disabled={loading || !contentRating || (pubType === 'TEXT' && !description)}
                                >
                                    {loading ? <span className="loading loading-spinner"></span> : 'Publicar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}