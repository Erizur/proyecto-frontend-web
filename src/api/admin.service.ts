import { apiClient } from './axios.config';
import type { PageResponse, Pageable } from '../types/api.types';
import type { Report, Appeal, FailedTask, ReportStatus, AppealStatus } from '../types/admin.types';

export const adminService = {
    getReports: async (status: ReportStatus, params: Pageable) => {
        const response = await apiClient.get<PageResponse<Report>>('/admin/moderation/reports', {
            params: { status, ...params }
        });
        return response.data;
    },

    resolveReport: async (id: number, status: ReportStatus, notes: string) => {
        await apiClient.patch(`/admin/moderation/reports/${id}/resolve`, { status, notes });
    },

    getAppeals: async (params: Pageable) => {
        const response = await apiClient.get<PageResponse<Appeal>>('/appeal/admin/list', { params });
        return response.data;
    },

    resolveAppeal: async (id: number, status: AppealStatus, notes: string) => {
        await apiClient.patch(`/appeal/admin/${id}/resolve`, { status, adminNotes: notes });
    },

    getFailedPlaceTasks: async (params: Pageable) => {
        const response = await apiClient.get<PageResponse<FailedTask>>('/admin/moderation/tasks/place/failed', { params });
        return response.data;
    },

    retryPlaceTask: async (taskId: number) => {
        await apiClient.post(`/admin/moderation/tasks/place/${taskId}/retry`);
    },

    dismissPlaceTask: async (taskId: number) => {
        await apiClient.delete(`/admin/moderation/tasks/place/${taskId}`);
    },

    getFailedAiTasks: async (params: Pageable) => {
        const response = await apiClient.get<PageResponse<FailedTask>>('/admin/moderation/tasks/ai/failed', { params });
        return response.data;
    },

    retryAiTask: async (taskId: number) => {
        await apiClient.post(`/admin/moderation/tasks/ai/${taskId}/retry`);
    },

    dismissAiTask: async (taskId: number) => {
        await apiClient.delete(`/admin/moderation/tasks/ai/${taskId}`);
    }
};