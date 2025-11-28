import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
import type { CreatePublicationDto, PublicationType } from "../../types/publication.types";
import type { PlaceData } from "../../api/map.service";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../api/user.service";
import LocationPicker from "../common/LocationPicker";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePublicationDto, images: File[]) => Promise<void>;
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
    // Estados de Pasos
    const [step, setStep] = useState<'TYPE_SELECT' | 'CONTENT' | 'DETAILS'>('TYPE_SELECT');
    
    // Datos del Formulario
    const [pubType, setPubType] = useState<PublicationType>('ILLUSTRATION');
    const [images, setImages] = useState<File[]>([]);
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [contentRating, setContentRating] = useState<'SAFE' | 'SENSITIVE' | null>(null);
    const [machineGenerated, setMachineGenerated] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);

    // Estados de UI/Control
    const { userId } = useAuth();
    const [canExplicit, setCanExplicit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                resetForm();
            }, 300);
            return () => clearTimeout(timer);
        } else {
            checkUserPermissions();
        }
    }, [isOpen]);

    const resetForm = () => {
        setStep('TYPE_SELECT');
        setImages([]);
        setDescription('');
        setTags([]);
        setTagInput('');
        setContentRating(null);
        setMachineGenerated(false);
        setPubType('ILLUSTRATION');
        setSelectedPlace(null);
        setError(null);
        setLoading(false);
    };

    const checkUserPermissions = async () => {
        if (!userId) return;
        try {
            const profile = await userService.getCurrent();
            setCanExplicit(profile.showExplicit || false);
        } catch (err) {
            console.error("No se pudo verificar permisos de usuario", err);
        }
    };

    // -- Handlers --

    const handleTypeSelect = (type: PublicationType) => {
        setPubType(type);
        setError(null);
        setStep(type === 'TEXT' ? 'CONTENT' : 'CONTENT'); 
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            
            // Validación básica de tamaño/tipo
            const validFiles = files.filter(f => f.size <= 10 * 1024 * 1024 && f.type.startsWith('image/'));
            
            if (validFiles.length !== files.length) {
                setError("Algunos archivos fueron ignorados (max 10MB, solo imágenes).");
            } else {
                setError(null);
            }

            if (validFiles.length > 0) {
                setImages(validFiles);
            }
        }
    };

    const handleAddTag = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter' && e.key !== ',') return;
        
        e?.preventDefault();
        
        const cleanTag = tagInput.trim().replace(/#/g, '').toLowerCase();
        
        if (!cleanTag) return;
        
        if (tags.includes(cleanTag)) {
            setError("¡Ese tag ya está agregado!");
            return;
        }
        
        if (tags.length >= 10) {
            setError("Máximo 10 tags permitidos.");
            return;
        }

        setTags([...tags, cleanTag]);
        setTagInput('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (!contentRating) {
            setError("Debes seleccionar una clasificación de contenido.");
            return;
        }
        if (pubType !== 'TEXT' && images.length === 0) {
            setError("Debes subir al menos una imagen para este tipo de publicación.");
            return;
        }
        if (pubType === 'TEXT' && !description.trim()) {
            setError("La publicación de texto no puede estar vacía.");
            return;
        }

        setLoading(true);
        setError(null);

        const dto: CreatePublicationDto = {
            description,
            pubType,
            tags,
            contentWarning: contentRating === 'SENSITIVE',
            machineGenerated,
            // Solo enviamos location si existe
            osmId: selectedPlace?.osmId,
            osmType: selectedPlace?.osmType
        };

        try {
            await onSubmit(dto, images);
        } catch (err: unknown) {
            console.error("Error creating post:", err);
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Error al crear la publicación. Intenta nuevamente.");
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-200/50 shrink-0">
                    <div className="flex items-center gap-2">
                        {step !== 'TYPE_SELECT' && (
                            <button onClick={() => setStep(prev => prev === 'DETAILS' ? 'CONTENT' : 'TYPE_SELECT')} className="btn btn-sm btn-circle btn-ghost">
                                ←
                            </button>
                        )}
                        <h3 className="font-bold text-lg">
                            {step === 'TYPE_SELECT' ? 'Crear nueva publicación' : 
                             step === 'CONTENT' ? 'Contenido' : 'Detalles finales'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>

                {/* Body Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* Error Banner */}
                    {error && (
                        <div role="alert" className="alert alert-error mb-6 text-sm py-2 animate-in fade-in slide-in-from-top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* PASO 1: TIPO */}
                    {step === 'TYPE_SELECT' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-center">
                            <button 
                                onClick={() => handleTypeSelect('ILLUSTRATION')}
                                className="group relative overflow-hidden p-8 rounded-2xl border-2 border-base-200 hover:border-primary hover:bg-primary/5 transition-all text-left"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
                                <h4 className="font-bold text-xl">Arte Visual</h4>
                                <p className="text-sm opacity-70 mt-1">Comparte ilustraciones, dibujos digitales o pinturas.</p>
                            </button>

                            <button 
                                onClick={() => handleTypeSelect('PHOTOGRAPHY')}
                                className="group relative overflow-hidden p-8 rounded-2xl border-2 border-base-200 hover:border-secondary hover:bg-secondary/5 transition-all text-left"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📷</div>
                                <h4 className="font-bold text-xl">Fotografía</h4>
                                <p className="text-sm opacity-70 mt-1">Sube tus mejores capturas fotográficas.</p>
                            </button>

                            <button 
                                onClick={() => handleTypeSelect('TEXT')}
                                className="group relative overflow-hidden p-8 rounded-2xl border-2 border-base-200 hover:border-accent hover:bg-accent/5 transition-all text-left sm:col-span-2"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
                                <h4 className="font-bold text-xl">Comunidad</h4>
                                <p className="text-sm opacity-70 mt-1">Inicia una discusión, pide consejos o comparte tutoriales.</p>
                            </button>
                        </div>
                    )}

                    {/* PASO 2: CONTENIDO (Imagen o Texto) */}
                    {step === 'CONTENT' && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            
                            {/* Uploader de Imagen */}
                            {pubType !== 'TEXT' && (
                                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${images.length > 0 ? 'border-success bg-success/5' : 'border-base-300 hover:border-primary hover:bg-base-200'}`}>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                    />
                                    
                                    {images.length > 0 ? (
                                        <div className="relative group">
                                            <img 
                                                src={URL.createObjectURL(images[0])} 
                                                alt="Preview" 
                                                className="max-h-64 mx-auto rounded-lg shadow-md"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-white">
                                                    Cambiar imagen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="cursor-pointer flex flex-col items-center"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="font-bold text-lg">Haz clic para subir</span>
                                            <span className="text-sm opacity-60 mt-1">PNG, JPG, WEBP (Max 10MB)</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold">Descripción</span></label>
                                <textarea 
                                    className="textarea textarea-bordered h-32 focus:textarea-primary text-base leading-relaxed"
                                    placeholder={pubType === 'TEXT' ? "Escribe aquí tus pensamientos, preguntas o tutorial..." : "Cuéntanos sobre tu obra..."}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button 
                                    className="btn btn-primary px-8"
                                    onClick={() => {
                                        if (pubType === 'TEXT' && !description.trim()) {
                                            setError("Escribe algo en la descripción.");
                                            return;
                                        }
                                        if (pubType !== 'TEXT' && images.length === 0) {
                                            setError("Sube una imagen primero.");
                                            return;
                                        }
                                        setError(null);
                                        setStep('DETAILS');
                                    }}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PASO 3: DETALLES (Tags, Lugar, Rating) */}
                    {step === 'DETAILS' && (
                        <div className="space-y-8 max-w-xl mx-auto">
                            
                            {/* Tags */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Etiquetas (Tags)</span>
                                    <span className="label-text-alt opacity-60">Max 10</span>
                                </label>
                                <div className="flex flex-col gap-3">
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            className="input input-bordered w-full pr-20 focus:input-primary"
                                            placeholder="Escribe y presiona Enter..."
                                            value={tagInput}
                                            onChange={(e) => {
                                                setTagInput(e.target.value);
                                                setError(null);
                                            }}
                                            onKeyDown={handleAddTag}
                                        />
                                        <button 
                                            onClick={() => handleAddTag()} 
                                            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs text-primary font-bold"
                                            disabled={!tagInput.trim()}
                                        >
                                            AÑADIR
                                        </button>
                                    </div>
                                    
                                    {tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 bg-base-200/50 p-3 rounded-lg min-h-[3rem]">
                                            {tags.map((tag, i) => (
                                                <span key={i} className="badge badge-neutral gap-1 pl-3 pr-1 py-3 animate-in zoom-in duration-200">
                                                    #{tag}
                                                    <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="btn btn-xs btn-circle btn-ghost text-white/70 hover:text-white hover:bg-white/20 ml-1">✕</button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs opacity-50 italic pl-1">Sin etiquetas. Añade algunas para que te encuentren.</p>
                                    )}
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="form-control">
                                <LocationPicker 
                                    onSelect={setSelectedPlace} 
                                    selectedPlace={selectedPlace} 
                                />
                            </div>

                            <div className="divider"></div>

                            {/* Clasificación */}
                            <div className="form-control">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    Clasificación de Contenido <span className="text-error">*</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${contentRating === 'SAFE' ? 'border-success bg-success/5' : 'border-base-200 hover:border-base-300'}`}>
                                        <input type="radio" name="rating" className="radio radio-success" checked={contentRating === 'SAFE'} onChange={() => { setContentRating('SAFE'); setError(null); }} />
                                        <div>
                                            <span className="font-bold block">Todo Público</span>
                                            <span className="text-xs opacity-70">Contenido seguro para todas las edades.</span>
                                        </div>
                                    </label>
                                    
                                    <div className={`relative border-2 rounded-xl p-4 transition-all ${!canExplicit ? 'opacity-50 grayscale cursor-not-allowed bg-base-200 border-base-200' : contentRating === 'SENSITIVE' ? 'border-warning bg-warning/5' : 'border-base-200 hover:border-base-300'}`}>
                                        <label className={`cursor-pointer flex items-center gap-3 ${!canExplicit ? 'pointer-events-none' : ''}`}>
                                            <input type="radio" name="rating" className="radio radio-warning" disabled={!canExplicit} checked={contentRating === 'SENSITIVE'} onChange={() => { setContentRating('SENSITIVE'); setError(null); }} />
                                            <div>
                                                <span className="font-bold block">Sensible (NSFW)</span>
                                                <span className="text-xs opacity-70">Desnudez artística, temas maduros.</span>
                                            </div>
                                        </label>
                                        {!canExplicit && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 backdrop-blur-[1px] rounded-xl">
                                                <span className="badge badge-error text-xs font-bold">Requiere permiso en Perfil</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* IA Checkbox */}
                            {pubType !== 'TEXT' && (
                                <div className="form-control">
                                    <label className="cursor-pointer flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors w-fit">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-sm checkbox-primary"
                                            checked={machineGenerated}
                                            onChange={(e) => setMachineGenerated(e.target.checked)}
                                        />
                                        <span className="label-text">Esta obra fue creada con asistencia de IA</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-base-200 bg-base-100 flex justify-end gap-3 shrink-0">
                    {step === 'DETAILS' && (
                        <button 
                            className="btn btn-primary btn-wide shadow-lg"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <span className="loading loading-spinner"></span> : 'Publicar Ahora'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}