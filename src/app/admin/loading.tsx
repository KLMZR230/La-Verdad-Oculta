export default function AdminLoading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-cosmic-600 dark:text-cosmic-400">
                    Cargando panel...
                </p>
            </div>
        </div>
    );
}
