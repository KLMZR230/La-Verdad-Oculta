import { describe, it, expect } from 'vitest';
import { slugify, generateUniqueSlug } from '../src/lib/utils/slugify';

describe('slugify', () => {
    it('should convert text to lowercase', () => {
        expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
        expect(slugify('hello world test')).toBe('hello-world-test');
    });

    it('should handle Spanish characters', () => {
        expect(slugify('El niño español')).toBe('el-nino-espanol');
        expect(slugify('La Verdad Oculta')).toBe('la-verdad-oculta');
        expect(slugify('Reflexión cósmica')).toBe('reflexion-cosmica');
    });

    it('should handle accented vowels', () => {
        expect(slugify('áéíóú')).toBe('aeiou');
        expect(slugify('üe')).toBe('ue');
        expect(slugify('ñ')).toBe('n');
    });

    it('should remove special characters', () => {
        expect(slugify('Hello, World!')).toBe('hello-world');
        expect(slugify('Test@123#Example')).toBe('test123example');
    });

    it('should remove leading and trailing hyphens', () => {
        expect(slugify(' Hello World ')).toBe('hello-world');
        expect(slugify('---test---')).toBe('test');
    });

    it('should collapse multiple hyphens', () => {
        expect(slugify('hello    world')).toBe('hello-world');
        expect(slugify('hello---world')).toBe('hello-world');
    });

    it('should handle empty strings', () => {
        expect(slugify('')).toBe('');
        expect(slugify('   ')).toBe('');
    });

    it('should handle numbers', () => {
        expect(slugify('Post 123')).toBe('post-123');
        expect(slugify('2024 Year Review')).toBe('2024-year-review');
    });
});

describe('generateUniqueSlug', () => {
    it('should return the base slug if not in existing list', () => {
        expect(generateUniqueSlug('Hello World', [])).toBe('hello-world');
        expect(generateUniqueSlug('Test', ['other-slug'])).toBe('test');
    });

    it('should append a number if slug exists', () => {
        expect(generateUniqueSlug('Hello World', ['hello-world'])).toBe('hello-world-1');
    });

    it('should increment number for multiple conflicts', () => {
        const existing = ['test', 'test-1', 'test-2'];
        expect(generateUniqueSlug('Test', existing)).toBe('test-3');
    });
});
