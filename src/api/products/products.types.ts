// ─── Products Query Params ───────────────────────────────────────────────────
export interface ProductFilter {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    sort?: string;
}

// ─── Products Request DTOs ───────────────────────────────────────────────────
export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    categoryId: string;
    isFeatured?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> { }

// ─── Products Response Types ─────────────────────────────────────────────────
export interface ProductsResponse {
    products: import('@/types').Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
