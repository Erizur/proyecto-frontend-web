import { useState, useEffect, useRef } from 'react';
import { mapService, type PlaceData } from '../../api/map.service';
import LoadingSpinner from './LoadingSpinner';

interface LocationPickerProps {
    onSelect: (place: PlaceData | null) => void;
    selectedPlace: PlaceData | null;
}

export default function LocationPicker({ onSelect, selectedPlace }: LocationPickerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PlaceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Cierra el menú si se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Búsqueda con debounce (espera a que el usuario deje de escribir)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const data = await mapService.searchPlaces(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Error buscando lugares", error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 600); // 600ms de retraso

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (place: PlaceData) => {
        onSelect(place);
        setQuery('');
        setIsOpen(false);
    };

    const handleClear = () => {
        onSelect(null);
        setQuery('');
    };

    // Vista cuando ya hay un lugar seleccionado
    if (selectedPlace) {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold">Ubicación</span>
                </label>
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-sm truncate">{selectedPlace.name}</div>
                            <div className="text-xs opacity-60 truncate">{selectedPlace.address}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleClear} 
                        className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                        title="Quitar ubicación"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    // Vista de búsqueda
    return (
        <div className="form-control w-full relative" ref={wrapperRef}>
            <label className="label">
                <span className="label-text font-bold flex items-center gap-2">
                    📍 Agregar Ubicación (Opcional)
                </span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    className={`input input-bordered w-full pr-10 focus:input-primary transition-all ${isOpen ? 'rounded-b-none border-b-0' : ''}`}
                    placeholder="Busca una ciudad, museo, parque..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setResults.length > 0 && setIsOpen(true)}
                />
                {loading && (
                    <div className="absolute right-3 top-3">
                        <span className="loading loading-spinner loading-xs text-primary"></span>
                    </div>
                )}
            </div>

            {/* Dropdown de resultados */}
            {isOpen && (
                <div className="absolute z-50 w-full bg-base-100 border border-base-300 border-t-0 rounded-b-xl shadow-xl max-h-60 overflow-y-auto no-scrollbar">
                    {results.length > 0 ? (
                        <ul className="menu menu-sm p-2 gap-1">
                            {results.map((place) => (
                                <li key={`${place.osmId}-${place.name}`}>
                                    <button 
                                        onClick={() => handleSelect(place)}
                                        className="flex flex-col items-start py-3 px-4 hover:bg-base-200 rounded-lg transition-colors"
                                    >
                                        <span className="font-bold text-sm text-base-content">{place.name}</span>
                                        <span className="text-xs text-base-content/50 truncate w-full text-left">{place.address}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm opacity-50">
                            {loading ? 'Buscando...' : 'No se encontraron lugares'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}