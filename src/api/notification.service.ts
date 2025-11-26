import { apiClient } from './axios.config';
import type { PageResponse, Pageable } from '../types/api.types';
import type { Notification } from '../types/notification.types';

export const notificationService = {
    // Obtener todas las notificaciones (Paginado)
    getAll: async (params: Pageable) => {
        const response = await apiClient.get<PageResponse<Notification>>('/notifications', {
            params
        });
        return response.data;
    },

    // Obtener conteo de no leídas (Para el badge del Navbar)
    getUnreadCount: async () => {
        const response = await apiClient.get<number>('/notifications/unread-count');
        return response.data;
    },

    // Marcar una como leída (Al hacer clic)
    markAsRead: async (id: number) => {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return response.data;
    }
};