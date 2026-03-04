import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProfileApi,
    updateProfileApi,
    addAddressApi,
    updateAddressApi,
    deleteAddressApi,
    getUsersApi,
    toggleUserActiveApi,
    changeUserRoleApi,
} from './users.api';
import type { UpdateProfileDto, AddressDto, UsersListParams } from './users.types';

export const userKeys = {
    profile: ['users', 'me'] as const,
    list: (params: UsersListParams) => ['users', 'list', params] as const,
};

export const useProfile = () =>
    useQuery({
        queryKey: userKeys.profile,
        queryFn: getProfileApi,
    });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: UpdateProfileDto) => updateProfileApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: AddressDto) => addAddressApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: Partial<AddressDto> }) =>
            updateAddressApi(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAddressApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
};

// ─── Admin hooks ─────────────────────────────────────────────────────────────
export const useUsers = (params: UsersListParams = {}) =>
    useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => getUsersApi(params),
    });

export const useToggleUserActive = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => toggleUserActiveApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
        },
    });
};

export const useChangeUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: 'ADMIN' | 'CUSTOMER' }) =>
            changeUserRoleApi(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
        },
    });
};
