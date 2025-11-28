import axios from 'axios';

export interface NominatimPlace {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
}

export const externalMapService = {
    search: async (query: string): Promise<NominatimPlace[]> => {
        if (!query || query.length < 3) return [];
        
        try {
            const response = await axios.get<NominatimPlace[]>('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5
                },
                headers: {
                    'User-Agent': window.navigator.userAgent 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching from Nominatim:", error);
            return [];
        }
    }
};