import { useState, useMemo, useRef } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useCategories } from '@/hooks';
import type { Product } from '@/types';
import { DataTableCSR } from '@/components/data-table/data-table-CSR/data-table-CSR';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
    name: string;
    description: string;
    price: string;
    comparePrice: string;
    categoryId: string;
    isFeatured: boolean;
    imageFiles: File[];
    imagePreviews: string[];
}

const EMPTY_FORM: FormState = {
    name: '', description: '', price: '', comparePrice: '',
    categoryId: '', isFeatured: false, imageFiles: [], imagePreviews: [],
};

// ─── Product Form ─────────────────────────────────────────────────────────────
function ProductForm({
    initial, onSubmit, isPending, onClose,
}: {
    initial?: Product;
    onSubmit: (formData: FormData) => Promise<void>;
    isPending: boolean;
    onClose: () => void;
}) {
    const { data: categories } = useCategories();
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<FormState>(() =>
        initial
            ? {
                name: initial.name,
                description: initial.description,
                price: String(initial.price),
                comparePrice: String(initial.comparePrice ?? ''),
                categoryId: initial.categoryId,
                isFeatured: initial.isFeatured,
                imageFiles: [],
                imagePreviews: initial.images ?? [],
            }
            : EMPTY_FORM
    );

    const set = (key: keyof FormState, val: any) => setForm(f => ({ ...f, [key]: val }));

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        const previews = files.map(f => URL.createObjectURL(f));
        set('imageFiles', files);
        set('imagePreviews', previews);
    };

    const removeImages = () => {
        set('imageFiles', []);
        set('imagePreviews', []);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price || !form.categoryId) {
            toast.error('Vui lòng điền đầy đủ tên, giá và danh mục');
            return;
        }
        const fd = new FormData();
        fd.append('name', form.name.trim());
        fd.append('description', form.description.trim());
        fd.append('price', form.price);
        if (form.comparePrice) fd.append('comparePrice', form.comparePrice);
        fd.append('categoryId', form.categoryId);
        fd.append('isFeatured', String(form.isFeatured));
        form.imageFiles.forEach(f => fd.append('images', f));
        await onSubmit(fd);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            {/* Image upload */}
            <div className="grid gap-2">
                <Label>Product Images</Label>
                {form.imagePreviews.length > 0 ? (
                    <div className="relative">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {form.imagePreviews.map((src, i) => (
                                <img key={i} src={src} alt="" className="h-28 w-28 object-cover rounded-lg border flex-shrink-0" />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={removeImages}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-28 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500">Click to upload (multiple)</span>
                    </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="p-name">Name *</Label>
                <Input id="p-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic Wool Coat" required />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="p-desc">Description</Label>
                <textarea
                    id="p-desc" rows={3}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Product description..."
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                    <Label htmlFor="p-price">Price * (₫)</Label>
                    <Input id="p-price" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" required />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="p-compare">Compare Price (₫)</Label>
                    <Input id="p-compare" type="number" min="0" value={form.comparePrice} onChange={e => set('comparePrice', e.target.value)} placeholder="0" />
                </div>
            </div>

            <div className="grid gap-1.5">
                <Label>Category *</Label>
                <select
                    value={form.categoryId}
                    onChange={e => set('categoryId', e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    <option value="">Select category...</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => set('isFeatured', e.target.checked)}
                    className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
            </label>

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-700 text-white" disabled={isPending}>
                    {isPending ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Product | null>(null);

    // Fetch all products (no server pagination) — DataTableCSR handles local search + pagination
    const { data, isLoading, refetch } = useProducts({ limit: 999 });
    const products = data?.products ?? [];

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const handleCreate = async (formData: FormData) => {
        await createMutation.mutateAsync(formData, {
            onSuccess: () => { toast.success('Product created!'); setIsAddOpen(false); },
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create product'),
        });
    };

    const handleUpdate = async (formData: FormData) => {
        if (!editTarget) return;
        await updateMutation.mutateAsync({ id: editTarget.id, formData }, {
            onSuccess: () => { toast.success('Product updated!'); setEditTarget(null); },
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update product'),
        });
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            deleteMutation.mutate(product.id, {
                onSuccess: () => toast.success('Product deleted'),
                onError: () => toast.error('Failed to delete product'),
            });
        }
    };

    // ─── Column definitions ──────────────────────────────────────────────────
    const columns = useMemo<ColumnDef<Product>[]>(() => [
        {
            id: 'image',
            header: 'Image',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                    {row.original.images?.[0]
                        ? <img src={row.original.images[0]} alt="" className="w-full h-full object-cover" />
                        : <span className="flex items-center justify-center h-full text-xs text-gray-400">—</span>
                    }
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    {row.original.isFeatured && <span className="text-xs text-amber-600">★ Featured</span>}
                </div>
            ),
        },
        {
            id: 'category',
            header: 'Category',
            accessorFn: (row) => row.category?.name ?? '',
            cell: ({ row }) => <span className="text-gray-500">{row.original.category?.name}</span>,
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }) => (
                <div>
                    <div>{Number(row.original.price).toLocaleString('vi-VN')}₫</div>
                    {row.original.comparePrice && (
                        <div className="text-xs text-gray-400 line-through">
                            {Number(row.original.comparePrice).toLocaleString('vi-VN')}₫
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditTarget(row.original)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost" size="icon"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(row.original)}
                        disabled={deleteMutation.isPending}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ], [deleteMutation.isPending]);

    return (
        <div className="space-y-6">
            <DataTableCSR
                columns={columns}
                data={products}
                isLoading={isLoading}
                onReload={() => refetch()}
                titleTable="Products"
                descripTable="Manage your product catalog."
                searchPlaceholder="Search products..."
                customActions={
                    <Button className="gap-2 bg-gray-900 hover:bg-gray-700 text-white" onClick={() => setIsAddOpen(true)}>
                        <Plus className="w-4 h-4" /> Add Product
                    </Button>
                }
            />

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) setIsAddOpen(false); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                    <ProductForm onSubmit={handleCreate} isPending={createMutation.isPending} onClose={() => setIsAddOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Edit "{editTarget?.name}"</DialogTitle></DialogHeader>
                    {editTarget && (
                        <ProductForm
                            key={editTarget.id}
                            initial={editTarget}
                            onSubmit={handleUpdate}
                            isPending={updateMutation.isPending}
                            onClose={() => setEditTarget(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
