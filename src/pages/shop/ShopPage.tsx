import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks';
import type { Category } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Pagination from '@/components/common/Pagination';
import PriceRangeSlider from '@/components/common/PriceRangeSlider';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
];

// Price slider bounds (VND). At the extremes we drop the param so it's "no filter".
const PRICE_MIN = 100_000;
const PRICE_MAX = 200_000_000;
const PRICE_STEP = 100_000;
const formatPrice = (n: number) => `${n.toLocaleString('vi-VN')}₫`;

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    const categoryId = searchParams.get('categoryId') ?? '';
    const sort = searchParams.get('sort') ?? 'newest';
    const page = Number(searchParams.get('page')) || 1;
    const minPrice = searchParams.get('minPrice') ?? '';
    const maxPrice = searchParams.get('maxPrice') ?? '';
    const featured = searchParams.get('featured') === 'true';

    const { data: categories } = useCategories();
    const { data, isLoading, isFetching } = useProducts({
        categoryId: categoryId || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        featured: featured || undefined,
    });

    // Keep the search box in sync when the URL changes (back/forward, chip clear).
    useEffect(() => {
        setSearch(searchParams.get('search') ?? '');
    }, [searchParams]);

    // Jump back to top whenever the page number changes.
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const setParams = (mutate: (p: URLSearchParams) => void, { resetPage = true } = {}) => {
        const next = new URLSearchParams(searchParams);
        mutate(next);
        if (resetPage) next.delete('page');
        setSearchParams(next);
    };

    const setFilter = (key: string, value: string) =>
        setParams((p) => (value ? p.set(key, value) : p.delete(key)));

    const priceValue: [number, number] = [
        minPrice ? Number(minPrice) : PRICE_MIN,
        maxPrice ? Number(maxPrice) : PRICE_MAX,
    ];
    const priceActive = Boolean(minPrice || maxPrice);

    const commitPrice = ([lo, hi]: [number, number]) => {
        setParams((p) => {
            if (lo <= PRICE_MIN) p.delete('minPrice');
            else p.set('minPrice', String(lo));
            if (hi >= PRICE_MAX) p.delete('maxPrice');
            else p.set('maxPrice', String(hi));
        });
    };

    const clearPrice = () =>
        setParams((p) => { p.delete('minPrice'); p.delete('maxPrice'); });

    const submitSearch = () => setFilter('search', search.trim());

    const clearAll = () => {
        setSearch('');
        setSearchParams(new URLSearchParams());
    };

    const hasActiveFilters = Boolean(categoryId || minPrice || maxPrice || search || featured);
    const activeCategory = (categories ?? []).find((c: Category) => c.id === categoryId);

    const FiltersContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-brown)' }}>
                    Category
                </h3>
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setFilter('categoryId', '')}
                        className={`text-left text-sm py-1.5 transition-colors ${!categoryId ? 'font-medium' : ''}`}
                        style={{ color: !categoryId ? 'var(--color-gold-dark)' : 'var(--color-stone)' }}
                    >
                        All Products
                    </button>
                    {(categories ?? []).map((cat: Category) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter('categoryId', cat.id)}
                            className={`flex items-center justify-between text-left text-sm py-1.5 transition-colors ${categoryId === cat.id ? 'font-medium' : ''}`}
                            style={{ color: categoryId === cat.id ? 'var(--color-gold-dark)' : 'var(--color-stone)' }}
                        >
                            <span>{cat.name}</span>
                            {cat._count?.products !== undefined && (
                                <span className="text-[11px]" style={{ color: 'var(--color-stone)' }}>
                                    {cat._count.products}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px" style={{ background: '#EDE7D9' }} />

            <div>
                <h3 className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--color-brown)' }}>
                    Price
                </h3>
                <PriceRangeSlider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={priceValue}
                    onCommit={commitPrice}
                />
            </div>

            {hasActiveFilters && (
                <button onClick={clearAll} className="btn-outline w-full text-xs">
                    Clear All Filters
                </button>
            )}
        </div>
    );

    return (
        <div className="pt-24 pb-20" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center py-10">
                    <span className="section-tag">Explore</span>
                    <h1 className="section-title">The Collection</h1>
                    <div className="section-divider mx-auto" />
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mb-10">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-stone)' }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                            className="input-field pl-10 pr-10"
                            placeholder="Search products..."
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); setFilter('search', ''); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                aria-label="Clear search"
                            >
                                <X size={16} style={{ color: 'var(--color-stone)' }} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* Sidebar filters (desktop) */}
                    <aside className="hidden lg:block w-60 flex-shrink-0">
                        <div className="sticky top-24">
                            <FiltersContent />
                        </div>
                    </aside>

                    {/* Main */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="btn-outline lg:hidden flex items-center gap-2 text-xs"
                                >
                                    <SlidersHorizontal size={14} /> Filters
                                </button>
                                <p className="text-xs" style={{ color: 'var(--color-stone)' }}>
                                    {data ? `${data.total} product${data.total === 1 ? '' : 's'}` : '\u00A0'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs hidden sm:inline" style={{ color: 'var(--color-stone)' }}>Sort by</span>
                                <select
                                    value={sort}
                                    onChange={(e) => setFilter('sort', e.target.value)}
                                    className="input-field w-auto text-xs"
                                    style={{ paddingTop: 10, paddingBottom: 10 }}
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {(activeCategory || priceActive || featured) && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {featured && (
                                    <span className="badge-gold flex items-center gap-1">
                                        Featured
                                        <button onClick={() => setFilter('featured', '')}><X size={10} /></button>
                                    </span>
                                )}
                                {activeCategory && (
                                    <span className="badge-gold flex items-center gap-1">
                                        {activeCategory.name}
                                        <button onClick={() => setFilter('categoryId', '')}><X size={10} /></button>
                                    </span>
                                )}
                                {priceActive && (
                                    <span className="badge-gold flex items-center gap-1">
                                        {formatPrice(priceValue[0])} – {formatPrice(priceValue[1])}
                                        <button onClick={clearPrice}><X size={10} /></button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {[...Array(PAGE_SIZE)].map((_, i) => (
                                    <div key={i} className="card">
                                        <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                                        <div className="p-4 space-y-2">
                                            <div className="skeleton h-3 rounded w-3/4" />
                                            <div className="skeleton h-4 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !data?.products?.length ? (
                            <div className="text-center py-24 border" style={{ borderColor: '#EDE7D9', background: 'var(--color-white)' }}>
                                <p className="text-sm mb-4" style={{ color: 'var(--color-stone)' }}>No products found.</p>
                                {hasActiveFilters && (
                                    <button onClick={clearAll} className="btn-outline text-xs">Clear Filters</button>
                                )}
                            </div>
                        ) : (
                            <div
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 transition-opacity duration-200"
                                style={{ opacity: isFetching ? 0.6 : 1 }}
                            >
                                {data.products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {data && data.totalPages > 1 && (
                            <Pagination
                                page={page}
                                totalPages={data.totalPages}
                                onPageChange={(p) => setParams((sp) => sp.set('page', String(p)), { resetPage: false })}
                                className="mt-12"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile filters slide-over */}
            {mobileFiltersOpen && (
                <>
                    <div className="overlay lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
                    <div
                        className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] p-6 overflow-y-auto lg:hidden"
                        style={{ background: 'var(--color-cream)' }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-brown)' }}>Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X size={18} style={{ color: 'var(--color-stone)' }} />
                            </button>
                        </div>
                        <FiltersContent />
                    </div>
                </>
            )}
        </div>
    );
}
