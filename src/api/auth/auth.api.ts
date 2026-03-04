import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import type { LoginDto, RegisterDto, AuthResponse } from './auth.types';

export const loginApi = async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', dto);
    const result = data.data as AuthResponse;
    useAuthStore.getState().setAuth(result.user, result.accessToken);
    return result;
};

export const registerApi = async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', dto);
    const result = data.data as AuthResponse;
    useAuthStore.getState().setAuth(result.user, result.accessToken);
    return result;
};

export const logoutApi = async (): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
    } catch {
        /* ignore server errors on logout */
    }
    useAuthStore.getState().logout();
};

export const getMeApi = async (): Promise<AuthResponse['user']> => {
    const { data } = await apiClient.get('/auth/me');
    return data.data as AuthResponse['user'];
};
