import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://laverdadoculta369.netlify.app'),
    title: {
        default: 'La Verdad Oculta | Reflexiones sobre Dios y el Universo',
        template: '%s | La Verdad Oculta',
    },
    description:
        'Una exploración filosófica y espiritual de la idea de Dios como el universo entero. Reflexiones educativas sobre espiritualidad y consciencia.',
    keywords: [
        'espiritualidad',
        'filosofía',
        'universo',
        'consciencia',
        'reflexión',
        'Dios',
        'cosmos',
    ],
    authors: [{ name: 'La Verdad Oculta' }],
    creator: 'La Verdad Oculta',
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: 'La Verdad Oculta',
        title: 'La Verdad Oculta | Reflexiones sobre Dios y el Universo',
        description:
            'Una exploración filosófica y espiritual de la idea de Dios como el universo entero.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'La Verdad Oculta',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'La Verdad Oculta',
        description:
            'Una exploración filosófica y espiritual de la idea de Dios como el universo entero.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <ThemeProvider>
                    <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
