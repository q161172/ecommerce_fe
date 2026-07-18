import { useEffect, useState } from 'react';
import {
    useProfile,
    useUpdateProfile,
    useAddAddress,
    useUpdateAddress,
    useDeleteAddress,
} from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import type { Address } from '@/api/users/users.types';
import { User, MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_ADDRESS = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    district: '',
    isDefault: false,
};

export default function AccountPage() {
    const { user, setAuth, accessToken } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
    const [name, setName] = useState('');
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

    const { data: profile, isLoading } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();

    useEffect(() => {
        const next = profile?.name ?? user?.name ?? '';
        setName(next);
    }, [profile?.name, user?.name]);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            toast.error('Name must be at least 2 characters');
            return;
        }
        updateProfileMutation.mutate(
            { name: trimmed },
            {
                onSuccess: (updated) => {
                    if (user && accessToken) {
                        setAuth(
                            {
                                ...user,
                                name: updated.name,
                                avatar: updated.avatar ?? user.avatar,
                            },
                            accessToken,
                        );
                    }
                    toast.success('Profile updated');
                },
                onError: () => toast.error('Failed to update profile'),
            },
        );
    };

    const openEditAddress = (addr: Address) => {
        setIsAddingAddress(false);
        setEditingAddress(addr);
        setAddressForm({
            fullName: addr.fullName,
            phone: addr.phone,
            street: addr.street,
            city: addr.city,
            district: addr.district,
            isDefault: addr.isDefault,
        });
    };

    const resetAddressForm = () => {
        setIsAddingAddress(false);
        setEditingAddress(null);
        setAddressForm(EMPTY_ADDRESS);
    };

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            updateAddressMutation.mutate(
                { id: editingAddress.id, dto: addressForm },
                {
                    onSuccess: () => {
                        toast.success('Address updated');
                        resetAddressForm();
                    },
                    onError: () => toast.error('Failed to update address'),
                },
            );
            return;
        }
        addAddressMutation.mutate(addressForm, {
            onSuccess: () => {
                toast.success('Address added');
                resetAddressForm();
            },
            onError: () => toast.error('Failed to add address'),
        });
    };

    if (isLoading) {
        return (
            <div className="pt-24 min-h-screen" style={{ background: 'var(--color-cream)' }}>
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 skeleton h-64 card" />
            </div>
        );
    }

    const showAddressForm = isAddingAddress || !!editingAddress;
    const isSavingAddress = addAddressMutation.isPending || updateAddressMutation.isPending;

    return (
        <div className="pt-24 pb-20 min-h-screen" style={{ background: 'var(--color-cream)' }}>
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <span className="section-tag">Account</span>
                    <h1 className="section-title">Welcome, {(user?.name || profile?.name || '').split(' ')[0]}</h1>
                    <div className="section-divider" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${activeTab === 'profile' ? 'bg-ivory border-l-2 border-gold font-medium' : 'hover:bg-ivory border-l-2 border-transparent text-stone'}`}
                            style={{ color: activeTab === 'profile' ? 'var(--color-brown)' : '' }}
                        >
                            <User size={16} /> Profile Info
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('addresses')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${activeTab === 'addresses' ? 'bg-ivory border-l-2 border-gold font-medium' : 'hover:bg-ivory border-l-2 border-transparent text-stone'}`}
                            style={{ color: activeTab === 'addresses' ? 'var(--color-brown)' : '' }}
                        >
                            <MapPin size={16} /> Saved Addresses
                        </button>
                    </div>

                    <div className="md:col-span-3">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleUpdateProfile} className="card p-8">
                                <h2 className="font-serif text-xl mb-6" style={{ color: 'var(--color-brown)' }}>
                                    Profile Information
                                </h2>
                                <div className="flex items-center gap-4 mb-8">
                                    <div
                                        className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-lg font-medium"
                                        style={{ background: 'var(--color-ivory)', color: 'var(--color-brown)' }}
                                    >
                                        {(user?.avatar || profile?.avatar) ? (
                                            <img
                                                src={user?.avatar || profile?.avatar || ''}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            (name || '?').charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{ color: 'var(--color-brown)' }}>{name || '—'}</p>
                                        <p className="text-sm" style={{ color: 'var(--color-stone)' }}>
                                            {user?.email || profile?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-6 max-w-md">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-stone mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            className="input-field bg-gray-50/50 cursor-not-allowed"
                                            value={user?.email || profile?.email || ''}
                                            disabled
                                            readOnly
                                        />
                                        <p className="text-xs mt-1.5" style={{ color: 'var(--color-stone)' }}>
                                            Email is used for sign-in and cannot be changed.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-stone mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            className="input-field"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            required
                                            minLength={2}
                                        />
                                    </div>
                                    <div className="pt-4 border-t" style={{ borderColor: '#EDE7D9' }}>
                                        <button
                                            type="submit"
                                            className="btn-primary text-xs"
                                            disabled={updateProfileMutation.isPending}
                                        >
                                            {updateProfileMutation.isPending ? 'Saving...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-serif text-xl" style={{ color: 'var(--color-brown)' }}>
                                        Saved Addresses
                                    </h2>
                                    {!showAddressForm && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingAddress(null);
                                                setAddressForm(EMPTY_ADDRESS);
                                                setIsAddingAddress(true);
                                            }}
                                            className="btn-primary text-xs flex items-center gap-2"
                                        >
                                            <Plus size={14} /> Add New
                                        </button>
                                    )}
                                </div>

                                {showAddressForm && (
                                    <form onSubmit={handleSaveAddress} className="card p-6 grid gap-4 relative">
                                        <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-brown)' }}>
                                            {editingAddress ? 'Edit Address' : 'New Address'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                className="input-field"
                                                placeholder="Full Name"
                                                value={addressForm.fullName}
                                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                                required
                                            />
                                            <input
                                                className="input-field"
                                                placeholder="Phone Number"
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <input
                                            className="input-field"
                                            placeholder="Street Address"
                                            value={addressForm.street}
                                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                className="input-field"
                                                placeholder="District"
                                                value={addressForm.district}
                                                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                                required
                                            />
                                            <input
                                                className="input-field"
                                                placeholder="City / Province"
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm mt-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={addressForm.isDefault}
                                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                            />
                                            Set as default shipping address
                                        </label>
                                        <div className="flex gap-2 mt-4">
                                            <button type="submit" className="btn-primary flex-1" disabled={isSavingAddress}>
                                                {isSavingAddress ? 'Saving...' : 'Save Address'}
                                            </button>
                                            <button type="button" onClick={resetAddressForm} className="btn-cancel">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                    {profile?.addresses?.map((addr) => (
                                        <div key={addr.id} className="card p-6 relative group">
                                            {addr.isDefault && (
                                                <span className="absolute top-4 right-4 badge-gold text-[10px]">Default</span>
                                            )}
                                            <p className="font-medium text-sm mb-1" style={{ color: 'var(--color-brown)' }}>
                                                {addr.fullName}
                                            </p>
                                            <p className="text-sm text-stone">{addr.phone}</p>
                                            <p className="text-sm text-stone mt-2 leading-relaxed">
                                                {addr.street}<br />{addr.district}, {addr.city}
                                            </p>
                                            <div
                                                className="flex gap-3 mt-6 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ borderColor: '#EDE7D9' }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => openEditAddress(addr)}
                                                    className="text-xs uppercase tracking-widest text-stone hover:text-brown flex items-center gap-1"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteAddressMutation.mutate(addr.id, {
                                                            onSuccess: () => toast.success('Address deleted'),
                                                            onError: () => toast.error('Failed to delete address'),
                                                        })
                                                    }
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
