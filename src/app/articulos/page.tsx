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

interface PageProps {
    searchParams: Promise<{
        search?: string;
        tag?: string;
        page?: string;
    }>;
}

const PAGE_SIZE = 9;

async function getPosts(
    search?: string,
    tag?: string,
    page: number = 1
): Promise<{ posts: Post[]; total: number }> {
    const supabase = await createClient();

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

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count } = await query.range(from, to);

    return {
        posts: data || [],
        total: count || 0,
    };
}

async function getAllTags(): Promise<string[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('tags')
        .eq('status', 'published');

    if (!data) return [];

    const allTags = data.flatMap((post) => post.tags || []);
    return [...new Set(allTags)].sort();
}

export default async function ArticulosPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = params.search || '';
    const tag = params.tag || '';
    const page = parseInt(params.page || '1', 10);

    const [{ posts, total }, allTags] = await Promise.all([
        getPosts(search, tag, page),
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
                <div className="mt-12">
                    <ArticleSearch
                        initialSearch={search}
                        initialTag={tag}
                        allTags={allTags}
                    />
                </div>

                {/* Active filters */}
                {(search || tag) && (
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-cosmic-600 dark:text-cosmic-400">
                            Filtros activos:
                        </span>
                        {search && (
                            <Link
                                href={tag ? `/articulos?tag=${tag}` : '/articulos'}
                                className="inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-sm text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                            >
                                &ldquo;{search}&rdquo;
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Link>
                        )}
                        {tag && (
                            <Link
                                href={search ? `/articulos?search=${search}` : '/articulos'}
                                className="inline-flex items-center gap-1 rounded-full bg-accent-100 dark:bg-accent-900/30 px-3 py-1 text-sm text-accent-700 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-900/50 transition-colors"
                            >
                                #{tag}
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Link>
                        )}
                        <Link
                            href="/articulos"
                            className="text-sm text-cosmic-500 hover:text-cosmic-700 dark:hover:text-cosmic-300 transition-colors"
                        >
                            Limpiar todo
                        </Link>
                    </div>
                )}

                {/* Articles Grid */}
                {posts.length > 0 ? (
                    <>
                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-cosmic-800 shadow-sm ring-1 ring-cosmic-200 dark:ring-cosmic-700 transition-all duration-300 hover:shadow-lg hover:ring-primary-300 dark:hover:ring-primary-700"
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

                                    <div className="flex flex-1 flex-col p-6">
                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.slice(0, 2).map((t) => (
                                                    <Link
                                                        key={t}
                                                        href={`/articulos?tag=${encodeURIComponent(t)}`}
                                                        className="relative z-10 inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {t}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h2 className="text-lg font-semibold text-cosmic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            <Link href={`/articulos/${post.slug}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="mt-3 flex-1 text-sm text-cosmic-600 dark:text-cosmic-400 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Date */}
                                        {post.published_at && (
                                            <time
                                                dateTime={post.published_at}
                                                className="mt-4 text-xs text-cosmic-500"
                                            >
                                                {formatDate(post.published_at)}
                                            </time>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav className="mt-12 flex items-center justify-center gap-2">
                                {page > 1 && (
                                    <Link
                                        href={`/articulos?${new URLSearchParams({
                                            ...(search && { search }),
                                            ...(tag && { tag }),
                                            page: String(page - 1),
                                        })}`}
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
                                        href={`/articulos?${new URLSearchParams({
                                            ...(search && { search }),
                                            ...(tag && { tag }),
                                            page: String(page + 1),
                                        })}`}
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
                            No se encontraron artículos
                        </h3>
                        <p className="mt-2 text-cosmic-600 dark:text-cosmic-400">
                            {search || tag
                                ? 'Intenta con otros términos de búsqueda o filtros.'
                                : 'Pronto habrá contenido disponible.'}
                        </p>
                        {(search || tag) && (
                            <Link
                                href="/articulos"
                                className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
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
