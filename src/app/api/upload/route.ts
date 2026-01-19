import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated and has admin/editor role
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { data: role } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (!role || !['admin', 'editor'].includes(role.role)) {
            return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'Archivo muy grande (máx 5MB)' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${timestamp}-${randomString}.${extension}`;

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadsDir, filename);
        await writeFile(filePath, buffer);

        // Get image dimensions (basic check)
        let width = 0;
        let height = 0;

        // Store in database
        const url = `/uploads/${filename}`;

        const { data: media, error: dbError } = await supabase
            .from('media')
            .insert({
                filename,
                original_filename: file.name,
                storage_path: filePath,
                url,
                mime_type: file.type,
                size_bytes: file.size,
                width,
                height,
                uploaded_by: user.id,
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ error: 'Error guardando en base de datos' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            media: {
                id: media.id,
                url,
                filename,
                original_filename: file.name,
                size_bytes: file.size,
                mime_type: file.type,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
        }

        // Delete from database
        const { error } = await supabase
            .from('media')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: 'Error eliminando' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
    }
}
