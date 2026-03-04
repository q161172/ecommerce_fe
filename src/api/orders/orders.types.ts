import type { OrderStatus, PaymentStatus } from '@/types';

// ─── Orders Request DTOs ─────────────────────────────────────────────────────
export interface CreateOrderDto {
    addressId: string;
    notes?: string;
}

export interface UpdateOrderStatusDto {
    status: OrderStatus;
}

// ─── Orders Query Params ─────────────────────────────────────────────────────
export interface OrdersListParams {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}

// ─── Orders Response Types ───────────────────────────────────────────────────
export interface CreateOrderResponse {
    order: import('@/types').Order;
    checkoutUrl: string;
}

export interface OrdersListResponse {
    data: import('@/types').Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type { OrderStatus, PaymentStatus };
