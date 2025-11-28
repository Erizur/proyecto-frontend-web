import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { mapService, type PlaceMapSummary } from '../../api/map.service';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ArtMapProps {
    onPlaceSelect: (placeId: number) => void;
}

// Componente interno para manejar eventos del mapa
function MapEvents({ onBoundsChange }: { onBoundsChange: () => void }) {
    const map = useMapEvents({
        moveend: () => {
            onBoundsChange();
        },
        zoomend: () => {
            onBoundsChange();
        }
    });
    return null;
}

export default function ArtMap({ onPlaceSelect }: ArtMapProps) {
    const [places, setPlaces] = useState<PlaceMapSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const mapRef = useRef<L.Map>(null);

    const initialPosition: [number, number] = [-12.0464, -77.0428]; 

    const fetchPlaces = async () => {
        if (!mapRef.current) return;
        
        setLoading(true);
        try {
            const bounds = mapRef.current.getBounds();
            const minLat = bounds.getSouth();
            const maxLat = bounds.getNorth();
            const minLon = bounds.getWest();
            const maxLon = bounds.getEast();

            if (maxLat - minLat > 1.5 || maxLon - minLon > 1.5) {
                return; 
            }

            const data = await mapService.getPlacesInView(minLat, minLon, maxLat, maxLon);
            setPlaces(data);
        } catch (error) {
            console.error("Error cargando lugares del mapa:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-full w-full rounded-xl overflow-hidden border border-base-300 shadow-lg z-0">
            <MapContainer 
                center={initialPosition} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                whenReady={() => fetchPlaces()}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapEvents onBoundsChange={fetchPlaces} />

                {places.map(place => (
                    <Marker 
                        key={place.id} 
                        position={[place.latitude, place.longitude]}
                        eventHandlers={{
                            click: () => onPlaceSelect(place.id),
                        }}
                    >
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-sm">{place.name}</h3>
                                <div className="badge badge-primary badge-sm mt-1">
                                    {place.postCount} obras
                                </div>
                                <button 
                                    className="btn btn-xs btn-link block mt-2 w-full"
                                    onClick={() => onPlaceSelect(place.id)}
                                >
                                    Ver obras
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {loading && (
                <div className="absolute top-4 right-4 bg-base-100/80 backdrop-blur p-2 rounded-full shadow-md z-[1000]">
                    <span className="loading loading-spinner loading-xs text-primary"></span>
                </div>
            )}
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-base-100/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-[1000] text-xs font-medium border border-base-200">
                Explora el mapa para encontrar arte cerca de ti
            </div>
        </div>
    );
}