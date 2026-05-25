import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Redo, Undo } from 'lucide-react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className={`w-7 h-7 p-1 rounded transition-all flex items-center justify-center ${active
      ? 'bg-blue-100 text-blue-600 shadow-sm'
      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
      }`}
  >
    {children}
  </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ label, value, onChange, placeholder }) => {
  const extensions = React.useMemo(() => [
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      code: false,
      blockquote: false,
      horizontalRule: false,
    }),
    Underline.configure(),
    Placeholder.configure({
      placeholder: placeholder || 'Start typing...',
    }),
  ], [placeholder]);

  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newHtml = editor.isEmpty ? '' : editor.getHTML();
      setTimeout(() => {
        onChange(newHtml);
      }, 0);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML() && !(editor.isEmpty && value === '')) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="border border-slate-200 rounded-lg shadow-sm bg-slate-50 hover:bg-white transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 overflow-hidden">
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
          <ToolbarButton
            title="Bold"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={14} />
          </ToolbarButton>

          <div className="w-px h-4 bg-slate-300 mx-1"></div>

          <ToolbarButton
            title="Bullet List"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Ordered List"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={14} />
          </ToolbarButton>

          <div className="w-px h-4 bg-slate-300 mx-1"></div>

          <ToolbarButton
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo size={14} />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
