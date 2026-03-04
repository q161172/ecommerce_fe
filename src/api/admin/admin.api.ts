import { apiClient } from '@/api/client';
import type { AdminStatsResponse } from './admin.types';

export const getAdminStatsApi = async (): Promise<AdminStatsResponse> => {
    const { data } = await apiClient.get('/admin/stats');
    return data.data;
};
