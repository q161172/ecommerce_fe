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
} from '@/api/users/users.api';
import type { UpdateProfileDto, AddressDto, UsersListParams } from '@/api/users/users.types';
import { keys } from './keys';

export const useProfile = () =>
    useQuery({
        queryKey: keys.users.profile,
        queryFn: getProfileApi,
    });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: UpdateProfileDto) => updateProfileApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.users.profile });
        },
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dto: AddressDto) => addAddressApi(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.users.profile });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: Partial<AddressDto> }) =>
            updateAddressApi(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.users.profile });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAddressApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.users.profile });
        },
    });
};

// ─── Admin hooks ─────────────────────────────────────────────────────────────
export const useUsers = (params: UsersListParams = {}) =>
    useQuery({
        queryKey: keys.users.list(params),
        queryFn: () => getUsersApi(params),
    });

export const useToggleUserActive = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => toggleUserActiveApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.users.all });
        },
    });
};

export const useChangeUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: 'ADMIN' | 'CUSTOMER' }) =>
            changeUserRoleApi(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.users.all });
        },
    });
};
