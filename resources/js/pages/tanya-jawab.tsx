import { Head } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

const faqs = [
    {
        question: 'Apa itu Rumah Citra Nusantara?',
        answer: 'Rumah Citra Nusantara adalah layanan pembangunan rumah yang membantu calon konsumen menghitung biaya, ongkir material, dan kebutuhan awal sebelum proses pembelian.',
    },
    {
        question: 'Bagaimana cara menghitung biaya pembangunan?',
        answer: 'Biaya pembangunan dapat dihitung melalui halaman Biaya dengan mengisi data bangunan seperti panjang, lebar, jumlah ruangan, tipe, wilayah, dan ongkir material.',
    },
    {
        question: 'Apakah ongkir material dihitung otomatis?',
        answer: 'Halaman Ongkir menyediakan estimasi berdasarkan wilayah dan jarak. Nilai tersebut masih dapat disesuaikan kembali oleh admin sesuai kondisi lokasi.',
    },
    {
        question: 'Data apa saja yang perlu disiapkan untuk Form Beli?',
        answer: 'Calon pembeli perlu menyiapkan data pribadi, alamat lengkap, informasi lokasi, akses mobil, foto KTP, serta denah atau sketsa rumah.',
    },
    {
        question: 'Apakah bisa konsultasi dulu sebelum mengisi Form Beli?',
        answer: 'Bisa. Silakan hubungi admin wilayah melalui halaman Kontak untuk bertanya mengenai biaya, lokasi, dan proses pembangunan.',
    },
    {
        question: 'Apakah desain rumah bisa disesuaikan?',
        answer: 'Desain dapat dikonsultasikan dengan admin. Denah atau sketsa yang dikirim akan menjadi bahan awal untuk pengecekan kebutuhan bangunan.',
    },
    {
        question: 'Berapa lama proses pembangunan?',
        answer: 'Durasi pembangunan bergantung pada luas rumah, tipe pekerjaan, kondisi lokasi, dan kesiapan material. Estimasi final akan diinformasikan setelah data diverifikasi.',
    },
    {
        question: 'Siapa yang akan menghubungi setelah form dikirim?',
        answer: 'Admin wilayah akan menghubungi calon pembeli untuk memverifikasi data dan memberikan arahan proses berikutnya.',
    },
];

export default function TanyaJawab() {
    return (
        <>
            <Head title="Tanya Jawab" />
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Tanya Jawab
                        </h1>
                    </div>

                    <div className="grid gap-3">
                        {faqs.map((faq) => (
                            <Collapsible
                                key={faq.question}
                                className="rounded-lg border bg-card"
                            >
                                <CollapsibleTrigger className="group flex w-full items-center justify-between gap-4 px-4 py-3 text-left">
                                    <span className="font-medium">
                                        {faq.question}
                                    </span>
                                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="px-4 pb-4 text-sm leading-6 text-muted-foreground">
                                    {faq.answer}
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
