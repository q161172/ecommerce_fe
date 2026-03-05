import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createOrderApi,
    getMyOrdersApi,
    getMyOrderByIdApi,
    getAllOrdersApi,
    updateOrderStatusApi,
} from '@/api/orders/orders.api';
import type { CreateOrderDto, OrdersListParams } from '@/api/orders/orders.types';
import { keys } from './keys';

export const useMyOrders = () =>
    useQuery({
        queryKey: keys.orders.myOrders(),
        queryFn: getMyOrdersApi,
    });

export const useMyOrder = (id: string) =>
    useQuery({
        queryKey: keys.orders.myOrder(id),
        queryFn: () => getMyOrderByIdApi(id),
        enabled: !!id,
    });

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateOrderDto) => createOrderApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.orders.myOrders() });
        },
    });
};

// ─── Admin hooks ─────────────────────────────────────────────────────────────
export const useAllOrders = (params: OrdersListParams = {}) =>
    useQuery({
        queryKey: keys.orders.adminList(params),
        queryFn: () => getAllOrdersApi(params),
    });

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateOrderStatusApi(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.orders.all });
        },
    });
};
