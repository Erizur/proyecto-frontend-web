import { apiClient } from './axios.config';

export const authService = {
    forgotPassword: async (email: string) => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Restablece la contraseña usando el token
    resetPassword: async (token: string, newPassword: string) => {
        const response = await apiClient.post('/auth/reset-password', { 
            token, 
            newPassword 
        });
        return response.data;
    }
};