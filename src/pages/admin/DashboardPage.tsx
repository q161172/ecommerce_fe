import { useState } from 'react';
import { useAdminStats } from '@/hooks';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminStats();

    if (isLoading) return <div className="p-8">Loading dashboard...</div>;
    if (!stats) return null;

    const revenue = Number(stats.totalRevenue ?? 0);
    const kpis = [
        { title: 'Total Revenue', value: `${revenue.toLocaleString('vi-VN')}₫`, icon: DollarSign },
        { title: 'Total Orders', value: (stats.totalOrders ?? 0).toLocaleString(), icon: ShoppingBag },
        { title: 'Total Customers', value: (stats.totalUsers ?? 0).toLocaleString(), icon: Users },
        { title: 'Active Products', value: '45', icon: Package }, // Placeholder for products count
    ];

    // Mock chart data based on total revenue
    const revenueData = [
        { name: 'Mon', total: Math.floor(revenue * 0.1) },
        { name: 'Tue', total: Math.floor(revenue * 0.15) },
        { name: 'Wed', total: Math.floor(revenue * 0.05) },
        { name: 'Thu', total: Math.floor(revenue * 0.2) },
        { name: 'Fri', total: Math.floor(revenue * 0.3) },
        { name: 'Sat', total: Math.floor(revenue * 0.1) },
        { name: 'Sun', total: Math.floor(revenue * 0.1) },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE7D9" />
                                <XAxis dataKey="name" stroke="#8C7B6B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#8C7B6B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="total" stroke="#C9A96E" fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>Based on recent order volume.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.topProducts.map((p: any) => (
                                <div key={p.id} className="flex items-center">
                                    <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                                        {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="ml-4 space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none">{p.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {Number(p.price).toLocaleString('vi-VN')}₫
                                        </p>
                                    </div>
                                    <div className="font-medium text-sm">
                                        {p.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0)} sold
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
