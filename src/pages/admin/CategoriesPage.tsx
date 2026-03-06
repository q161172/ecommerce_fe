import { useState, useMemo, useRef } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks';
import type { CategoryItem } from '@/api/categories/categories.types';
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

// ─── Category Form ─────────────────────────────────────────────────────────────
interface CategoryFormProps {
    initial?: CategoryItem;
    onSubmit: (data: { name: string; slug: string; description: string; imageFile?: File; removeImage?: boolean }) => Promise<void>;
    isPending: boolean;
    onClose: () => void;
}

function CategoryForm({ initial, onSubmit, isPending, onClose }: CategoryFormProps) {
    const [name, setName] = useState(initial?.name ?? '');
    const [slug, setSlug] = useState(initial?.slug ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [imageFile, setImageFile] = useState<File | undefined>();
    const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (val: string) => {
        setName(val);
        if (!initial) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImageRemoved(false);
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setPreview(null);
        setImageFile(undefined);
        setImageRemoved(true);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({ name, slug, description, imageFile, removeImage: imageRemoved });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image upload */}
            <div className="grid gap-2">
                <Label>Image</Label>
                <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border flex-shrink-0">
                        {preview
                            ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            : <span className="text-xs text-gray-400">No image</span>
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()}>
                            <Upload className="w-4 h-4" /> Upload
                        </Button>
                        {preview && (
                            <Button type="button" variant="ghost" size="sm" className="gap-2 text-red-500" onClick={removeImage}>
                                <X className="w-4 h-4" /> Remove
                            </Button>
                        )}
                    </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="cat-name">Name *</Label>
                <Input id="cat-name" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Outerwear" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. outerwear" className="font-mono text-sm" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional short description" />
            </div>

            <div className="flex gap-2 mt-2 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-700 text-white" disabled={isPending}>
                    {isPending ? 'Saving...' : initial ? 'Update Category' : 'Create Category'}
                </Button>
            </div>
        </form>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);

    const { data: categories = [], isLoading, refetch } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const handleCreate = async (data: { name: string; slug: string; description: string; imageFile?: File }) => {
        await createMutation.mutateAsync(data, {
            onSuccess: () => { toast.success('Category created!'); setIsAddOpen(false); },
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create category'),
        });
    };

    const handleUpdate = async (data: { name: string; slug: string; description: string; imageFile?: File; removeImage?: boolean }) => {
        if (!editTarget) return;
        await updateMutation.mutateAsync({ id: editTarget.id, params: data }, {
            onSuccess: () => { toast.success('Category updated!'); setEditTarget(null); },
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update category'),
        });
    };

    const handleDelete = (cat: CategoryItem) => {
        if ((cat._count?.products ?? 0) > 0) {
            toast.error('Cannot delete a category that has products.');
            return;
        }
        if (confirm(`Delete "${cat.name}"? This cannot be undone.`)) {
            deleteMutation.mutate(cat.id, {
                onSuccess: () => toast.success('Category deleted'),
                onError: () => toast.error('Failed to delete category'),
            });
        }
    };

    // ─── Column definitions ──────────────────────────────────────────────────
    const columns = useMemo<ColumnDef<CategoryItem>[]>(() => [
        {
            id: 'image',
            header: 'Image',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {row.original.image
                        ? <img src={row.original.image} alt={row.original.name} className="w-full h-full object-cover" />
                        : <span className="text-xs text-gray-400">—</span>
                    }
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => <span className="font-mono text-sm text-gray-500">{row.original.slug}</span>,
        },
        {
            id: 'products',
            header: 'Products',
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original._count?.products ?? 0} products</Badge>
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
                data={categories}
                isLoading={isLoading}
                onReload={() => refetch()}
                titleTable="Categories"
                descripTable="Manage product categories."
                searchPlaceholder="Search categories..."
                customActions={
                    <Button className="gap-2 bg-gray-900 hover:bg-gray-700 text-white" onClick={() => setIsAddOpen(true)}>
                        <Plus className="w-4 h-4" /> Add Category
                    </Button>
                }
            />

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={(open) => { if (!open) setIsAddOpen(false); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Add New Category</DialogTitle></DialogHeader>
                    <CategoryForm onSubmit={handleCreate} isPending={createMutation.isPending} onClose={() => setIsAddOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Edit "{editTarget?.name}"</DialogTitle></DialogHeader>
                    {editTarget && (
                        <CategoryForm
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
