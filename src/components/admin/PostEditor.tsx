'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostFormData } from '@/lib/types';
import { slugify } from '@/lib/utils/slugify';
import { debounce } from '@/lib/utils';
import { TipTapEditor } from './TipTapEditor';
import { MediaLibrary } from './MediaLibrary';
import { savePost, publishPost, deletePost } from '@/app/actions/posts';

interface PostEditorProps {
    post: Post;
}

export function PostEditor({ post }: PostEditorProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<PostFormData>({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image_url: post.cover_image_url || '',
        status: post.status,
        tags: post.tags || [],
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    // Autosave debounced
    const debouncedSave = useCallback(
        debounce(async (data: PostFormData) => {
            try {
                await savePost(post.id, data);
                setLastSaved(new Date());
            } catch (error) {
                console.error('Autosave error:', error);
            }
        }, 2000),
        [post.id]
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
            await savePost(post.id, formData);
            setLastSaved(new Date());
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Publish
    const handlePublish = async () => {
        if (!formData.title.trim()) {
            alert('El artículo necesita un título para ser publicado.');
            return;
        }

        setIsPublishing(true);
        try {
            await publishPost(post.id, formData);
            router.push('/admin/posts');
            router.refresh();
        } catch (error) {
            console.error('Publish error:', error);
        } finally {
            setIsPublishing(false);
        }
    };

    // Delete
    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePost(post.id);
            router.push('/admin/posts');
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Add tag
    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tag],
            }));
        }
        setTagInput('');
    };

    // Remove tag
    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tagToRemove),
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/posts')}
                        className="p-2 text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 rounded-lg transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-cosmic-900 dark:text-white">
                            {post.status === 'published' ? 'Editar artículo' : 'Nuevo artículo'}
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
                        className="px-4 py-2 text-sm font-medium text-cosmic-700 dark:text-cosmic-300 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar borrador'}
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPublishing ? 'Publicando...' : post.status === 'published' ? 'Actualizar' : 'Publicar'}
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
                            placeholder="Título del artículo"
                            className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-cosmic-200 dark:border-cosmic-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-0 text-cosmic-900 dark:text-white placeholder-cosmic-400 py-2"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Extracto
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                            placeholder="Breve descripción del artículo..."
                            rows={2}
                            className="w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-800 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none"
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
                            <span className="text-sm text-cosmic-500">/articulos/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                                className="flex-1 text-sm bg-transparent border-0 focus:ring-0 text-cosmic-900 dark:text-white p-0 ml-1"
                                placeholder="mi-articulo"
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-4">
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Imagen de portada
                        </label>
                        {formData.cover_image_url ? (
                            <div className="relative">
                                <img
                                    src={formData.cover_image_url}
                                    alt="Cover"
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => setFormData((prev) => ({ ...prev, cover_image_url: '' }))}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMediaPicker(true)}
                                    className="w-full py-8 border-2 border-dashed border-cosmic-300 dark:border-cosmic-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
                                >
                                    <svg className="mx-auto h-12 w-12 text-cosmic-400 group-hover:text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    <p className="mt-2 text-sm font-medium text-cosmic-700 dark:text-cosmic-300 group-hover:text-primary-600">
                                        Seleccionar imagen
                                    </p>
                                    <p className="text-xs text-cosmic-500">
                                        Click para abrir la biblioteca
                                    </p>
                                </button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-cosmic-200 dark:border-cosmic-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-white dark:bg-cosmic-800 px-2 text-cosmic-500">o pegar URL</span>
                                    </div>
                                </div>
                                <input
                                    type="url"
                                    value={formData.cover_image_url}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full text-sm rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-3 py-2 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-4">
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Etiquetas
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Nueva etiqueta"
                                className="flex-1 text-sm rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-900 px-3 py-2 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none"
                            />
                            <button
                                onClick={handleAddTag}
                                className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-900/30 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-red-500"
                                        >
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white dark:bg-cosmic-800 rounded-xl ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-4">
                        <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-2">
                            Estado
                        </label>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${formData.status === 'published'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                    }`}
                            >
                                {formData.status === 'published' ? 'Publicado' : 'Borrador'}
                            </span>
                            {post.published_at && (
                                <span className="text-xs text-cosmic-500">
                                    desde {new Date(post.published_at).toLocaleDateString('es-ES')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Picker Modal */}
            {showMediaPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                    <div className="bg-white dark:bg-cosmic-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
                        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-cosmic-200 dark:border-cosmic-700 bg-white dark:bg-cosmic-900">
                            <h3 className="text-lg font-semibold text-cosmic-900 dark:text-white">
                                Seleccionar imagen de portada
                            </h3>
                            <button
                                onClick={() => setShowMediaPicker(false)}
                                className="p-2 rounded-lg hover:bg-cosmic-100 dark:hover:bg-cosmic-800"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <MediaLibrary
                                selectable={true}
                                onSelect={(url) => {
                                    setFormData((prev) => ({ ...prev, cover_image_url: url }));
                                    setShowMediaPicker(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
