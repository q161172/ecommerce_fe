import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginApi, registerApi, logoutApi, getMeApi } from '@/api/auth/auth.api';
import type { LoginDto, RegisterDto } from '@/api/auth/auth.types';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { keys } from './keys';

export const useMe = () =>
    useQuery({
        queryKey: keys.auth.me,
        queryFn: getMeApi,
        retry: false,
    });

export const useLogin = () => {
    const queryClient = useQueryClient();
    const { clearCart } = useCartStore();
    return useMutation({
        mutationFn: (dto: LoginDto) => loginApi(dto),
        onSuccess: () => {
            clearCart();
            localStorage.removeItem('cart-storage');
            queryClient.invalidateQueries({ queryKey: keys.auth.me });
            queryClient.invalidateQueries({ queryKey: keys.cart.root });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: RegisterDto) => registerApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.auth.me });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuthStore();
    const { clearCart, closeCart } = useCartStore();
    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            logout();
            clearCart();
            closeCart();
            localStorage.removeItem('cart-storage');
            queryClient.clear();
        },
    });
};
