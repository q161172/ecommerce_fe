import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/api/products/products.hooks';
import { useCategories } from '@/api/categories/categories.hooks';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Queries
    const { data, isLoading } = useProducts({ page, limit: 10, search: search || undefined });
    const { data: categories } = useCategories();

    // Delete Mutation
    const deleteMutation = useDeleteProduct();

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage your product catalog.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Simple placeholder form - real impl would use react-hook-form */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Product name" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" placeholder="0" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="">Select category...</option>
                                    {categories?.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full mt-4">Save Product</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

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
                        ) : data?.products?.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
                        ) : (
                            data?.products?.map((product: any) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                                            {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category?.name}</TableCell>
                                    <TableCell>{Number(product.price).toLocaleString('vi-VN')}₫</TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" title="Edit">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this product?')) {
                                                    deleteMutation.mutate(product.id);
                                                }
                                            }}
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
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
