'use client';

import { useState } from 'react';
import { submitContactForm } from '@/app/actions/contact';

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setResult(null);

        try {
            const response = await submitContactForm(formData);
            setResult(response);

            if (response.success) {
                // Reset form on success
                const form = document.getElementById('contact-form') as HTMLFormElement;
                form?.reset();
            }
        } catch {
            setResult({
                success: false,
                message: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form id="contact-form" action={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-cosmic-900 dark:text-white"
                >
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    className="mt-2 block w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                    disabled={isSubmitting}
                />
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-cosmic-900 dark:text-white"
                >
                    Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-2 block w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                />
            </div>

            {/* Message */}
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-cosmic-900 dark:text-white"
                >
                    Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={6}
                    className="mt-2 block w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                    disabled={isSubmitting}
                />
            </div>

            {/* Result message */}
            {result && (
                <div
                    className={`p-4 rounded-xl ${result.success
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}
                >
                    {result.message}
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-primary-500 hover:to-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Enviando...
                    </span>
                ) : (
                    'Enviar mensaje'
                )}
            </button>
        </form>
    );
}
