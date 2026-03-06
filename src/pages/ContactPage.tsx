import { useState } from 'react';
import { Mail, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setSending(true);
        // Simulate send delay
        await new Promise(r => setTimeout(r, 1000));
        setSending(false);
        toast.success('Message sent. We\'ll be in touch within 1–2 business days.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    const inputClass = "w-full px-4 py-3 text-sm border outline-none transition-all focus:border-[var(--color-gold)]";
    const inputStyle = { borderColor: '#D4C9B5', background: '#fff', color: 'var(--color-brown)' };

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="text-center mb-16">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
                    Get in Touch
                </p>
                <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)' }}>
                    Contact Us
                </h1>
                <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--color-gold)' }} />
                <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                    We'd love to hear from you. Whether it's a question about our pieces, an order,
                    or a collaboration — our team is here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Info */}
                <div className="lg:col-span-2 space-y-8">
                    {[
                        {
                            Icon: Mail,
                            label: 'Email',
                            lines: ['support@maison.com', 'press@maison.com'],
                        },
                        {
                            Icon: MapPin,
                            label: 'Atelier',
                            lines: ['12 Đường Đồng Khởi', 'Quận 1, Hồ Chí Minh', 'Vietnam'],
                        },
                        {
                            Icon: Clock,
                            label: 'Hours',
                            lines: ['Monday – Friday', '9:00 AM – 6:00 PM (GMT+7)'],
                        },
                    ].map(({ Icon, label, lines }) => (
                        <div key={label} className="flex gap-4">
                            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 border"
                                style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                                <Icon size={15} style={{ color: 'var(--color-gold)' }} />
                            </div>
                            <div>
                                <p className="text-xs tracking-wider uppercase font-medium mb-1.5" style={{ color: 'var(--color-gold)' }}>
                                    {label}
                                </p>
                                {lines.map(l => (
                                    <p key={l} className="text-sm" style={{ color: 'var(--color-stone)' }}>{l}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: 'var(--color-stone)' }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Your name"
                                    className={inputClass}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: 'var(--color-stone)' }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="your@email.com"
                                    className={inputClass}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: 'var(--color-stone)' }}>
                                Subject
                            </label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                placeholder="How can we help?"
                                className={inputClass}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: 'var(--color-stone)' }}>
                                Message *
                            </label>
                            <textarea
                                rows={6}
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                placeholder="Tell us more..."
                                className={`${inputClass} resize-none`}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full py-3.5 text-xs tracking-widest uppercase font-medium transition-all hover:opacity-80 active:scale-[0.99] disabled:opacity-50"
                            style={{ background: 'var(--color-brown)', color: 'var(--color-ivory)' }}
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
