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
    'Bandar Lampung',
    'Lampung Selatan',
    'Lampung Barat',
    'Lampung Tengah',
    'Lampung Utara',
    'Tanggamus',
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
        const nonFinishing = distance * 35000;

        return {
            nonFinishing,
        };
    }, [distance]);

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
                                    Total Ongkir (Rp 35.000 / km)
                                </span>
                                <span className="font-semibold">
                                    {formatRupiah(totals.nonFinishing)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
