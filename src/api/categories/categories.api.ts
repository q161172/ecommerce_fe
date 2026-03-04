import { apiClient } from '@/api/client';
import type { CategoryItem } from './categories.types';

export const getCategoriesApi = async (): Promise<CategoryItem[]> => {
    const { data } = await apiClient.get('/categories');
    return data.data;
};

export const getCategoryBySlugApi = async (slug: string): Promise<CategoryItem> => {
    const { data } = await apiClient.get(`/categories/${slug}`);
    return data.data;
};

export const createCategoryApi = async (params: {
    name: string;
    slug?: string;
    description?: string;
    imageFile?: File;
}): Promise<CategoryItem> => {
    const formData = new FormData();
    formData.append('name', params.name);
    if (params.slug) formData.append('slug', params.slug);
    if (params.description) formData.append('description', params.description);
    if (params.imageFile) formData.append('image', params.imageFile);

    const { data } = await apiClient.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
};

export const updateCategoryApi = async (id: string, params: {
    name?: string;
    slug?: string;
    description?: string;
    imageFile?: File;
    removeImage?: boolean;
}): Promise<CategoryItem> => {
    const formData = new FormData();
    if (params.name) formData.append('name', params.name);
    if (params.slug) formData.append('slug', params.slug);
    if (params.description) formData.append('description', params.description);
    if (params.imageFile) formData.append('image', params.imageFile);
    if (params.removeImage) formData.append('removeImage', 'true');

    const { data } = await apiClient.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
};

export const deleteCategoryApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
};
