import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const tipeOptions = ['Small', 'Medium', 'Large'];
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

export default function Biaya() {
    const [type, setType] = useState('Medium');
    const [region, setRegion] = useState('Lampung');

    return (
        <>
            <Head title="Biaya" />
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Biaya Pembangunan
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Biaya
                        </p>
                    </div>

                    <div className="grid gap-5 rounded-lg border bg-card p-5">
                        <h2 className="text-lg font-semibold">FORM ISIAN</h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    placeholder="Nama Lengkap"
                                />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="desa">Desa</Label>
                                <Input
                                    id="desa"
                                    placeholder="Desa"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="panjang">
                                    Panjang Bangunan
                                </Label>
                                <Input
                                    id="panjang"
                                    type="number"
                                    min="0"
                                    placeholder="Panjang Bangunan : Meter"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="lebar">Lebar Bangunan</Label>
                                <Input
                                    id="lebar"
                                    type="number"
                                    min="0"
                                    placeholder="Lebar Bangunan : Meter"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ruang-tamu">
                                    Jumlah Ruang Tamu
                                </Label>
                                <Input
                                    id="ruang-tamu"
                                    type="number"
                                    min="0"
                                    defaultValue="1"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ruang-tidur">
                                    Jumlah Ruang Tidur
                                </Label>
                                <Input
                                    id="ruang-tidur"
                                    type="number"
                                    min="0"
                                    placeholder="Jumlah Ruang Tidur"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ruang-keluarga">
                                    Jumlah Ruang Keluarga
                                </Label>
                                <Input
                                    id="ruang-keluarga"
                                    type="number"
                                    min="0"
                                    defaultValue="1"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ruang-dapur">
                                    Jumlah Ruang Dapur
                                </Label>
                                <Input
                                    id="ruang-dapur"
                                    type="number"
                                    min="0"
                                    defaultValue="1"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ongkir-material">
                                    Ongkir Material
                                </Label>
                                <Input
                                    id="ongkir-material"
                                    type="number"
                                    min="0"
                                    defaultValue="0"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Tipe</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipeOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label>Wilayah</Label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {wilayahOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
