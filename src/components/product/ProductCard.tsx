import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product, ProductVariant } from '@/types';
import { useAddCartItem } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

interface ProductCardProps {
    product: Product;
    /** Show the on-hover "Quick Add" affordance with the size picker. */
    showQuickAdd?: boolean;
}

/**
 * Shared product card for the storefront (shop grid, landing, related products).
 * Optional inline "Quick Add" lets shoppers pick a size and add to cart without
 * leaving the grid.
 */
export default function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { setItems } = useCartStore();
    const addToCartMutation = useAddCartItem();

    const [pickerOpen, setPickerOpen] = useState(false);
    const [addingVariantId, setAddingVariantId] = useState<string | null>(null);

    const reviews = product.reviews ?? [];
    const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;

    // A product can have one variant per (color, size) combo. Quick Add doesn't
    // pick a color, so collapse variants down to unique sizes: aggregate stock
    // and keep an in-stock variant as the add target for each size.
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const sizeOptions = Array.from(
        variants
            .reduce((map, v) => {
                const existing = map.get(v.size);
                if (!existing) {
                    map.set(v.size, { size: v.size, stock: v.stock, variant: v });
                } else {
                    existing.stock += v.stock;
                    if (existing.variant.stock === 0 && v.stock > 0) existing.variant = v;
                }
                return map;
            }, new Map<string, { size: string; stock: number; variant: ProductVariant }>())
            .values()
    ).sort((a, b) => {
        const ia = sizeOrder.indexOf(a.size.toUpperCase());
        const ib = sizeOrder.indexOf(b.size.toUpperCase());
        if (ia === -1 && ib === -1) return a.size.localeCompare(b.size);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });

    const promptLogin = () => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Đăng nhập để thêm vào giỏ hàng</p>
                <div className="flex gap-2">
                    <button
                        className="flex-1 py-1.5 px-3 text-xs bg-gray-900 text-white rounded hover:bg-gray-700"
                        onClick={() => {
                            toast.dismiss(t.id);
                            navigate('/login', { state: { from: `/shop/${product.slug}` } });
                        }}
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
    };

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            promptLogin();
            return;
        }
        if (!hasVariants) {
            toast.error('Sản phẩm này chưa có biến thể. Xem chi tiết để biết thêm.');
            return;
        }
        setPickerOpen((open) => !open);
    };

    const handleAddWithVariant = async (e: React.MouseEvent, variant: ProductVariant) => {
        e.preventDefault();
        e.stopPropagation();
        if (variant.stock === 0) {
            toast.error('Hết hàng');
            return;
        }

        setAddingVariantId(variant.id);
        try {
            const cart = await addToCartMutation.mutateAsync({
                productId: product.id,
                variantId: variant.id,
                quantity: 1,
            });
            setItems(cart.items as any);
            setPickerOpen(false);
            toast.success(`${product.name} — ${variant.size} added!`);
        } catch (err) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(message ?? 'Failed to add');
        } finally {
            setAddingVariantId(null);
        }
    };

    return (
        <Link to={`/shop/${product.slug}`} className="product-card group relative">
            <div className="product-image">
                {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} loading="lazy" />
                ) : (
                    <div className="w-full h-full skeleton" style={{ minHeight: 280 }} />
                )}
                {product.comparePrice && (
                    <div className="absolute top-3 left-3">
                        <span className="badge-gold text-[10px]">Sale</span>
                    </div>
                )}

                {showQuickAdd && (
                    <>
                        <button
                            onClick={handleQuickAdd}
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 text-xs tracking-wide opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-200"
                            style={{ background: 'rgba(44,24,16,0.92)', color: '#F5F0E8', whiteSpace: 'nowrap' }}
                            title="Add to cart"
                        >
                            <ShoppingBag size={13} />
                            Quick Add
                        </button>

                        {pickerOpen && (
                            <div
                                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 p-3 shadow-xl rounded"
                                style={{ background: '#FAF7F2', minWidth: 160, border: '1px solid #EDE7D9' }}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                                <p className="text-[10px] tracking-widest uppercase mb-2 text-center" style={{ color: 'var(--color-stone)' }}>
                                    Select Size
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {sizeOptions.map((opt) => (
                                        <button
                                            key={opt.size}
                                            disabled={opt.stock === 0 || addingVariantId !== null}
                                            onClick={(e) => handleAddWithVariant(e, opt.variant)}
                                            className={`w-9 h-9 text-xs border transition-all ${opt.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-amber-600 hover:text-amber-700'} ${addingVariantId === opt.variant.id ? 'opacity-60' : ''}`}
                                            style={{ borderColor: '#D4C9B5', color: 'var(--color-brown)' }}
                                            title={opt.stock === 0 ? 'Hết hàng' : `Size ${opt.size}`}
                                        >
                                            {opt.size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--color-stone)' }}>
                    {product.category?.name}
                </p>
                <h3 className="text-sm font-medium" style={{ color: 'var(--color-brown)' }}>{product.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-gold-dark)', fontFamily: 'Cormorant Garamond, serif', fontSize: '15px' }}>
                        {Number(product.price).toLocaleString('vi-VN')}₫
                    </span>
                    {product.comparePrice && (
                        <span className="text-xs line-through" style={{ color: 'var(--color-stone)' }}>
                            {Number(product.comparePrice).toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>
                {avgRating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <Star size={11} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-stone)' }}>{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
