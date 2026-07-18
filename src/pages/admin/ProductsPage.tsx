import { useState, useMemo, useRef } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useCategories } from '@/hooks';
import type { Product } from '@/types';
import { DataTable } from '@/components/data-table-new';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);

interface VariantRow {
    size: string;
    color: string;
    stock: string;
    sku: string;
}

const EMPTY_VARIANT: VariantRow = { size: '', color: '', stock: '10', sku: '' };

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
    name: string;
    slug: string;
    description: string;
    price: string;
    comparePrice: string;
    categoryId: string;
    isFeatured: boolean;
    imageFiles: File[];
    imagePreviews: string[];
    variants: VariantRow[];
}

const EMPTY_FORM: FormState = {
    name: '', slug: '', description: '', price: '', comparePrice: '',
    categoryId: '', isFeatured: false, imageFiles: [], imagePreviews: [],
    variants: [{ ...EMPTY_VARIANT }],
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
                slug: initial.slug,
                description: initial.description,
                price: String(initial.price),
                comparePrice: String(initial.comparePrice ?? ''),
                categoryId: initial.categoryId,
                isFeatured: initial.isFeatured,
                imageFiles: [],
                imagePreviews: initial.images ?? [],
                variants: initial.variants?.length
                    ? initial.variants.map((v) => ({
                        size: v.size,
                        color: v.color,
                        stock: String(v.stock),
                        sku: v.sku,
                    }))
                    : [{ ...EMPTY_VARIANT }],
            }
            : EMPTY_FORM
    );

    const set = (key: keyof FormState, val: any) => setForm(f => ({ ...f, [key]: val }));

    const handleNameChange = (name: string) => {
        setForm((f) => ({
            ...f,
            name,
            // Only auto-slug on create, or when slug still matches previous auto value
            slug: initial ? f.slug : slugify(name),
        }));
    };

    const updateVariant = (index: number, key: keyof VariantRow, value: string) => {
        setForm((f) => {
            const variants = f.variants.map((v, i) => (i === index ? { ...v, [key]: value } : v));
            return { ...f, variants };
        });
    };

    const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, { ...EMPTY_VARIANT }] }));

    const removeVariant = (index: number) => {
        setForm((f) => ({
            ...f,
            variants: f.variants.length <= 1 ? f.variants : f.variants.filter((_, i) => i !== index),
        }));
    };

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
        const slug = form.slug.trim() || slugify(form.name);
        if (!form.name.trim() || !form.price || !form.categoryId || !slug) {
            toast.error('Vui lòng điền đầy đủ tên, giá và danh mục');
            return;
        }
        if (form.description.trim().length < 10) {
            toast.error('Mô tả cần ít nhất 10 ký tự');
            return;
        }
        const variants = form.variants
            .map((v) => ({
                size: v.size.trim(),
                color: v.color.trim(),
                stock: Number(v.stock),
                sku: v.sku.trim() || `${slug}-${v.size.trim()}-${v.color.trim()}`.toUpperCase().replace(/\s+/g, '-'),
            }))
            .filter((v) => v.size && v.color && Number.isFinite(v.stock) && v.stock >= 0);

        if (!variants.length) {
            toast.error('Cần ít nhất 1 biến thể (size + color + stock)');
            return;
        }

        const fd = new FormData();
        fd.append('name', form.name.trim());
        fd.append('slug', slug);
        fd.append('description', form.description.trim());
        fd.append('price', form.price);
        if (form.comparePrice) fd.append('comparePrice', form.comparePrice);
        fd.append('categoryId', form.categoryId);
        fd.append('isFeatured', String(form.isFeatured));
        fd.append('variants', JSON.stringify(variants));
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
                <Input id="p-name" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Classic Wool Coat" required />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="p-slug">Slug *</Label>
                <Input
                    id="p-slug"
                    value={form.slug}
                    onChange={e => set('slug', slugify(e.target.value))}
                    placeholder="classic-wool-coat"
                    required
                />
                <p className="text-xs text-gray-400">URL path — lowercase letters, numbers, hyphens only</p>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="p-desc">Description * (min 10 chars)</Label>
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

            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label>Variants *</Label>
                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1" onClick={addVariant}>
                        <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {form.variants.map((v, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-3 grid gap-1">
                                <Label className="text-xs text-gray-500">Size</Label>
                                <Input value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="M" />
                            </div>
                            <div className="col-span-3 grid gap-1">
                                <Label className="text-xs text-gray-500">Color</Label>
                                <Input value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="Black" />
                            </div>
                            <div className="col-span-2 grid gap-1">
                                <Label className="text-xs text-gray-500">Stock</Label>
                                <Input type="number" min={0} value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} />
                            </div>
                            <div className="col-span-3 grid gap-1">
                                <Label className="text-xs text-gray-500">SKU</Label>
                                <Input value={v.sku} onChange={(e) => updateVariant(i, 'sku', e.target.value)} placeholder="auto" />
                            </div>
                            <div className="col-span-1 flex justify-end pb-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() => removeVariant(i)}
                                    disabled={form.variants.length <= 1}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
            <DataTable
                columns={columns}
                data={products}
                isLoading={isLoading}
                onReload={() => refetch()}
                titleTable="Products"
                descripTable="Manage your product catalog."
                searchPlaceholder="Search products..."
                customActions={
                    <Button effect="shineHover" className="gap-2 bg-gray-900 hover:bg-gray-700 text-white" onClick={() => setIsAddOpen(true)}>
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
