'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Artículos', href: '/articulos' },
    { name: 'Manifiesto', href: '/manifiesto' },
    { name: 'Acerca', href: '/acerca' },
    { name: 'Contacto', href: '/contacto' },
];

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-cosmic-200/50 dark:border-cosmic-800/50 bg-white/80 dark:bg-cosmic-950/80 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/logo.jpg"
                        alt="La Verdad Oculta"
                        width={48}
                        height={48}
                        className="rounded-full ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 transition-all"
                    />
                    <span className="hidden sm:block font-display text-xl font-bold bg-gradient-to-r from-primary-600 via-amber-500 to-primary-600 bg-clip-text text-transparent">
                        La Verdad Oculta
                    </span>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden lg:flex lg:items-center lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-cosmic-700 dark:text-cosmic-300 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="lg:hidden -m-2.5 p-2.5 text-cosmic-700 dark:text-cosmic-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        {mobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-cosmic-200 dark:border-cosmic-800 bg-white dark:bg-cosmic-950">
                    <div className="space-y-1 px-6 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-base font-medium transition-colors ${pathname === item.href
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-cosmic-700 dark:text-cosmic-300 hover:text-primary-600'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
