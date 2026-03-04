// All shared TypeScript types for the frontend

export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: 'ADMIN' | 'CUSTOMER';
    createdAt: string;
}

export interface Address {
    id: string;
    fullName: string;
    phone: string;
    street: string;
    district: string;
    city: string;
    isDefault: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    _count?: { products: number };
}

export interface ProductVariant {
    id: string;
    size: string;
    color: string;
    stock: number;
    sku: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
    categoryId: string;
    category: { name: string; slug: string };
    variants: ProductVariant[];
    reviews: { rating: number }[];
    createdAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    productName: string;
    variantInfo: string;
    product?: { images: string[]; slug: string; name: string };
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    subtotal: number;
    shippingFee: number;
    total: number;
    notes: string | null;
    createdAt: string;
    items: OrderItem[];
    payment: { status: PaymentStatus } | null;
    address: Address;
}

export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string; avatar: string | null };
}

export interface PaginatedResponse<T> {
    products?: T[];
    data?: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface AdminStats {
    kpis: {
        totalRevenue: number;
        monthRevenue: number;
        revenueGrowth: number;
        totalOrders: number;
        monthOrders: number;
        totalUsers: number;
        monthUsers: number;
        totalProducts: number;
    };
    recentOrders: (Order & { user: { name: string; email: string } })[];
    revenueByMonth: { month: string; revenue: number }[];
    topProducts: { productId: string; productName: string; _sum: { quantity: number } }[];
    ordersByStatus: { status: OrderStatus; _count: { _all: number } }[];
}
