import { useQuery } from '@tanstack/react-query';
import { getAdminStatsApi } from '@/api/admin/admin.api';
import { keys } from './keys';

export const useAdminStats = () =>
    useQuery({
        queryKey: keys.admin.stats,
        queryFn: getAdminStatsApi,
    });
