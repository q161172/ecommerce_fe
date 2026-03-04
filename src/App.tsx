import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { useAuthStore } from '@/store/authStore';

// Layouts
import CustomerLayout from '@/components/layout/CustomerLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Route guards
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Lazy-loaded pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ShopPage = lazy(() => import('@/pages/shop/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/shop/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const AccountPage = lazy(() => import('@/pages/account/AccountPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const GoogleCallbackPage = lazy(() => import('@/pages/auth/GoogleCallbackPage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProducts = lazy(() => import('@/pages/admin/ProductsPage'));
const AdminCategories = lazy(() => import('@/pages/admin/CategoriesPage'));
const AdminOrders = lazy(() => import('@/pages/admin/OrdersPage'));
const AdminUsers = lazy(() => import('@/pages/admin/UsersPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-cream">
    <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2C1810',
              color: '#F5F0E8',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '0',
            },
            success: { iconTheme: { primary: '#C9A96E', secondary: '#F5F0E8' } },
          }}
        />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Customer routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            </Route>

            {/* Auth routes (no layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<GoogleCallbackPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
