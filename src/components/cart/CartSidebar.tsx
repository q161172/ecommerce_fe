import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks';
import toast from 'react-hot-toast';

export default function CartSidebar() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCartStore();
    const updateCartItem = useUpdateCartItem();
    const removeCartItem = useRemoveCartItem();

    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        try {
            await updateCartItem.mutateAsync({ itemId, quantity });
            updateQuantity(itemId, quantity);
        } catch {
            toast.error('Failed to update quantity');
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await removeCartItem.mutateAsync(itemId);
            removeItem(itemId);
            toast.success('Item removed');
        } catch {
            toast.error('Failed to remove item');
        }
    };

    return (
        <aside
            className={`fixed top-0 right-0 h-full z-50 w-96 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            style={{ background: 'var(--color-white)', borderLeft: '1px solid #EDE7D9', boxShadow: '-4px 0 30px rgba(44,24,16,0.08)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#EDE7D9' }}>
                <div className="flex items-center gap-2">
                    <ShoppingBag size={18} style={{ color: 'var(--color-brown)' }} />
                    <h2 className="font-serif text-lg" style={{ color: 'var(--color-brown)' }}>Your Cart</h2>
                    {items.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5" style={{ background: 'var(--color-gold)', color: 'white' }}>{items.length}</span>
                    )}
                </div>
                <button onClick={closeCart} className="p-1 hover:opacity-60" style={{ color: 'var(--color-charcoal)' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <ShoppingBag size={48} strokeWidth={1} style={{ color: 'var(--color-stone)' }} />
                        <p className="text-sm" style={{ color: 'var(--color-stone)' }}>Your cart is empty</p>
                        <button onClick={closeCart} className="btn-outline text-xs">Continue Shopping</button>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex gap-3 py-3 border-b" style={{ borderColor: '#F0EDE5' }}>
                            {/* Product image */}
                            <div className="w-20 h-24 flex-shrink-0 overflow-hidden" style={{ background: 'var(--color-ivory)' }}>
                                {item.product.images[0] ? (
                                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full skeleton" />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate" style={{ color: 'var(--color-brown)' }}>{item.product.name}</h4>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-stone)' }}>{item.variant.size} / {item.variant.color}</p>
                                <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-gold-dark)' }}>
                                    {(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')}₫
                                </p>

                                {/* Quantity controls */}
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        className="w-6 h-6 flex items-center justify-center border hover:bg-ivory"
                                        style={{ borderColor: '#D4C9B5', color: 'var(--color-charcoal)' }}
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-sm w-4 text-center" style={{ color: 'var(--color-charcoal)' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-6 h-6 flex items-center justify-center border hover:bg-ivory"
                                        style={{ borderColor: '#D4C9B5', color: 'var(--color-charcoal)' }}
                                        disabled={item.quantity >= item.variant.stock}
                                    >
                                        <Plus size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="ml-auto hover:opacity-60"
                                        style={{ color: '#DC2626' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="px-6 py-5 border-t" style={{ borderColor: '#EDE7D9' }}>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm" style={{ color: 'var(--color-stone)' }}>Subtotal</span>
                        <span className="text-base font-medium" style={{ color: 'var(--color-brown)', fontFamily: 'Cormorant Garamond, serif' }}>
                            {totalPrice().toLocaleString('vi-VN')}₫
                        </span>
                    </div>
                    <p className="text-xs mb-4 text-center" style={{ color: 'var(--color-stone)' }}>
                        Free shipping on orders over 500.000₫
                    </p>
                    <Link to="/checkout" onClick={closeCart} className="btn-primary w-full text-center block">
                        Proceed to Checkout
                    </Link>
                </div>
            )}
        </aside>
    );
}
