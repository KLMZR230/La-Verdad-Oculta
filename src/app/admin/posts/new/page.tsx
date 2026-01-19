import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PostEditor } from '@/components/admin/PostEditor';

export default async function NewPostPage() {
    const supabase = await createClient();

    // Create a new draft post
    const { data: { user } } = await supabase.auth.getUser();

    const { data: post, error } = await supabase
        .from('posts')
        .insert({
            title: '',
            slug: '',
            status: 'draft',
            author_id: user?.id,
            tags: [],
        })
        .select()
        .single();

    if (error || !post) {
        console.error('Error creating post:', error);
        redirect('/admin/posts');
    }

    // Redirect to edit page
    redirect(`/admin/posts/${post.id}`);
}
