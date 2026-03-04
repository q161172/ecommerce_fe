import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginApi, registerApi, logoutApi, getMeApi } from './auth.api';
import type { LoginDto, RegisterDto } from './auth.types';

export const authKeys = {
    me: ['auth', 'me'] as const,
};

export const useMe = () =>
    useQuery({
        queryKey: authKeys.me,
        queryFn: getMeApi,
        retry: false,
    });

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: LoginDto) => loginApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.me });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: RegisterDto) => registerApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.me });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.clear();
        },
    });
};
