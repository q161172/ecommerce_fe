import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Scissors, Sparkles } from 'lucide-react';

const VALUES = [
    {
        Icon: Scissors,
        title: 'Artisanal Craft',
        body: 'Every piece is cut and finished by hand in small ateliers, honouring techniques passed down through generations.',
    },
    {
        Icon: Leaf,
        title: 'Conscious Materials',
        body: 'We source natural, responsibly produced fabrics — organic cotton, fine wool, and traceable linen.',
    },
    {
        Icon: Sparkles,
        title: 'Timeless Design',
        body: 'We design for permanence, not seasons. Pieces meant to be worn, loved, and passed on for years.',
    },
];

const STATS = [
    { value: '2018', label: 'Established' },
    { value: '40+', label: 'Countries Shipped' },
    { value: '120', label: 'Artisan Partners' },
    { value: '100%', label: 'Traceable Fabric' },
];

const MILESTONES = [
    {
        year: '2018',
        title: 'The Beginning',
        body: 'Maison was founded in Ho Chi Minh City with a single belief: that true luxury lies in restraint, quality, and intention.',
    },
    {
        year: '2021',
        title: 'Going Global',
        body: 'Our collections crossed borders, reaching discerning wardrobes across Asia, Europe, and North America.',
    },
    {
        year: '2024',
        title: 'A Conscious Future',
        body: 'We committed to fully traceable materials and low-impact production, without compromising on craft.',
    },
];

export default function AboutPage() {
    return (
        <div className="pt-24 pb-20" style={{ background: 'var(--color-cream)' }}>
            {/* Header */}
            <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
                <span className="section-tag">Our Maison</span>
                <h1 className="section-title">Our Story</h1>
                <div className="section-divider mx-auto" />
                <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                    Maison began with a quiet conviction — that clothing should be made to last, designed with
                    intention, and worn with pride. We craft timeless pieces for those who understand that
                    elegance is never loud.
                </p>
            </div>

            {/* Philosophy banner */}
            <section className="relative py-24 mt-16 overflow-hidden" style={{ background: 'var(--color-brown)' }}>
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(201,169,110,0.5) 30px, rgba(201,169,110,0.5) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(201,169,110,0.5) 30px, rgba(201,169,110,0.5) 31px)',
                    }}
                />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <span className="section-tag block mb-4">Our Philosophy</span>
                    <blockquote
                        className="text-3xl md:text-4xl font-thin leading-relaxed"
                        style={{ color: 'var(--color-ivory)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}
                    >
                        "We believe in fewer, finer things — made honestly, kept forever."
                    </blockquote>
                    <div className="section-divider mx-auto mt-8" style={{ width: '3rem' }} />
                </div>
            </section>

            {/* Values */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                    <span className="section-tag">What We Stand For</span>
                    <h2 className="section-title text-3xl md:text-4xl">Our Values</h2>
                    <div className="section-divider mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {VALUES.map(({ Icon, title, body }) => (
                        <div key={title} className="card p-8 text-center">
                            <div
                                className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border"
                                style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}
                            >
                                <Icon size={18} style={{ color: 'var(--color-gold)' }} />
                            </div>
                            <h3 className="font-serif text-lg mb-3" style={{ color: 'var(--color-brown)' }}>{title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="border-y py-16" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {STATS.map(({ value, label }) => (
                            <div key={label}>
                                <p
                                    className="text-4xl md:text-5xl font-light mb-2"
                                    style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-gold-dark)' }}
                                >
                                    {value}
                                </p>
                                <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-stone)' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Milestones timeline */}
            <section className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
                <div className="text-center mb-14">
                    <span className="section-tag">Our Journey</span>
                    <h2 className="section-title text-3xl md:text-4xl">Milestones</h2>
                    <div className="section-divider mx-auto" />
                </div>
                <div className="space-y-10">
                    {MILESTONES.map(({ year, title, body }) => (
                        <div key={year} className="flex gap-6">
                            <div className="flex-shrink-0 w-16 pt-1">
                                <span
                                    className="text-2xl font-light"
                                    style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-gold-dark)' }}
                                >
                                    {year}
                                </span>
                            </div>
                            <div className="border-l pl-6 pb-2" style={{ borderColor: '#EDE7D9' }}>
                                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-brown)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-3xl mx-auto px-6 text-center">
                <div className="section-divider mx-auto mb-8" />
                <h2 className="section-title text-3xl">Discover the Collection</h2>
                <p className="text-sm mb-8" style={{ color: 'var(--color-stone)' }}>
                    Explore timeless pieces crafted with intention and care.
                </p>
                <Link to="/shop" className="btn-primary">
                    Shop Now <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}
