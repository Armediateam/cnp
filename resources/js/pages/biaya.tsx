import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    const [nama, setNama] = useState('');
    const [desa, setDesa] = useState('');
    const [panjang, setPanjang] = useState('');
    const [lebar, setLebar] = useState('');
    const [ruangTamu, setRuangTamu] = useState('1');
    const [ruangTidur, setRuangTidur] = useState('');
    const [ruangKeluarga, setRuangKeluarga] = useState('1');
    const [ruangDapur, setRuangDapur] = useState('1');
    const [ongkirMaterial, setOngkirMaterial] = useState('0');
    const [type, setType] = useState('Medium');
    const [region, setRegion] = useState('Lampung');
    const [showResult, setShowResult] = useState(false);

    const luas = (Number(panjang) || 0) * (Number(lebar) || 0);
    const biayaPembangunan = luas * 1700000;
    const potongan = biayaPembangunan * 0.10;
    const biayaAkhir = biayaPembangunan - potongan;
    const ongkir = Number(ongkirMaterial) || 0;

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

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
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Nama Lengkap"
                                />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="desa">Desa</Label>
                                <Input
                                    id="desa"
                                    value={desa}
                                    onChange={(e) => setDesa(e.target.value)}
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
                                    value={panjang}
                                    onChange={(e) => setPanjang(e.target.value)}
                                    placeholder="Panjang Bangunan : Meter"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="lebar">Lebar Bangunan</Label>
                                <Input
                                    id="lebar"
                                    type="number"
                                    min="0"
                                    value={lebar}
                                    onChange={(e) => setLebar(e.target.value)}
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
                                    value={ruangTamu}
                                    onChange={(e) => setRuangTamu(e.target.value)}
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
                                    value={ruangTidur}
                                    onChange={(e) => setRuangTidur(e.target.value)}
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
                                    value={ruangKeluarga}
                                    onChange={(e) => setRuangKeluarga(e.target.value)}
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
                                    value={ruangDapur}
                                    onChange={(e) => setRuangDapur(e.target.value)}
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
                                    value={ongkirMaterial}
                                    onChange={(e) => setOngkirMaterial(e.target.value)}
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

                        <div className="mt-4">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => setShowResult(true)}
                            >
                                HITUNG
                            </Button>
                        </div>
                    </div>

                    {showResult && (
                        <div className="rounded-lg border bg-card p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                            <div className="flex flex-col items-center space-y-2">
                                {/* Simulated Logo Placeholder */}
                                <div className="text-xl font-bold text-orange-600 flex items-center">
                                    <span className="mr-2 border-2 border-orange-600 px-2 py-1 bg-orange-100">
                                        Program
                                    </span>
                                    <div className="text-left leading-tight text-black">
                                        Rumah<br />
                                        <span className="text-red-600">Mandiri</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold italic text-red-600">
                                Hallo {nama || '-'} - {desa || '-'}
                            </h3>
                            <h4 className="text-lg font-semibold italic text-red-600">
                                Hitung rumah impianmu...!
                            </h4>

                            <div className="space-y-1 text-muted-foreground w-full max-w-sm mt-4">
                                <p>Luas Bangunan : {luas} M2</p>
                                <p>Biaya Pembangunan : {formatRupiah(biayaPembangunan)}</p>
                                <p>Potongan 10%</p>
                                <p>Untuk Pembayaran Cash Tempo</p>
                            </div>

                            <div className="bg-gray-300 w-full max-w-xs py-2 mt-2 font-bold text-xl border border-black rounded shadow-inner">
                                {formatRupiah(biayaAkhir)}
                            </div>

                            <div className="mt-4 text-muted-foreground w-full max-w-sm space-y-2">
                                <p>Ongkir Material : {formatRupiah(ongkir)}</p>
                                <p>Ruangan :</p>
                            </div>

                            <div className="w-full max-w-sm mt-2">
                                <table className="w-full border-collapse border border-gray-400 text-left text-sm text-muted-foreground">
                                    <tbody>
                                        <tr className="border border-gray-400">
                                            <td className="border border-gray-400 px-4 py-2 text-center w-12">{ruangTamu || 0}</td>
                                            <td className="border border-gray-400 px-4 py-2">Ruang Tamu</td>
                                        </tr>
                                        <tr className="border border-gray-400">
                                            <td className="border border-gray-400 px-4 py-2 text-center">{ruangTidur || 0}</td>
                                            <td className="border border-gray-400 px-4 py-2">Ruang Tidur</td>
                                        </tr>
                                        <tr className="border border-gray-400">
                                            <td className="border border-gray-400 px-4 py-2 text-center">{ruangKeluarga || 0}</td>
                                            <td className="border border-gray-400 px-4 py-2">Ruang Keluarga</td>
                                        </tr>
                                        <tr className="border border-gray-400">
                                            <td className="border border-gray-400 px-4 py-2 text-center">{ruangDapur || 0}</td>
                                            <td className="border border-gray-400 px-4 py-2">Ruang Dapur</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 text-muted-foreground w-full max-w-sm">
                                <p className="mb-2">Dengan Spesifikasi Teknik :</p>
                                <table className="w-full text-left text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 w-1/3">Pondasi</td>
                                            <td className="py-1">: Batu belah</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 w-1/3">Dinding</td>
                                            <td className="py-1">: Bata merah/hebel, Plester, Aci, Cat</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 w-1/3">Lantai</td>
                                            <td className="py-1">: Keramik 40x40</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 w-1/3">Plafon</td>
                                            <td className="py-1">: Gypsum rangka hollow</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 w-1/3">Atap</td>
                                            <td className="py-1">: Baja ringan, Genteng metal pasir</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
