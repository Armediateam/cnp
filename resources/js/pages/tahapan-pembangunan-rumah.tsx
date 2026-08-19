import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function TahapanPembangunanRumah() {
    return (
        <>
            <Head title="Tahapan Pembangunan Rumah" />
            <PublicInfoPage
                title="Tahapan Pembangunan Rumah"
                subtitle="Gambaran sederhana proses pembangunan dari survei lokasi, perhitungan biaya, persiapan material, sampai serah terima rumah."
                image="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                points={['Survei dan pengukuran', 'Pengerjaan bertahap', 'Kontrol progress pembangunan']}
            />
        </>
    );
}
