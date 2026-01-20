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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <span className="text-sm font-medium text-cosmic-700 dark:text-cosmic-300">
                            ¿Te gustó este artículo? Compártelo:
                        </span>
                        <div className="flex items-center gap-3">
                            {/* X (Twitter) */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/articulos/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                                aria-label="Compartir en X"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="hidden sm:inline">X</span>
                            </a>
                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/articulos/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#166FE5] transition-colors"
                                aria-label="Compartir en Facebook"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden sm:inline">Facebook</span>
                            </a>
                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${process.env.NEXT_PUBLIC_SITE_URL}/articulos/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#20BD5C] transition-colors"
                                aria-label="Compartir en WhatsApp"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="hidden sm:inline">WhatsApp</span>
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
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
