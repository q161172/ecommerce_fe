import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-24 border-t" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl tracking-widest font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)', letterSpacing: '0.3em' }}>
                            MAISON
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                            Curated fashion for the discerning individual. Timeless elegance, modern sensibility.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            {[Instagram, Twitter, Mail].map((Icon, i) => (
                                <button key={i} className="p-2 transition-all hover:opacity-60" style={{ color: 'var(--color-brown)' }}>
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: 'var(--color-gold)' }}>Shop</h3>
                        <ul className="space-y-2">
                            {['New Arrivals', 'Collection', 'Sale'].map((item) => (
                                <li key={item}>
                                    <Link to="/shop" className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--color-stone)' }}>{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: 'var(--color-gold)' }}>Help</h3>
                        <ul className="space-y-2">
                            {['Size Guide', 'Shipping & Returns', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--color-stone)' }}>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: '#D4C9B5' }}>
                    <p className="text-xs" style={{ color: 'var(--color-stone)' }}>© {new Date().getFullYear()} Maison. All rights reserved.</p>
                    <p className="text-xs" style={{ color: 'var(--color-stone)' }}>Crafted with intention.</p>
                </div>
            </div>
        </footer>
    );
}
