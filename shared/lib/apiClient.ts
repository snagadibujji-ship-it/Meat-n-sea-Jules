import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Safe cross-platform storage check: verify both window AND localStorage exist
    // to prevent React Native (which has a window object but no localStorage) from crashing
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const token = window.localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
