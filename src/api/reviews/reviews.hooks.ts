import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductReviewsApi, createReviewApi, deleteReviewApi } from './reviews.api';
import type { CreateReviewDto } from './reviews.types';

export const reviewKeys = {
    all: ['reviews'] as const,
    forProduct: (productId: string) => ['reviews', 'product', productId] as const,
};

export const useProductReviews = (productId: string) =>
    useQuery({
        queryKey: reviewKeys.forProduct(productId),
        queryFn: () => getProductReviewsApi(productId),
        enabled: !!productId,
    });

export const useCreateReview = (productId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateReviewDto) => createReviewApi(productId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.forProduct(productId) });
        },
    });
};

export const useDeleteReview = (productId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteReviewApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.forProduct(productId) });
        },
    });
};
