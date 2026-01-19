import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Manifiesto',
    description: 'Nuestra visión: Dios como el universo entero. Una exploración filosófica de la unidad cósmica.',
};

async function getManifiestoPage() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'manifiesto')
        .single();

    return data;
}

export default async function ManifiestoPage() {
    const page = await getManifiestoPage();

    return (
        <div className="py-16 lg:py-24">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold tracking-tight text-cosmic-900 dark:text-white sm:text-5xl">
                        Manifiesto
                    </h1>
                    <p className="mt-4 text-lg text-cosmic-600 dark:text-cosmic-400">
                        Nuestra visión sobre la naturaleza del universo
                    </p>
                </header>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:tracking-tight
          prose-p:text-cosmic-700 dark:prose-p:text-cosmic-300 prose-p:leading-relaxed
          prose-blockquote:border-l-primary-500 prose-blockquote:bg-cosmic-50 dark:prose-blockquote:bg-cosmic-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">

                    {/* Default content if no page exists in database */}
                    <blockquote>
                        <p>
                            &ldquo;Mira las estrellas, mira cómo brillan para ti,
                            y todo lo que haces, sí, ellas brillan para ti.&rdquo;
                        </p>
                    </blockquote>

                    <h2>El Universo como Manifestación Divina</h2>

                    <p>
                        Proponemos una visión donde no existe separación entre el Creador y la creación.
                        Dios no es un ser distante observando desde afuera; Dios <em>es</em> cada átomo,
                        cada estrella, cada pensamiento, cada latido.
                    </p>

                    <p>
                        Esta perspectiva no niega otras creencias. Más bien, invita a contemplar la
                        posibilidad de que todas las tradiciones espirituales apuntan, desde diferentes
                        ángulos, hacia la misma verdad inefable: que somos parte de algo infinitamente
                        más grande, y que ese &ldquo;algo&rdquo; no está separado de nosotros.
                    </p>

                    <h2>La Consciencia Universal</h2>

                    <p>
                        Si el universo entero es una expresión de lo divino, entonces la consciencia
                        que experimentamos no es un accidente biológico, sino el universo conociéndose
                        a sí mismo. Cada momento de asombro ante una puesta de sol, cada acto de
                        compasión, cada instante de paz interior, es el cosmos reflexionando sobre
                        su propia naturaleza.
                    </p>

                    <h2>Una Invitación, No un Dogma</h2>

                    <p>
                        Este manifiesto no pretende ser la verdad absoluta. Es una invitación a la
                        reflexión. No pedimos que abandones tus creencias, sino que consideres una
                        perspectiva complementaria.
                    </p>

                    <p>
                        ¿Y si cada religión, cada filosofía, cada búsqueda espiritual, fuera un
                        camino diferente hacia la misma montaña? ¿Y si la montaña no estuviera
                        fuera, sino dentro de todo?
                    </p>

                    <h2>Respeto y Apertura</h2>

                    <p>
                        Respetamos profundamente todas las tradiciones religiosas y espirituales.
                        No buscamos convencer, sino compartir. No pretendemos tener todas las
                        respuestas, sino hacer preguntas que inviten a la contemplación.
                    </p>

                    <div className="mt-12 p-6 bg-cosmic-100 dark:bg-cosmic-800/50 rounded-xl border border-cosmic-200 dark:border-cosmic-700">
                        <p className="text-sm text-cosmic-600 dark:text-cosmic-400 italic mb-0">
                            <strong>Nota:</strong> Este sitio es una propuesta filosófica y espiritual personal.
                            Las ideas presentadas son reflexiones individuales que buscan complementar,
                            nunca reemplazar ni contradecir, la riqueza de las tradiciones espirituales
                            del mundo. Agradecemos tu apertura y respeto mientras exploramos juntos
                            estos temas profundos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
