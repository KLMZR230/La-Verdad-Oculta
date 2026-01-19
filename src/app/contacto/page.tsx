import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
    title: 'Contacto',
    description: 'Ponte en contacto con nosotros. Queremos escuchar tus reflexiones y preguntas.',
};

export default function ContactoPage() {
    return (
        <div className="py-16 lg:py-24">
            <div className="mx-auto max-w-2xl px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-5xl">
                        Contacto
                    </h1>
                    <p className="mt-4 text-lg text-cosmic-600 dark:text-cosmic-400">
                        ¿Tienes preguntas, reflexiones o comentarios? Nos encantaría escucharte.
                    </p>
                </header>

                {/* Form */}
                <div className="bg-white dark:bg-cosmic-800 rounded-2xl shadow-sm ring-1 ring-cosmic-200 dark:ring-cosmic-700 p-8">
                    <ContactForm />
                </div>

                {/* Additional info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-cosmic-500 dark:text-cosmic-400">
                        Respetamos tu privacidad. Tu información solo será utilizada para responder
                        a tu mensaje y nunca será compartida con terceros.
                    </p>
                </div>
            </div>
        </div>
    );
}
