import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Formats a date for display
 */
export function formatDate(date: string | Date, locale: string = 'es-ES'): string {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Truncates text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Debounce function for autosave
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Extract headings from HTML content for TOC
 */
export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
    if (typeof window === 'undefined') {
        // Server-side: simple regex extraction
        const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h\1>/gi;
        const headings: { id: string; text: string; level: number }[] = [];
        let match;

        while ((match = headingRegex.exec(html)) !== null) {
            headings.push({
                level: parseInt(match[1]),
                id: match[2],
                text: match[3],
            });
        }

        return headings;
    }

    // Client-side: DOM parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    return Array.from(headingElements).map((el) => ({
        id: el.id || slugifyForId(el.textContent || ''),
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
    }));
}

function slugifyForId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}
