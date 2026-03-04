import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import CartSidebar from '@/components/cart/CartSidebar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';

export default function CustomerLayout() {
    const { isOpen, closeCart } = useCartStore();

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />

            {/* Cart Sidebar Overlay */}
            {isOpen && (
                <div className="overlay" onClick={closeCart} />
            )}
            <CartSidebar />
        </div>
    );
}
