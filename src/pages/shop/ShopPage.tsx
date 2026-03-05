import { useState } from 'react';
import { useProducts } from '@/hooks';
import { useCategories } from '@/hooks';
import { useAddCartItem } from '@/hooks';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

function ProductCard({ product }: { product: any }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { addItem, openCart } = useCartStore();
    const addToCartMutation = useAddCartItem();

    const [pickerOpen, setPickerOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [adding, setAdding] = useState(false);

    const avgRating = product.reviews?.length
        ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
        : 0;

    const variants: any[] = product.variants ?? [];
    const hasVariants = variants.length > 0;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast((t) => (
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Đăng nhập để thêm vào giỏ hàng</p>
                    <div className="flex gap-2">
                        <button
                            className="flex-1 py-1.5 px-3 text-xs bg-gray-900 text-white rounded hover:bg-gray-700"
                            onClick={() => { toast.dismiss(t.id); navigate('/login', { state: { from: `/shop/${product.slug}` } }); }}
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

        if (!hasVariants) {
            toast.error('Sản phẩm này chưa có biến thể. Xem chi tiết để biết thêm.'); return;
        }

        // Toggle size picker
        setPickerOpen(o => !o);
    };

    const handleAddWithVariant = async (e: React.MouseEvent, variant: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (variant.stock === 0) { toast.error('Hết hàng'); return; }
        setSelectedVariant(variant);
        setAdding(true);
        try {
            await addToCartMutation.mutateAsync({ productId: product.id, variantId: variant.id, quantity: 1 });
            addItem({
                id: variant.id, cartId: '', productId: product.id, variantId: variant.id, quantity: 1,
                product: { id: product.id, name: product.name, slug: product.slug, images: product.images, price: product.price },
                variant,
            });
            setPickerOpen(false);
            openCart();
            toast.success(`${product.name} — ${variant.size} added!`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Failed to add');
        } finally {
            setAdding(false);
            setSelectedVariant(null);
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
                    <div className="absolute top-3 left-3"><span className="badge-gold text-[10px]">Sale</span></div>
                )}

                {/* Quick Add button — appears on hover */}
                <button
                    onClick={handleQuickAdd}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 text-xs tracking-wide opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                    style={{ background: 'rgba(44,24,16,0.92)', color: '#F5F0E8', whiteSpace: 'nowrap' }}
                    title="Add to cart"
                >
                    <ShoppingBag size={13} />
                    Quick Add
                </button>

                {/* Size picker popup */}
                {pickerOpen && (
                    <div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 p-3 shadow-xl rounded"
                        style={{ background: '#FAF7F2', minWidth: 160, border: '1px solid #EDE7D9' }}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <p className="text-[10px] tracking-widest uppercase mb-2 text-center" style={{ color: 'var(--color-stone)' }}>Select Size</p>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {variants.map((v) => (
                                <button
                                    key={v.id}
                                    disabled={v.stock === 0 || adding}
                                    onClick={(e) => handleAddWithVariant(e, v)}
                                    className={`w-9 h-9 text-xs border transition-all ${v.stock === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-amber-600 hover:text-amber-700'} ${selectedVariant?.id === v.id && adding ? 'opacity-60' : ''}`}
                                    style={{ borderColor: '#D4C9B5', color: 'var(--color-brown)' }}
                                >
                                    {v.stock === 0 ? '—' : v.size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--color-stone)' }}>{product.category?.name}</p>
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

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterOpen, setFilterOpen] = useState(false);
    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    const categoryId = searchParams.get('categoryId') ?? '';
    const sort = searchParams.get('sort') ?? 'newest';
    const page = Number(searchParams.get('page')) || 1;

    const { data: categories } = useCategories();

    const { data, isLoading } = useProducts({ categoryId: categoryId || undefined, sort, page, limit: 12, search: search || undefined });

    const updateFilter = (key: string, value: string) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set(key, value); else p.delete(key);
        p.delete('page');
        setSearchParams(p);
    };

    return (
        <div className="pt-24 pb-20" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center py-12">
                    <span className="section-tag">Explore</span>
                    <h1 className="section-title">The Collection</h1>
                    <div className="section-divider mx-auto" />
                </div>

                {/* Search + Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-stone)' }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', search)}
                            className="input-field pl-10 pr-4"
                            placeholder="Search products..."
                        />
                    </div>
                    <button onClick={() => setFilterOpen(!filterOpen)} className="btn-outline flex items-center gap-2 text-xs">
                        <SlidersHorizontal size={14} /> Filters
                    </button>
                    <select
                        value={sort}
                        onChange={(e) => updateFilter('sort', e.target.value)}
                        className="input-field w-auto text-xs"
                        style={{ paddingTop: 12, paddingBottom: 12 }}
                    >
                        <option value="newest">Newest</option>
                        <option value="popular">Most Popular</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>

                {/* Filter Panel */}
                {filterOpen && (
                    <div className="mb-8 p-6 border" style={{ background: 'var(--color-white)', borderColor: '#EDE7D9' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-brown)' }}>Filter by Category</h3>
                            <button onClick={() => setFilterOpen(false)}><X size={16} style={{ color: 'var(--color-stone)' }} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => updateFilter('categoryId', '')}
                                className={`px-4 py-2 text-xs tracking-wide border transition-all ${!categoryId ? 'btn-primary' : 'btn-outline'}`}
                            >
                                All
                            </button>
                            {(categories ?? []).map((cat: any) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateFilter('categoryId', cat.id)}
                                    className={`px-4 py-2 text-xs tracking-wide border transition-all ${categoryId === cat.id ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active filters */}
                {categoryId && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs" style={{ color: 'var(--color-stone)' }}>Showing:</span>
                        <span className="badge-gold flex items-center gap-1">
                            {(categories ?? []).find((c: any) => c.id === categoryId)?.name}
                            <button onClick={() => updateFilter('categoryId', '')}><X size={10} /></button>
                        </span>
                    </div>
                )}

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="card">
                                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                                <div className="p-4 space-y-2">
                                    <div className="skeleton h-3 rounded w-3/4" />
                                    <div className="skeleton h-4 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : data?.products?.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-sm" style={{ color: 'var(--color-stone)' }}>No products found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {data?.products?.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        {[...Array(data.totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => updateFilter('page', String(i + 1))}
                                className={`w-9 h-9 text-sm transition-all ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
