import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProductsApi,
    getProductBySlugApi,
    createProductApi,
    updateProductApi,
    deleteProductApi,
} from './products.api';
import type { ProductFilter } from './products.types';

export const productKeys = {
    all: ['products'] as const,
    list: (filter: ProductFilter) => ['products', 'list', filter] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
};

export const useProducts = (filter: ProductFilter = {}) =>
    useQuery({
        queryKey: productKeys.list(filter),
        queryFn: () => getProductsApi(filter),
    });

export const useProduct = (slug: string) =>
    useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => getProductBySlugApi(slug),
        enabled: !!slug,
    });

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => createProductApi(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            updateProductApi(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProductApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};
