import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface CountUpProps {
    /** Display target, e.g. "2018", "40+", "100%" */
    value: string;
    durationMs?: number;
    className?: string;
    style?: CSSProperties;
}

function parseStat(value: string) {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) return { target: 0, suffix: value, prefix: '' };
    return { target: Number(match[1]), suffix: match[2] ?? '', prefix: '' };
}

/**
 * Counts from 0 → target once when scrolled into view.
 * Keeps any suffix from the source string (+, %, …).
 */
export default function CountUp({ value, durationMs = 1600, className = '', style }: CountUpProps) {
    const { target, suffix } = parseStat(value);
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(target);
            setStarted(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    useEffect(() => {
        if (!started) return;

        let raf = 0;
        const start = performance.now();
        // Ease-out cubic — quiet, not bouncy
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            setDisplay(Math.round(easeOut(t) * target));
            if (t < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [started, target, durationMs]);

    return (
        <span ref={ref} className={className} style={style}>
            {display}{suffix}
        </span>
    );
}
