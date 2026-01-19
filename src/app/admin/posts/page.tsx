import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Post } from '@/lib/types';

export const metadata: Metadata = {
    title: 'Artículos',
    robots: { index: false, follow: false },
};

async function getPosts(): Promise<Post[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('*')
        .order('updated_at', { ascending: false });

    return data || [];
}

export default async function AdminPostsPage() {
    const posts = await getPosts();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-cosmic-900 dark:text-white">
                        Artículos
                    </h1>
                    <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                        Gestiona tus publicaciones
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:from-primary-500 hover:to-primary-600"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Nuevo artículo
                </Link>
            </div>

            {/* Posts table */}
            <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 overflow-hidden">
                {posts.length > 0 ? (
                    <table className="min-w-full divide-y divide-cosmic-200 dark:divide-cosmic-700">
                        <thead className="bg-cosmic-50 dark:bg-cosmic-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-cosmic-500 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-cosmic-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-cosmic-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-cosmic-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cosmic-200 dark:divide-cosmic-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-cosmic-50 dark:hover:bg-cosmic-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-cosmic-900 dark:text-white truncate max-w-xs">
                                                {post.title || 'Sin título'}
                                            </p>
                                            <p className="text-xs text-cosmic-500 mt-0.5">
                                                /{post.slug || '...'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.status === 'published'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                                }`}
                                        >
                                            {post.status === 'published' ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-cosmic-600 dark:text-cosmic-400">
                                        {new Date(post.updated_at).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/posts/${post.id}`}
                                                className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                            >
                                                Editar
                                            </Link>
                                            {post.status === 'published' && (
                                                <Link
                                                    href={`/articulos/${post.slug}`}
                                                    target="_blank"
                                                    className="px-3 py-1.5 text-sm font-medium text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-700 rounded-lg transition-colors"
                                                >
                                                    Ver
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-cosmic-900 dark:text-white">
                            No hay artículos
                        </h3>
                        <p className="mt-2 text-sm text-cosmic-600 dark:text-cosmic-400">
                            Comienza creando tu primer artículo.
                        </p>
                        <Link
                            href="/admin/posts/new"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Crear artículo
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
