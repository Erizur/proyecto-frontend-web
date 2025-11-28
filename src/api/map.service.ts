import { apiClient } from './axios.config';
import type { PageResponse, Pageable } from '../types/api.types';
import type { Publication } from '../types/publication.types';

export interface PlaceMapSummary {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    postCount: number;
}

export interface PlaceData {
    osmId: number;
    osmType: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export const mapService = {
    // Obtener lugares visibles en el viewport actual
    getPlacesInView: async (minLat: number, minLon: number, maxLat: number, maxLon: number) => {
        const response = await apiClient.get<PlaceMapSummary[]>('/map/in-view', {
            params: { minLat, minLon, maxLat, maxLon }
        });
        return response.data;
    },

    // Obtener posts de un lugar específico
    getPostsForPlace: async (placeId: number, params: Pageable) => {
        const response = await apiClient.get<PageResponse<Publication>>(`/map/${placeId}/posts`, {
            params
        });
        return response.data;
    },

    // Buscar lugares (para el autocompletado al crear post)
    searchPlaces: async (query: string) => {
        const response = await apiClient.get<PlaceData[]>('/map/search', {
            params: { query }
        });
        return response.data;
    }
};