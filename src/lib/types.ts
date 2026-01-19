import { JSONContent } from '@tiptap/react';

export type UserRole = 'admin' | 'editor';

export type PostStatus = 'draft' | 'published';

export interface UserRoleRecord {
    id: string;
    user_id: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: JSONContent | null;
    cover_image_url: string | null;
    status: PostStatus;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    author_id: string | null;
    tags: string[];
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: JSONContent | null;
    meta_description: string | null;
    created_at: string;
    updated_at: string;
    author_id: string | null;
}

export interface Media {
    id: string;
    filename: string;
    original_filename: string;
    storage_path: string;
    url: string;
    mime_type: string | null;
    size_bytes: number | null;
    width: number | null;
    height: number | null;
    alt_text: string | null;
    created_at: string;
    updated_at: string;
    uploaded_by: string | null;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    message: string;
    ip_address: string | null;
    created_at: string;
    read_at: string | null;
}

// Form types
export interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: JSONContent | null;
    cover_image_url: string;
    status: PostStatus;
    tags: string[];
}

export interface PageFormData {
    title: string;
    slug: string;
    content: JSONContent | null;
    meta_description: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
