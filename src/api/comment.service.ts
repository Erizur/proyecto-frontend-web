import { apiClient } from './axios.config';
import type { Comment, CreateCommentDto } from '../types/comment.types';

export const commentService = {
    getByPublication: async (publicationId: number) => {
        const response = await apiClient.get<Comment[]>(
            `/publication/${publicationId}/comment`
        );
        return response.data;
    },

    create: async (publicationId: number, data: CreateCommentDto) => {
        const response = await apiClient.post<Comment>(
            `/publication/${publicationId}/comment`,
            data
        );
        return response.data;
    },

    // CORREGIDO: Añadido commentId a la URL
    delete: async (publicationId: number, commentId: number) => {
        const response = await apiClient.delete(`/publication/${publicationId}/comment/${commentId}`);
        return response.data;
    }
};