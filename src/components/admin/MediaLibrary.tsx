'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Media } from '@/lib/types';

export function MediaLibrary() {
    const [media, setMedia] = useState<Media[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [search, setSearch] = useState('');

    const fetchMedia = useCallback(async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from('media')
            .select('*')
            .order('created_at', { ascending: false });

        setMedia(data || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const supabase = createClient();

        for (const file of Array.from(files)) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                continue;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            // Get image dimensions if it's an image
            let width: number | null = null;
            let height: number | null = null;

            if (file.type.startsWith('image/')) {
                try {
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    await new Promise((resolve) => (img.onload = resolve));
                    width = img.width;
                    height = img.height;
                } catch {
                    // Ignore dimension errors
                }
            }

            // Save to database
            const { data: { user } } = await supabase.auth.getUser();

            await supabase.from('media').insert({
                filename: fileName,
                original_filename: file.name,
                storage_path: filePath,
                url: urlData.publicUrl,
                mime_type: file.type,
                size_bytes: file.size,
                width,
                height,
                uploaded_by: user?.id,
            });
        }

        fetchMedia();
        setIsUploading(false);
        e.target.value = '';
    };

    const handleDelete = async (id: string, storagePath: string) => {
        if (!confirm('¿Eliminar este archivo?')) return;

        const supabase = createClient();

        // Delete from storage
        await supabase.storage.from('media').remove([storagePath]);

        // Delete from database
        await supabase.from('media').delete().eq('id', id);

        fetchMedia();
        setSelectedMedia(null);
    };

    const handleUpdateAlt = async (id: string, altText: string) => {
        const supabase = createClient();
        await supabase.from('media').update({ alt_text: altText }).eq('id', id);
        fetchMedia();
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        alert('URL copiada al portapapeles');
    };

    const filteredMedia = media.filter((m) =>
        m.original_filename.toLowerCase().includes(search.toLowerCase()) ||
        m.alt_text?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Upload and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar archivos..."
                        className="w-full rounded-xl border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-800 px-4 py-3 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                    />
                </div>
                <label className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:from-primary-500 hover:to-primary-600 cursor-pointer">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {isUploading ? 'Subiendo...' : 'Subir archivos'}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Media Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                </div>
            ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedMedia(item)}
                            className={`group relative aspect-square rounded-xl overflow-hidden ring-2 transition-all ${selectedMedia?.id === item.id
                                    ? 'ring-primary-500'
                                    : 'ring-transparent hover:ring-cosmic-300 dark:hover:ring-cosmic-600'
                                }`}
                        >
                            {item.mime_type?.startsWith('image/') ? (
                                <img
                                    src={item.url}
                                    alt={item.alt_text || item.original_filename}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-cosmic-100 dark:bg-cosmic-800 flex items-center justify-center">
                                    <svg className="h-8 w-8 text-cosmic-400" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                    <p className="text-xs text-white truncate">
                                        {item.original_filename}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-cosmic-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-cosmic-900 dark:text-white">
                        No hay archivos
                    </h3>
                    <p className="mt-2 text-sm text-cosmic-600 dark:text-cosmic-400">
                        Sube imágenes para usarlas en tus artículos.
                    </p>
                </div>
            )}

            {/* Selected Media Panel */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-cosmic-950/50 backdrop-blur-sm" onClick={() => setSelectedMedia(null)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-cosmic-900 shadow-xl overflow-auto">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-cosmic-900 dark:text-white">
                                    Detalles del archivo
                                </h2>
                                <button
                                    onClick={() => setSelectedMedia(null)}
                                    className="p-2 text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-800 rounded-lg"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="aspect-video rounded-lg overflow-hidden bg-cosmic-100 dark:bg-cosmic-800">
                                {selectedMedia.mime_type?.startsWith('image/') ? (
                                    <img
                                        src={selectedMedia.url}
                                        alt={selectedMedia.alt_text || selectedMedia.original_filename}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="h-12 w-12 text-cosmic-400" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-cosmic-500 mb-1">
                                        Nombre
                                    </label>
                                    <p className="text-sm text-cosmic-900 dark:text-white break-all">
                                        {selectedMedia.original_filename}
                                    </p>
                                </div>

                                {selectedMedia.width && selectedMedia.height && (
                                    <div>
                                        <label className="block text-xs font-medium text-cosmic-500 mb-1">
                                            Dimensiones
                                        </label>
                                        <p className="text-sm text-cosmic-900 dark:text-white">
                                            {selectedMedia.width} × {selectedMedia.height}px
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-cosmic-500 mb-1">
                                        Tamaño
                                    </label>
                                    <p className="text-sm text-cosmic-900 dark:text-white">
                                        {selectedMedia.size_bytes
                                            ? `${(selectedMedia.size_bytes / 1024).toFixed(1)} KB`
                                            : 'Desconocido'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-cosmic-500 mb-1">
                                        Texto alternativo
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedMedia.alt_text || ''}
                                        onBlur={(e) => handleUpdateAlt(selectedMedia.id, e.target.value)}
                                        placeholder="Describe la imagen..."
                                        className="w-full text-sm rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-white dark:bg-cosmic-800 px-3 py-2 text-cosmic-900 dark:text-white placeholder-cosmic-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-cosmic-500 mb-1">
                                        URL
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={selectedMedia.url}
                                            readOnly
                                            className="flex-1 text-xs rounded-lg border border-cosmic-300 dark:border-cosmic-600 bg-cosmic-50 dark:bg-cosmic-800 px-3 py-2 text-cosmic-600 dark:text-cosmic-400"
                                        />
                                        <button
                                            onClick={() => copyUrl(selectedMedia.url)}
                                            className="px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-cosmic-200 dark:border-cosmic-700">
                                <button
                                    onClick={() => handleDelete(selectedMedia.id, selectedMedia.storage_path)}
                                    className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    Eliminar archivo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
