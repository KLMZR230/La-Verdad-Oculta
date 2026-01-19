'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface MediaItem {
    id: string;
    filename: string;
    original_filename: string;
    url: string;
    mime_type: string;
    size_bytes: number;
    alt_text: string | null;
    created_at: string;
}

export function MediaLibrary() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const supabase = createClient();

    const loadMedia = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading media:', error);
            setError('Error cargando media');
        } else {
            setMedia(data || []);
        }
        setIsLoading(false);
    }, [supabase]);

    useEffect(() => {
        loadMedia();
    }, [loadMedia]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        const totalFiles = files.length;
        let uploaded = 0;

        for (const file of Array.from(files)) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Error al subir');
                }

                uploaded++;
                setUploadProgress(Math.round((uploaded / totalFiles) * 100));
            } catch (err) {
                console.error('Upload error:', err);
                setError(err instanceof Error ? err.message : 'Error al subir archivo');
            }
        }

        setIsUploading(false);
        setUploadProgress(0);
        setSuccess(`${uploaded} archivo(s) subido(s) correctamente`);
        setTimeout(() => setSuccess(null), 3000);
        loadMedia();

        // Reset input
        e.target.value = '';
    };

    const handleDelete = async (item: MediaItem) => {
        if (!confirm('¿Eliminar esta imagen?')) return;

        try {
            const response = await fetch(`/api/upload?id=${item.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar');
            }

            setSuccess('Imagen eliminada');
            setTimeout(() => setSuccess(null), 3000);
            setSelectedMedia(null);
            loadMedia();
        } catch (err) {
            setError('Error al eliminar imagen');
        }
    };

    const handleUpdateAlt = async (item: MediaItem, altText: string) => {
        const { error } = await supabase
            .from('media')
            .update({ alt_text: altText })
            .eq('id', item.id);

        if (error) {
            setError('Error actualizando alt text');
        } else {
            setSuccess('Alt text actualizado');
            setTimeout(() => setSuccess(null), 3000);
            loadMedia();
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setSuccess('URL copiada al portapapeles');
        setTimeout(() => setSuccess(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const filteredMedia = media.filter(
        (item) =>
            item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h1 className="text-2xl font-bold text-cosmic-900 dark:text-white">
                    Biblioteca de Medios
                </h1>
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-amber-600 px-6 py-3 text-sm font-medium text-white hover:from-primary-500 hover:to-amber-500 transition-all">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 4.502 4.502 0 013.516 8.07" />
                    </svg>
                    Subir imágenes
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                    {success}
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                                Subiendo... {uploadProgress}%
                            </p>
                            <div className="mt-2 h-2 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cosmic-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar imágenes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-cosmic-300 dark:border-cosmic-700 bg-white dark:bg-cosmic-900 text-cosmic-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                />
            </div>

            {/* Media Grid */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    <p className="text-cosmic-600 dark:text-cosmic-400">Cargando media...</p>
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 rounded-xl border-2 border-dashed border-cosmic-300 dark:border-cosmic-700">
                    <svg className="mx-auto h-12 w-12 text-cosmic-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-cosmic-900 dark:text-white">
                        No hay imágenes
                    </h3>
                    <p className="mt-2 text-cosmic-600 dark:text-cosmic-400">
                        Sube tu primera imagen para comenzar
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedMedia(item)}
                            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition-all"
                        >
                            <Image
                                src={item.url}
                                alt={item.alt_text || item.original_filename}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-xs text-white truncate">
                                        {item.original_filename}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                    <div className="bg-white dark:bg-cosmic-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-cosmic-900 dark:text-white">
                                    Detalles de imagen
                                </h3>
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="p-2 rounded-lg hover:bg-cosmic-100 dark:hover:bg-cosmic-800"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="aspect-video relative rounded-xl overflow-hidden mb-4 bg-cosmic-100 dark:bg-cosmic-800">
                                <Image
                                    src={selectedMedia.url}
                                    alt={selectedMedia.alt_text || selectedMedia.original_filename}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-1">
                                        Nombre del archivo
                                    </label>
                                    <p className="text-cosmic-900 dark:text-white">
                                        {selectedMedia.original_filename}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-1">
                                        Tamaño
                                    </label>
                                    <p className="text-cosmic-900 dark:text-white">
                                        {formatSize(selectedMedia.size_bytes)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-1">
                                        URL
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedMedia.url}
                                            className="flex-1 px-3 py-2 rounded-lg border border-cosmic-300 dark:border-cosmic-700 bg-cosmic-50 dark:bg-cosmic-800 text-sm"
                                        />
                                        <button
                                            onClick={() => copyUrl(selectedMedia.url)}
                                            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-500"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-cosmic-700 dark:text-cosmic-300 mb-1">
                                        Texto alternativo (SEO)
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedMedia.alt_text || ''}
                                        onBlur={(e) => handleUpdateAlt(selectedMedia, e.target.value)}
                                        placeholder="Descripción de la imagen"
                                        className="w-full px-3 py-2 rounded-lg border border-cosmic-300 dark:border-cosmic-700 bg-white dark:bg-cosmic-800 text-sm"
                                    />
                                </div>

                                <button
                                    onClick={() => handleDelete(selectedMedia)}
                                    className="w-full py-3 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
