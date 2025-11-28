import { useState, useRef, useEffect } from "react";
import { AxiosError } from "axios";
import type { CreatePublicationDto, PublicationType } from "../../types/publication.types";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../api/user.service";
import { externalMapService, type NominatimPlace } from "../../api/externalMap.service";

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
    
    // Estados para Ubicación (Nominatim)
    const [locationQuery, setLocationQuery] = useState('');
    const [locationResults, setLocationResults] = useState<NominatimPlace[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<NominatimPlace | null>(null);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);

    // Estados de UI/Control
    const { userId } = useAuth();
    const [canExplicit, setCanExplicit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset al abrir/cerrar
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

    // Efecto para búsqueda de lugares (Debounce)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (locationQuery.length >= 3 && !selectedLocation) {
                setIsSearchingLocation(true);
                const results = await externalMapService.search(locationQuery);
                setLocationResults(results);
                setIsSearchingLocation(false);
            } else {
                setLocationResults([]);
            }
        }, 800); // Esperar 800ms después de dejar de escribir

        return () => clearTimeout(delayDebounceFn);
    }, [locationQuery, selectedLocation]);

    const resetForm = () => {
        setStep('TYPE_SELECT');
        setImages([]);
        setDescription('');
        setTags([]);
        setTagInput('');
        setContentRating(null);
        setMachineGenerated(false);
        setPubType('ILLUSTRATION');
        
        // Reset ubicación
        setLocationQuery('');
        setLocationResults([]);
        setSelectedLocation(null);
        
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
        setStep('CONTENT'); 
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            
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
        if (e && !['Enter', ',', 'Tab'].includes(e.key)) return;
        e?.preventDefault(); 
        
        const cleanTag = tagInput.trim().replace(/^#/, '').replace(/\s+/g, '').toLowerCase();
        
        if (!cleanTag) return;
        if (tags.includes(cleanTag)) {
            setError("¡Esa etiqueta ya está agregada!");
            return;
        }
        if (tags.length >= 10) {
            setError("Máximo 10 etiquetas permitidas.");
            return;
        }

        setTags([...tags, cleanTag]);
        setTagInput('');
        setError(null);
    };

    // Handlers de Ubicación
    const handleSelectLocation = (place: NominatimPlace) => {
        setSelectedLocation(place);
        setLocationQuery(place.display_name);
        setLocationResults([]);
    };

    const handleClearLocation = () => {
        setSelectedLocation(null);
        setLocationQuery('');
        setLocationResults([]);
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

        // Mapeo de datos para el backend
        // Nota: El backend espera osmId y osmType para validar/crear el lugar si no existe
        const dto: CreatePublicationDto = {
            description,
            pubType,
            tags,
            contentWarning: contentRating === 'SENSITIVE',
            machineGenerated,
            osmId: selectedLocation ? selectedLocation.osm_id : undefined,
            // Nominatim devuelve osm_type como "node", "way", "relation". El backend lo necesita tal cual (quizás en minúscula/mayúscula según tu lógica backend)
            osmType: selectedLocation ? selectedLocation.osm_type : undefined 
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
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-200/30 shrink-0 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        {step !== 'TYPE_SELECT' && (
                            <button 
                                onClick={() => setStep(prev => prev === 'DETAILS' ? 'CONTENT' : 'TYPE_SELECT')} 
                                className="btn btn-sm btn-circle btn-ghost hover:bg-base-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        )}
                        <div>
                            <h3 className="font-bold text-lg leading-none">
                                {step === 'TYPE_SELECT' ? 'Crear nueva publicación' : 
                                 step === 'CONTENT' ? 'Contenido de la obra' : 'Detalles finales'}
                            </h3>
                            <p className="text-xs opacity-50 mt-1">Paso {step === 'TYPE_SELECT' ? '1' : step === 'CONTENT' ? '2' : '3'} de 3</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>

                {/* Body Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* Error Banner */}
                    {error && (
                        <div role="alert" className="alert alert-error mb-6 text-sm py-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* PASO 1: TIPO */}
                    {step === 'TYPE_SELECT' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-center py-4">
                            <button 
                                onClick={() => handleTypeSelect('ILLUSTRATION')}
                                className="group relative overflow-hidden p-8 rounded-2xl border-2 border-base-200 hover:border-primary hover:bg-primary/5 transition-all text-left"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
                                <h4 className="font-bold text-xl">Arte Visual</h4>
                                <p className="text-sm opacity-70 mt-1">Sube tus ilustraciones, dibujos digitales o pinturas.</p>
                            </button>

                            <button 
                                onClick={() => handleTypeSelect('PHOTOGRAPHY')}
                                className="group relative overflow-hidden p-8 rounded-2xl border-2 border-base-200 hover:border-secondary hover:bg-secondary/5 transition-all text-left"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📷</div>
                                <h4 className="font-bold text-xl">Fotografía</h4>
                                <p className="text-sm opacity-70 mt-1">Comparte tus mejores capturas del mundo.</p>
                            </button>

                            <button 
                                onClick={() => handleTypeSelect('TEXT')}
                                className="group relative overflow-hidden p-8 rounded-2xl border-2 border-base-200 hover:border-accent hover:bg-accent/5 transition-all text-left sm:col-span-2 flex items-center gap-6"
                            >
                                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📝</div>
                                <div>
                                    <h4 className="font-bold text-xl">Discusión / Blog</h4>
                                    <p className="text-sm opacity-70 mt-1">Inicia una conversación, pide feedback o escribe un tutorial.</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* PASO 2: CONTENIDO */}
                    {step === 'CONTENT' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            
                            {/* Uploader de Imagen */}
                            {pubType !== 'TEXT' && (
                                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${images.length > 0 ? 'border-success bg-success/5' : 'border-base-300 hover:border-primary hover:bg-base-200 cursor-pointer'}`}>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                    />
                                    
                                    {images.length > 0 ? (
                                        <div className="relative group w-fit mx-auto">
                                            <img 
                                                src={URL.createObjectURL(images[0])} 
                                                alt="Preview" 
                                                className="max-h-[300px] rounded-lg shadow-lg object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-white gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                    Cambiar imagen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="flex flex-col items-center py-6"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4 text-base-content/40">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <h3 className="font-bold text-lg">Sube tu obra aquí</h3>
                                            <p className="text-sm opacity-60 mt-1">Soporta PNG, JPG, WEBP (Max 10MB)</p>
                                            <button className="btn btn-primary mt-4 btn-sm">Seleccionar Archivo</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Descripción de la publicación</span>
                                </label>
                                <textarea 
                                    className="textarea textarea-bordered h-32 focus:textarea-primary text-base leading-relaxed resize-none shadow-sm"
                                    placeholder={pubType === 'TEXT' ? "Escribe aquí tus pensamientos, preguntas o tutorial..." : "Cuéntanos la historia detrás de esta obra, herramientas usadas..."}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button 
                                    className="btn btn-primary px-8 gap-2"
                                    onClick={() => {
                                        if (pubType === 'TEXT' && !description.trim()) {
                                            setError("Por favor escribe algo en la descripción.");
                                            return;
                                        }
                                        if (pubType !== 'TEXT' && images.length === 0) {
                                            setError("Es necesario subir una imagen.");
                                            return;
                                        }
                                        setError(null);
                                        setStep('DETAILS');
                                    }}
                                >
                                    Siguiente Paso
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PASO 3: DETALLES */}
                    {step === 'DETAILS' && (
                        <div className="space-y-8 max-w-2xl mx-auto">
                            
                            {/* Tags mejorados */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Etiquetas (Tags)</span>
                                    <span className="label-text-alt opacity-60">{tags.length}/10</span>
                                </label>
                                <div className="p-2 border border-base-300 rounded-xl bg-base-100 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map((tag, i) => (
                                            <span key={i} className="badge badge-neutral gap-1 py-3 px-3 animate-in zoom-in duration-200">
                                                #{tag}
                                                <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="btn btn-xs btn-circle btn-ghost text-white/70 hover:text-white ml-1">✕</button>
                                            </span>
                                        ))}
                                        <input 
                                            type="text"
                                            className="input input-ghost h-8 min-w-[120px] focus:bg-transparent focus:outline-none p-0 placeholder:text-sm"
                                            placeholder={tags.length === 0 ? "Escribe tags separados por enter..." : "Añadir otro..."}
                                            value={tagInput}
                                            onChange={(e) => {
                                                setTagInput(e.target.value);
                                                setError(null);
                                            }}
                                            onKeyDown={handleAddTag}
                                            disabled={tags.length >= 10}
                                        />
                                    </div>
                                </div>
                                <label className="label">
                                    <span className="label-text-alt opacity-50">Presiona Enter o Coma para agregar. Usa tags relevantes para mayor visibilidad.</span>
                                </label>
                            </div>

                            {/* Selector de Ubicación (Nominatim Directo) */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Ubicación</span>
                                    <span className="label-text-alt opacity-60">Opcional</span>
                                </label>
                                
                                <div className="relative">
                                    {selectedLocation ? (
                                        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl animate-in fade-in zoom-in duration-200">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0 text-left">
                                                    <div className="font-bold text-sm truncate">{selectedLocation.display_name.split(',')[0]}</div>
                                                    <div className="text-xs opacity-60 truncate">{selectedLocation.display_name}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleClearLocation} 
                                                className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <input 
                                                type="text" 
                                                className="input input-bordered w-full pr-10 focus:input-primary"
                                                placeholder="Buscar ciudad, lugar..." 
                                                value={locationQuery}
                                                onChange={(e) => setLocationQuery(e.target.value)}
                                            />
                                            {isSearchingLocation && (
                                                <div className="absolute right-3 top-3">
                                                    <span className="loading loading-spinner loading-xs text-primary"></span>
                                                </div>
                                            )}
                                            
                                            {/* Resultados Dropdown */}
                                            {locationResults.length > 0 && (
                                                <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                                    <ul className="menu menu-sm p-2 gap-1">
                                                        {locationResults.map((place) => (
                                                            <li key={place.place_id}>
                                                                <button 
                                                                    onClick={() => handleSelectLocation(place)}
                                                                    className="flex flex-col items-start py-3 px-4 hover:bg-base-200 rounded-lg transition-colors"
                                                                >
                                                                    <span className="font-bold text-sm text-base-content text-left w-full truncate">
                                                                        {place.display_name.split(',')[0]}
                                                                    </span>
                                                                    <span className="text-xs text-base-content/50 truncate w-full text-left">
                                                                        {place.display_name}
                                                                    </span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Clasificación de Contenido */}
                            <div className="form-control">
                                <h4 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide opacity-80">
                                    Clasificación de Contenido <span className="text-error">*</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${contentRating === 'SAFE' ? 'border-success bg-success/5 ring-1 ring-success' : 'border-base-200 hover:border-base-300'}`}>
                                        <input type="radio" name="rating" className="radio radio-success" checked={contentRating === 'SAFE'} onChange={() => { setContentRating('SAFE'); setError(null); }} />
                                        <div>
                                            <span className="font-bold block">Todo Público</span>
                                            <span className="text-xs opacity-70">Contenido seguro para todas las edades.</span>
                                        </div>
                                    </label>
                                    
                                    <div className={`relative border-2 rounded-xl p-4 transition-all ${!canExplicit ? 'opacity-60 grayscale cursor-not-allowed bg-base-200 border-base-200' : contentRating === 'SENSITIVE' ? 'border-warning bg-warning/5 ring-1 ring-warning' : 'border-base-200 hover:border-base-300'}`}>
                                        <label className={`cursor-pointer flex items-center gap-3 ${!canExplicit ? 'pointer-events-none' : ''}`}>
                                            <input type="radio" name="rating" className="radio radio-warning" disabled={!canExplicit} checked={contentRating === 'SENSITIVE'} onChange={() => { setContentRating('SENSITIVE'); setError(null); }} />
                                            <div>
                                                <span className="font-bold block text-warning-content">Sensible (NSFW)</span>
                                                <span className="text-xs opacity-70">Desnudez artística, temas maduros.</span>
                                            </div>
                                        </label>
                                        {!canExplicit && (
                                            <div className="absolute top-2 right-2 tooltip tooltip-left" data-tip="Habilita contenido sensible en tu perfil para usar esta opción">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* IA Checkbox */}
                            {pubType !== 'TEXT' && (
                                <div className="form-control bg-base-200/50 p-3 rounded-xl">
                                    <label className="cursor-pointer flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-primary"
                                            checked={machineGenerated}
                                            onChange={(e) => setMachineGenerated(e.target.checked)}
                                        />
                                        <div>
                                            <span className="label-text font-bold">Creado con asistencia de IA</span>
                                            <p className="text-xs opacity-60">Marca esto si utilizaste herramientas de generación por IA.</p>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-base-200 bg-base-100 flex justify-end gap-3 shrink-0 z-10">
                    {step === 'DETAILS' && (
                        <button 
                            className="btn btn-primary btn-wide shadow-lg"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span> Publicando...
                                </>
                            ) : 'Publicar Ahora'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}