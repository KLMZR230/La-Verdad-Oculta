'use client';

import { useMemo } from 'react';
import { JSONContent, generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { sanitizeHtml } from '@/lib/utils/sanitize';

interface ArticleContentProps {
    content: JSONContent | null;
}

// Configure extensions for HTML generation
const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4, 5, 6],
        },
    }),
    Link.configure({
        openOnClick: false,
    }),
    Image,
];

// Add IDs to headings for TOC navigation
function addHeadingIds(html: string): string {
    return html.replace(
        /<(h[1-6])([^>]*)>([^<]*)<\/h[1-6]>/gi,
        (_, tag, attrs, text) => {
            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
        }
    );
}

export function ArticleContent({ content }: ArticleContentProps) {
    const html = useMemo(() => {
        if (!content) return '';

        try {
            const rawHtml = generateHTML(content, extensions);
            const withIds = addHeadingIds(rawHtml);
            return sanitizeHtml(withIds);
        } catch (error) {
            console.error('Error generating HTML:', error);
            return '<p>Error al cargar el contenido.</p>';
        }
    }, [content]);

    if (!content) {
        return (
            <div className="text-center py-12">
                <p className="text-cosmic-500 dark:text-cosmic-400">
                    Este artículo no tiene contenido todavía.
                </p>
            </div>
        );
    }

    return (
        <div
            className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-display prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-cosmic-700 dark:prose-p:text-cosmic-300 prose-p:leading-relaxed
        prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-cosmic-900 dark:prose-strong:text-white
        prose-blockquote:border-l-primary-500 prose-blockquote:bg-cosmic-50 dark:prose-blockquote:bg-cosmic-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        prose-img:rounded-xl prose-img:shadow-lg
        prose-code:bg-cosmic-100 dark:prose-code:bg-cosmic-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-cosmic-900 prose-pre:text-cosmic-100"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
