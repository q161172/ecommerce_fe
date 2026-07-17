import { useAdminStats } from '@/hooks';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { format } from 'date-fns';

function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-7 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
                    <CardContent><Skeleton className="h-[350px] w-full" /></CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-52" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="w-12 h-16 rounded" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-4 w-12" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const MONTH_LABEL = (ym: string) => {
    // ym is 'YYYY-MM'
    const d = new Date(`${ym}-01T00:00:00`);
    return Number.isNaN(d.getTime()) ? ym : format(d, 'MMM');
};

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminStats();

    if (isLoading) return <DashboardSkeleton />;
    if (!stats) return null;

    const { kpis, revenueByMonth, topProducts } = stats;
    const revenue = Number(kpis?.totalRevenue ?? 0);
    const growth = kpis?.revenueGrowth ?? 0;

    const kpiCards = [
        {
            title: 'Total Revenue',
            value: `${revenue.toLocaleString('vi-VN')}₫`,
            icon: DollarSign,
            sub:
                growth !== 0 ? (
                    <span className={`inline-flex items-center gap-1 ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(growth)}% vs last month
                    </span>
                ) : (
                    <span className="text-muted-foreground">No change vs last month</span>
                ),
        },
        {
            title: 'Total Orders',
            value: (kpis?.totalOrders ?? 0).toLocaleString('vi-VN'),
            icon: ShoppingBag,
            sub: <span className="text-muted-foreground">+{kpis?.monthOrders ?? 0} this month</span>,
        },
        {
            title: 'Total Customers',
            value: (kpis?.totalUsers ?? 0).toLocaleString('vi-VN'),
            icon: Users,
            sub: <span className="text-muted-foreground">+{kpis?.monthUsers ?? 0} this month</span>,
        },
        {
            title: 'Active Products',
            value: (kpis?.totalProducts ?? 0).toLocaleString('vi-VN'),
            icon: Package,
            sub: <span className="text-muted-foreground">Currently listed</span>,
        },
    ];

    const revenueData = (revenueByMonth ?? []).map((r) => ({
        name: MONTH_LABEL(r.month),
        total: Number(r.revenue ?? 0),
    }));

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((kpi, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs mt-1">{kpi.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Completed payments over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {revenueData.length === 0 ? (
                            <div className="h-[350px] flex items-center justify-center text-sm text-muted-foreground">
                                No revenue data yet.
                            </div>
                        ) : (
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
                                    <YAxis
                                        stroke="#8C7B6B"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => (value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}K`)}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${Number(value).toLocaleString('vi-VN')}₫`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#C9A96E" fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>By total units sold.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(topProducts ?? []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No sales data yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {topProducts.map((p) => (
                                    <div key={p.id} className="flex items-center">
                                        <div className="w-12 h-16 bg-muted rounded overflow-hidden flex items-center justify-center">
                                            {p.images?.[0]
                                                ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                : <Package className="w-4 h-4 text-muted-foreground" />}
                                        </div>
                                        <div className="ml-4 space-y-1 flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-none truncate">{p.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {Number(p.price).toLocaleString('vi-VN')}₫
                                            </p>
                                        </div>
                                        <div className="font-medium text-sm whitespace-nowrap ml-2">
                                            {p.quantitySold} sold
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
