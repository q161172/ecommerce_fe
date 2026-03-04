import { useState } from 'react';
import { useProfile } from '@/api/users/users.hooks';
import { useCreateOrder } from '@/api/orders/orders.hooks';
import { useCartStore } from '@/store/cartStore';
import { MapPin, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [placing, setPlacing] = useState(false);

    const { data: profile } = useProfile();
    const createOrderMutation = useCreateOrder();

    const addresses = profile?.addresses ?? [];
    const subtotal = totalPrice();
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) { toast.error('Please select a delivery address'); return; }
        if (items.length === 0) { toast.error('Your cart is empty'); return; }
        setPlacing(true);
        try {
            const { checkoutUrl } = await createOrderMutation.mutateAsync({ addressId: selectedAddressId, notes });
            clearCart();
            // Redirect to Stripe checkout
            window.location.href = checkoutUrl!;
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Failed to create order');
            setPlacing(false);
        }
    };

    return (
        <div className="pt-24 pb-20 min-h-screen" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <span className="section-tag">Secure Checkout</span>
                    <h1 className="section-title">Place Your Order</h1>
                    <div className="section-divider" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Address */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Address selection */}
                        <div className="card p-6">
                            <h2 className="font-serif text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--color-brown)' }}>
                                <MapPin size={18} style={{ color: 'var(--color-gold)' }} /> Delivery Address
                            </h2>
                            {addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm mb-4" style={{ color: 'var(--color-stone)' }}>No saved addresses. Please add one in your account settings.</p>
                                    <button onClick={() => navigate('/account')} className="btn-outline text-xs">
                                        <Plus size={14} /> Add Address
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr: any) => (
                                        <button
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`w-full text-left p-4 border transition-all ${selectedAddressId === addr.id ? '' : ''}`}
                                            style={{
                                                borderColor: selectedAddressId === addr.id ? 'var(--color-gold)' : '#EDE7D9',
                                                background: selectedAddressId === addr.id ? 'rgba(201,169,110,0.05)' : 'white',
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: 'var(--color-brown)' }}>{addr.fullName}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-stone)' }}>{addr.phone}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-stone)' }}>
                                                        {addr.street}, {addr.district}, {addr.city}
                                                    </p>
                                                </div>
                                                {selectedAddressId === addr.id && (
                                                    <Check size={16} style={{ color: 'var(--color-gold)' }} />
                                                )}
                                            </div>
                                            {addr.isDefault && <span className="badge-gold text-[10px] mt-2 inline-block">Default</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="card p-6">
                            <h2 className="font-serif text-lg mb-4" style={{ color: 'var(--color-brown)' }}>Order Notes</h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="input-field resize-none"
                                rows={3}
                                placeholder="Special instructions, delivery time preferences..."
                            />
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-28">
                            <h2 className="font-serif text-lg mb-6" style={{ color: 'var(--color-brown)' }}>Order Summary</h2>
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-10 h-12 overflow-hidden flex-shrink-0" style={{ background: 'var(--color-ivory)' }}>
                                            {item.product.images[0] && <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate" style={{ color: 'var(--color-brown)' }}>{item.product.name}</p>
                                            <p className="text-[10px]" style={{ color: 'var(--color-stone)' }}>{item.variant.size}/{item.variant.color} × {item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-medium" style={{ color: 'var(--color-charcoal)' }}>
                                            {(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px mb-4" style={{ background: '#EDE7D9' }} />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--color-stone)' }}>Subtotal</span>
                                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span style={{ color: 'var(--color-stone)' }}>Shipping</span>
                                    <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'inherit' }}>
                                        {shipping === 0 ? 'Free' : `${shipping.toLocaleString('vi-VN')}₫`}
                                    </span>
                                </div>
                                <div className="h-px" style={{ background: '#EDE7D9' }} />
                                <div className="flex justify-between font-medium">
                                    <span style={{ color: 'var(--color-brown)' }}>Total</span>
                                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--color-brown)' }}>
                                        {total.toLocaleString('vi-VN')}₫
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing || !selectedAddressId || items.length === 0}
                                className="btn-primary w-full mt-6 disabled:opacity-50"
                            >
                                {placing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                                        Redirecting to payment...
                                    </div>
                                ) : 'Pay with Stripe'}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-3">
                                <svg width="32" height="14" viewBox="0 0 60 25" fill="none"><path d="M5 12.5 C5 7 9 3 14 3 C19 3 23 7 23 12.5 C23 18 19 22 14 22 C9 22 5 18 5 12.5Z" fill="#6461FC" /><path d="M25 12.5 C25 7 29 3 34 3 C39 3 43 7 43 12.5 C43 18 39 22 34 22 C29 22 25 18 25 12.5Z" fill="#FF5F00" opacity="0.9" /></svg>
                                <span className="text-[10px]" style={{ color: 'var(--color-stone)' }}>Secured by Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
