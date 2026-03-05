import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks';
import { ArrowRight, Star } from 'lucide-react';

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
                    <div className="w-full h-full skeleton" />
                )}
                {product.comparePrice && (
                    <div className="absolute top-3 left-3">
                        <span className="badge-gold text-[10px]">Sale</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--color-stone)' }}>{product.category.name}</p>
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
                    <div className="flex items-center gap-1 mt-1.5">
                        <Star size={11} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-stone)' }}>{avgRating.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}

export default function LandingPage() {
    const { data: featured } = useProducts({ featured: true, limit: 4 });
    const { data: newArrivals } = useProducts({ sort: 'newest', limit: 8 });

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center">
                {/* Background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #2C1810 0%, #3D2510 40%, #6B4226 100%)',
                    }}
                >
                    {/* Subtle texture overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(201,169,110,0.3) 5px, rgba(201,169,110,0.3) 6px)' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
                    <div className="max-w-2xl">
                        <span className="section-tag">New Collection 2026</span>
                        <h1 className="text-6xl md:text-8xl font-thin leading-none" style={{ color: '#F5F0E8', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-0.02em' }}>
                            Refined
                            <br />
                            <span style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Elegance</span>
                        </h1>
                        <p className="mt-8 text-base font-light leading-relaxed max-w-md" style={{ color: 'rgba(245,240,232,0.7)' }}>
                            Timeless pieces crafted for those who know that true luxury lies in quality, not excess.
                        </p>
                        <div className="flex items-center gap-4 mt-10">
                            <Link to="/shop" className="btn-gold">
                                Explore Collection
                                <ArrowRight size={16} />
                            </Link>
                            <Link to="/shop?featured=true" className="text-xs tracking-widest uppercase hover:opacity-70 flex items-center gap-2" style={{ color: '#F5F0E8' }}>
                                Featured Pieces
                                <span style={{ color: 'var(--color-gold)' }}>→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-px h-12 animate-pulse" style={{ background: 'linear-gradient(to bottom, rgba(201,169,110,0), var(--color-gold))' }} />
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-gold)' }}>Scroll</span>
                </div>
            </section>

            {/* Brand Values */}
            <section className="py-20 border-y" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { label: 'Premium Quality', desc: 'Carefully sourced materials from the finest ateliers worldwide.' },
                            { label: 'Timeless Design', desc: 'Pieces that transcend trends and remain relevant for decades.' },
                            { label: 'Conscious Craft', desc: 'Ethically made with attention to every stitch and detail.' },
                        ].map(({ label, desc }) => (
                            <div key={label} className="px-6">
                                <div className="section-divider mx-auto mb-6" />
                                <h3 className="font-serif text-lg mb-3" style={{ color: 'var(--color-brown)' }}>{label}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featured && featured.products && featured.products.length > 0 && (
                <section className="py-24" style={{ background: 'var(--color-cream)' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <span className="section-tag">Handpicked</span>
                            <h2 className="section-title">Featured Pieces</h2>
                            <div className="section-divider mx-auto" />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {featured.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Link to="/shop?featured=true" className="btn-outline">
                                View All Featured <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Editorial Banner */}
            <section className="relative py-32 overflow-hidden" style={{ background: 'var(--color-brown)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(201,169,110,0.5) 30px, rgba(201,169,110,0.5) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(201,169,110,0.5) 30px, rgba(201,169,110,0.5) 31px)' }} />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="section-tag block mb-4">Our Philosophy</span>
                    <blockquote className="text-3xl md:text-5xl font-thin leading-relaxed" style={{ color: 'var(--color-ivory)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
                        "Dress not for the occasion, but for the version of yourself you aspire to be."
                    </blockquote>
                    <div className="section-divider mx-auto mt-8" style={{ width: '3rem' }} />
                </div>
            </section>

            {/* New Arrivals */}
            {newArrivals && newArrivals.products && newArrivals.products.length > 0 && (
                <section className="py-24" style={{ background: 'var(--color-cream)' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-14">
                            <div>
                                <span className="section-tag">Just In</span>
                                <h2 className="section-title">New Arrivals</h2>
                            </div>
                            <Link to="/shop?sort=newest" className="btn-outline text-xs hidden md:inline-flex">
                                See All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {newArrivals.products.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center mt-8 md:hidden">
                            <Link to="/shop" className="btn-outline">See All Products</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-24 border-t" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="section-tag">What Clients Say</span>
                        <h2 className="section-title">Testimonials</h2>
                        <div className="section-divider mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Linh N.', text: 'Exceptional quality. The fabric feels luxurious and the fit is impeccable. Worth every penny.', rating: 5 },
                            { name: 'Minh T.', text: 'I have been shopping here for two years. The pieces are timeless and never go out of style.', rating: 5 },
                            { name: 'Thu H.', text: 'Fast shipping and beautifully packaged. The attention to detail is remarkable.', rating: 5 },
                        ].map(({ name, text, rating }) => (
                            <div key={name} className="card p-8">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(rating)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" style={{ color: 'var(--color-gold)' }} />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-charcoal-light)', fontStyle: 'italic' }}>"{text}"</p>
                                <div className="h-px mb-4" style={{ background: '#EDE7D9' }} />
                                <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-brown)' }}>{name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-xl mx-auto px-6 text-center">
                    <span className="section-tag">Stay Connected</span>
                    <h2 className="section-title text-3xl">Join Our Circle</h2>
                    <p className="text-sm mb-8" style={{ color: 'var(--color-stone)' }}>
                        Receive curated updates on new collections and exclusive offers.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                        <input
                            type="email"
                            className="input-field flex-1"
                            placeholder="Your email address"
                        />
                        <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
