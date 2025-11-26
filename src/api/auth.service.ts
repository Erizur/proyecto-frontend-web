import { apiClient } from './axios.config';

export const authService = {
    // Envía el correo de recuperación
    forgotPassword: async (email: string) => {
        // Backend: POST /auth/forgot-password body: { email }
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Restablece la contraseña usando el token
    resetPassword: async (token: string, newPassword: string) => {
        // Backend: POST /auth/reset-password body: { token, newPassword }
        const response = await apiClient.post('/auth/reset-password', { 
            token, 
            newPassword 
        });
        return response.data;
    }
};