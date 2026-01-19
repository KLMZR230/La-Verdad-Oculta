'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface ArticleSearchProps {
    initialSearch: string;
    initialTag: string;
    allTags: string[];
}

export function ArticleSearch({ initialSearch, initialTag, allTags }: ArticleSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(initialSearch);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.delete('page'); // Reset to first page on new search

        startTransition(() => {
            router.push(`/articulos?${params.toString()}`);
        });
    };

    const handleTagChange = (tag: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (tag) {
            params.set('tag', tag);
        } else {
            params.delete('tag');
        }
        params.delete('page'); // Reset to first page on tag change

        startTransition(() => {
            router.push(`/articulos?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar artículos..."
                    className="w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-800 px-4 py-3 pl-11 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                    aria-label="Buscar artículos"
                />
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cosmic-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
                {isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                    </div>
                )}
            </form>

            {/* Tag filter */}
            {allTags.length > 0 && (
                <select
                    value={initialTag}
                    onChange={(e) => handleTagChange(e.target.value)}
                    className="rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-800 px-4 py-3 text-cosmic-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors appearance-none cursor-pointer min-w-[180px]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.25em 1.25em',
                        paddingRight: '2.5rem',
                    }}
                    aria-label="Filtrar por tema"
                >
                    <option value="">Todos los temas</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
