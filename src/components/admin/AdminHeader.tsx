'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';

interface AdminHeaderProps {
    userEmail: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-cosmic-200 dark:border-cosmic-800 bg-white dark:bg-cosmic-900 px-6">
            {/* Mobile menu button */}
            <button
                type="button"
                className="lg:hidden -m-2.5 p-2.5 text-cosmic-700 dark:text-cosmic-300"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* Mobile logo */}
            <Link href="/admin" className="lg:hidden font-display font-bold gradient-text">
                Admin
            </Link>

            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="hidden sm:block h-6 w-px bg-cosmic-200 dark:bg-cosmic-700" />

                <div className="hidden sm:flex items-center gap-3">
                    <span className="text-sm text-cosmic-600 dark:text-cosmic-400">
                        {userEmail}
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 transition-colors disabled:opacity-50"
                >
                    {isLoggingOut ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    )}
                    <span className="hidden sm:inline">Salir</span>
                </button>
            </div>
        </header>
    );
}
