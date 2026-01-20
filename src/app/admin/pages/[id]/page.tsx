import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageEditor } from '@/components/admin/PageEditor';
import { Page } from '@/lib/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
    title: 'Editar Página',
    robots: { index: false, follow: false },
};

async function getPage(id: string): Promise<Page | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

    return data;
}

export default async function EditPagePage({ params }: PageProps) {
    const { id } = await params;
    const page = await getPage(id);

    if (!page) {
        notFound();
    }

    return <PageEditor page={page} />;
}
