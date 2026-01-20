import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { ArticleSearch } from '@/components/articles/ArticleSearch';

export const metadata: Metadata = {
    title: 'Artículos',
    description: 'Explora nuestras reflexiones sobre espiritualidad, el universo y la conexión con el todo.',
};

const PAGE_SIZE = 12;

async function getAllTags(): Promise<string[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('tags')
        .eq('status', 'published');

    if (!data) return [];

    const allTags = data.flatMap((post) => post.tags || []);
    const uniqueTags = [...new Set(allTags)].sort();
    return uniqueTags;
}

async function getPosts(
    page: number = 1,
    search: string = '',
    tag: string = ''
): Promise<{ posts: Post[]; total: number }> {
    const supabase = await createClient();

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (tag) {
        query = query.contains('tags', [tag]);
    }

    const { data, count } = await query.range(from, to);

    return {
        posts: data || [],
        total: count || 0,
    };
}

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        tag?: string;
    }>;
}

export default async function ArticulosPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1', 10);
    const search = params.search || '';
    const tag = params.tag || '';

    const [{ posts, total }, allTags] = await Promise.all([
        getPosts(page, search, tag),
        getAllTags(),
    ]);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-5xl">
                        Artículos
                    </h1>
                    <p className="mt-4 text-lg text-cosmic-600 dark:text-cosmic-400">
                        Reflexiones y exploraciones sobre espiritualidad, el cosmos y nuestra conexión con el todo.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mt-8 max-w-2xl mx-auto">
                    <ArticleSearch
                        initialSearch={search}
                        initialTag={tag}
                        allTags={allTags}
                    />
                </div>

                {/* Articles Grid */}
                {posts.length > 0 ? (
                    <>
                        <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/articulos/${post.slug}`}
                                    className="group block overflow-hidden rounded-2xl bg-white dark:bg-cosmic-800 shadow-sm ring-1 ring-cosmic-200 dark:ring-cosmic-700 transition-all duration-300 hover:shadow-lg hover:ring-primary-300 dark:hover:ring-primary-700"
                                >
                                    {/* Cover image */}
                                    {post.cover_image_url ? (
                                        <div className="aspect-[16/9] overflow-hidden">
                                            <img
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30" />
                                    )}

                                    <div className="p-3 sm:p-6">
                                        {/* Title */}
                                        <h2 className="text-sm sm:text-lg font-semibold text-cosmic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt - hidden on mobile */}
                                        {post.excerpt && (
                                            <p className="hidden sm:block mt-3 text-sm text-cosmic-600 dark:text-cosmic-400 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Date - hidden on mobile */}
                                        {post.published_at && (
                                            <time
                                                dateTime={post.published_at}
                                                className="hidden sm:block mt-4 text-xs text-cosmic-500"
                                                suppressHydrationWarning
                                            >
                                                {formatDate(post.published_at)}
                                            </time>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="mt-12 flex items-center justify-center gap-2">
                                {page > 1 && (
                                    <Link
                                        href={`/articulos?page=${page - 1}${search ? `&search=${search}` : ''}${tag ? `&tag=${tag}` : ''}`}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 transition-colors"
                                    >
                                        ← Anterior
                                    </Link>
                                )}

                                <span className="px-4 py-2 text-sm text-cosmic-600 dark:text-cosmic-400">
                                    Página {page} de {totalPages}
                                </span>

                                {page < totalPages && (
                                    <Link
                                        href={`/articulos?page=${page + 1}${search ? `&search=${search}` : ''}${tag ? `&tag=${tag}` : ''}`}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 transition-colors"
                                    >
                                        Siguiente →
                                    </Link>
                                )}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="mt-12 text-center">
                        <div className="mx-auto w-24 h-24 rounded-full bg-cosmic-100 dark:bg-cosmic-800 flex items-center justify-center">
                            <svg
                                className="h-12 w-12 text-cosmic-400"
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
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-cosmic-900 dark:text-white">
                            {search || tag ? 'No se encontraron artículos' : 'No hay artículos disponibles'}
                        </h3>
                        <p className="mt-2 text-cosmic-600 dark:text-cosmic-400">
                            {search || tag
                                ? 'Intenta con otros términos de búsqueda o filtros.'
                                : 'Pronto habrá contenido disponible.'}
                        </p>
                        {(search || tag) && (
                            <Link
                                href="/articulos"
                                className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Ver todos los artículos
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

