import Image from 'next/image';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cosmic-50 dark:bg-cosmic-950">
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <Image
                        src="/logo.jpg"
                        alt="Cargando..."
                        width={96}
                        height={96}
                        className="rounded-full animate-pulse"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" />
                </div>
                <p className="text-cosmic-600 dark:text-cosmic-400 animate-pulse">
                    Cargando...
                </p>
            </div>
        </div>
    );
}
