import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartVariant {
    id: string;
    size: string;
    color: string;
    stock: number;
}

export interface CartProduct {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
}

export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    product: CartProduct;
    variant: CartVariant;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    setItems: (items: CartItem[]) => void;
    addItem: (item: CartItem) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            setItems: (items) => set({ items }),

            addItem: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            updateQuantity: (itemId, quantity) =>
                set((state) => ({
                    items:
                        quantity === 0
                            ? state.items.filter((i) => i.id !== itemId)
                            : state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
                })),

            removeItem: (itemId) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

            clearCart: () => set({ items: [] }),

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

            totalPrice: () =>
                get().items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
