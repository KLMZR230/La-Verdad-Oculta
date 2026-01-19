'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
            setIsLoading(false);
            return;
        }

        // Verify user has admin/editor role
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: role } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .single();

            if (!role || !['admin', 'editor'].includes(role.role)) {
                await supabase.auth.signOut();
                setError('No tienes permisos para acceder al panel de administración.');
                setIsLoading(false);
                return;
            }
        }

        router.push(redirectTo);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-cosmic-900 dark:text-white"
                >
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 block w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                    placeholder="admin@ejemplo.com"
                    disabled={isLoading}
                />
            </div>

            {/* Password */}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-cosmic-900 dark:text-white"
                >
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-2 block w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    disabled={isLoading}
                />
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-sm">
                    {error}
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-primary-500 hover:to-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Iniciando sesión...
                    </span>
                ) : (
                    'Iniciar sesión'
                )}
            </button>
        </form>
    );
}

export function LoginForm() {
    return (
        <Suspense fallback={<div className="text-center text-cosmic-500">Cargando...</div>}>
            <LoginFormContent />
        </Suspense>
    );
}
