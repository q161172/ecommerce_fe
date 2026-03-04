// ─── Reviews Request DTOs ────────────────────────────────────────────────────
export interface CreateReviewDto {
    rating: number;
    comment?: string;
}

// ─── Reviews Response Types ──────────────────────────────────────────────────
export interface ReviewItem {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string;
        avatar: string | null;
    };
}
