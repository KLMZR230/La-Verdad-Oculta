import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

async function getRecentPosts(): Promise<Post[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

    return data || [];
}

export default async function HomePage() {
    const recentPosts = await getRecentPosts();

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-cosmic-950 to-primary-900">
                    {/* Star effect */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse-soft" />
                        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft delay-300" />
                        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse-soft delay-500" />
                        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse-soft delay-700" />
                        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-white rounded-full animate-pulse-soft delay-1000" />
                    </div>
                    {/* Radial gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-cosmic-950/80" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <h1 className="animate-fade-in font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                        La Verdad{' '}
                        <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                            Oculta
                        </span>
                    </h1>

                    <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cosmic-300 sm:text-xl">
                        Una exploración filosófica sobre la naturaleza del universo y nuestra conexión
                        con el todo. Reflexiones sobre espiritualidad, consciencia y el cosmos.
                    </p>

                    <div className="animate-slide-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/articulos"
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-base font-medium text-white shadow-lg shadow-primary-900/30 transition-all hover:from-primary-500 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-900/40 focus-visible-ring"
                        >
                            Leer artículos
                            <svg
                                className="ml-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </Link>
                        <Link
                            href="/manifiesto"
                            className="inline-flex items-center justify-center rounded-full border border-cosmic-600 px-8 py-3 text-base font-medium text-white transition-all hover:bg-cosmic-800/50 focus-visible-ring"
                        >
                            Explorar manifiesto
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg
                        className="h-6 w-6 text-cosmic-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </div>
            </section>

            {/* Featured Articles Section */}
            {recentPosts.length > 0 && (
                <section className="bg-cosmic-50 dark:bg-cosmic-900 py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="font-display text-3xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-4xl">
                                Últimas reflexiones
                            </h2>
                            <p className="mt-4 text-lg text-cosmic-600 dark:text-cosmic-400">
                                Explora las publicaciones más recientes sobre espiritualidad y el universo.
                            </p>
                        </div>

                        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                            {recentPosts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-cosmic-800 shadow-sm ring-1 ring-cosmic-200 dark:ring-cosmic-700 transition-all duration-300 hover:shadow-lg hover:ring-primary-300 dark:hover:ring-primary-700"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Cover image */}
                                    {post.cover_image_url && (
                                        <div className="aspect-[16/9] overflow-hidden">
                                            <img
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-1 flex-col p-6">
                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-cosmic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            <Link href={`/articulos/${post.slug}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>

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
                                                className="mt-4 text-xs text-cosmic-500 dark:text-cosmic-500"
                                            >
                                                {formatDate(post.published_at)}
                                            </time>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/articulos"
                                className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                                Ver todos los artículos
                                <svg
                                    className="ml-1 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Philosophy Section */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="font-display text-3xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-4xl">
                            Una nueva perspectiva
                        </h2>
                        <div className="mt-8 space-y-6 text-lg leading-relaxed text-cosmic-600 dark:text-cosmic-400">
                            <p>
                                ¿Y si todo lo que buscamos estuviera ya presente en cada átomo del universo?
                                ¿Y si Dios no estuviera separado de la creación, sino que fuera la creación misma?
                            </p>
                            <p>
                                Este sitio explora la idea de que el universo entero—cada estrella, cada
                                partícula, cada pensamiento—es una expresión de lo divino. No como dogma,
                                sino como invitación a la reflexión.
                            </p>
                        </div>
                        <div className="mt-10">
                            <Link
                                href="/manifiesto"
                                className="inline-flex items-center justify-center rounded-full bg-cosmic-900 dark:bg-white px-8 py-3 text-base font-medium text-white dark:text-cosmic-900 shadow transition-all hover:bg-cosmic-800 dark:hover:bg-cosmic-100 focus-visible-ring"
                            >
                                Leer el manifiesto completo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
