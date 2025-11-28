import { useState, useEffect, useRef } from 'react';
import { mapService, type PlaceData } from '../../api/map.service';

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

    // Cierra el dropdown si clicamos fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const data = await mapService.searchPlaces(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        }, 500);

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

    if (selectedPlace) {
        return (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center shrink-0">
                        📍
                    </div>
                    <div className="truncate">
                        <div className="font-bold text-sm truncate">{selectedPlace.name}</div>
                        <div className="text-xs opacity-70 truncate">{selectedPlace.address}</div>
                    </div>
                </div>
                <button onClick={handleClear} className="btn btn-xs btn-circle btn-ghost text-error">
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="label">
                <span className="label-text font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Agregar Ubicación (Opcional)
                </span>
            </label>
            <input
                type="text"
                className="input input-bordered w-full focus:input-primary"
                placeholder="Buscar lugar, ciudad o museo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 2 && setIsOpen(true)}
            />
            
            {loading && (
                <div className="absolute right-3 top-[3.2rem]">
                    <span className="loading loading-spinner loading-xs text-primary"></span>
                </div>
            )}

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    <ul className="menu menu-compact p-2">
                        {results.map((place) => (
                            <li key={place.osmId}>
                                <button 
                                    onClick={() => handleSelect(place)}
                                    className="flex flex-col items-start py-2"
                                >
                                    <span className="font-bold text-sm">{place.name}</span>
                                    <span className="text-xs opacity-60 truncate w-full">{place.address}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}