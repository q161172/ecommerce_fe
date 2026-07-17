import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googleOneTapApi } from '@/api/auth/auth.api';

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

// Load the Google Identity Services script once (shared across mounts).
let gisScriptPromise: Promise<void> | null = null;
const loadGisScript = (): Promise<void> => {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (gisScriptPromise) return gisScriptPromise;

    gisScriptPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load GIS')));
            return;
        }
        const script = document.createElement('script');
        script.src = GIS_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load GIS'));
        document.head.appendChild(script);
    });
    return gisScriptPromise;
};

/**
 * Google One Tap prompt. Mount only on public pages while the app user is NOT
 * authenticated. Google itself decides whether to actually show the prompt
 * (only if the browser is signed into Google and not in cooldown).
 */
export default function GoogleOneTap() {
    const navigate = useNavigate();
    const handledRef = useRef(false);

    useEffect(() => {
        if (!CLIENT_ID) return;
        let cancelled = false;

        loadGisScript()
            .then(() => {
                if (cancelled || !window.google?.accounts?.id) return;

                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    auto_select: false,
                    itp_support: true,
                    cancel_on_tap_outside: false,
                    callback: (response) => {
                        if (handledRef.current || !response.credential) return;
                        handledRef.current = true;
                        googleOneTapApi(response.credential)
                            .then((result) => {
                                toast.success(`Welcome, ${result.user.name}!`);
                                navigate('/');
                            })
                            .catch(() => {
                                handledRef.current = false;
                                toast.error('Google sign in failed');
                            });
                    },
                });
                window.google.accounts.id.prompt();
            })
            .catch(() => {
                /* GIS unavailable (offline / blocked) — silently skip One Tap */
            });

        return () => {
            cancelled = true;
            window.google?.accounts?.id?.cancel();
        };
    }, [navigate]);

    return null;
}
