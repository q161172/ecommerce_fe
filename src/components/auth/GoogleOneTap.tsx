import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googleOneTapApi } from '@/api/auth/auth.api';
import {
    canUseFedCmOneTap,
    hasOneTapPromptedThisLoad,
    isOneTapCoolingDown,
    isOneTapSkippedThisSession,
    markOneTapPromptedThisLoad,
    skipGoogleOneTapPermanentlyForSession,
} from '@/lib/googleOneTap';

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

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
 * Google One Tap for signed-out storefront visitors.
 * Skips when FedCM is blocked (site settings) or after dismiss/cooldown,
 * so the console doesn't fill with `FedCM get() rejects with NetworkError`.
 */
export default function GoogleOneTap() {
    const navigate = useNavigate();
    const handledRef = useRef(false);

    useEffect(() => {
        if (!CLIENT_ID) return;
        if (isOneTapCoolingDown() || isOneTapSkippedThisSession()) return;
        if (hasOneTapPromptedThisLoad()) return;

        let cancelled = false;
        let promptTimer: ReturnType<typeof setTimeout> | undefined;

        (async () => {
            const fedCmOk = await canUseFedCmOneTap();
            if (cancelled) return;
            if (!fedCmOk) {
                skipGoogleOneTapPermanentlyForSession();
                return;
            }

            try {
                await loadGisScript();
            } catch {
                return;
            }
            if (cancelled || !window.google?.accounts?.id) return;
            if (isOneTapCoolingDown() || isOneTapSkippedThisSession()) return;

            markOneTapPromptedThisLoad();

            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                auto_select: false,
                use_fedcm_for_prompt: true,
                cancel_on_tap_outside: true,
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

            // Delay so logout cleanup (cancel / disableAutoSelect) finishes first.
            promptTimer = setTimeout(() => {
                if (cancelled || isOneTapCoolingDown() || isOneTapSkippedThisSession()) return;
                try {
                    // No notification callback — FedCM path deprecates status helpers,
                    // and calling them triggers extra GSI_LOGGER noise.
                    window.google?.accounts?.id?.prompt();
                } catch {
                    skipGoogleOneTapPermanentlyForSession();
                }
            }, 400);
        })();

        return () => {
            cancelled = true;
            if (promptTimer) clearTimeout(promptTimer);
            try {
                window.google?.accounts?.id?.cancel();
            } catch {
                /* ignore */
            }
        };
    }, [navigate]);

    return null;
}
