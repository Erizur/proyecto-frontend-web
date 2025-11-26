import type { Pageable, PageResponse } from "../types/api.types";
import type { CreatePublicationDto, Publication, PublicationType } from "../types/publication.types";
import { apiClient } from "./axios.config";

interface PublicationCreatedResponse {
    id: number;
    url: string;
    description: string;
}

export const publicationService = {
    // Obtener todas las publicaciones (Feed Global)
    getAll: async (params: Pageable & { pubType?: PublicationType }) => {
        const response = await apiClient.get<PageResponse<Publication>>('/publication', {
            params
        });
        return response.data;
    },

    // ✅ NUEVO: Feed de Seguidos (/publication/following)
    // Este endpoint trae solo los posts de la gente que sigues
    getFeed: async (params: Pageable & { pubType?: PublicationType }) => {
        const response = await apiClient.get<PageResponse<Publication>>('/publication/following', {
            params
        });
        return response.data;
    },

    // Obtener una publicación por ID
    getById: async (id: number): Promise<Publication> => {
        const response = await apiClient.get<Publication>(`/publication/${id}`);
        return response.data;
    },

    // Crear publicación
    create: async (data: CreatePublicationDto, images?: File[]): Promise<Publication> => {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('data', jsonBlob);
        
        if (images) {
            images.forEach(image => {
                formData.append('images', image);
            });
        }

        const creationResponse = await apiClient.post<PublicationCreatedResponse>(
            '/publication', 
            formData, 
            { headers: { 'Content-Type': null } }
        );

        return await publicationService.getById(creationResponse.data.id);
    },

    // Obtener publicaciones por ID de usuario
    getByUserId: async (userId: number, params: Pageable & { pubType?: PublicationType }) => {
        const response = await apiClient.get<PageResponse<Publication>>(
            `/publication/user/${userId}`, 
            { params }
        );
        return response.data;
    },

    // Actualizar publicación
    update: async (id: number, data: Partial<CreatePublicationDto>) => {
        const response = await apiClient.patch<Publication>(`/publication/${id}`, data);
        return response.data;
    },

    // Eliminar publicación
    delete: async (id: number) => {
        const response = await apiClient.delete(`/publication/${id}`);
        return response.data;
    },

    // Dar/Quitar Like
    toggleHeart: async (id: number) => {
        const response = await apiClient.post(`/publication/${id}/heart`);
        return response.data;
    },

    // Obtener por Tag
    getByTag: async (tagName: string, params: Pageable) => {
        const response = await apiClient.get<PageResponse<Publication>>(
            `/publication/tag/${tagName}`,
            { params }
        );
        return response.data;
    }
};