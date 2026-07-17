import { apiClient } from '@/api/client';
import type { Order } from '@/types';
import type {
    CreateOrderDto,
    CreateOrderResponse,
    OrdersListParams,
    OrdersListResponse,
} from './orders.types';

export const createOrderApi = async (dto: CreateOrderDto): Promise<CreateOrderResponse> => {
    const { data } = await apiClient.post('/orders', dto);
    return data.data;
};

export const getMyOrdersApi = async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders/my');
    return data.data;
};

export const getMyOrderByIdApi = async (id: string): Promise<Order> => {
    const { data } = await apiClient.get(`/orders/my/${id}`);
    return data.data;
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getAllOrdersApi = async (
    params: OrdersListParams = {}
): Promise<OrdersListResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.status) query.append('status', params.status);
    const { data } = await apiClient.get(`/orders?${query}`);
    // API returns the list under `orders`; normalize to the `data` contract.
    return {
        data: data.orders ?? data.data ?? [],
        total: data.total ?? 0,
        page: data.page ?? params.page ?? 1,
        limit: data.limit ?? params.limit ?? 20,
        totalPages: data.totalPages ?? 1,
    };
};

export const updateOrderStatusApi = async (id: string, status: string): Promise<Order> => {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data.data;
};
