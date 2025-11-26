import axios from 'axios';
import constants from '../components/common/constants';

const API_BASE_URL = constants.API_HOST;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                    withCredentials: true
                });
                
                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // ✅ CORRECCIÓN: Borrar TODA la sesión para evitar el bucle
                localStorage.removeItem('token');
                localStorage.removeItem('session'); 
                localStorage.removeItem('expiresOn');
                
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);