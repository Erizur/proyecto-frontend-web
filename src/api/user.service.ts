import { apiClient } from './axios.config';
import type { UserDetails, PublicUser, UpdateUserDto } from '../types/user.types';
import type { Pageable, PageResponse } from '../types/api.types';

interface UserPageResponse extends PageResponse<PublicUser> {}

export const userService = {
    // GET /user/{username} -> Info Pública (PublicUserDto)
    getByUsername: async (username: string) => {
        const response = await apiClient.get<PublicUser>(`/user/${username}`);
        return response.data;
    },

    // GET /user/i/{id} -> Info Completa/Privada (UserDetailsDto)
    // Este es el que usaremos para obtener contadores y detalles extra
    getById: async (id: number) => {
        const response = await apiClient.get<UserDetails>(`/user/i/${id}`);
        return response.data;
    },

    update: async (id: number, data: UpdateUserDto, watermark?: File) => {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (watermark) formData.append('watermark', watermark);

        const response = await apiClient.patch<UserDetails>(`/user/${id}`, formData, {
            headers: { 'Content-Type': null }
        });
        return response.data;
    },

    uploadAvatar: async (image: File) => {
        const formData = new FormData();
        formData.append('image', image);
        const response = await apiClient.post<UserDetails>('/user/avatar', formData, {
            headers: { 'Content-Type': null }
        });
        return response.data;
    },

    toggleFollow: async (userId: number) => {
        const response = await apiClient.post(`/user/${userId}/follow`);
        return response.data;
    },

    // Helper para verificar estado (Client-side check)
    checkIsFollowing: async (myUserId: number, targetUserId: number): Promise<boolean> => {
        try {
            const response = await userService.getFollowing(myUserId, { page: 0, size: 100 });
            return response.content.some(u => u.userId === targetUserId);
        } catch (error) {
            return false;
        }
    },

    getFollowing: async (userId: number, params: Pageable) => {
        const response = await apiClient.get<UserPageResponse>(`/user/${userId}/following`, { params });
        return response.data;
    },

    getFollowers: async (userId: number, params: Pageable) => {
        const response = await apiClient.get<UserPageResponse>(`/user/${userId}/followers`, { params });
        return response.data;
    },

    toggleSavePost: async (publicationId: number) => {
        const response = await apiClient.post(`/user/save/${publicationId}`);
        return response.data;
    },

    getSavedPosts: async (params: Pageable) => {
        const response = await apiClient.get('/user/saved', { params });
        return response.data;
    },

    switchRole: async () => {
        const response = await apiClient.patch('/user/switch-role');
        return response.data;
    }
};