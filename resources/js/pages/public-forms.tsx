import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';

type PurchaseForm = {
    id: number;
    name: string;
    birthPlace: string | null;
    birthDate: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    rt: string | null;
    rw: string | null;
    village: string | null;
    district: string | null;
    regency: string | null;
    province: string | null;
    houseArea: string | null;
    location: string | null;
    carAccess: string | null;
    spouseName: string | null;
    spousePhone: string | null;
    ktpPhotoPath: string | null;
    sketchPhotoPath: string | null;
    region: string | null;
    createdAt: string | null;
};

type Metrics = {
    total: number;
    today: number;
    thisMonth: number;
    withAttachments: number;
};

export default function PublicForms({
    metrics = {
        total: 0,
        today: 0,
        thisMonth: 0,
        withAttachments: 0,
    },
    purchaseForms = [],
}: {
    metrics: Metrics;
    purchaseForms: PurchaseForm[];
}) {
    return (
        <>
            <Head title="Pengajuan Pembelian" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Pengajuan Pembelian
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Data yang masuk dari Form Beli di halaman publik.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Total Pengajuan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {metrics.total}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Pengajuan Hari Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {metrics.today}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Pengajuan Bulan Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {metrics.thisMonth}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                Dengan Lampiran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {metrics.withAttachments}
                        </CardContent>
                    </Card>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-card">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Kontak</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Rumah</TableHead>
                                <TableHead>Akses</TableHead>
                                <TableHead>Pasangan</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Dibuat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchaseForms.length > 0 ? (
                                purchaseForms.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            <div>{item.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.birthPlace ?? '-'}
                                                {item.birthDate
                                                    ? `, ${item.birthDate}`
                                                    : ''}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{item.phone ?? '-'}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.email ?? '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{item.address ?? '-'}</div>
                                            <div className="text-xs text-muted-foreground">
                                                RT {item.rt ?? '-'} / RW{' '}
                                                {item.rw ?? '-'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {[
                                                    item.village,
                                                    item.district,
                                                    item.regency,
                                                    item.province,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ') || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>Luas {item.houseArea ?? '-'}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Lokasi {item.location ?? '-'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Wilayah {item.region ?? '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.carAccess ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div>{item.spouseName ?? '-'}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.spousePhone ?? '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="grid gap-1 text-xs">
                                                <span>
                                                    KTP:{' '}
                                                    {item.ktpPhotoPath
                                                        ? 'Ada'
                                                        : '-'}
                                                </span>
                                                <span>
                                                    Denah:{' '}
                                                    {item.sketchPhotoPath
                                                        ? 'Ada'
                                                        : '-'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.createdAt ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        Belum ada data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

PublicForms.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Pengajuan Pembelian',
            href: '/dashboard/pengajuan-pembelian',
        },
    ],
};
