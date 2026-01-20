import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageEditor } from '@/components/admin/PageEditor';

export const metadata: Metadata = {
    title: 'Nueva Página',
    robots: { index: false, follow: false },
};

export default async function NewPagePage() {
    const supabase = await createClient();

    // Create a new draft page
    const { data: page, error } = await supabase
        .from('pages')
        .insert({
            title: '',
            slug: '',
            content: null,
        })
        .select()
        .single();

    if (error || !page) {
        console.error('Error creating page:', error);
        redirect('/admin/pages');
    }

    // Redirect to edit the new page
    redirect(`/admin/pages/${page.id}`);
}
