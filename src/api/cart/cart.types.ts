// ─── Cart Request DTOs ───────────────────────────────────────────────────────
export interface AddCartItemDto {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

// ─── Cart Response Types ─────────────────────────────────────────────────────
export interface CartItemResponse {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
    };
    variant: {
        id: string;
        size: string;
        color: string;
        stock: number;
        sku: string;
    };
}

export interface CartResponse {
    id: string;
    userId: string;
    items: CartItemResponse[];
}
