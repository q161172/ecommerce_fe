// ─── Users Request DTOs ──────────────────────────────────────────────────────
export interface UpdateProfileDto {
    name?: string;
    avatar?: string;
}

export interface AddressDto {
    fullName: string;
    phone: string;
    street: string;
    district: string;
    city: string;
    isDefault?: boolean;
}

// ─── Users Query Params ──────────────────────────────────────────────────────
export interface UsersListParams {
    page?: number;
    limit?: number;
    search?: string;
}

// ─── Users Response Types ────────────────────────────────────────────────────

/** Address as returned from the server */
export interface Address {
    id: string;
    fullName: string;
    phone: string;
    street: string;
    district: string;
    city: string;
    isDefault: boolean;
}

/** Full profile including addresses — returned by GET /users/me */
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: 'ADMIN' | 'CUSTOMER';
    isActive: boolean;
    createdAt: string;
    addresses: Address[];
}

/** Compact user row used in admin user list */
export interface UserItem {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: 'ADMIN' | 'CUSTOMER';
    isActive: boolean;
    createdAt: string;
}

export interface UsersListResponse {
    data: UserItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
