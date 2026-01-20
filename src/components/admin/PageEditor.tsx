'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Page, PageFormData } from '@/lib/types';
import { slugify } from '@/lib/utils/slugify';
import { debounce } from '@/lib/utils';
import { TipTapEditor } from './TipTapEditor';
import { savePage, deletePage } from '@/app/actions/pages';

interface PageEditorProps {
    page: Page;
}

export function PageEditor({ page }: PageEditorProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<PageFormData>({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content,
        meta_description: page.meta_description || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Autosave debounced
    const debouncedSave = useCallback(
        debounce(async (data: PageFormData) => {
            try {
                await savePage(page.id, data);
                setLastSaved(new Date());
            } catch (error) {
                console.error('Autosave error:', error);
            }
        }, 2000),
        [page.id]
    );

    // Trigger autosave on form changes
    useEffect(() => {
        if (formData.title || formData.content) {
            debouncedSave(formData);
        }
    }, [formData, debouncedSave]);

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: prev.slug || slugify(title),
        }));
    };

    // Manual save
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await savePage(page.id, formData);
            setLastSaved(new Date());
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta página? Esta acción no se puede deshacer.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePage(page.id);
            router.push('/admin/pages');
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/pages')}
                        className="p-2 text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 rounded-lg transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-cosmic-900 dark:text-white">
                            {page.title ? 'Editar página' : 'Nueva página'}
                        </h1>
                        {lastSaved && (
                            <p className="text-xs text-cosmic-500 mt-0.5">
                                Guardado {lastSaved.toLocaleTimeString('es-ES')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Título de la página"
                            className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-cosmic-200 dark:border-cosmic-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-0 text-cosmic-900 dark:text-white placeholder-cosmic-400 py-2"
                        />
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Contenido
                        </label>
                        <div className="bg-white dark:bg-cosmic-800 rounded-xl border border-cosmic-300 dark:border-cosmic-600 overflow-hidden">
                            <TipTapEditor
                                content={formData.content}
                                onChange={(content: Record<string, unknown> | null) => setFormData((prev) => ({ ...prev, content }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Slug */}
                    <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-4">
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            URL (slug)
                        </label>
                        <div className="flex items-center">
                            <span className="text-sm text-cosmic-500">/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                                className="flex-1 text-sm bg-transparent border-0 focus:ring-0 text-cosmic-900 dark:text-white p-0 ml-1"
                                placeholder="mi-pagina"
                            />
                        </div>
                    </div>

                    {/* Meta Description */}
                    <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-4">
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Meta descripción (SEO)
                        </label>
                        <textarea
                            value={formData.meta_description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                            placeholder="Descripción para buscadores..."
                            rows={3}
                            className="w-full text-sm rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-3 py-2 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none resize-none"
                        />
                        <p className="mt-1 text-xs text-cosmic-500">
                            {formData.meta_description.length}/160 caracteres
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-4">
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Información
                        </label>
                        <div className="text-xs text-cosmic-500 space-y-1">
                            <p>Creada: {new Date(page.created_at).toLocaleDateString('es-ES')}</p>
                            <p>Actualizada: {new Date(page.updated_at).toLocaleDateString('es-ES')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
