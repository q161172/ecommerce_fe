import { apiClient } from '@/api/client';
import type {
    UpdateProfileDto,
    AddressDto,
    UsersListParams,
    UsersListResponse,
    UserItem,
    UserProfile,
    Address,
} from './users.types';

// ─── User Profile ─────────────────────────────────────────────────────────────
export const getProfileApi = async (): Promise<UserProfile> => {
    const { data } = await apiClient.get('/users/me');
    return data.data;
};

export const updateProfileApi = async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await apiClient.put('/users/me', dto);
    return data.data;
};

// ─── Addresses ───────────────────────────────────────────────────────────────
export const addAddressApi = async (dto: AddressDto): Promise<Address> => {
    const { data } = await apiClient.post('/users/me/addresses', dto);
    return data.data;
};

export const updateAddressApi = async (
    id: string,
    dto: Partial<AddressDto>
): Promise<Address> => {
    const { data } = await apiClient.put(`/users/me/addresses/${id}`, dto);
    return data.data;
};

export const deleteAddressApi = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/me/addresses/${id}`);
};

// ─── Admin: Users ────────────────────────────────────────────────────────────
export const getUsersApi = async (params: UsersListParams = {}): Promise<UsersListResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    const { data } = await apiClient.get(`/users?${query}`);
    return data;
};

export const toggleUserActiveApi = async (id: string): Promise<UserItem> => {
    const { data } = await apiClient.patch(`/users/${id}/toggle-active`);
    return data.data;
};

export const changeUserRoleApi = async (
    id: string,
    role: 'ADMIN' | 'CUSTOMER'
): Promise<UserItem> => {
    const { data } = await apiClient.patch(`/users/${id}/role`, { role });
    return data.data;
};
