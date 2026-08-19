import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type PublicInfoPageProps = {
    title: string;
    subtitle: string;
    image: string;
    points: string[];
};

export default function PublicInfoPage({
    title,
    subtitle,
    image,
    points,
}: PublicInfoPageProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-8">
                <section className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
                    <div className="grid gap-4">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                            {subtitle}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href="/form-beli">
                                    Form Beli
                                    <ArrowRight />
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/kontak">Hubungi Admin</Link>
                            </Button>
                        </div>
                    </div>
                    <img
                        src={image}
                        alt={title}
                        className="aspect-[16/10] w-full rounded-lg object-cover"
                    />
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {points.map((point) => (
                        <Card key={point}>
                            <CardHeader>
                                <div className="flex size-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 className="size-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-base leading-6">
                                    {point}
                                </CardTitle>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </div>
    );
}
