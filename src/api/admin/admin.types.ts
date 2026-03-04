// ─── Admin Response Types ────────────────────────────────────────────────────

export interface TopProduct {
    id: string;
    name: string;
    price: string | number;
    images: string[];
    orderItems: { quantity: number }[];
}

/** Flat stats object returned by GET /admin/stats */
export interface AdminStatsResponse {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    topProducts: TopProduct[];
}

export interface ChangeRoleDto {
    role: 'ADMIN' | 'CUSTOMER';
}
