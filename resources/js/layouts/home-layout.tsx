import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const homeNavItems = [
    { title: 'Beranda', href: '/' },
    { title: 'Ongkir', href: '/ongkir' },
    { title: 'Biaya', href: '/biaya' },
    { title: 'Buat RAB', href: '/rab-project' },
    { title: 'Tanya Jawab', href: '/tanya-jawab' },
    { title: 'Kontak', href: '/kontak' },
];

const socialItems = [
    { title: 'Instagram', href: '#', icon: 'instagram' },
    { title: 'Facebook', href: '#', icon: 'facebook' },
    { title: 'WhatsApp', href: '#', icon: 'whatsapp' },
];

function SocialIcon({ icon }: { icon: string }) {
    if (icon === 'instagram') {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="currentColor"
            >
                <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
        );
    }

    if (icon === 'facebook') {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="currentColor"
            >
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.79-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.49 0-1.955.93-1.955 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
            </svg>
        );
    }

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4"
            fill="currentColor"
        >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326ZM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592Zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232Z" />
        </svg>
    );
}

function isActive(currentUrl: string, href: string) {
    return href === '/' ? currentUrl === href : currentUrl.startsWith(href);
}

export default function HomeLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();

    useEffect(() => {
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');
        const previousColorScheme = root.style.colorScheme;

        root.classList.remove('dark');
        root.style.colorScheme = 'light';

        return () => {
            root.classList.toggle('dark', wasDark);
            root.style.colorScheme = previousColorScheme;
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <AppLogoIcon className="size-10" />
                        <span className="hidden text-sm font-semibold sm:block">
                            PT Citra Nusantara Propertindo
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {homeNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive(url, item.href)
                                        ? 'bg-muted text-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <Menu />
                                <span className="sr-only">Buka menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-1 px-4">
                                {homeNavItems.map((item) => (
                                    <SheetClose key={item.href} asChild>
                                        <Link
                                            href={item.href}
                                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                isActive(url, item.href)
                                                    ? 'bg-muted text-foreground'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        >
                                            {item.title}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>
                        &copy; {new Date().getFullYear()} PT Citra Nusantara
                        Propertindo
                    </p>
                    <div className="flex items-center gap-1.5">
                        {socialItems.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                aria-label={item.title}
                                title={item.title}
                                className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <SocialIcon icon={item.icon} />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
