import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-cosmic-200 dark:border-cosmic-800 bg-cosmic-50 dark:bg-cosmic-950">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Main footer content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Brand & Disclaimer */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block">
                            <span className="font-display text-xl font-bold gradient-text">
                                La Verdad Oculta
                            </span>
                        </Link>
                        <p className="mt-4 max-w-md text-sm text-cosmic-600 dark:text-cosmic-400 leading-relaxed">
                            Una exploración filosófica y espiritual de la idea de Dios como el universo entero.
                            Este sitio presenta reflexiones educativas independientes de religiones organizadas.
                        </p>
                        {/* Disclaimer */}
                        <div className="mt-4 p-3 bg-cosmic-100 dark:bg-cosmic-900 rounded-lg border border-cosmic-200 dark:border-cosmic-800">
                            <p className="text-xs text-cosmic-500 dark:text-cosmic-500 italic">
                                Este sitio es una propuesta filosófica/espiritual personal.
                                Las opiniones expresadas son reflexiones individuales y no pretenden
                                representar verdades absolutas ni ofender a ningún grupo o creencia.
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold text-cosmic-900 dark:text-cosmic-100">
                            Navegación
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link
                                    href="/articulos"
                                    className="text-sm text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Artículos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/manifiesto"
                                    className="text-sm text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Manifiesto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/acerca"
                                    className="text-sm text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Acerca
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contacto"
                                    className="text-sm text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t border-cosmic-200 dark:border-cosmic-800 pt-8">
                    <p className="text-center text-xs text-cosmic-500 dark:text-cosmic-500">
                        © {currentYear} La Verdad Oculta. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
