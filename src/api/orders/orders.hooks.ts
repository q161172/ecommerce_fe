import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createOrderApi,
    getMyOrdersApi,
    getMyOrderByIdApi,
    getAllOrdersApi,
    updateOrderStatusApi,
} from './orders.api';
import type { CreateOrderDto, OrdersListParams } from './orders.types';

export const orderKeys = {
    all: ['orders'] as const,
    myOrders: () => ['orders', 'my'] as const,
    myOrder: (id: string) => ['orders', 'my', id] as const,
    adminList: (params: OrdersListParams) => ['orders', 'admin', 'list', params] as const,
};

export const useMyOrders = () =>
    useQuery({
        queryKey: orderKeys.myOrders(),
        queryFn: getMyOrdersApi,
    });

export const useMyOrder = (id: string) =>
    useQuery({
        queryKey: orderKeys.myOrder(id),
        queryFn: () => getMyOrderByIdApi(id),
        enabled: !!id,
    });

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateOrderDto) => createOrderApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
        },
    });
};

// ─── Admin hooks ─────────────────────────────────────────────────────────────
export const useAllOrders = (params: OrdersListParams = {}) =>
    useQuery({
        queryKey: orderKeys.adminList(params),
        queryFn: () => getAllOrdersApi(params),
    });

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateOrderStatusApi(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
};
