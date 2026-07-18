import { useEffect, useState } from 'react';

const HOLD_MS = 4800;
const EXIT_MS = 1200;
const SPLASH_SEEN_KEY = 'maison_splash_seen';

function hasSeenSplash() {
    try {
        return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1';
    } catch {
        return false;
    }
}

function markSplashSeen() {
    try {
        sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
    } catch {
        /* private mode */
    }
}

/**
 * Quiet-luxury brand splash — once per browser tab session.
 * After it finishes, F5 will not show it again (sessionStorage).
 * Closing the tab clears the flag so the next visit gets the splash.
 */
export default function SplashScreen() {
    const [phase, setPhase] = useState<'idle' | 'show' | 'leave' | 'gone'>(() =>
        hasSeenSplash() ? 'gone' : 'idle',
    );

    useEffect(() => {
        if (hasSeenSplash()) {
            setPhase('gone');
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            markSplashSeen();
            setPhase('gone');
            return;
        }

        let cancelled = false;
        document.documentElement.classList.add('splash-lock');
        const showRaf = requestAnimationFrame(() => {
            if (!cancelled) setPhase('show');
        });

        const leaveTimer = window.setTimeout(() => {
            if (!cancelled) setPhase('leave');
        }, HOLD_MS);

        const goneTimer = window.setTimeout(() => {
            if (cancelled) return;
            markSplashSeen();
            setPhase('gone');
            document.documentElement.classList.remove('splash-lock');
        }, HOLD_MS + EXIT_MS);

        return () => {
            cancelled = true;
            cancelAnimationFrame(showRaf);
            window.clearTimeout(leaveTimer);
            window.clearTimeout(goneTimer);
            document.documentElement.classList.remove('splash-lock');
        };
    }, []);

    if (phase === 'gone') return null;

    return (
        <div
            className={[
                'splash-screen',
                phase === 'show' && 'is-visible',
                phase === 'leave' && 'is-leaving',
            ]
                .filter(Boolean)
                .join(' ')}
            aria-hidden={phase !== 'show'}
            role="presentation"
        >
            <div className="splash-veil" />
            <div className="splash-inner">
                <span className="splash-rule splash-rule-top" />
                <p className="splash-brand">MAISON</p>
                <span className="splash-rule splash-rule-bottom" />
                <p className="splash-tag">Refined Elegance</p>
            </div>
        </div>
    );
}
