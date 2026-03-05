// Single entry point for all TanStack Query hooks
// Import from here across the codebase: import { useProducts, useCart, ... } from '@/hooks'

export { keys } from './keys';

// Auth
export { useMe, useLogin, useRegister, useLogout } from './useAuthHooks';

// Cart
export { useCart, useAddCartItem, useUpdateCartItem, useRemoveCartItem, useClearCart } from './useCartHooks';

// Products
export { useProducts, useProduct, useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProductHooks';

// Categories
export { useCategories, useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategoryHooks';

// Reviews
export { useProductReviews, useCreateReview, useDeleteReview } from './useReviewHooks';

// Orders
export { useMyOrders, useMyOrder, useCreateOrder, useAllOrders, useUpdateOrderStatus } from './useOrderHooks';

// Users
export {
    useProfile, useUpdateProfile,
    useAddAddress, useUpdateAddress, useDeleteAddress,
    useUsers, useToggleUserActive, useChangeUserRole,
} from './useUserHooks';

// Admin
export { useAdminStats } from './useAdminHooks';
