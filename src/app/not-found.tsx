import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-cosmic-900 dark:text-white">
                    404
                </h1>
                <h2 className="mt-4 text-xl font-semibold text-cosmic-700 dark:text-cosmic-300">
                    Página no encontrada
                </h2>
                <p className="mt-2 text-cosmic-600 dark:text-cosmic-400">
                    La página que buscas no existe o ha sido movida.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-block rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
