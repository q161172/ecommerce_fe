import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getCartApi,
    addCartItemApi,
    updateCartItemApi,
    removeCartItemApi,
    clearCartApi,
} from '@/api/cart/cart.api';
import { useAuthStore } from '@/store/authStore';
import { keys } from './keys';

export const useCart = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: keys.cart.root,
        queryFn: getCartApi,
        enabled: isAuthenticated,
    });
};

export const useAddCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            productId,
            variantId,
            quantity,
        }: {
            productId: string;
            variantId: string;
            quantity: number;
        }) => addCartItemApi(productId, variantId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.cart.root });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            updateCartItemApi(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.cart.root });
        },
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) => removeCartItemApi(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.cart.root });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearCartApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.cart.root });
        },
    });
};
