import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import HomeLayout from '@/layouts/home-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = 'PT Citra Nusantara Propertindo';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case [
                'ongkir',
                'biaya',
                'form-beli',
                'tanya-jawab',
                'kontak',
                'rumah-citra-nusantara',
                'rumah-sudah-terbangun',
                'tahapan-pembangunan-rumah',
                'profil-perusahaan',
                'keuntungan-menggunakan-jasa-kami',
                'alur-kerjasama-pesanan',
                'spesifikasi-material-yang-dipakai',
                'skema-pembayaran',
            ].includes(name):
                return HomeLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
