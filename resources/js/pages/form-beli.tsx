import { Head, router } from '@inertiajs/react';
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

const aksesOptions = ['Bisa Dilalui Mobil', 'Tidak Bisa Dilalui Mobil'];
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

function TextField({
    id,
    name,
    label,
    type = 'text',
}: {
    id: string;
    name: string;
    label: string;
    type?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} name={name} type={type} placeholder={label} />
        </div>
    );
}

export default function FormBeli() {
    const [carAccess, setCarAccess] = useState('');
    const [region, setRegion] = useState('');
    const [saving, setSaving] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);

        const formData = new FormData(event.currentTarget);
        formData.set('car_access', carAccess);
        formData.set('region', region);

        router.post('/form-beli', formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }

    return (
        <>
            <Head title="Form Beli" />
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Form Beli</h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-5 rounded-lg border bg-card p-5"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField id="nama" name="name" label="Nama" />
                            <TextField
                                id="tempat-lahir"
                                name="birth_place"
                                label="Tempat Lahir"
                            />
                            <TextField
                                id="tanggal-lahir"
                                name="birth_date"
                                label="Tanggal Lahir"
                                type="date"
                            />
                            <TextField
                                id="umur"
                                name="age"
                                label="Umur"
                                type="number"
                            />
                            <TextField
                                id="no-hp"
                                name="phone"
                                label="No HP"
                                type="tel"
                            />
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                            />
                            <TextField
                                id="pekerjaan"
                                name="occupation"
                                label="Pekerjaan"
                            />
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Input
                                    id="alamat"
                                    name="address"
                                    placeholder="Alamat"
                                />
                            </div>
                            <TextField id="rt" name="rt" label="RT" />
                            <TextField id="rw" name="rw" label="RW" />
                            <TextField id="desa" name="village" label="Desa" />
                            <TextField
                                id="kecamatan"
                                name="district"
                                label="Kecamatan"
                            />
                            <TextField
                                id="kabupaten"
                                name="regency"
                                label="Kabupaten"
                            />
                            <TextField
                                id="provinsi"
                                name="province"
                                label="Provinsi"
                            />
                            <TextField
                                id="luas-rumah"
                                name="house_area"
                                label="Luas Rumah"
                            />
                            <TextField
                                id="lokasi"
                                name="location"
                                label="Lokasi"
                            />
                            <TextField
                                id="informasi-dari"
                                name="information_source"
                                label="Informasi Dari"
                            />

                            <div className="grid gap-2">
                                <Label>Akses Mobil</Label>
                                <Select
                                    value={carAccess}
                                    onValueChange={setCarAccess}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- PILIH AKSES --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {aksesOptions.map((option) => (
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

                            <TextField
                                id="nama-pasangan"
                                name="spouse_name"
                                label="Nama Suami/Istri"
                            />
                            <TextField
                                id="no-hp-pasangan"
                                name="spouse_phone"
                                label="No HP Suami/Istri"
                                type="tel"
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="foto-ktp">Foto KTP</Label>
                                <Input
                                    id="foto-ktp"
                                    name="ktp_photo"
                                    type="file"
                                    accept="image/*"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="foto-denah">
                                    Foto Denah / Sketsa
                                </Label>
                                <Input
                                    id="foto-denah"
                                    name="sketch_photo"
                                    type="file"
                                    accept="image/*"
                                />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label>WILAYAH</Label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="-- PILIH WILAYAH --" />
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
                        <Button disabled={saving} type="submit">
                            Simpan Form Beli
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
