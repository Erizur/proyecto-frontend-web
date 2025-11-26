import { apiClient } from './axios.config';
import type { CreateReportDto } from '../types/report.types';

export const reportService = {
    create: async (data: CreateReportDto) => {
        const response = await apiClient.post('/report', data);
        return response.data;
    }
};
