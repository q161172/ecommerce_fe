import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    /** How many page numbers to show on each side of the current page. */
    siblingCount?: number;
    className?: string;
}

const DOTS = 'dots';

const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Build a windowed list of pages with ellipses, e.g. `1 … 4 5 [6] 7 8 … 20`.
 * Keeps the control compact regardless of how many pages exist.
 */
const buildRange = (page: number, totalPages: number, siblingCount: number): (number | typeof DOTS)[] => {
    // first + last + current + 2*siblings + 2 dots
    const totalToShow = siblingCount * 2 + 5;
    if (totalPages <= totalToShow) return range(1, totalPages);

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
        return [...range(1, 3 + siblingCount * 2), DOTS, totalPages];
    }
    if (showLeftDots && !showRightDots) {
        return [1, DOTS, ...range(totalPages - (2 + siblingCount * 2), totalPages)];
    }
    return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, totalPages];
};

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = '',
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = buildRange(page, totalPages, siblingCount);

    const go = (target: number) => {
        const next = Math.min(Math.max(target, 1), totalPages);
        if (next !== page) onPageChange(next);
    };

    const arrowClass =
        'flex items-center justify-center w-9 h-9 border transition-all disabled:opacity-30 disabled:cursor-not-allowed';
    const arrowStyle = { borderColor: '#D4C9B5', color: 'var(--color-brown)' };

    return (
        <nav
            className={`flex justify-center items-center gap-2 ${className}`}
            aria-label="Pagination"
        >
            <button
                onClick={() => go(page - 1)}
                disabled={page === 1}
                className={arrowClass}
                style={arrowStyle}
                aria-label="Previous page"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((p, i) =>
                p === DOTS ? (
                    <span
                        key={`dots-${i}`}
                        className="flex items-center justify-center w-9 h-9 text-sm select-none"
                        style={{ color: 'var(--color-stone)' }}
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => go(p)}
                        aria-current={page === p ? 'page' : undefined}
                        className={`w-9 h-9 text-sm border transition-all ${page === p ? '' : 'hover:border-amber-600'}`}
                        style={
                            page === p
                                ? { background: 'var(--color-brown)', color: 'var(--color-ivory)', borderColor: 'var(--color-brown)' }
                                : { borderColor: '#D4C9B5', color: 'var(--color-brown)' }
                        }
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => go(page + 1)}
                disabled={page === totalPages}
                className={arrowClass}
                style={arrowStyle}
                aria-label="Next page"
            >
                <ChevronRight size={16} />
            </button>
        </nav>
    );
}
