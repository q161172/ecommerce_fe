import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductReviewsApi, createReviewApi, deleteReviewApi } from '@/api/reviews/reviews.api';
import type { CreateReviewDto } from '@/api/reviews/reviews.types';
import { keys } from './keys';

export const useProductReviews = (productId: string) =>
    useQuery({
        queryKey: keys.reviews.forProduct(productId),
        queryFn: () => getProductReviewsApi(productId),
        enabled: !!productId,
    });

export const useCreateReview = (productId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateReviewDto) => createReviewApi(productId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.reviews.forProduct(productId) });
        },
    });
};

export const useDeleteReview = (productId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteReviewApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.reviews.forProduct(productId) });
        },
    });
};
