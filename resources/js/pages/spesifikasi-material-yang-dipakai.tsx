import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function SpesifikasiMaterialYangDipakai() {
    return (
        <>
            <Head title="Spesifikasi / Material Yang Dipakai" />
            <PublicInfoPage
                title="Spesifikasi / Material Yang Dipakai"
                subtitle="Preview daftar material dan spesifikasi pekerjaan yang umum dipakai dalam proses pembangunan rumah. Data final dapat disesuaikan."
                image="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                points={['Material struktur', 'Finishing dasar', 'Spesifikasi bisa disesuaikan']}
            />
        </>
    );
}
