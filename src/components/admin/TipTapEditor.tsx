'use client';

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapEditorProps {
    content: JSONContent | null;
    onChange: (content: JSONContent) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary-600 dark:text-primary-400 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Placeholder.configure({
                placeholder: 'Comienza a escribir tu artículo...',
            }),
        ],
        content: content || undefined,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none p-6 min-h-[400px] focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    if (!editor) {
        return <div className="p-6 text-cosmic-500">Cargando editor...</div>;
    }

    const addLink = () => {
        const url = window.prompt('URL del enlace:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('URL de la imagen:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-cosmic-200 dark:border-cosmic-700 bg-cosmic-50 dark:bg-cosmic-900">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Negrita"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 11h4.5a2.5 2.5 0 100-5H8v5zm10 4.5a4.5 4.5 0 01-4.5 4.5H6V4h6.5a4.5 4.5 0 013.256 7.606A4.498 4.498 0 0118 15.5zM8 13v5h5.5a2.5 2.5 0 100-5H8z" />
                    </svg>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Cursiva"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2z" />
                    </svg>
                </ToolbarButton>

                <div className="w-px h-6 bg-cosmic-300 dark:bg-cosmic-600 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    title="Título 2"
                >
                    H2
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    title="Título 3"
                >
                    H3
                </ToolbarButton>

                <div className="w-px h-6 bg-cosmic-300 dark:bg-cosmic-600 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Lista"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 6.9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />
                    </svg>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Lista numerada"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zm-2 7h3.5v1H4.5v1H6v1H3v-1h2v-1H3v-2h2.5V8H3V7h2v3zm2 7v1h1v1H3v-1h1v-1H3v-1h2v2zm3-3h13v2H8v-2zm0 7h13v2H8v-2z" />
                    </svg>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Cita"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                </ToolbarButton>

                <div className="w-px h-6 bg-cosmic-300 dark:bg-cosmic-600 mx-1" />

                <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Enlace">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 10-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 119.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 11-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 107.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" />
                    </svg>
                </ToolbarButton>

                <ToolbarButton onClick={addImage} title="Imagen">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 012 20.007V3.993A1 1 0 012.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 01-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </ToolbarButton>

                <div className="w-px h-6 bg-cosmic-300 dark:bg-cosmic-600 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                    title="Código inline"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" />
                    </svg>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                    title="Bloque de código"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v14h16V5H4zm16 7l-3.536 3.536-1.414-1.415L17.172 12 15.05 9.879l1.414-1.415L20 12zM6.828 12l2.122 2.121-1.414 1.415L4 12l3.536-3.536L8.95 9.88 6.828 12zm4.416 5H9.116l3.64-10h2.128l-3.64 10z" />
                    </svg>
                </ToolbarButton>
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarButton({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded text-sm font-medium transition-colors ${active
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-cosmic-600 dark:text-cosmic-400 hover:bg-cosmic-100 dark:hover:bg-cosmic-800'
                }`}
        >
            {children}
        </button>
    );
}
