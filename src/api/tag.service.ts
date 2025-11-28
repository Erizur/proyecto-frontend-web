import { apiClient } from './axios.config';

export const tagService = {
    delete: async (id: number) => {
        await apiClient.delete(`/tag/${id}`);
    }
};