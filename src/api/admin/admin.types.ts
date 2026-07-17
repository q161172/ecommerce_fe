import type { OrderStatus, PaymentStatus } from '@/types';

// ─── Admin Response Types ────────────────────────────────────────────────────

export interface DashboardKpis {
    totalRevenue: number;
    monthRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    monthOrders: number;
    totalUsers: number;
    monthUsers: number;
    totalProducts: number;
}

export interface TopProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    quantitySold: number;
}

export interface RevenuePoint {
    month: string; // 'YYYY-MM'
    revenue: number;
}

export interface OrdersByStatusItem {
    status: OrderStatus;
    _count: { _all: number };
}

export interface RecentOrder {
    id: string;
    total: string | number;
    status: OrderStatus;
    createdAt: string;
    user: { name: string; email: string };
    payment: { status: PaymentStatus } | null;
}

/** Full stats object returned by GET /admin/stats */
export interface AdminStatsResponse {
    kpis: DashboardKpis;
    recentOrders: RecentOrder[];
    revenueByMonth: RevenuePoint[];
    topProducts: TopProduct[];
    ordersByStatus: OrdersByStatusItem[];
}

export interface ChangeRoleDto {
    role: 'ADMIN' | 'CUSTOMER';
}
