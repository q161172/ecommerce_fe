export default function ShippingPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="text-center mb-16">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
                    Maison
                </p>
                <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)' }}>
                    Shipping & Returns
                </h1>
                <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--color-gold)' }} />
            </div>

            {/* Sections */}
            <div className="space-y-12">
                {/* Shipping */}
                <section>
                    <h2 className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: 'var(--color-gold)' }}>
                        Shipping Information
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                title: 'Standard Domestic Shipping',
                                body: 'Orders within Vietnam are delivered within 3–5 business days. Free shipping on orders over 2,000,000₫.',
                            },
                            {
                                title: 'Express Shipping',
                                body: 'Next-day delivery available for Ho Chi Minh City and Hanoi. Order before 12:00 PM for same-day dispatch.',
                            },
                            {
                                title: 'International Shipping',
                                body: 'We ship to over 40 countries. Delivery typically takes 7–14 business days. Duties and taxes are the responsibility of the recipient.',
                            },
                        ].map(({ title, body }) => (
                            <div key={title} className="p-6 border" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-brown)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="w-full h-px" style={{ background: '#EDE7D9' }} />

                {/* Returns */}
                <section>
                    <h2 className="text-xs tracking-widest uppercase font-medium mb-6" style={{ color: 'var(--color-gold)' }}>
                        Returns Policy
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                title: '30-Day Return Window',
                                body: 'We accept returns within 30 days of delivery for items in their original, unworn condition with all tags attached.',
                            },
                            {
                                title: 'How to Initiate a Return',
                                body: 'Email us at returns@maison.com with your order number and reason for return. We will provide a prepaid shipping label within 24 hours.',
                            },
                            {
                                title: 'Refunds',
                                body: 'Refunds are processed within 5–7 business days of receiving your return. Original shipping costs are non-refundable.',
                            },
                            {
                                title: 'Exchanges',
                                body: 'We offer free exchanges for a different size or colour. Please note that exchange items are subject to availability.',
                            },
                            {
                                title: 'Non-Returnable Items',
                                body: 'Final sale items, swimwear, and personalised pieces cannot be returned or exchanged.',
                            },
                        ].map(({ title, body }) => (
                            <div key={title} className="p-6 border" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-brown)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="p-6 border-l-2" style={{ borderColor: 'var(--color-gold)', background: 'var(--color-ivory)' }}>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                        <span className="font-medium" style={{ color: 'var(--color-brown)' }}>Questions? </span>
                        Our customer care team is available Monday–Friday, 9AM–6PM (GMT+7). Reach us at{' '}
                        <a href="mailto:support@maison.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--color-gold)' }}>
                            support@maison.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
