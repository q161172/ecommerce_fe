import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getCartApi,
    addCartItemApi,
    updateCartItemApi,
    removeCartItemApi,
    clearCartApi,
} from './cart.api';

export const cartKeys = {
    cart: ['cart'] as const,
};

export const useCart = () =>
    useQuery({
        queryKey: cartKeys.cart,
        queryFn: getCartApi,
    });

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
            queryClient.invalidateQueries({ queryKey: cartKeys.cart });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            updateCartItemApi(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart });
        },
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) => removeCartItemApi(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearCartApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart });
        },
    });
};
