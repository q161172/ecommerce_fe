/**
 * Centralized TanStack Query key factory.
 * Import from here to ensure type-safe, consistent cache keys across all hooks.
 */

import type { ProductFilter } from '@/api/products/products.types';
import type { OrdersListParams } from '@/api/orders/orders.types';
import type { UsersListParams } from '@/api/users/users.types';

export const keys = {
    // ── Auth ──────────────────────────────────────────────────────────────────
    auth: {
        me: ['auth', 'me'] as const,
    },

    // ── Cart ──────────────────────────────────────────────────────────────────
    cart: {
        root: ['cart'] as const,
    },

    // ── Products ──────────────────────────────────────────────────────────────
    products: {
        all:    ['products'] as const,
        list:   (filter: ProductFilter) => ['products', 'list', filter] as const,
        detail: (slug: string)          => ['products', 'detail', slug] as const,
    },

    // ── Categories ────────────────────────────────────────────────────────────
    categories: {
        all:    ['categories'] as const,
        list:   ()             => ['categories', 'list'] as const,
        detail: (slug: string) => ['categories', 'detail', slug] as const,
    },

    // ── Reviews ───────────────────────────────────────────────────────────────
    reviews: {
        all:        ['reviews'] as const,
        forProduct: (productId: string) => ['reviews', 'product', productId] as const,
    },

    // ── Orders ────────────────────────────────────────────────────────────────
    orders: {
        all:       ['orders'] as const,
        myOrders:  ()                    => ['orders', 'my'] as const,
        myOrder:   (id: string)          => ['orders', 'my', id] as const,
        adminList: (params: OrdersListParams) => ['orders', 'admin', 'list', params] as const,
    },

    // ── Users ─────────────────────────────────────────────────────────────────
    users: {
        all:     ['users'] as const,
        profile: ['users', 'me'] as const,
        list:    (params: UsersListParams) => ['users', 'list', params] as const,
    },

    // ── Admin ─────────────────────────────────────────────────────────────────
    admin: {
        stats: ['admin', 'stats'] as const,
    },
} as const;
