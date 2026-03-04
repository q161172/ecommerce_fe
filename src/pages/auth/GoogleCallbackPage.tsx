import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getMeApi } from '@/api/auth/auth.api';
import toast from 'react-hot-toast';

export default function GoogleCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAccessToken } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            toast.error('Google login failed');
            navigate('/login');
            return;
        }

        // Store access token then fetch user profile
        setAccessToken(token);
        getMeApi()
            .then((user) => {
                useAuthStore.getState().setAuth(user, token);
                toast.success(`Welcome, ${user.name}!`);
                navigate('/');
            })
            .catch(() => {
                toast.error('Failed to load profile');
                navigate('/login');
            });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
            <div className="text-center">
                <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }} />
                <p className="text-sm tracking-wide" style={{ color: 'var(--color-stone)' }}>Completing sign in...</p>
            </div>
        </div>
    );
}
