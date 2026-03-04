import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, LogOut, ExternalLink } from 'lucide-react';
import { useLogout } from '@/api/auth/auth.hooks';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        toast.success('Logged out');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#F8F5F0' }}>
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'var(--color-white)', borderRight: '1px solid #EDE7D9' }}>
                {/* Logo */}
                <div className="px-6 py-8 border-b" style={{ borderColor: '#EDE7D9' }}>
                    <h1 className="text-xl font-serif" style={{ color: 'var(--color-brown)' }}>MAISON</h1>
                    <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'var(--color-gold)' }}>Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer actions */}
                <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: '#EDE7D9' }}>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item flex">
                        <ExternalLink size={18} />
                        <span>View Store</span>
                    </a>
                    <button onClick={handleLogout} className="nav-item w-full text-left" style={{ color: '#DC2626' }}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="px-8 py-4 border-b flex items-center justify-between" style={{ background: 'var(--color-white)', borderColor: '#EDE7D9' }}>
                    <h2 className="text-sm tracking-widest uppercase font-medium" style={{ color: 'var(--color-stone)' }}>Admin Panel</h2>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
