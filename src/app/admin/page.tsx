import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Dashboard',
    robots: { index: false, follow: false },
};

async function getStats() {
    const supabase = await createClient();

    const [publishedPosts, draftPosts, totalMedia, unreadMessages] = await Promise.all([
        supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published'),
        supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'draft'),
        supabase
            .from('media')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('contact_submissions')
            .select('*', { count: 'exact', head: true })
            .is('read_at', null),
    ]);

    return {
        publishedPosts: publishedPosts.count || 0,
        draftPosts: draftPosts.count || 0,
        totalMedia: totalMedia.count || 0,
        unreadMessages: unreadMessages.count || 0,
    };
}

async function getRecentPosts() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('id, title, slug, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);

    return data || [];
}

export default async function AdminDashboard() {
    const [stats, recentPosts] = await Promise.all([
        getStats(),
        getRecentPosts(),
    ]);

    const statCards = [
        {
            name: 'Publicados',
            value: stats.publishedPosts,
            icon: 'check',
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            name: 'Borradores',
            value: stats.draftPosts,
            icon: 'edit',
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
        },
        {
            name: 'Media',
            value: stats.totalMedia,
            icon: 'image',
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            name: 'Mensajes',
            value: stats.unreadMessages,
            icon: 'message',
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-100 dark:bg-purple-900/30',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-cosmic-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                    Bienvenido al panel de administración de La Verdad Oculta
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white dark:bg-cosmic-800 rounded-xl p-6 ring-1 ring-cosmic-200 dark:ring-cosmic-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <StatIcon name={stat.icon} className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-cosmic-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                                    {stat.name}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent posts */}
                <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700">
                    <div className="flex items-center justify-between p-6 border-b border-cosmic-200 dark:border-cosmic-700">
                        <h2 className="font-semibold text-cosmic-900 dark:text-white">
                            Artículos recientes
                        </h2>
                        <Link
                            href="/admin/posts/new"
                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                            + Nuevo
                        </Link>
                    </div>
                    <div className="divide-y divide-cosmic-200 dark:divide-cosmic-700">
                        {recentPosts.length > 0 ? (
                            recentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/admin/posts/${post.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-cosmic-50 dark:hover:bg-cosmic-700/50 transition-colors"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-cosmic-900 dark:text-white truncate">
                                            {post.title || 'Sin título'}
                                        </p>
                                        <p className="text-xs text-cosmic-500 mt-1">
                                            {new Date(post.updated_at).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <span
                                        className={`ml-4 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${post.status === 'published'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                            }`}
                                    >
                                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="p-6 text-center text-cosmic-500">
                                No hay artículos aún.{' '}
                                <Link href="/admin/posts/new" className="text-primary-600 dark:text-primary-400 hover:underline">
                                    Crea el primero
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick links */}
                <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-6">
                    <h2 className="font-semibold text-cosmic-900 dark:text-white mb-4">
                        Acciones rápidas
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/admin/posts/new"
                            className="flex items-center gap-3 p-4 rounded-lg bg-cosmic-50 dark:bg-cosmic-700/50 hover:bg-cosmic-100 dark:hover:bg-cosmic-700 transition-colors"
                        >
                            <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span className="text-sm font-medium text-cosmic-900 dark:text-white">
                                Nuevo artículo
                            </span>
                        </Link>
                        <Link
                            href="/admin/media"
                            className="flex items-center gap-3 p-4 rounded-lg bg-cosmic-50 dark:bg-cosmic-700/50 hover:bg-cosmic-100 dark:hover:bg-cosmic-700 transition-colors"
                        >
                            <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-sm font-medium text-cosmic-900 dark:text-white">
                                Subir media
                            </span>
                        </Link>
                        <Link
                            href="/admin/pages"
                            className="flex items-center gap-3 p-4 rounded-lg bg-cosmic-50 dark:bg-cosmic-700/50 hover:bg-cosmic-100 dark:hover:bg-cosmic-700 transition-colors"
                        >
                            <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                            </svg>
                            <span className="text-sm font-medium text-cosmic-900 dark:text-white">
                                Editar páginas
                            </span>
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-3 p-4 rounded-lg bg-cosmic-50 dark:bg-cosmic-700/50 hover:bg-cosmic-100 dark:hover:bg-cosmic-700 transition-colors"
                        >
                            <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="text-sm font-medium text-cosmic-900 dark:text-white">
                                Ver sitio
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatIcon({ name, className }: { name: string; className?: string }) {
    const icons: Record<string, React.ReactNode> = {
        check: (
            <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        edit: (
            <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        ),
        image: (
            <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
        message: (
            <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
    };

    return icons[name] || null;
}
