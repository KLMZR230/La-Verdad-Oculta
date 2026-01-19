import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Accede al panel de administración de La Verdad Oculta.',
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cosmic-50 to-cosmic-100 dark:from-cosmic-950 dark:to-cosmic-900">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <span className="font-display text-2xl font-bold gradient-text">
                            La Verdad Oculta
                        </span>
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold text-cosmic-900 dark:text-white">
                        Panel de Administración
                    </h1>
                    <p className="mt-2 text-sm text-cosmic-600 dark:text-cosmic-400">
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-8">
                    <LoginForm />
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        ← Volver al sitio
                    </Link>
                </div>
            </div>
        </div>
    );
}
