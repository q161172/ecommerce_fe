import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
    const updateCartItem = useUpdateCartItem();
    const removeCartItem = useRemoveCartItem();

    const handleUpdate = async (itemId: string, qty: number) => {
        try {
            await updateCartItem.mutateAsync({ itemId, quantity: qty });
            updateQuantity(itemId, qty);
        } catch { toast.error('Failed to update'); }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await removeCartItem.mutateAsync(itemId);
            removeItem(itemId);
        } catch { toast.error('Failed to remove'); }
    };

    const subtotal = totalPrice();
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    return (
        <div className="pt-24 pb-20 min-h-screen" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <span className="section-tag">Shopping</span>
                    <h1 className="section-title">Your Cart</h1>
                    <div className="section-divider" />
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-24">
                        <ShoppingBag size={64} strokeWidth={1} className="mx-auto mb-6" style={{ color: 'var(--color-stone)' }} />
                        <p className="text-lg font-serif mb-2" style={{ color: 'var(--color-brown)' }}>Your cart is empty</p>
                        <p className="text-sm mb-8" style={{ color: 'var(--color-stone)' }}>Add pieces you love to your cart.</p>
                        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="card p-5 flex gap-4">
                                    <div className="w-24 h-28 flex-shrink-0 overflow-hidden" style={{ background: 'var(--color-ivory)' }}>
                                        {item.product.images[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : <div className="w-full h-full skeleton" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-sm" style={{ color: 'var(--color-brown)' }}>{item.product.name}</h3>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-stone)' }}>{item.variant.size} / {item.variant.color}</p>
                                            </div>
                                            <button onClick={() => handleRemove(item.id)} className="ml-2 p-1 hover:opacity-60" style={{ color: '#DC2626' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border" style={{ borderColor: '#D4C9B5' }}>
                                                <button onClick={() => handleUpdate(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-ivory" style={{ color: 'var(--color-brown)' }}><Minus size={12} /></button>
                                                <span className="px-4 py-2 text-sm" style={{ borderLeft: '1px solid #D4C9B5', borderRight: '1px solid #D4C9B5', color: 'var(--color-brown)' }}>{item.quantity}</span>
                                                <button onClick={() => handleUpdate(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-ivory" style={{ color: 'var(--color-brown)' }} disabled={item.quantity >= item.variant.stock}><Plus size={12} /></button>
                                            </div>
                                            <span className="font-medium" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '16px', color: 'var(--color-gold-dark)' }}>
                                                {(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="card p-6 sticky top-28">
                                <h2 className="font-serif text-lg mb-6" style={{ color: 'var(--color-brown)' }}>Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span style={{ color: 'var(--color-stone)' }}>Subtotal</span>
                                        <span style={{ color: 'var(--color-charcoal)' }}>{subtotal.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: 'var(--color-stone)' }}>Shipping</span>
                                        <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'var(--color-charcoal)' }}>
                                            {shipping === 0 ? 'Free' : `${shipping.toLocaleString('vi-VN')}₫`}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs" style={{ color: 'var(--color-stone)' }}>
                                            Add {(500000 - subtotal).toLocaleString('vi-VN')}₫ for free shipping
                                        </p>
                                    )}
                                    <div className="h-px" style={{ background: '#EDE7D9' }} />
                                    <div className="flex justify-between font-medium">
                                        <span style={{ color: 'var(--color-brown)' }}>Total</span>
                                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--color-brown)' }}>{total.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>
                                <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                                    Checkout <ArrowRight size={14} />
                                </Link>
                                <Link to="/shop" className="block text-center mt-3 text-xs hover:opacity-70" style={{ color: 'var(--color-stone)' }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
