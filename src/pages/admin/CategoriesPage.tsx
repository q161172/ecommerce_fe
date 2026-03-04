import { useState, useRef } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/api/categories/categories.hooks';
import type { CategoryItem } from '@/api/categories/categories.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
        setImageFile(undefined);
        setPreview(null);
        setImageRemoved(true);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onSubmit({ name, slug, description, imageFile, removeImage: imageRemoved });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Image upload */}
            <div className="grid gap-2">
                <Label>Category Image</Label>
                {preview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                        >
                            <X className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500">Click to upload image</span>
                        <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
                    </div>
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Name */}
            <div className="grid gap-2">
                <Label htmlFor="cat-name">Name *</Label>
                <Input
                    id="cat-name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Outerwear"
                    required
                />
            </div>

            {/* Slug */}
            <div className="grid gap-2">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input
                    id="cat-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. outerwear"
                    className="font-mono text-sm"
                />
            </div>

            {/* Description */}
            <div className="grid gap-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Input
                    id="cat-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional short description"
                />
            </div>

            <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? 'Saving...' : initial ? 'Update Category' : 'Create Category'}
                </Button>
            </div>
        </form>
    );
}

export default function AdminCategoriesPage() {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);

    const { data: categories, isLoading } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const handleCreate = async (data: { name: string; slug: string; description: string; imageFile?: File }) => {
        await createMutation.mutateAsync(data, {
            onSuccess: () => {
                toast.success('Category created!');
                setIsAddOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create category'),
        });
    };

    const handleUpdate = async (data: { name: string; slug: string; description: string; imageFile?: File; removeImage?: boolean }) => {
        if (!editTarget) return;
        await updateMutation.mutateAsync({ id: editTarget.id, params: data }, {
            onSuccess: () => {
                toast.success('Category updated!');
                setEditTarget(null);
            },
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

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage product categories.</p>
                </div>

                {/* Add Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            onSubmit={handleCreate}
                            isPending={createMutation.isPending}
                            onClose={() => setIsAddOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit "{editTarget?.name}"</DialogTitle>
                        </DialogHeader>
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

            {/* Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
                        ) : categories?.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No categories found</TableCell></TableRow>
                        ) : (
                            categories?.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {cat.image
                                                ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                : <span className="text-xs text-gray-400">No img</span>
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-sm">{cat.slug}</TableCell>
                                    <TableCell>{cat._count?.products ?? 0}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Edit"
                                            onClick={() => setEditTarget(cat)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(cat)}
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
        </div>
    );
}
