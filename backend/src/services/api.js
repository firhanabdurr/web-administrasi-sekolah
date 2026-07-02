import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true; 

      try {
        const authStore = useAuthStore();
        
        const newToken = await authStore.refreshToken();
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
        
      } catch (refreshError) {
        const authStore = useAuthStore();
        authStore.forceLogout();
        
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan pada server';
    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

export default api;