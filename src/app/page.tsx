import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

async function getRecentPosts() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, cover_image_url, published_at, tags')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

    return data || [];
}

export default async function HomePage() {
    const posts = await getRecentPosts();

    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-950">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <Image
                            src="/logo.jpg"
                            alt="La Verdad Oculta"
                            width={280}
                            height={280}
                            className="rounded-full ring-4 ring-primary-500/30 shadow-2xl shadow-primary-500/20 animate-float"
                            priority
                        />
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-amber-400 via-primary-400 to-amber-400 bg-clip-text text-transparent">
                            La Verdad Oculta
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-cosmic-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Una exploración filosófica y espiritual de la idea de{' '}
                        <span className="text-primary-400 font-semibold">Dios como el universo entero</span>.
                        Reflexiones educativas sobre espiritualidad y consciencia.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/articulos"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105"
                        >
                            Leer artículos
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link
                            href="/manifiesto"
                            className="inline-flex items-center gap-2 rounded-full border-2 border-cosmic-600 px-8 py-4 text-lg font-semibold text-cosmic-300 transition-all hover:bg-cosmic-800 hover:border-primary-500 hover:text-white"
                        >
                            Nuestro manifiesto
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="h-6 w-6 text-cosmic-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Recent Articles */}
            <section className="py-20 bg-white dark:bg-cosmic-950">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-cosmic-900 dark:text-white sm:text-4xl">
                            Artículos Recientes
                        </h2>
                        <p className="mt-4 text-lg text-cosmic-600 dark:text-cosmic-400">
                            Explora nuestras reflexiones más recientes
                        </p>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group relative bg-cosmic-50 dark:bg-cosmic-900 rounded-2xl overflow-hidden ring-1 ring-cosmic-200 dark:ring-cosmic-800 hover:ring-primary-500/50 transition-all hover:shadow-xl"
                                >
                                    {/* Cover image */}
                                    <div className="aspect-video relative overflow-hidden">
                                        {post.cover_image_url ? (
                                            <Image
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-amber-600 flex items-center justify-center">
                                                <Image
                                                    src="/logo.jpg"
                                                    alt="La Verdad Oculta"
                                                    width={80}
                                                    height={80}
                                                    className="rounded-full opacity-50"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {post.published_at && (
                                            <time className="text-sm text-cosmic-500 dark:text-cosmic-400">
                                                {formatDate(post.published_at)}
                                            </time>
                                        )}
                                        <h3 className="mt-2 text-xl font-semibold text-cosmic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            <Link href={`/articulos/${post.slug}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>
                                        {post.excerpt && (
                                            <p className="mt-3 text-cosmic-600 dark:text-cosmic-400 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Image
                                src="/logo.jpg"
                                alt="La Verdad Oculta"
                                width={120}
                                height={120}
                                className="mx-auto rounded-full opacity-50 mb-6"
                            />
                            <h3 className="text-xl font-semibold text-cosmic-900 dark:text-white mb-2">
                                Próximamente
                            </h3>
                            <p className="text-cosmic-600 dark:text-cosmic-400">
                                Estamos preparando contenido inspirador para ti.
                            </p>
                        </div>
                    )}

                    {posts.length > 0 && (
                        <div className="mt-12 text-center">
                            <Link
                                href="/articulos"
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                                Ver todos los artículos
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 bg-cosmic-50 dark:bg-cosmic-900">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="font-display text-3xl font-bold text-cosmic-900 dark:text-white sm:text-4xl mb-8">
                        Nuestra Filosofía
                    </h2>
                    <blockquote className="text-xl italic text-cosmic-700 dark:text-cosmic-300 leading-relaxed">
                        &ldquo;No existe separación entre el Creador y la creación.
                        Dios no es un ser distante observando desde afuera; Dios <em>es</em> cada átomo,
                        cada estrella, cada pensamiento, cada latido.&rdquo;
                    </blockquote>
                    <div className="mt-8">
                        <Link
                            href="/manifiesto"
                            className="inline-flex items-center gap-2 rounded-full bg-cosmic-900 dark:bg-white px-6 py-3 text-base font-medium text-white dark:text-cosmic-900 transition-all hover:bg-cosmic-800 dark:hover:bg-cosmic-100"
                        >
                            Leer el manifiesto completo
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
