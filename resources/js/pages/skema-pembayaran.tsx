import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function SkemaPembayaran() {
    return (
        <>
            <Head title="Skema Pembayaran" />
            <PublicInfoPage
                title="Skema Pembayaran"
                subtitle="Skema pembayaran dapat dibuat bertahap sesuai kesepakatan, mulai dari DP, progress pembangunan, hingga pelunasan akhir."
                image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
                points={['DP awal', 'Pembayaran progress', 'Rekap biaya jelas']}
            />
        </>
    );
}
