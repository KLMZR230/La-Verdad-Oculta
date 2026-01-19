import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary color palette - deep cosmic blue
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c7d6fe',
                    300: '#a4b8fc',
                    400: '#8093f8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                // Neutral cosmic grays
                cosmic: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                // Accent gold for highlights
                accent: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                },
            },
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
                display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '75ch',
                        color: 'var(--tw-prose-body)',
                        lineHeight: '1.8',
                        h1: {
                            fontFamily: 'var(--font-playfair), serif',
                            fontWeight: '700',
                        },
                        h2: {
                            fontFamily: 'var(--font-playfair), serif',
                            fontWeight: '600',
                        },
                        h3: {
                            fontFamily: 'var(--font-playfair), serif',
                            fontWeight: '600',
                        },
                        a: {
                            color: 'var(--tw-prose-links)',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            '&:hover': {
                                color: 'var(--tw-prose-links-hover)',
                            },
                        },
                        blockquote: {
                            borderLeftColor: 'var(--tw-prose-quote-borders)',
                            fontStyle: 'italic',
                        },
                    },
                },
                invert: {
                    css: {
                        '--tw-prose-body': '#d4d4d8',
                        '--tw-prose-headings': '#fafafa',
                        '--tw-prose-links': '#a4b8fc',
                        '--tw-prose-links-hover': '#c7d6fe',
                        '--tw-prose-bold': '#fafafa',
                        '--tw-prose-counters': '#a1a1aa',
                        '--tw-prose-bullets': '#a1a1aa',
                        '--tw-prose-hr': '#3f3f46',
                        '--tw-prose-quotes': '#d4d4d8',
                        '--tw-prose-quote-borders': '#4338ca',
                        '--tw-prose-captions': '#a1a1aa',
                        '--tw-prose-code': '#fafafa',
                        '--tw-prose-pre-code': '#d4d4d8',
                        '--tw-prose-pre-bg': '#18181b',
                        '--tw-prose-th-borders': '#3f3f46',
                        '--tw-prose-td-borders': '#27272a',
                    },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [typography],
};

export default config;
