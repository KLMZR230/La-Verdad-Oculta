import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Acerca',
    description: 'Conoce más sobre La Verdad Oculta y nuestra misión de explorar la espiritualidad y el cosmos.',
};

export default function AcercaPage() {
    return (
        <div className="py-16 lg:py-24">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-5xl">
                        Acerca de Nosotros
                    </h1>
                    <p className="mt-4 text-lg text-cosmic-600 dark:text-cosmic-400">
                        Una comunidad dedicada a la exploración espiritual
                    </p>
                </header>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:tracking-tight
          prose-p:text-cosmic-700 dark:prose-p:text-cosmic-300 prose-p:leading-relaxed">

                    <h2>Nuestra Misión</h2>

                    <p>
                        La Verdad Oculta nace del deseo de explorar las grandes preguntas de la
                        existencia desde una perspectiva abierta e inclusiva. No representamos
                        ninguna religión organizada ni buscamos convertir a nadie. Simplemente,
                        somos buscadores compartiendo el camino.
                    </p>

                    <h2>¿Por Qué &ldquo;La Verdad Oculta&rdquo;?</h2>

                    <p>
                        El nombre refleja nuestra creencia de que las verdades más profundas sobre
                        la naturaleza de la realidad a menudo están &ldquo;ocultas a plena vista&rdquo;.
                        No se trata de secretos esotéricos reservados para unos pocos, sino de
                        perspectivas que quizás simplemente no hemos considerado.
                    </p>

                    <p>
                        La verdad de que somos parte de un todo unificado, de que cada átomo de
                        nuestro ser está conectado con el cosmos entero, es algo que la ciencia
                        moderna confirma y que las tradiciones místicas han intuido durante milenios.
                    </p>

                    <h2>Nuestros Valores</h2>

                    <ul>
                        <li>
                            <strong>Respeto:</strong> Valoramos todas las tradiciones espirituales y
                            filosóficas. Nunca menospreciamos ni atacamos otras creencias.
                        </li>
                        <li>
                            <strong>Apertura:</strong> Mantenemos la mente abierta a nuevas ideas
                            mientras permanecemos anclados en el pensamiento crítico.
                        </li>
                        <li>
                            <strong>Inclusión:</strong> Todos son bienvenidos, independientemente de
                            su trasfondo religioso, cultural o filosófico.
                        </li>
                        <li>
                            <strong>Humildad:</strong> Reconocemos que nadie tiene todas las respuestas.
                            Estamos aquí para explorar, no para dogmatizar.
                        </li>
                    </ul>

                    <h2>El Contenido</h2>

                    <p>
                        Nuestros artículos exploran temas como la consciencia, la conexión entre
                        ciencia y espiritualidad, la naturaleza del tiempo y el espacio, y las
                        tradiciones místicas de diversas culturas. Buscamos puntos de convergencia
                        entre el pensamiento científico moderno y la sabiduría ancestral.
                    </p>

                    <h2>Únete a la Conversación</h2>

                    <p>
                        Este no es un monólogo, sino una invitación al diálogo. Queremos escuchar
                        tus perspectivas, tus preguntas, tus reflexiones. La verdad, si existe
                        algo que pueda llamarse así, emerge del intercambio respetuoso de ideas.
                    </p>

                    <p>
                        Si algo de lo que lees aquí resuena contigo, o si tienes preguntas o
                        perspectivas que compartir, no dudes en contactarnos.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <a
                        href="/contacto"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-primary-500 hover:to-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                        Contáctanos
                    </a>
                </div>
            </div>
        </div>
    );
}
