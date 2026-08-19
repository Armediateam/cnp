import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';

const previews = [
    {
        title: 'Rumah Citra Nusantara',
        href: '/rumah-citra-nusantara',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Rumah Sudah Terbangun',
        href: '/rumah-sudah-terbangun',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Tahapan Pembangunan Rumah',
        href: '/tahapan-pembangunan-rumah',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Profil Perusahaan',
        href: '/profil-perusahaan',
        image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Keuntungan Menggunakan Jasa Kami',
        href: '/keuntungan-menggunakan-jasa-kami',
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Alur Kerjasama / Pesanan',
        href: '/alur-kerjasama-pesanan',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Spesifikasi / Material Yang Dipakai',
        href: '/spesifikasi-material-yang-dipakai',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Skema Pembayaran',
        href: '/skema-pembayaran',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Beranda" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {previews.map((item) => (
                        <Link key={item.title} href={item.href}>
                            <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
                                <CardHeader className="p-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="aspect-[16/10] w-full object-cover"
                                    />
                                </CardHeader>
                                <CardContent className="p-5">
                                    <h2 className="text-sm leading-6 font-medium text-orange-600">
                                        {item.title}
                                    </h2>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
