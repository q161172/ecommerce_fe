export default function SizeGuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
            {/* Header */}
            <div className="text-center mb-16">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
                    Maison
                </p>
                <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-brown)' }}>
                    Size Guide
                </h1>
                <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--color-gold)' }} />
                <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                    Our pieces are designed in Italy with a relaxed, tailored fit. We recommend measuring yourself
                    and comparing with the chart below for the best experience.
                </p>
            </div>

            {/* How to measure */}
            <div className="mb-14">
                <h2 className="text-sm tracking-widest uppercase mb-6 font-medium" style={{ color: 'var(--color-gold)' }}>
                    How to Measure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
                        { label: 'Waist', desc: 'Measure around your natural waistline, the narrowest part of your torso.' },
                        { label: 'Hips', desc: 'Measure around the fullest part of your hips, about 8 inches below your waist.' },
                    ].map(({ label, desc }) => (
                        <div key={label} className="p-6 border" style={{ borderColor: '#EDE7D9', background: 'var(--color-ivory)' }}>
                            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-brown)' }}>{label}</h3>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-stone)' }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Size table — Women */}
            <div className="mb-14">
                <h2 className="text-sm tracking-widest uppercase mb-6 font-medium" style={{ color: 'var(--color-gold)' }}>
                    Women's Sizing (cm)
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr style={{ background: 'var(--color-ivory-dark)' }}>
                                {['Size', 'EU', 'Chest', 'Waist', 'Hips'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs tracking-wider font-medium uppercase"
                                        style={{ color: 'var(--color-stone)', borderBottom: '1px solid #EDE7D9' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['XS', '34', '82–84', '62–64', '88–90'],
                                ['S', '36', '86–88', '66–68', '92–94'],
                                ['M', '38', '90–92', '70–72', '96–98'],
                                ['L', '40', '94–96', '74–76', '100–102'],
                                ['XL', '42', '98–100', '78–80', '104–106'],
                            ].map(([size, eu, chest, waist, hips], i) => (
                                <tr key={size} style={{ background: i % 2 === 0 ? '#fff' : 'var(--color-ivory)', borderBottom: '1px solid #EDE7D9' }}>
                                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--color-brown)' }}>{size}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{eu}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{chest}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{waist}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{hips}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Size table — Men */}
            <div className="mb-14">
                <h2 className="text-sm tracking-widest uppercase mb-6 font-medium" style={{ color: 'var(--color-gold)' }}>
                    Men's Sizing (cm)
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr style={{ background: 'var(--color-ivory-dark)' }}>
                                {['Size', 'EU', 'Chest', 'Waist', 'Hips'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs tracking-wider font-medium uppercase"
                                        style={{ color: 'var(--color-stone)', borderBottom: '1px solid #EDE7D9' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['S', '46', '90–94', '78–80', '92–96'],
                                ['M', '48', '96–100', '82–84', '98–102'],
                                ['L', '50', '102–106', '86–88', '104–108'],
                                ['XL', '52', '108–112', '90–92', '110–114'],
                                ['XXL', '54', '114–118', '94–96', '116–120'],
                            ].map(([size, eu, chest, waist, hips], i) => (
                                <tr key={size} style={{ background: i % 2 === 0 ? '#fff' : 'var(--color-ivory)', borderBottom: '1px solid #EDE7D9' }}>
                                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--color-brown)' }}>{size}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{eu}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{chest}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{waist}</td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-stone)' }}>{hips}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note */}
            <div className="p-6 border-l-2" style={{ borderColor: 'var(--color-gold)', background: 'var(--color-ivory)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-stone)' }}>
                    <span className="font-medium" style={{ color: 'var(--color-brown)' }}>A note on fit: </span>
                    If you're between sizes, we recommend sizing up for a more relaxed silhouette or sizing down for a closer fit.
                    For further assistance, please don't hesitate to contact our styling team.
                </p>
            </div>
        </div>
    );
}
