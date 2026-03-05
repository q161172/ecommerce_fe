import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import CartSidebar from '@/components/cart/CartSidebar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCart } from '@/hooks';
import { useEffect } from 'react';

// Syncs server cart → Zustand store when user is authenticated
function CartSync() {
    const { isAuthenticated } = useAuthStore();
    const { setItems, clearCart } = useCartStore();
    const { data: cartData } = useCart();

    useEffect(() => {
        if (!isAuthenticated) {
            clearCart();
            return;
        }
        if (cartData?.items) {
            setItems(cartData.items as any);
        }
    }, [isAuthenticated, cartData]);

    return null;
}

export default function CustomerLayout() {
    const { isOpen, closeCart } = useCartStore();

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
            <CartSync />
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
