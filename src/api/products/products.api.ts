import { apiClient } from '@/api/client';
import type { Product } from '@/types';
import type { ProductFilter, ProductsResponse } from './products.types';

export const getProductsApi = async (filter: ProductFilter = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const { data } = await apiClient.get(`/products?${params}`);
    return data;
};

export const getProductBySlugApi = async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${slug}`);
    return data.data;
};

export const createProductApi = async (formData: FormData): Promise<Product> => {
    const { data } = await apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
};

export const updateProductApi = async (id: string, formData: FormData): Promise<Product> => {
    const { data } = await apiClient.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
};

export const deleteProductApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
};
