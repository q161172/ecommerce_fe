import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getCategoriesApi,
    getCategoryBySlugApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
} from './categories.api';

export const categoryKeys = {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
};

export const useCategories = () =>
    useQuery({
        queryKey: categoryKeys.list(),
        queryFn: getCategoriesApi,
    });

export const useCategory = (slug: string) =>
    useQuery({
        queryKey: categoryKeys.detail(slug),
        queryFn: () => getCategoryBySlugApi(slug),
        enabled: !!slug,
    });

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { name: string; slug?: string; description?: string; imageFile?: File }) =>
            createCategoryApi(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: { name?: string; slug?: string; description?: string; imageFile?: File; removeImage?: boolean } }) =>
            updateCategoryApi(id, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCategoryApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.all });
        },
    });
};
