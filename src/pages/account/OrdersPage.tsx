import { useMyOrders } from '@/api/orders/orders.hooks';
import { format } from 'date-fns';
import { Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrdersPage() {
    const { data: response, isLoading } = useMyOrders();

    return (
        <div className="pt-24 pb-20 min-h-screen" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <span className="section-tag">Account</span>
                    <h1 className="section-title">Order History</h1>
                    <div className="section-divider" />
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <div key={i} className="card h-32 skeleton" />)}
                    </div>
                ) : response?.length === 0 ? (
                    <div className="text-center py-24 card">
                        <Package size={48} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--color-stone)' }} />
                        <p className="text-sm mb-6" style={{ color: 'var(--color-stone)' }}>You haven't placed any orders yet.</p>
                        <Link to="/shop" className="btn-outline text-xs">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {response?.map((order: Order) => (
                            <div key={order.id} className="card p-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4" style={{ borderColor: '#EDE7D9' }}>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-brown)' }}>
                                            Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                                            {order.status}
                                        </span>
                                        <p className="font-serif text-lg font-medium" style={{ color: 'var(--color-brown)' }}>
                                            {Number(order.total).toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-20 bg-ivory overflow-hidden flex-shrink-0">
                                                {item.product.images[0] && <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link to={`/shop/${item.product.slug}`} className="font-medium text-sm hover:underline" style={{ color: 'var(--color-brown)' }}>
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-stone)' }}>{item.variant.size} / {item.variant.color}</p>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-charcoal)' }}>Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                                                {Number(item.price).toLocaleString('vi-VN')}₫
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                {order.status === 'DELIVERED' && (
                                    <div className="mt-6 pt-4 border-t flex justify-end" style={{ borderColor: '#EDE7D9' }}>
                                        <Link to={`/shop/${order.items[0]?.product?.slug}`} className="text-xs uppercase tracking-widest font-medium flex items-center gap-1 hover:opacity-70" style={{ color: 'var(--color-gold)' }}>
                                            Leave Review <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
