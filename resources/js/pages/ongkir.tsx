import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const wilayahOptions = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bengkulu',
    'Lampung',
    'Kepulauan Bangka Belitung',
    'Kepulauan Riau',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua Barat',
    'Papua Barat Daya',
    'Papua',
    'Papua Selatan',
    'Papua Tengah',
    'Papua Pegunungan',
];

function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Ongkir() {
    const [wilayah, setWilayah] = useState('');
    const [jarak, setJarak] = useState('');

    const distance = Number(jarak) || 0;
    const totals = useMemo(() => {
        const baseRate = wilayah.startsWith('Papua') ? 25000 : 15000;
        const nonFinishing = distance * baseRate;
        const interlock = distance * (baseRate + 5000);

        return {
            nonFinishing,
            interlock,
        };
    }, [distance, wilayah]);

    return (
        <>
            <Head title="Ongkir" />
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Hitung Ongkir
                        </h1>
                    </div>

                    <div className="grid gap-5 rounded-lg border bg-card p-5">
                        <div className="grid gap-2">
                            <Label>WILAYAH</Label>
                            <Select value={wilayah} onValueChange={setWilayah}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="-- PILIH WILAYAH --" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {wilayahOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jarak">Jarak (Km)</Label>
                            <Input
                                id="jarak"
                                type="number"
                                min="0"
                                value={jarak}
                                onChange={(event) =>
                                    setJarak(event.target.value)
                                }
                                placeholder="0"
                            />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Lokasi pusat Rumah Citra Nusantara
                        </p>

                        <div className="grid gap-3 border-t pt-5">
                            <h2 className="text-lg font-semibold">Ongkir</h2>
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    Total Ongkir Rumah Non Finishing
                                </span>
                                <span className="font-semibold">
                                    {formatRupiah(totals.nonFinishing)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    Total Ongkir Rumah Interlock
                                </span>
                                <span className="font-semibold">
                                    {formatRupiah(totals.interlock)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
