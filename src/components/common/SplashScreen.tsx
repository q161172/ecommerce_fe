import { useEffect, useState } from 'react';

const HOLD_MS = 2200;
const EXIT_MS = 900;

/**
 * Quiet-luxury brand splash on first app boot.
 * Soft fade / drift timed to the same easing language as `.reveal`.
 */
export default function SplashScreen() {
    const [phase, setPhase] = useState<'idle' | 'show' | 'leave' | 'gone'>('idle');

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPhase('gone');
            return;
        }

        document.documentElement.classList.add('splash-lock');
        const showRaf = requestAnimationFrame(() => setPhase('show'));

        const leaveTimer = window.setTimeout(() => setPhase('leave'), HOLD_MS);
        const goneTimer = window.setTimeout(() => {
            setPhase('gone');
            document.documentElement.classList.remove('splash-lock');
        }, HOLD_MS + EXIT_MS);

        return () => {
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
