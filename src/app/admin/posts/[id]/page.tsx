import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PostEditor } from '@/components/admin/PostEditor';
import { Post } from '@/lib/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
    title: 'Editar artículo',
    robots: { index: false, follow: false },
};

async function getPost(id: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    return data;
}

export default async function EditPostPage({ params }: PageProps) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <PostEditor post={post} />
        </div>
    );
}
