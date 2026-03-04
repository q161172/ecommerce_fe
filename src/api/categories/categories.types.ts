// ─── Categories Request DTOs ─────────────────────────────────────────────────
export interface CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }

// ─── Categories Response Types ───────────────────────────────────────────────
export interface CategoryItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    _count?: { products: number };
}
