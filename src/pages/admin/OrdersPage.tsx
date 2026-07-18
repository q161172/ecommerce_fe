import { useMemo, useState } from 'react';
import { type ColumnDef, type OnChangeFn, type PaginationState } from '@tanstack/react-table';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks';
import type { OrderStatus } from '@/types';
import { DataTable } from '@/components/data-table-new';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    DELIVERED: 'bg-green-500/10 text-green-600 border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// The admin orders endpoint returns richer objects than the base Order type
// (joined user + full address + expanded items), so describe them locally.
interface AdminOrderItem {
    id: string;
    quantity: number;
    price: number;
    product?: { name: string; images: string[] } | null;
    variant?: { size: string; color: string } | null;
}

interface AdminOrder {
    id: string;
    createdAt: string;
    total: number;
    subtotal?: number;
    shippingFee?: number;
    notes: string | null;
    status: OrderStatus;
    user?: { name: string; email: string } | null;
    address?: { fullName: string; phone: string; street: string; district: string; city: string } | null;
    items?: AdminOrderItem[];
}

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    const { data, isLoading, refetch } = useAllOrders({
        page,
        limit,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
    });

    const orders = (data?.data ?? []) as unknown as AdminOrder[];

    const updateStatusMutation = useUpdateOrderStatus();

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

    const columns = useMemo<ColumnDef<AdminOrder>[]>(() => [
        {
            id: 'id',
            header: 'Order ID',
            meta: { title: 'Order ID' },
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(0, 8)}</span>,
        },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            meta: { title: 'Date' },
            cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy'),
        },
        {
            id: 'customer',
            header: 'Customer',
            accessorFn: (row) => row.user?.name ?? '',
            meta: { title: 'Customer' },
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.user?.email}</p>
                </div>
            ),
        },
        {
            accessorKey: 'total',
            header: 'Total',
            meta: { title: 'Total' },
            cell: ({ row }) => (
                <span className="font-medium">{Number(row.original.total).toLocaleString('vi-VN')}₫</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            meta: { title: 'Status' },
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <Select
                        value={order.status}
                        onValueChange={(val) =>
                            updateStatusMutation.mutate(
                                { id: order.id, status: val },
                                {
                                    onSuccess: () => toast.success('Order status updated'),
                                    onError: () => toast.error('Failed to update status'),
                                },
                            )}
                        disabled={updateStatusMutation.isPending}
                    >
                        <SelectTrigger className={`w-[130px] h-8 text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s.charAt(0) + s.slice(1).toLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(row.original)}>
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ], [updateStatusMutation]);

    return (
        <div className="p-8">
            <DataTable
                columns={columns}
                data={orders}
                isLoading={isLoading}
                onReload={() => refetch()}
                titleTable="Orders"
                descripTable="Manage and track customer orders."
                hiddenSearch
                enableSorting={false}
                manualPagination
                pageCount={data?.totalPages ?? 1}
                totalItems={data?.total ?? 0}
                onPaginationChange={handlePaginationChange}
                state={{ pagination: { pageIndex: page - 1, pageSize: limit } }}
                pageSizeOptions={[10, 15, 20, 30, 50]}
                noResults="No orders found"
                filterToolbar={
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val as OrderStatus | 'ALL');
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="h-9 w-[160px]">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All statuses</SelectItem>
                            {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s.charAt(0) + s.slice(1).toLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                }
            />

            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Order Details #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="grid grid-cols-2 gap-8 py-4">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wider">Customer</h4>
                                    <p className="font-medium">{selectedOrder.user?.name ?? '—'}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.user?.email ?? '—'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wider">Shipping Address</h4>
                                    {selectedOrder.address ? (
                                        <>
                                            <p className="font-medium">{selectedOrder.address.fullName}</p>
                                            <p className="text-sm">{selectedOrder.address.phone}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {[selectedOrder.address.street, selectedOrder.address.district, selectedOrder.address.city]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No address on file.</p>
                                    )}
                                </div>
                                {selectedOrder.notes && (
                                    <div>
                                        <h4 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wider">Notes</h4>
                                        <p className="text-sm p-3 bg-muted rounded-md">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-sm mb-4 text-muted-foreground uppercase tracking-wider">Order Items</h4>
                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4">
                                    {(selectedOrder.items ?? []).map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center border-b pb-4 last:border-0">
                                            <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                                                {item.product?.images?.[0] && <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.product?.name ?? 'Product'}</p>
                                                {item.variant && (
                                                    <p className="text-xs text-muted-foreground">{item.variant.size} / {item.variant.color}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-sm">{Number(item.price).toLocaleString('vi-VN')}₫</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>
                                            {Number(
                                                selectedOrder.subtotal ??
                                                selectedOrder.total - (selectedOrder.total >= 500000 ? 0 : 30000),
                                            ).toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>
                                            {(selectedOrder.shippingFee ?? (selectedOrder.total >= 500000 ? 0 : 30000)) === 0
                                                ? 'Free'
                                                : `${Number(selectedOrder.shippingFee ?? 30000).toLocaleString('vi-VN')}₫`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span>{Number(selectedOrder.total).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
