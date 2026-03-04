import { apiClient } from '@/api/client';
import type { ReviewItem, CreateReviewDto } from './reviews.types';

export const getProductReviewsApi = async (productId: string): Promise<ReviewItem[]> => {
    const { data } = await apiClient.get(`/reviews/product/${productId}`);
    return data.data;
};

export const createReviewApi = async (
    productId: string,
    dto: CreateReviewDto
): Promise<ReviewItem> => {
    const { data } = await apiClient.post(`/reviews/product/${productId}`, dto);
    return data.data;
};

export const deleteReviewApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
};
