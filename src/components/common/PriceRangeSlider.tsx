import { useEffect, useState } from 'react';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step?: number;
    /** Committed value [low, high]. */
    value: [number, number];
    /** Fired when the user finishes dragging / editing (pointer up, key up). */
    onCommit: (value: [number, number]) => void;
    formatValue?: (n: number) => string;
}

const defaultFormat = (n: number) => `${n.toLocaleString('vi-VN')}₫`;

/**
 * Dual-thumb price range slider. Two overlapping native range inputs give an
 * accessible, keyboard-friendly control; the value is committed on release to
 * avoid firing a request on every pixel of drag.
 */
export default function PriceRangeSlider({
    min,
    max,
    step = 100_000,
    value,
    onCommit,
    formatValue = defaultFormat,
}: PriceRangeSliderProps) {
    const [local, setLocal] = useState<[number, number]>(value);

    useEffect(() => {
        setLocal(value);
    }, [value[0], value[1]]);

    const [lo, hi] = local;
    const percent = (v: number) => ((v - min) / (max - min)) * 100;

    const handleLo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Math.min(Number(e.target.value), hi - step);
        setLocal([next, hi]);
    };

    const handleHi = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Math.max(Number(e.target.value), lo + step);
        setLocal([lo, next]);
    };

    const commit = () => onCommit(local);

    return (
        <div>
            <div className="flex items-center justify-between mb-3 text-xs" style={{ color: 'var(--color-brown)' }}>
                <span>{formatValue(lo)}</span>
                <span>{formatValue(hi)}</span>
            </div>

            <div className="range-dual">
                <div className="range-track" />
                <div
                    className="range-track-fill"
                    style={{ left: `${percent(lo)}%`, right: `${100 - percent(hi)}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={lo}
                    onChange={handleLo}
                    onMouseUp={commit}
                    onTouchEnd={commit}
                    onKeyUp={commit}
                    aria-label="Minimum price"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={hi}
                    onChange={handleHi}
                    onMouseUp={commit}
                    onTouchEnd={commit}
                    onKeyUp={commit}
                    aria-label="Maximum price"
                />
            </div>
        </div>
    );
}
