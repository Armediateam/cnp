import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function RumahCitraNusantara() {
    return (
        <>
            <Head title="Rumah Citra Nusantara" />
            <PublicInfoPage
                title="Rumah Citra Nusantara"
                subtitle="Preview konsep rumah sederhana, rapi, dan siap dikembangkan sesuai kebutuhan keluarga. Konten ini masih dummy untuk kebutuhan tampilan awal."
                image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                points={['Desain rumah modern', 'Layout fleksibel', 'Estimasi awal mudah dibaca']}
            />
        </>
    );
}
