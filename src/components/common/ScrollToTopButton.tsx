import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
    /** Show the button after scrolling past this many pixels. */
    threshold?: number;
}

/**
 * Floating "back to top" button, fixed to the bottom-right. Fades in once the
 * page is scrolled past `threshold` and smoothly scrolls to the top on click.
 */
export default function ScrollToTopButton({ threshold = 400 }: ScrollToTopButtonProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > threshold);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-40 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
            style={{ background: 'var(--color-brown)', color: 'var(--color-ivory)', border: '1px solid var(--color-gold)' }}
        >
            <ArrowUp size={18} />
        </button>
    );
}
