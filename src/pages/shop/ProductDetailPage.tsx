import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks';
import { useAddCartItem } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Star, ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { addItem, openCart } = useCartStore();

    // ── All hooks must be at top, before any early return ──────────────────
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [imgIdx, setImgIdx] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    const { data: product, isLoading } = useProduct(slug!);
    const addToCartMutation = useAddCartItem();
    // ───────────────────────────────────────────────────────────────────────

    if (isLoading) return (
        <div className="pt-24 min-h-screen" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="skeleton rounded-none" style={{ aspectRatio: '3/4' }} />
                    <div className="space-y-4 pt-4">
                        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-6 rounded" style={{ width: `${[80, 50, 60, 90, 40][i]}%` }} />)}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
            <p style={{ color: 'var(--color-stone)' }}>Product not found.</p>
        </div>
    );

    const avgRating = product.reviews?.length
        ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
        : 0;

    // Derive from product data (not hooks — so safe after early return)
    const colors = [...new Set(product.variants.map((v) => v.color))];
    const activeColor = selectedColor || colors[0] || '';
    const availableSizes = product.variants.filter((v) => v.color === activeColor);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast((t) => (
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Bạn cần đăng nhập để mua hàng</p>
                    <div className="flex gap-2">
                        <button
                            className="flex-1 py-1.5 px-3 text-xs bg-gray-900 text-white rounded hover:bg-gray-700"
                            onClick={() => { toast.dismiss(t.id); navigate('/login', { state: { from: `/shop/${slug}` } }); }}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className="flex-1 py-1.5 px-3 text-xs border rounded hover:bg-gray-50"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Bỏ qua
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
            return;
        }
        if (!selectedVariant) { toast.error('Please select a size'); return; }
        if (selectedVariant.stock < quantity) { toast.error('Not enough stock'); return; }

        setAddingToCart(true);
        try {
            await addToCartMutation.mutateAsync({ productId: product.id, variantId: selectedVariant.id, quantity });
            addItem({
                id: selectedVariant.id,
                cartId: '',
                productId: product.id,
                variantId: selectedVariant.id,
                quantity,
                product: { id: product.id, name: product.name, slug: product.slug, images: product.images, price: product.price },
                variant: selectedVariant,
            });
            openCart();
            toast.success('Added to cart!');
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div className="pt-20 pb-20" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Images */}
                    <div>
                        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'var(--color-ivory)' }}>
                            {product.images[imgIdx] ? (
                                <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-stone)' }}>
                                    No image
                                </div>
                            )}
                            {product.images.length > 1 && (
                                <>
                                    <button onClick={() => setImgIdx((i) => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 transition-opacity hover:opacity-70" style={{ background: 'rgba(250,247,242,0.9)' }}>
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={() => setImgIdx((i) => Math.min(product.images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-opacity hover:opacity-70" style={{ background: 'rgba(250,247,242,0.9)' }}>
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-2 mt-3">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 overflow-hidden border-2 transition-all ${imgIdx === i ? '' : 'opacity-50'}`} style={{ borderColor: imgIdx === i ? 'var(--color-gold)' : 'transparent' }}>
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:pt-8">
                        <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold)' }}>{product.category.name}</p>
                        <h1 className="text-4xl font-light mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)' }}>{product.name}</h1>

                        {/* Rating */}
                        {product.reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={13} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} style={{ color: 'var(--color-gold)' }} />
                                    ))}
                                </div>
                                <span className="text-sm" style={{ color: 'var(--color-stone)' }}>({product.reviews.length} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)' }}>
                                {Number(product.price).toLocaleString('vi-VN')}₫
                            </span>
                            {product.comparePrice && (
                                <span className="text-base line-through" style={{ color: 'var(--color-stone)' }}>
                                    {Number(product.comparePrice).toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>

                        <div className="h-px mb-6" style={{ background: '#EDE7D9' }} />
                        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-charcoal-light)' }}>{product.description}</p>

                        {/* Color */}
                        {colors.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: 'var(--color-stone)' }}>
                                    Color: <span style={{ color: 'var(--color-brown)' }}>{activeColor}</span>
                                </p>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => { setSelectedColor(color); setSelectedVariant(null); }}
                                            className={`px-4 py-2 text-xs border transition-all ${activeColor === color ? 'btn-primary' : 'btn-outline'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {availableSizes.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: 'var(--color-stone)' }}>Size</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            disabled={variant.stock === 0}
                                            className={`w-12 h-12 text-sm border transition-all ${selectedVariant?.id === variant.id ? 'btn-primary' : variant.stock === 0 ? 'opacity-30 cursor-not-allowed btn-outline' : 'btn-outline'}`}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                                {selectedVariant && (
                                    <p className="text-xs mt-2" style={{ color: selectedVariant.stock < 5 ? '#DC2626' : 'var(--color-stone)' }}>
                                        {selectedVariant.stock < 5 ? `Only ${selectedVariant.stock} left!` : `${selectedVariant.stock} in stock`}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* No variants fallback */}
                        {product.variants.length === 0 && (
                            <div className="mb-6 p-3 rounded text-sm" style={{ background: '#FEF3C7', color: '#92400E' }}>
                                This product has no size/color variants yet.
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: 'var(--color-stone)' }}>Quantity</p>
                            <div className="flex items-center border w-fit" style={{ borderColor: '#D4C9B5' }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:opacity-70" style={{ color: 'var(--color-brown)' }}>−</button>
                                <span className="px-6 py-3 text-sm" style={{ color: 'var(--color-brown)', borderLeft: '1px solid #D4C9B5', borderRight: '1px solid #D4C9B5' }}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:opacity-70" style={{ color: 'var(--color-brown)' }}>+</button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                        >
                            {addingToCart ? (
                                <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ShoppingBag size={16} />
                            )}
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                        </button>

                        {/* Features */}
                        <div className="mt-8 pt-8 border-t space-y-2" style={{ borderColor: '#EDE7D9' }}>
                            {['Free shipping on orders over 500.000₫', 'Easy 30-day returns', 'Authenticity guaranteed'].map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-stone)' }}>
                                    <Check size={13} style={{ color: 'var(--color-gold)' }} />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                {product.reviews.length > 0 && (
                    <div className="mt-20">
                        <div className="h-px mb-12" style={{ background: '#EDE7D9' }} />
                        <h2 className="font-serif text-2xl mb-8" style={{ color: 'var(--color-brown)' }}>Customer Reviews</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {product.reviews.map((review: any, i: number) => (
                                <div key={i} className="card p-6">
                                    <div className="flex gap-0.5 mb-3">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={12} fill={j < review.rating ? 'currentColor' : 'none'} style={{ color: 'var(--color-gold)' }} />
                                        ))}
                                    </div>
                                    {review.comment && <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-charcoal-light)', fontStyle: 'italic' }}>"{review.comment}"</p>}
                                    <p className="text-xs tracking-wide uppercase" style={{ color: 'var(--color-brown)' }}>{review.user?.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
