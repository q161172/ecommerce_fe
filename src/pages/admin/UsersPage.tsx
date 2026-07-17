import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef, type OnChangeFn, type PaginationState } from '@tanstack/react-table';
import { useUsers, useToggleUserActive, useChangeUserRole } from '@/hooks';
import type { UserItem } from '@/api/users/users.types';
import { DataTable } from '@/components/data-table-new';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { MoreVertical, Search, Shield, ShieldAlert, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    // Debounce free-text search → server query (reset to first page on change)
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    const { data, isLoading, refetch } = useUsers({
        page,
        limit,
        search: search || undefined,
    });

    const users = data?.data ?? [];

    const toggleActiveMutation = useToggleUserActive();
    const changeRoleMutation = useChangeUserRole();

    const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
        const prev: PaginationState = { pageIndex: page - 1, pageSize: limit };
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (next.pageSize !== limit) {
            setLimit(next.pageSize);
            setPage(1);
        } else {
            setPage(next.pageIndex + 1);
        }
    };

    const columns = useMemo<ColumnDef<UserItem>[]>(() => [
        {
            id: 'user',
            header: 'User',
            accessorFn: (row) => row.name,
            meta: { title: 'User' },
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                        {row.original.avatar
                            ? <img src={row.original.avatar} className="w-full h-full object-cover" alt={row.original.name} />
                            : row.original.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            meta: { title: 'Email' },
            cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
        },
        {
            accessorKey: 'role',
            header: 'Role',
            meta: { title: 'Role' },
            cell: ({ row }) => (
                <Badge variant={row.original.role === 'ADMIN' ? 'default' : 'secondary'} className="gap-1">
                    {row.original.role === 'ADMIN'
                        ? <ShieldAlert className="w-3 h-3" />
                        : <Shield className="w-3 h-3" />}
                    {row.original.role}
                </Badge>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            meta: { title: 'Status' },
            cell: ({ row }) => (
                <Badge
                    variant={row.original.isActive ? 'outline' : 'destructive'}
                    className={row.original.isActive ? 'text-green-600 border-green-200 bg-green-50' : ''}
                >
                    {row.original.isActive ? 'Active' : 'Banned'}
                </Badge>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
            meta: { title: 'Joined' },
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
                </span>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => {
                                        const newRole: 'ADMIN' | 'CUSTOMER' = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
                                        if (confirm(`Change role to ${newRole}?`)) {
                                            changeRoleMutation.mutate(
                                                { id: user.id, role: newRole },
                                                {
                                                    onSuccess: () => toast.success(`Role updated to ${newRole}`),
                                                    onError: () => toast.error('Failed to change role'),
                                                },
                                            );
                                        }
                                    }}
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Make {user.role === 'ADMIN' ? 'Customer' : 'Admin'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={user.isActive ? 'text-destructive' : 'text-green-600'}
                                    onClick={() => {
                                        if (confirm(`Are you sure you want to ${user.isActive ? 'ban' : 'unban'} ${user.name}?`)) {
                                            toggleActiveMutation.mutate(user.id, {
                                                onSuccess: () => toast.success(user.isActive ? 'User banned' : 'User unbanned'),
                                                onError: () => toast.error('Failed to update user'),
                                            });
                                        }
                                    }}
                                >
                                    {user.isActive
                                        ? <><Ban className="w-4 h-4 mr-2" /> Ban User</>
                                        : <><CheckCircle className="w-4 h-4 mr-2" /> Unban User</>}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ], [changeRoleMutation, toggleActiveMutation]);

    return (
        <div className="p-8">
            <DataTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                onReload={() => refetch()}
                titleTable="Users"
                descripTable="Manage customers and admin accounts."
                hiddenSearch
                enableSorting={false}
                manualPagination
                pageCount={data?.totalPages ?? 1}
                totalItems={data?.total ?? 0}
                onPaginationChange={handlePaginationChange}
                state={{ pagination: { pageIndex: page - 1, pageSize: limit } }}
                pageSizeOptions={[10, 15, 20, 30, 50]}
                noResults="No users found"
                filterToolbar={
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or email..."
                            className="pl-9 h-9"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                }
            />
        </div>
    );
}
