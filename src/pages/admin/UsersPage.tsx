import { useState } from 'react';
import { useUsers, useToggleUserActive, useChangeUserRole } from '@/api/users/users.hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

interface UserRow {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: 'ADMIN' | 'CUSTOMER';
    isActive: boolean;
    createdAt: string;
}

interface UsersResponse {
    data: UserRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function AdminUsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data, isLoading } = useUsers({ page, limit: 15, search: search || undefined });

    const toggleActiveMutation = useToggleUserActive();
    const changeRoleMutation = useChangeUserRole();

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage customers and admin accounts.</p>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative flex items-center max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : !data?.data?.length ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold overflow-hidden">
                                                {user.avatar
                                                    ? <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                                    : user.name.charAt(0).toUpperCase()
                                                }
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                            className="gap-1"
                                        >
                                            {user.role === 'ADMIN'
                                                ? <ShieldAlert className="w-3 h-3" />
                                                : <Shield className="w-3 h-3" />
                                            }
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.isActive ? 'outline' : 'destructive'}
                                            className={user.isActive ? 'text-green-600 border-green-200 bg-green-50' : ''}
                                        >
                                            {user.isActive ? 'Active' : 'Banned'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        const newRole: 'ADMIN' | 'CUSTOMER' =
                                                            user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
                                                        if (confirm(`Change role to ${newRole}?`)) {
                                                            changeRoleMutation.mutate({ id: user.id, role: newRole });
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
                                                            toggleActiveMutation.mutate(user.id);
                                                        }
                                                    }}
                                                >
                                                    {user.isActive ? (
                                                        <><Ban className="w-4 h-4 mr-2" /> Ban User</>
                                                    ) : (
                                                        <><CheckCircle className="w-4 h-4 mr-2" /> Unban User</>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground px-2">
                        {page} / {data.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
