import { apiClient } from './axios.config';
import type { PageResponse, Pageable } from '../types/api.types';
import type { Notification } from '../types/notification.types';

export const notificationService = {
    getAll: async (params: Pageable) => {
        const response = await apiClient.get<PageResponse<Notification>>('/notifications', {
            params
        });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await apiClient.get<number>('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: number) => {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return response.data;
    }
};