import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getCategoriesApi,
    getCategoryBySlugApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
} from '@/api/categories/categories.api';
import { keys } from './keys';

export const useCategories = () =>
    useQuery({
        queryKey: keys.categories.list(),
        queryFn: getCategoriesApi,
    });

export const useCategory = (slug: string) =>
    useQuery({
        queryKey: keys.categories.detail(slug),
        queryFn: () => getCategoryBySlugApi(slug),
        enabled: !!slug,
    });

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { name: string; slug?: string; description?: string; imageFile?: File }) =>
            createCategoryApi(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.categories.all });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, params }: { id: string; params: { name?: string; slug?: string; description?: string; imageFile?: File; removeImage?: boolean } }) =>
            updateCategoryApi(id, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.categories.all });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCategoryApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.categories.all });
        },
    });
};
