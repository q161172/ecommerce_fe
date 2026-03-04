import { apiClient } from '@/api/client';
import type { CartResponse } from './cart.types';

export const getCartApi = async (): Promise<CartResponse> => {
    const { data } = await apiClient.get('/cart');
    return data.data;
};

export const addCartItemApi = async (
    productId: string,
    variantId: string,
    quantity: number
): Promise<CartResponse> => {
    const { data } = await apiClient.post('/cart/items', { productId, variantId, quantity });
    return data.data;
};

export const updateCartItemApi = async (
    itemId: string,
    quantity: number
): Promise<CartResponse> => {
    const { data } = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return data.data;
};

export const removeCartItemApi = async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`);
};

export const clearCartApi = async (): Promise<void> => {
    await apiClient.delete('/cart');
};
