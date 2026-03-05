import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    role: 'ADMIN' | 'CUSTOMER';
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: AuthUser, accessToken: string) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken) =>
                set({ user, accessToken, isAuthenticated: true }),

            setAccessToken: (accessToken) =>
                set({ accessToken }),

            logout: () => {
                set({ user: null, accessToken: null, isAuthenticated: false });
                // Clear persisted cart so it doesn't show after logout
                localStorage.removeItem('cart-storage');
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
