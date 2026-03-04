import { useState } from 'react';
import { useAllOrders, useUpdateOrderStatus } from '@/api/orders/orders.hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    DELIVERED: 'bg-green-500/10 text-green-600 border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function AdminOrdersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const { data, isLoading } = useAllOrders({ page, limit: 15 });
    const updateStatusMutation = useUpdateOrderStatus();

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <p className="text-muted-foreground">Manage and track customer orders.</p>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
                <Input
                    placeholder="Search by order ID or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : data?.data?.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders found</TableCell></TableRow>
                        ) : (
                            data?.data?.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                                    <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{order.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{Number(order.total).toLocaleString('vi-VN')}₫</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(val) => updateStatusMutation.mutate({ id: order.id, status: val })}
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            <SelectTrigger className={`w-[130px] h-8 text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {data && data.totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}>Next</Button>
                </div>
            )}

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
                                    <p className="font-medium">{selectedOrder.user.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm mb-2 text-muted-foreground uppercase tracking-wider">Shipping Address</h4>
                                    <p className="font-medium">{selectedOrder.address.fullName}</p>
                                    <p className="text-sm">{selectedOrder.address.phone}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOrder.address.street}, {selectedOrder.address.district}, {selectedOrder.address.city}
                                    </p>
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
                                    {selectedOrder.items.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 items-center border-b pb-4 last:border-0">
                                            <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                                                {item.product.images[0] && <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.variant.size} / {item.variant.color}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-sm">{Number(item.price).toLocaleString('vi-VN')}₫</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{(selectedOrder.total - (selectedOrder.total >= 500000 ? 0 : 30000)).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{selectedOrder.total >= 500000 ? 'Free' : '30.000₫'}</span>
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
