import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeGoogleOAuthApi } from '@/api/auth/auth.api';
import toast from 'react-hot-toast';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_denied: 'Google sign in was cancelled',
    invalid_state: 'Sign in session expired, please try again',
    invalid_grant: 'Sign in code expired, please try again',
    invalid_client: 'Google login is misconfigured',
    redirect_uri_mismatch: 'Google login is misconfigured',
    account_disabled: 'Your account has been disabled',
    server_error: 'Something went wrong, please try again',
    oauth_failed: 'Google sign in failed',
};

export default function GoogleCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            toast.error(OAUTH_ERROR_MESSAGES[error] ?? 'Google sign in failed');
            navigate('/login');
            return;
        }

        const oauthCode = searchParams.get('oauth_code');
        if (!oauthCode) {
            toast.error('Google sign in failed');
            navigate('/login');
            return;
        }

        exchangeGoogleOAuthApi(oauthCode)
            .then((result) => {
                toast.success(`Welcome, ${result.user.name}!`);
                navigate('/');
            })
            .catch(() => {
                toast.error('Failed to complete sign in');
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
