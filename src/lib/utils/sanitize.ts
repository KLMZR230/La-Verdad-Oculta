import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr',
            'ul', 'ol', 'li',
            'strong', 'em', 'u', 's', 'code', 'pre',
            'blockquote',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'span',
        ],
        ALLOWED_ATTR: [
            'href', 'target', 'rel',
            'src', 'alt', 'title', 'width', 'height',
            'class', 'id',
        ],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
}

/**
 * Sanitizes plain text - removes all HTML
 */
export function sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitizes a URL to ensure it's safe
 */
export function sanitizeUrl(url: string): string {
    const trimmed = url.trim();

    // Only allow http, https, and relative URLs
    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('#')
    ) {
        return trimmed;
    }

    // Block javascript:, data:, and other potentially dangerous protocols
    return '';
}
