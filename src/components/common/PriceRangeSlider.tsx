import { useEffect, useState } from 'react';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step?: number;
    /** Committed value [low, high]. */
    value: [number, number];
    /** Fired when the user finishes dragging / editing (pointer up, key up, blur). */
    onCommit: (value: [number, number]) => void;
}

/**
 * Dual-thumb price range slider with editable min/max text inputs. Two
 * overlapping native range inputs give an accessible, keyboard-friendly
 * control; values are committed on release / blur to avoid firing a request on
 * every pixel of drag or keystroke.
 */
export default function PriceRangeSlider({
    min,
    max,
    step = 100_000,
    value,
    onCommit,
}: PriceRangeSliderProps) {
    const [local, setLocal] = useState<[number, number]>(value);

    useEffect(() => {
        setLocal(value);
    }, [value[0], value[1]]);

    const [lo, hi] = local;
    const percent = (v: number) => ((v - min) / (max - min)) * 100;
    const clampBounds = (v: number) => Math.min(Math.max(v, min), max);

    const handleLo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Math.min(Number(e.target.value), hi - step);
        setLocal([next, hi]);
    };

    const handleHi = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Math.max(Number(e.target.value), lo + step);
        setLocal([lo, next]);
    };

    const commit = () => onCommit(local);

    // ── Text inputs: allow free typing, then normalise (clamp + order) on commit
    const handleLoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '');
        setLocal([digits === '' ? min : clampBounds(Number(digits)), hi]);
    };

    const handleHiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '');
        setLocal([lo, digits === '' ? max : clampBounds(Number(digits))]);
    };

    const commitInputs = () => {
        let a = Math.min(lo, hi);
        let b = Math.max(lo, hi);
        if (b - a < step) b = Math.min(a + step, max);
        setLocal([a, b]);
        onCommit([a, b]);
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') e.currentTarget.blur();
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={lo.toLocaleString('vi-VN')}
                        onChange={handleLoInput}
                        onBlur={commitInputs}
                        onKeyDown={onInputKeyDown}
                        aria-label="Minimum price"
                        className="w-full pl-2.5 pr-5 py-2 text-xs outline-none transition-colors focus:border-[var(--color-gold)]"
                        style={{ border: '1px solid #D4C9B5', background: 'var(--color-white)', color: 'var(--color-brown)' }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-stone)' }}>₫</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-stone)' }}>–</span>
                <div className="relative flex-1">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={hi.toLocaleString('vi-VN')}
                        onChange={handleHiInput}
                        onBlur={commitInputs}
                        onKeyDown={onInputKeyDown}
                        aria-label="Maximum price"
                        className="w-full pl-2.5 pr-5 py-2 text-xs outline-none transition-colors focus:border-[var(--color-gold)]"
                        style={{ border: '1px solid #D4C9B5', background: 'var(--color-white)', color: 'var(--color-brown)' }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-stone)' }}>₫</span>
                </div>
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
