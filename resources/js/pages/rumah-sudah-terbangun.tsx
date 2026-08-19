import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function RumahSudahTerbangun() {
    return (
        <>
            <Head title="Rumah Sudah Terbangun" />
            <PublicInfoPage
                title="Rumah Sudah Terbangun"
                subtitle="Kumpulan contoh rumah yang sudah selesai dikerjakan sebagai bahan preview. Foto dan isi halaman ini masih dummy sementara."
                image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
                points={['Contoh hasil pengerjaan', 'Referensi tipe bangunan', 'Preview portofolio project']}
            />
        </>
    );
}
