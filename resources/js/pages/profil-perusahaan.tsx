import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function ProfilPerusahaan() {
    return (
        <>
            <Head title="Profil Perusahaan" />
            <PublicInfoPage
                title="Profil Perusahaan"
                subtitle="PT Citra Nusantara Propertindo bergerak dalam layanan pembangunan rumah dan pendampingan konsumen dari tahap awal sampai siap bangun."
                image="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
                points={['Tim admin wilayah', 'Informasi biaya transparan', 'Pendampingan calon konsumen']}
            />
        </>
    );
}
