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
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover z-0"
                >
                    <source
                        src="https://pub-0c024c9a5a7a439aa0319b5140a52857.r2.dev/compressed_Static_camera_shot_202601201549_c7syl.mp4"
                        type="video/mp4"
                    />
                </video>

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/50 z-0" />

                {/* Content */}
                <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
                    {/* Subtitle only - the image already has the logo/title */}
                    <div className="mt-48 sm:mt-56 lg:mt-64">
                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            Una exploración filosófica y espiritual de la idea de{' '}
                            <span className="text-amber-400 font-semibold">Dios como el universo entero</span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/articulos"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105"
                            >
                                Leer artículos
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/manifiesto"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10 hover:border-amber-400 hover:text-amber-400"
                            >
                                Nuestro manifiesto
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="h-8 w-8 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
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
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
                                    <div className="p-3 sm:p-6">
                                        {post.published_at && (
                                            <time className="hidden sm:block text-sm text-cosmic-500 dark:text-cosmic-400" suppressHydrationWarning>
                                                {formatDate(post.published_at)}
                                            </time>
                                        )}
                                        <h3 className="sm:mt-2 text-sm sm:text-xl font-semibold text-cosmic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                            <Link href={`/articulos/${post.slug}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>
                                        {post.excerpt && (
                                            <p className="hidden sm:block mt-3 text-cosmic-600 dark:text-cosmic-400 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="hidden sm:flex mt-4 flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag: string) => (
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
