import { useQuery } from '@tanstack/react-query';
import { getAdminStatsApi } from './admin.api';

export const adminKeys = {
    stats: ['admin', 'stats'] as const,
};

export const useAdminStats = () =>
    useQuery({
        queryKey: adminKeys.stats,
        queryFn: getAdminStatsApi,
    });
