import { useState } from 'react';
import { useProfile, useAddAddress, useDeleteAddress } from '@/api/users/users.hooks';
import { useAuthStore } from '@/store/authStore';
import { User, MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', street: '', city: '', district: '', isDefault: false });

    const { data: profile, isLoading } = useProfile();

    const addAddressMutation = useAddAddress();
    const deleteAddressMutation = useDeleteAddress();

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        addAddressMutation.mutate(addressForm, {
            onSuccess: () => {
                toast.success('Address added');
                setIsAddingAddress(false);
                setAddressForm({ fullName: '', phone: '', street: '', city: '', district: '', isDefault: false });
            },
            onError: () => toast.error('Failed to add address'),
        });
    };

    if (isLoading) return <div className="pt-24 min-h-screen" style={{ background: 'var(--color-cream)' }}><div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 skeleton h-64 card" /></div>;

    return (
        <div className="pt-24 pb-20 min-h-screen" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <span className="section-tag">Account</span>
                    <h1 className="section-title">Welcome, {user?.name.split(' ')[0]}</h1>
                    <div className="section-divider" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${activeTab === 'profile' ? 'bg-ivory border-l-2 border-gold font-medium' : 'hover:bg-ivory border-l-2 border-transparent text-stone'}`}
                            style={{ color: activeTab === 'profile' ? 'var(--color-brown)' : '' }}
                        >
                            <User size={16} /> Profile Info
                        </button>
                        <button
                            onClick={() => setActiveTab('addresses')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${activeTab === 'addresses' ? 'bg-ivory border-l-2 border-gold font-medium' : 'hover:bg-ivory border-l-2 border-transparent text-stone'}`}
                            style={{ color: activeTab === 'addresses' ? 'var(--color-brown)' : '' }}
                        >
                            <MapPin size={16} /> Saved Addresses
                        </button>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="card p-8">
                                <h2 className="font-serif text-xl mb-6" style={{ color: 'var(--color-brown)' }}>Profile Information</h2>
                                <div className="grid gap-6 max-w-md">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-stone mb-2">Email Address</label>
                                        <input className="input-field bg-gray-50/50 cursor-not-allowed" value={user?.email} disabled />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-stone mb-2">Full Name</label>
                                        <input className="input-field bg-gray-50/50 cursor-not-allowed" value={user?.name} disabled />
                                    </div>
                                    <div className="pt-4 border-t" style={{ borderColor: '#EDE7D9' }}>
                                        <button className="btn-outline text-xs">Update Profile</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-serif text-xl" style={{ color: 'var(--color-brown)' }}>Saved Addresses</h2>
                                    {!isAddingAddress && (
                                        <button onClick={() => setIsAddingAddress(true)} className="btn-primary text-xs flex items-center gap-2">
                                            <Plus size={14} /> Add New
                                        </button>
                                    )}
                                </div>

                                {isAddingAddress && (
                                    <form onSubmit={handleAddAddress} className="card p-6 grid gap-4 relative">
                                        <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-brown)' }}>New Address</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="input-field" placeholder="Full Name" value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} required />
                                            <input className="input-field" placeholder="Phone Number" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} required />
                                        </div>
                                        <input className="input-field" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="input-field" placeholder="District" value={addressForm.district} onChange={e => setAddressForm({ ...addressForm, district: e.target.value })} required />
                                            <input className="input-field" placeholder="City / Province" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} required />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm mt-2 cursor-pointer">
                                            <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                                            Set as default shipping address
                                        </label>
                                        <div className="flex gap-2 mt-4">
                                            <button type="submit" className="btn-primary flex-1">Save Address</button>
                                            <button type="button" onClick={() => setIsAddingAddress(false)} className="btn-outline">Cancel</button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    {profile?.addresses?.map((addr: any) => (
                                        <div key={addr.id} className="card p-6 relative group">
                                            {addr.isDefault && <span className="absolute top-4 right-4 badge-gold text-[10px]">Default</span>}
                                            <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-brown)' }}>{addr.fullName}</p>
                                            <p className="text-sm text-stone">{addr.phone}</p>
                                            <p className="text-sm text-stone mt-2 leading-relaxed">
                                                {addr.street}<br />{addr.district}, {addr.city}
                                            </p>
                                            <div className="flex gap-3 mt-6 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: '#EDE7D9' }}>
                                                <button className="text-xs uppercase tracking-widest text-stone hover:text-brown flex items-center gap-1">
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteAddressMutation.mutate(addr.id)}
                                                    className="text-xs uppercase tracking-widest hover:opacity-70 flex items-center gap-1"
                                                    style={{ color: '#DC2626' }}
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
