import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProductsApi,
    getProductBySlugApi,
    createProductApi,
    updateProductApi,
    deleteProductApi,
} from '@/api/products/products.api';
import type { ProductFilter } from '@/api/products/products.types';
import { keys } from './keys';

export const useProducts = (filter: ProductFilter = {}) =>
    useQuery({
        queryKey: keys.products.list(filter),
        queryFn: () => getProductsApi(filter),
    });

export const useProduct = (slug: string) =>
    useQuery({
        queryKey: keys.products.detail(slug),
        queryFn: () => getProductBySlugApi(slug),
        enabled: !!slug,
    });

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => createProductApi(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.products.all });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            updateProductApi(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.products.all });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProductApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.products.all });
        },
    });
};
