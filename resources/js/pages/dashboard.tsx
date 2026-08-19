import { Head } from '@inertiajs/react';
import {
    BarChart3,
    CheckCircle2,
    FileText,
    Users,
    Wallet,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

type DashboardProps = {
    metrics: {
        totalRab: number;
        totalRabValue: number;
        dealRabValue: number;
        totalUsers: number;
        thisMonthRab: number;
    };
    monthlyRab: Array<{
        month: string;
        total: number;
        deal: number;
    }>;
    latestRab: Array<{
        name: string;
        code: string;
        value: number;
        status: string;
    }>;
    rabStatus: Array<{
        label: string;
        value: number;
    }>;
};

const statusColors: Record<string, string> = {
    Deal: 'bg-emerald-500',
    Review: 'bg-amber-500',
    Draft: 'bg-sky-500',
    Batal: 'bg-rose-500',
};

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Dashboard({
    metrics,
    monthlyRab,
    latestRab,
    rabStatus,
}: DashboardProps) {
    const dealPercentage =
        metrics.totalRabValue > 0
            ? Math.round((metrics.dealRabValue / metrics.totalRabValue) * 100)
            : 0;
    const summaryCards = [
        {
            title: 'Total RAB Dibuat',
            value: String(metrics.totalRab),
            note: `+${metrics.thisMonthRab} bulan ini`,
            icon: FileText,
        },
        {
            title: 'Total Nilai RAB',
            value: formatRupiah(metrics.totalRabValue),
            note: 'Akumulasi semua RAB',
            icon: Wallet,
        },
        {
            title: 'Nilai RAB Deal',
            value: formatRupiah(metrics.dealRabValue),
            note: `${dealPercentage}% dari total nilai`,
            icon: CheckCircle2,
        },
        {
            title: 'Total User',
            value: String(metrics.totalUsers),
            note: 'User terdaftar',
            icon: Users,
        },
    ];
    const maxMonthlyValue = Math.max(
        1,
        ...monthlyRab.map((item) => item.total),
    );
    const totalStatus = rabStatus.reduce(
        (total, item) => total + item.value,
        0,
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card key={item.title} className="gap-4 rounded-lg">
                                <CardHeader className="flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {item.title}
                                    </CardTitle>
                                    <Icon className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-semibold tracking-tight">
                                        {item.value}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {item.note}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="rounded-lg">
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Grafik RAB</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Perbandingan RAB dibuat dan RAB deal per bulan.
                            </p>
                        </div>
                        <BarChart3 className="size-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <div className="flex h-full items-end gap-3 border-b border-l border-border px-3 pt-6">
                                {monthlyRab.map((item) => (
                                    <div
                                        key={item.month}
                                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                    >
                                        <div className="flex h-full w-full items-end justify-center gap-1">
                                            <div
                                                className="w-full max-w-5 rounded-t bg-emerald-500"
                                                style={{
                                                    height: `${(item.total / maxMonthlyValue) * 100}%`,
                                                }}
                                                title={`Total: ${item.total}`}
                                            />
                                            <div
                                                className="w-full max-w-5 rounded-t bg-amber-500"
                                                style={{
                                                    height: `${(item.deal / maxMonthlyValue) * 100}%`,
                                                }}
                                                title={`Deal: ${item.deal}`}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {item.month}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                RAB Dibuat
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="size-2 rounded-full bg-amber-500" />
                                RAB Deal
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>RAB Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {latestRab.map((item) => (
                                    <div
                                        key={item.code}
                                        className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {item.name}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {item.code}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-semibold">
                                                {formatRupiah(item.value)}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Status RAB</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {rabStatus.map((item) => {
                                    const percent =
                                        totalStatus > 0
                                            ? Math.round(
                                                  (item.value / totalStatus) *
                                                      100,
                                              )
                                            : 0;

                                    return (
                                        <div key={item.label} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>{item.label}</span>
                                                <span className="font-medium">
                                                    {item.value} RAB
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={`h-full rounded-full ${statusColors[item.label] ?? 'bg-muted-foreground'}`}
                                                    style={{
                                                        width: `${totalStatus > 0 ? percent : 0}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {percent}% dari total RAB
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
