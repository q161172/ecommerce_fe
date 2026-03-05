import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
    withCredentials: true,
});

// ─── Request Interceptor: attach access token ─────────────────────────────
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Response Interceptor: auto refresh on 401 ───────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Only intercept if user had a token (was logged in)
            // Anonymous 401s (e.g. public pages calling protected API) should just fail silently
            const hasToken = !!useAuthStore.getState().accessToken;
            if (!hasToken) return Promise.reject(error);

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const newToken = data.data.accessToken;
                useAuthStore.getState().setAccessToken(newToken);
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
