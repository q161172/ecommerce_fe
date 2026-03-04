import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useLogout } from '@/api/auth/auth.hooks';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { isAuthenticated, user } = useAuthStore();
    const { totalItems, toggleCart } = useCartStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        toast.success('Logged out');
        navigate('/');
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${scrolled ? 'shadow-sm' : ''
                }`}
            style={{ background: 'rgba(250, 247, 242, 0.95)', backdropFilter: 'blur(10px)', borderBottom: scrolled ? '1px solid #EDE7D9' : 'none' }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 py-4">
                    {/* Mobile menu toggle */}
                    <button className="lg:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'var(--color-brown)' }}>
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                        <h1 className="text-2xl tracking-widest font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)', letterSpacing: '0.3em' }}>
                            MAISON
                        </h1>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/shop', label: 'Collection' },
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="text-xs tracking-widest uppercase font-medium transition-colors duration-200 hover:opacity-60"
                                style={{ color: 'var(--color-charcoal)' }}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 transition-opacity hover:opacity-60"
                            style={{ color: 'var(--color-brown)' }}
                        >
                            <ShoppingBag size={20} />
                            {totalItems() > 0 && (
                                <span
                                    className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-medium rounded-full"
                                    style={{ background: 'var(--color-gold)', color: 'white' }}
                                >
                                    {totalItems()}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 transition-opacity hover:opacity-60"
                                    style={{ color: 'var(--color-brown)' }}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-48 py-1 shadow-lg"
                                        style={{ background: 'var(--color-white)', border: '1px solid #EDE7D9', zIndex: 50 }}
                                        onMouseLeave={() => setUserMenuOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b" style={{ borderColor: '#EDE7D9' }}>
                                            <p className="text-xs font-medium" style={{ color: 'var(--color-brown)' }}>{user?.name}</p>
                                            <p className="text-xs" style={{ color: 'var(--color-stone)' }}>{user?.email}</p>
                                        </div>
                                        {user?.role === 'ADMIN' && (
                                            <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-ivory" style={{ color: 'var(--color-gold)' }}>
                                                <LayoutDashboard size={14} /> Admin Panel
                                            </Link>
                                        )}
                                        <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-ivory" style={{ color: 'var(--color-charcoal)' }}>
                                            <User size={14} /> My Account
                                        </Link>
                                        <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-ivory" style={{ color: 'var(--color-charcoal)' }}>
                                            <ShoppingBag size={14} /> My Orders
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-ivory w-full" style={{ color: '#DC2626' }}>
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-xs tracking-widest uppercase font-medium hover:opacity-60" style={{ color: 'var(--color-brown)' }}>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
                <div className="lg:hidden px-6 py-4 border-t space-y-3" style={{ borderColor: '#EDE7D9', background: 'var(--color-cream)' }}>
                    <Link to="/" className="block text-xs tracking-widest uppercase" style={{ color: 'var(--color-charcoal)' }} onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link to="/shop" className="block text-xs tracking-widest uppercase" style={{ color: 'var(--color-charcoal)' }} onClick={() => setMobileOpen(false)}>Collection</Link>
                </div>
            )}
        </header>
    );
}
