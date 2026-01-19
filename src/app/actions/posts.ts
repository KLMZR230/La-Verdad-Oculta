'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { PostFormData } from '@/lib/types';

export async function savePost(id: string, data: PostFormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('posts')
        .update({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            cover_image_url: data.cover_image_url || null,
            tags: data.tags,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error saving post:', error);
        throw new Error('Failed to save post');
    }

    revalidatePath('/admin/posts');
    return { success: true };
}

export async function publishPost(id: string, data: PostFormData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('posts')
        .update({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            cover_image_url: data.cover_image_url || null,
            tags: data.tags,
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error publishing post:', error);
        throw new Error('Failed to publish post');
    }

    revalidatePath('/admin/posts');
    revalidatePath('/articulos');
    revalidatePath('/');
    return { success: true };
}

export async function deletePost(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }

    revalidatePath('/admin/posts');
    revalidatePath('/articulos');
    revalidatePath('/');
    return { success: true };
}
