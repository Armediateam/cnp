import { Head } from '@inertiajs/react';
import { MessageCircle, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const contacts = [
    {
        region: 'Admin Jawa Tengah',
        name: 'Thufail',
        phone: '085839297113',
    },
    {
        region: 'Admin Jawa Barat',
        name: 'Pasya',
        phone: '08982512430',
    },
    {
        region: 'Admin Jawa Timur',
        name: 'Tyas',
        phone: '085381013808',
    },
    {
        region: 'Admin Sumatera',
        name: 'Admin Sumatera',
        phone: '080000000001',
    },
    {
        region: 'Admin Kalimantan',
        name: 'Admin Kalimantan',
        phone: '080000000002',
    },
    {
        region: 'Admin Indonesia Timur',
        name: 'Admin Timur',
        phone: '080000000003',
    },
];

function whatsappUrl(phone: string) {
    return `https://wa.me/62${phone.replace(/^0/, '')}`;
}

export default function Kontak() {
    return (
        <>
            <Head title="Kontak" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Kontak</h1>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {contacts.map((contact) => (
                            <Card key={contact.region}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {contact.region}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-5">
                                    <div className="flex size-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <UserRound className="size-11" />
                                    </div>

                                    <div className="grid gap-3">
                                        <p className="text-sm font-medium">
                                            {contact.name}{' '}
                                            <span className="font-normal text-muted-foreground">
                                                / Admin
                                            </span>
                                        </p>
                                        <p className="text-sm leading-6 text-muted-foreground">
                                            Untuk keterangan lebih lanjut bisa
                                            hubungi langsung {contact.phone} atau
                                            melalui chat whatsapp dibawah ini.
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-fit bg-green-500 text-white hover:bg-green-600"
                                    >
                                        <a
                                            href={whatsappUrl(contact.phone)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <MessageCircle />
                                            Whatsapp
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
