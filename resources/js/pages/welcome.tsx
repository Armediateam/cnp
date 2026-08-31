import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';

type HomepageCard = {
    id: number;
    title: string;
    image_path: string;
    url: string;
};

export default function Welcome({ cards }: { cards: HomepageCard[] }) {
    return (
        <>
            <Head title="Beranda" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((item) => (
                        <Link key={item.id} href={item.url}>
                            <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
                                <CardHeader className="p-0">
                                    <img
                                        src={`/storage/${item.image_path}`}
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
                    
                    {cards.length === 0 && (
                        <div className="col-span-full py-10 text-center text-muted-foreground">
                            Belum ada konten beranda yang diaktifkan.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
