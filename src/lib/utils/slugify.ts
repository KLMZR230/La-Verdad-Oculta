/**
 * Converts a string to a URL-safe slug
 * Handles Spanish characters, accents, and special characters
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        // Replace Spanish characters
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ü/g, 'u')
        .replace(/ñ/g, 'n')
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove all non-word chars except hyphens
        .replace(/[^\w\-]+/g, '')
        // Replace multiple hyphens with single hyphen
        .replace(/\-\-+/g, '-')
        // Remove leading hyphens
        .replace(/^-+/, '')
        // Remove trailing hyphens
        .replace(/-+$/, '');
}

/**
 * Generates a unique slug by appending a number if needed
 */
export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
    const baseSlug = slugify(text);

    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
    }

    let counter = 1;
    let candidateSlug = `${baseSlug}-${counter}`;

    while (existingSlugs.includes(candidateSlug)) {
        counter++;
        candidateSlug = `${baseSlug}-${counter}`;
    }

    return candidateSlug;
}
