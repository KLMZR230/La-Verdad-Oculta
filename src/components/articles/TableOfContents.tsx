'use client';

import { useEffect, useState } from 'react';
import { JSONContent, generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface TableOfContentsProps {
    content: JSONContent | null;
}

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

function extractHeadingsFromJSON(content: JSONContent): TOCItem[] {
    const headings: TOCItem[] = [];

    function traverse(node: JSONContent) {
        if (node.type?.startsWith('heading') && node.attrs?.level) {
            const text = node.content
                ?.filter((n) => n.type === 'text')
                .map((n) => n.text)
                .join('') || '';

            if (text) {
                const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                headings.push({
                    id,
                    text,
                    level: node.attrs.level,
                });
            }
        }

        if (node.content) {
            node.content.forEach(traverse);
        }
    }

    traverse(content);
    return headings;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [headings, setHeadings] = useState<TOCItem[]>([]);

    useEffect(() => {
        if (content) {
            setHeadings(extractHeadingsFromJSON(content));
        }
    }, [content]);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="rounded-xl border border-cosmic-200 dark:border-cosmic-700 bg-cosmic-50 dark:bg-cosmic-800/50 p-5">
            <h2 className="text-sm font-semibold text-cosmic-900 dark:text-white mb-4">
                Contenido
            </h2>
            <ul className="space-y-2">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={`block text-sm transition-colors ${activeId === heading.id
                                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                                    : 'text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(heading.id);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
