import { Metadata } from 'next';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export const metadata: Metadata = {
    title: 'Media',
    robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-cosmic-900 dark:text-white">
                    Biblioteca de Medios
                </h1>
                <p className="mt-1 text-sm text-cosmic-600 dark:text-cosmic-400">
                    Sube y gestiona imágenes para tus artículos
                </p>
            </div>

            <MediaLibrary />
        </div>
    );
}
