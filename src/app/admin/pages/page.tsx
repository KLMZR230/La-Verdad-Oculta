import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Page } from '@/lib/types';

export const metadata: Metadata = {
    title: 'Páginas',
    robots: { index: false, follow: false },
};

async function getPages(): Promise<Page[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('pages')
        .select('*')
        .order('title', { ascending: true });

    return data || [];
}

export default async function AdminPagesPage() {
    const pages = await getPages();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-cosmic-900 dark:text-white">
                        Páginas
                    </h1>
                    <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                        Gestiona las páginas estáticas del sitio
                    </p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:from-primary-500 hover:to-primary-600"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nueva página
                </Link>
            </div>

            {/* Pages list */}
            <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 overflow-hidden">
                {pages.length > 0 ? (
                    <div className="divide-y divide-cosmic-200 dark:divide-cosmic-700">
                        {pages.map((page) => (
                            <Link
                                key={page.id}
                                href={`/admin/pages/${page.id}`}
                                className="flex items-center justify-between p-4 hover:bg-cosmic-50 dark:hover:bg-cosmic-700/50 transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-cosmic-900 dark:text-white">
                                        {page.title}
                                    </p>
                                    <p className="text-xs text-cosmic-500 mt-0.5">
                                        /{page.slug}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-cosmic-500">
                                        {new Date(page.updated_at).toLocaleDateString('es-ES')}
                                    </span>
                                    <svg className="h-5 w-5 text-cosmic-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-cosmic-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-cosmic-900 dark:text-white">
                            No hay páginas
                        </h3>
                        <p className="mt-2 text-sm text-cosmic-600 dark:text-cosmic-400">
                            Crea páginas como &quot;Manifiesto&quot;, &quot;Acerca&quot; o &quot;Contacto&quot;.
                        </p>
                        <Link
                            href="/admin/pages/new"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Crear página
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
