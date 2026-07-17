import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    /** Stagger delay in milliseconds (e.g. index * 80). */
    delay?: number;
    /** Extra classes forwarded to the wrapper. */
    className?: string;
    /** How much of the element must be visible before revealing (0–1). */
    threshold?: number;
}

/**
 * Wraps content and fades / drifts it up the first time it scrolls into view.
 * Reveal is one-shot (it disconnects after triggering) and respects the user's
 * reduced-motion preference.
 */
export default function Reveal({ children, delay = 0, className = '', threshold = 0.12 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: '0px 0px -10% 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
