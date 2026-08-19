import { Head } from '@inertiajs/react';
import PublicInfoPage from '@/components/public-info-page';

export default function AlurKerjasamaPesanan() {
    return (
        <>
            <Head title="Alur Kerjasama / Pesanan" />
            <PublicInfoPage
                title="Alur Kerjasama / Pesanan"
                subtitle="Alur kerja dibuat sederhana agar calon pembeli paham proses dari pengisian form, validasi data, sampai diskusi kebutuhan rumah."
                image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
                points={['Isi form pembelian', 'Admin verifikasi data', 'Diskusi rencana pembangunan']}
            />
        </>
    );
}
