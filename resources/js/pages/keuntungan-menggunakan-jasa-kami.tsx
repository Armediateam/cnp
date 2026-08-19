import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function KeuntunganMenggunakanJasaKami() {
    return (
        <>
            <Head title="Keuntungan Menggunakan Jasa Kami" />
            <PublicInfoPage
                title="Keuntungan Menggunakan Jasa Kami"
                subtitle="Halaman ini menampilkan ringkasan manfaat layanan untuk calon pembeli. Konten sementara dapat diganti dengan materi final dari client."
                image="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80"
                points={['Konsultasi awal mudah', 'Estimasi biaya cepat', 'Admin siap membantu']}
            />
        </>
    );
}
