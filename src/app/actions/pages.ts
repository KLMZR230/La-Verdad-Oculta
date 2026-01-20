'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { PageFormData } from '@/lib/types';

export async function savePage(id: string, data: PageFormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('pages')
        .update({
            title: data.title,
            slug: data.slug,
            content: data.content,
            meta_description: data.meta_description || null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error saving page:', error);
        throw new Error('Failed to save page');
    }

    revalidatePath('/admin/pages');
    revalidatePath(`/${data.slug}`);
    return { success: true };
}

export async function deletePage(id: string) {
    const supabase = await createClient();

    // Get the page slug first for revalidation
    const { data: page } = await supabase
        .from('pages')
        .select('slug')
        .eq('id', id)
        .single();

    const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting page:', error);
        throw new Error('Failed to delete page');
    }

    revalidatePath('/admin/pages');
    if (page?.slug) {
        revalidatePath(`/${page.slug}`);
    }
    return { success: true };
}
