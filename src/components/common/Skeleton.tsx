import type { CSSProperties } from 'react';

interface SkeletonProps {
    className?: string;
    style?: CSSProperties;
}

/**
 * Base shimmer block. Compose with width/height/rounded classes to mimic the
 * shape of whatever is loading (a line of text, an avatar, an image, ...).
 */
export function Skeleton({ className = '', style }: SkeletonProps) {
    return <div className={`skeleton ${className}`.trim()} style={style} />;
}

/** Placeholder shaped like a storefront ProductCard (image + text + price). */
export function ProductCardSkeleton() {
    return (
        <div style={{ background: 'var(--color-white)', border: '1px solid #EDE7D9' }}>
            <Skeleton style={{ aspectRatio: '3/4' }} />
            <div className="p-4 space-y-2.5">
                <Skeleton className="h-2.5 w-1/3 rounded" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3.5 w-1/2 rounded" />
            </div>
        </div>
    );
}

interface ProductGridSkeletonProps {
    count?: number;
    className?: string;
}

/** A grid of ProductCard placeholders. */
export function ProductGridSkeleton({ count = 8, className = '' }: ProductGridSkeletonProps) {
    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

/** Placeholder shaped like the ProductDetail page (gallery + info column). */
export function ProductDetailSkeleton() {
    return (
        <div className="pt-20 pb-20" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Gallery */}
                    <div>
                        <Skeleton style={{ aspectRatio: '3/4' }} />
                        <div className="flex gap-2 mt-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="w-16 h-16" />
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="lg:pt-8 space-y-4">
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="h-9 w-3/4 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-8 w-40 rounded" />
                        <div className="h-px my-2" style={{ background: '#EDE7D9' }} />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-3 w-2/3 rounded" />
                        </div>
                        <div className="flex gap-2 pt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="w-12 h-12 rounded" />
                            ))}
                        </div>
                        <Skeleton className="h-12 w-full rounded" style={{ marginTop: 16 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
