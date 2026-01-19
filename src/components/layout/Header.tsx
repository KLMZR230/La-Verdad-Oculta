'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Artículos', href: '/articulos' },
    { name: 'Manifiesto', href: '/manifiesto' },
    { name: 'Acerca', href: '/acerca' },
    { name: 'Contacto', href: '/contacto' },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 group">
                        <span className="font-display text-xl font-bold tracking-tight">
                            <span className="gradient-text group-hover:opacity-80 transition-opacity">
                                La Verdad Oculta
                            </span>
                        </span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-cosmic-700 dark:text-cosmic-300 focus-visible-ring"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </div>

                {/* Desktop navigation */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-cosmic-700 dark:text-cosmic-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-visible-ring rounded-md px-2 py-1"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Theme toggle */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <ThemeToggle />
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div
                        className="fixed inset-0 z-50 bg-cosmic-950/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-cosmic-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-cosmic-900/10 dark:sm:ring-cosmic-100/10">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/"
                                className="-m-1.5 p-1.5"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="font-display text-xl font-bold gradient-text">
                                    La Verdad Oculta
                                </span>
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-cosmic-700 dark:text-cosmic-300 focus-visible-ring"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Cerrar menú"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-cosmic-200 dark:divide-cosmic-700">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-cosmic-600 dark:text-cosmic-400">
                                            Tema
                                        </span>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
