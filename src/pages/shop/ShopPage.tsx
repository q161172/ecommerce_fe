import { useState } from 'react';
import { useProducts } from '@/api/products/products.hooks';
import { useCategories } from '@/api/categories/categories.hooks';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react';

function ProductCard({ product }: { product: any }) {
    const avgRating = product.reviews?.length
        ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
        : 0;
    return (
        <Link to={`/shop/${product.slug}`} className="product-card group">
            <div className="product-image">
                {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} loading="lazy" />
                ) : (
                    <div className="w-full h-full skeleton" style={{ minHeight: 280 }} />
                )}
                {product.comparePrice && (
                    <div className="absolute top-3 left-3"><span className="badge-gold text-[10px]">Sale</span></div>
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
