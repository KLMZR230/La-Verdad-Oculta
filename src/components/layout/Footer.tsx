import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
    { name: 'Artículos', href: '/articulos' },
    { name: 'Manifiesto', href: '/manifiesto' },
    { name: 'Acerca', href: '/acerca' },
    { name: 'Contacto', href: '/contacto' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-cosmic-200 dark:border-cosmic-800 bg-cosmic-50 dark:bg-cosmic-900">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.jpg"
                                alt="La Verdad Oculta"
                                width={56}
                                height={56}
                                className="rounded-full ring-2 ring-primary-500/30"
                            />
                            <span className="font-display text-xl font-bold bg-gradient-to-r from-primary-600 via-amber-500 to-primary-600 bg-clip-text text-transparent">
                                La Verdad Oculta
                            </span>
                        </Link>
                        <p className="text-sm text-cosmic-600 dark:text-cosmic-400 leading-relaxed max-w-xs">
                            Una exploración filosófica y espiritual de la idea de Dios como el universo entero.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-cosmic-900 dark:text-white mb-4">
                            Navegación
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-cosmic-600 dark:text-cosmic-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div>
                        <h3 className="font-semibold text-cosmic-900 dark:text-white mb-4">
                            Aviso
                        </h3>
                        <p className="text-xs text-cosmic-500 dark:text-cosmic-400 leading-relaxed">
                            Este sitio presenta una propuesta filosófica y espiritual personal.
                            Las ideas expresadas buscan complementar, nunca reemplazar,
                            las tradiciones religiosas y espirituales del mundo.
                            Respetamos todas las creencias.
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-cosmic-200 dark:border-cosmic-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-cosmic-600 dark:text-cosmic-400">
                            © {currentYear} La Verdad Oculta. Todos los derechos reservados.
                        </p>
                        <p className="text-sm text-cosmic-500 dark:text-cosmic-500">
                            Creado por <span className="font-semibold text-primary-600 dark:text-primary-400">Freddy Granados</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
