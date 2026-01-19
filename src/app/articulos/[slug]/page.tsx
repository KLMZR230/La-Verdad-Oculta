import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { TableOfContents } from '@/components/articles/TableOfContents';
import { ArticleContent } from '@/components/articles/ArticleContent';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    return data;
}

async function getRelatedPosts(currentPost: Post): Promise<Post[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .neq('id', currentPost.id)
        .order('published_at', { ascending: false })
        .limit(3);

    return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Artículo no encontrado',
        };
    }

    return {
        title: post.title,
        description: post.excerpt || `Lee "${post.title}" en La Verdad Oculta`,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: 'article',
            publishedTime: post.published_at || undefined,
            images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || undefined,
            images: post.cover_image_url ? [post.cover_image_url] : undefined,
        },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(post);

    return (
        <article className="py-12 lg:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <header className="mx-auto max-w-3xl">
                    {/* Breadcrumb */}
                    <nav className="mb-8 flex items-center gap-2 text-sm">
                        <Link
                            href="/"
                            className="text-cosmic-500 hover:text-cosmic-700 dark:hover:text-cosmic-300 transition-colors"
                        >
                            Inicio
                        </Link>
                        <span className="text-cosmic-400">/</span>
                        <Link
                            href="/articulos"
                            className="text-cosmic-500 hover:text-cosmic-700 dark:hover:text-cosmic-300 transition-colors"
                        >
                            Artículos
                        </Link>
                        <span className="text-cosmic-400">/</span>
                        <span className="text-cosmic-700 dark:text-cosmic-300 truncate max-w-[200px]">
                            {post.title}
                        </span>
                    </nav>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/articulos?tag=${encodeURIComponent(tag)}`}
                                    className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="font-display text-3xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-4xl lg:text-5xl">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="mt-6 flex items-center gap-4 text-sm text-cosmic-600 dark:text-cosmic-400">
                        {post.published_at && (
                            <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                            </time>
                        )}
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="mt-6 text-lg leading-relaxed text-cosmic-600 dark:text-cosmic-400">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                {/* Cover Image */}
                {post.cover_image_url && (
                    <div className="mt-10 mx-auto max-w-4xl">
                        <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full rounded-2xl shadow-lg"
                        />
                    </div>
                )}

                {/* Content with TOC */}
                <div className="mt-12 lg:mt-16 mx-auto max-w-7xl">
                    <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
                        {/* Main content */}
                        <div className="mx-auto max-w-3xl lg:max-w-none">
                            <ArticleContent content={post.content} />
                        </div>

                        {/* Table of Contents - Desktop */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24">
                                <TableOfContents content={post.content} />
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Share */}
                <div className="mt-12 mx-auto max-w-3xl border-t border-cosmic-200 dark:border-cosmic-700 pt-8">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-cosmic-600 dark:text-cosmic-400">
                            ¿Te gustó este artículo? Compártelo:
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/articulos/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg p-2 text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 transition-colors"
                                aria-label="Compartir en Twitter"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/articulos/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg p-2 text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 transition-colors"
                                aria-label="Compartir en Facebook"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="mt-16 border-t border-cosmic-200 dark:border-cosmic-700 pt-16">
                        <h2 className="font-display text-2xl font-bold text-cosmic-900 dark:text-white mb-8">
                            Continúa explorando
                        </h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((relatedPost) => (
                                <article
                                    key={relatedPost.id}
                                    className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-cosmic-800 shadow-sm ring-1 ring-cosmic-200 dark:ring-cosmic-700 transition-all duration-300 hover:shadow-lg"
                                >
                                    {relatedPost.cover_image_url && (
                                        <div className="aspect-[16/9] overflow-hidden">
                                            <img
                                                src={relatedPost.cover_image_url}
                                                alt={relatedPost.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="font-semibold text-cosmic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                            <Link href={`/articulos/${relatedPost.slug}`}>
                                                <span className="absolute inset-0" />
                                                {relatedPost.title}
                                            </Link>
                                        </h3>
                                        {relatedPost.published_at && (
                                            <time
                                                dateTime={relatedPost.published_at}
                                                className="mt-2 text-xs text-cosmic-500"
                                            >
                                                {formatDate(relatedPost.published_at)}
                                            </time>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
}
