import { useState, useRef } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/api/products/products.hooks';
import { useCategories } from '@/api/categories/categories.hooks';
import type { Product } from '@/types';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    initial,
    onSubmit,
    isPending,
    onClose,
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

            {/* Name */}
            <div className="grid gap-1.5">
                <Label htmlFor="p-name">Name *</Label>
                <Input id="p-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic Wool Coat" required />
            </div>

            {/* Description */}
            <div className="grid gap-1.5">
                <Label htmlFor="p-desc">Description</Label>
                <textarea
                    id="p-desc"
                    rows={3}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Product description..."
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
            </div>

            {/* Price row */}
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

            {/* Category */}
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

            {/* Featured */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => set('isFeatured', e.target.checked)}
                    className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
            </label>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 hover:bg-gray-100 active:scale-95 transition-all"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-gray-900 hover:bg-gray-700 active:scale-95 transition-all text-white"
                    disabled={isPending}
                >
                    {isPending ? 'Saving...' : initial ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Product | null>(null);

    const { data, isLoading } = useProducts({ page, limit: 10, search: search || undefined });
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const handleCreate = async (formData: FormData) => {
        await createMutation.mutateAsync(formData, {
            onSuccess: () => {
                toast.success('Product created!');
                setIsAddOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create product'),
        });
    };

    const handleUpdate = async (formData: FormData) => {
        if (!editTarget) return;
        await updateMutation.mutateAsync({ id: editTarget.id, formData }, {
            onSuccess: () => {
                toast.success('Product updated!');
                setEditTarget(null);
            },
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

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage your product catalog.</p>
                </div>
                <Button
                    className="gap-2 bg-gray-900 hover:bg-gray-700 active:scale-95 transition-all text-white"
                    onClick={() => setIsAddOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={open => { if (!open) setIsAddOpen(false); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        onSubmit={handleCreate}
                        isPending={createMutation.isPending}
                        onClose={() => setIsAddOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={open => { if (!open) setEditTarget(null); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit "{editTarget?.name}"</DialogTitle>
                    </DialogHeader>
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

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : !data?.products?.length ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
                        ) : (
                            data.products.map(product => (
                                <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                                            {product.images?.[0]
                                                ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                : <span className="flex items-center justify-center h-full text-xs text-gray-400">—</span>
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>{product.name}</div>
                                        {product.isFeatured && <span className="text-xs text-amber-600">★ Featured</span>}
                                    </TableCell>
                                    <TableCell className="text-gray-500">{product.category?.name}</TableCell>
                                    <TableCell>
                                        <div>{Number(product.price).toLocaleString('vi-VN')}₫</div>
                                        {product.comparePrice && (
                                            <div className="text-xs text-gray-400 line-through">{Number(product.comparePrice).toLocaleString('vi-VN')}₫</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.isActive ? 'default' : 'destructive'}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Edit"
                                            className="hover:bg-gray-100 active:scale-90 transition-all"
                                            onClick={() => setEditTarget(product)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 active:scale-90 transition-all"
                                            onClick={() => handleDelete(product)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4">
                    <span className="text-sm text-gray-500 mr-2">Page {page} / {data.totalPages}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-gray-100 active:scale-90 transition-all disabled:opacity-40"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-gray-100 active:scale-90 transition-all disabled:opacity-40"
                        onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
