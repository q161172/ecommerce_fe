import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMyOrders, useAddCartItem } from '@/hooks';
import { keys } from '@/hooks/keys';
import { useCartStore } from '@/store/cartStore';
import { format } from 'date-fns';
import { Package, ArrowRight, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Order, OrderItem } from '@/types';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
};

const PAYMENT_LABELS: Record<string, string> = {
    PENDING: 'Payment pending',
    COMPLETED: 'Paid',
    FAILED: 'Payment failed',
    REFUNDED: 'Refunded',
};

export default function OrdersPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: response, isLoading, refetch } = useMyOrders();
    const [searchParams, setSearchParams] = useSearchParams();
    const handledPaymentRef = useRef(false);
    const [rebuyingItemId, setRebuyingItemId] = useState<string | null>(null);
    const addToCartMutation = useAddCartItem();
    const { setItems } = useCartStore();

    useEffect(() => {
        const payment = searchParams.get('payment');
        if (!payment || handledPaymentRef.current) return;
        handledPaymentRef.current = true;

        if (payment === 'success') {
            toast.success('Payment successful! Your order is confirmed.');
        } else if (payment === 'failed') {
            toast.error('Payment failed or was cancelled.');
        }

        void queryClient.invalidateQueries({ queryKey: keys.orders.myOrders() });
        void refetch();

        const next = new URLSearchParams(searchParams);
        next.delete('payment');
        next.delete('orderId');
        next.delete('code');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams, queryClient, refetch]);

    const productDetailPath = (item: OrderItem) =>
        item.product?.slug ? `/shop/${item.product.slug}` : null;

    const handleBuyAgain = async (item: OrderItem) => {
        if (!item.productId || !item.variantId) {
            toast.error('This item can no longer be reordered.');
            return;
        }

        setRebuyingItemId(item.id);
        try {
            const cart = await addToCartMutation.mutateAsync({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
            });
            setItems(cart.items as Parameters<typeof setItems>[0]);
            toast.success('Added to cart');
            navigate('/cart');
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(message ?? 'Failed to add to cart');
        } finally {
            setRebuyingItemId(null);
        }
    };

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
                        <p className="text-sm mb-6" style={{ color: 'var(--color-stone)' }}>You haven&apos;t placed any orders yet.</p>
                        <Link to="/shop" className="btn-outline text-xs">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {response?.map((order: Order) => (
                            <div key={order.id} className="card p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4" style={{ borderColor: '#EDE7D9' }}>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-brown)' }}>
                                            Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                                            {STATUS_LABELS[order.status] ?? order.status}
                                        </span>
                                        {order.payment?.status && (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-ivory text-stone border-[#EDE7D9]">
                                                {PAYMENT_LABELS[order.payment.status] ?? order.payment.status}
                                            </span>
                                        )}
                                        <p className="font-serif text-lg font-medium" style={{ color: 'var(--color-brown)' }}>
                                            {Number(order.total).toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item) => {
                                        const name = item.product?.name ?? item.productName;
                                        const detailPath = productDetailPath(item);
                                        const variantLabel = item.variant
                                            ? `${item.variant.size} / ${item.variant.color}`
                                            : item.variantInfo;
                                        const image = item.product?.images?.[0];
                                        const isRebuying = rebuyingItemId === item.id;

                                        return (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                {detailPath ? (
                                                    <Link
                                                        to={detailPath}
                                                        className="w-16 h-20 bg-ivory overflow-hidden flex-shrink-0 block hover:opacity-90 transition-opacity"
                                                    >
                                                        {image && <img src={image} alt="" className="w-full h-full object-cover" />}
                                                    </Link>
                                                ) : (
                                                    <div className="w-16 h-20 bg-ivory overflow-hidden flex-shrink-0">
                                                        {image && <img src={image} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    {detailPath ? (
                                                        <Link
                                                            to={detailPath}
                                                            className="font-medium text-sm hover:underline block truncate"
                                                            style={{ color: 'var(--color-brown)' }}
                                                        >
                                                            {name}
                                                        </Link>
                                                    ) : (
                                                        <p className="font-medium text-sm truncate" style={{ color: 'var(--color-brown)' }}>{name}</p>
                                                    )}
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-stone)' }}>{variantLabel}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-charcoal)' }}>Qty: {item.quantity}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <p className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                                                        {Number(item.price).toLocaleString('vi-VN')}₫
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => void handleBuyAgain(item)}
                                                        disabled={isRebuying || !item.variantId}
                                                        className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium px-2.5 py-1.5 border transition-opacity disabled:opacity-50 hover:opacity-80"
                                                        style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
                                                    >
                                                        <RotateCcw size={12} className={isRebuying ? 'animate-spin' : ''} />
                                                        {isRebuying ? 'Adding...' : 'Buy again'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {order.status === 'DELIVERED' && (
                                    <div className="mt-6 pt-4 border-t flex justify-end" style={{ borderColor: '#EDE7D9' }}>
                                        <Link
                                            to={order.items[0]?.product?.slug ? `/shop/${order.items[0].product.slug}` : '/shop'}
                                            className="text-xs uppercase tracking-widest font-medium flex items-center gap-1 hover:opacity-70"
                                            style={{ color: 'var(--color-gold)' }}
                                        >
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
