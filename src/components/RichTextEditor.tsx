import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Video as YoutubeIcon,
  Undo2, Redo2, RemoveFormatting, Quote, Minus, Palette,
  Highlighter, Table as TableIcon, Pilcrow, Code,
} from 'lucide-react';

/* ─── CUSTOM FONT SIZE EXTENSION ────────────────────────────────────────── */

const FONT_SIZES = [
  { label: '10', value: '10px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '28', value: '28px' },
  { label: '32', value: '32px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
  { label: '64', value: '64px' },
];

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

/* ─── TYPES ─────────────────────────────────────────────────────────────── */

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

/* ─── TOOLBAR BUTTON ────────────────────────────────────────────────────── */

const ToolbarBtn: React.FC<{
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ onClick, isActive, title, children, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-lg transition-all duration-150 ${
      isActive
        ? 'bg-secondary/15 text-secondary shadow-sm'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />
);

/* ─── COLOR PICKER BUTTON ───────────────────────────────────────────────── */

const ColorPickerBtn: React.FC<{
  currentColor: string;
  onColorChange: (color: string) => void;
  title: string;
  icon: React.ReactNode;
}> = ({ currentColor, onColorChange, title, icon }) => (
  <label className="relative cursor-pointer" title={title}>
    <div className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-150 flex items-center gap-0.5">
      {icon}
      <div className="w-3 h-1 rounded-full mt-0.5" style={{ backgroundColor: currentColor || '#000' }} />
    </div>
    <input
      type="color"
      value={currentColor || '#000000'}
      onChange={e => onColorChange(e.target.value)}
      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
    />
  </label>
);

/* ─── TOOLBAR ───────────────────────────────────────────────────────────── */

const Toolbar: React.FC<{ editor: ReturnType<typeof useEditor> }> = ({ editor }) => {
  if (!editor) return null;

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL da imagem:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    const url = window.prompt('URL do vídeo YouTube:');
    if (url) editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  }, [editor]);

  const insertTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const setColor = useCallback((color: string) => {
    editor.chain().focus().setColor(color).run();
  }, [editor]);

  const setHighlight = useCallback((color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  const sz = 15;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50/80 rounded-t-xl sticky top-0 z-10">
      {/* Undo / Redo */}
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
        <Undo2 size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
        <Redo2 size={sz} />
      </ToolbarBtn>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarBtn onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} title="Parágrafo">
        <Pilcrow size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Título 1">
        <Heading1 size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Título 2">
        <Heading2 size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Título 3">
        <Heading3 size={sz} />
      </ToolbarBtn>

      <ToolbarDivider />

      {/* Font Size */}
      <select
        value={editor.getAttributes('textStyle').fontSize || ''}
        onChange={e => {
          if (e.target.value) {
            (editor.commands as any).setFontSize(e.target.value);
          } else {
            (editor.commands as any).unsetFontSize();
          }
        }}
        title="Tamanho da letra"
        className="h-8 px-1.5 bg-transparent border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-secondary/40 cursor-pointer hover:bg-gray-100 transition-colors appearance-none text-center w-16"
      >
        <option value="">Tam.</option>
        {FONT_SIZES.map(s => (
          <option key={s.value} value={s.value}>{s.label}px</option>
        ))}
      </select>

      <ToolbarDivider />

      {/* Inline formatting */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Negrito">
        <Bold size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Itálico">
        <Italic size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Sublinhado">
        <UnderlineIcon size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Riscado">
        <Strikethrough size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Código inline">
        <Code size={sz} />
      </ToolbarBtn>

      <ToolbarDivider />

      {/* Colors */}
      <ColorPickerBtn
        currentColor={editor.getAttributes('textStyle').color || '#000000'}
        onColorChange={setColor}
        title="Cor do texto"
        icon={<Palette size={sz} />}
      />
      <ColorPickerBtn
        currentColor={editor.getAttributes('highlight').color || '#fef08a'}
        onColorChange={setHighlight}
        title="Cor de destaque"
        icon={<Highlighter size={sz} />}
      />

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista">
        <List size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista numerada">
        <ListOrdered size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Citação">
        <Quote size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linha horizontal">
        <Minus size={sz} />
      </ToolbarBtn>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Alinhar à esquerda">
        <AlignLeft size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Centrar">
        <AlignCenter size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Alinhar à direita">
        <AlignRight size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justificar">
        <AlignJustify size={sz} />
      </ToolbarBtn>

      <ToolbarDivider />

      {/* Media & Links */}
      <ToolbarBtn onClick={addLink} isActive={editor.isActive('link')} title="Inserir link">
        <LinkIcon size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={addImage} title="Inserir imagem (URL)">
        <ImageIcon size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={addYoutube} title="Inserir vídeo YouTube">
        <YoutubeIcon size={sz} />
      </ToolbarBtn>
      <ToolbarBtn onClick={insertTable} title="Inserir tabela">
        <TableIcon size={sz} />
      </ToolbarBtn>

      <ToolbarDivider />

      {/* Clear */}
      <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Limpar formatação">
        <RemoveFormatting size={sz} />
      </ToolbarBtn>
    </div>
  );
};

/* ─── RICH TEXT EDITOR ──────────────────────────────────────────────────── */

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Comece a escrever…',
  className = '',
  minHeight = '20rem',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-secondary underline cursor-pointer' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full mx-auto my-4' },
      }),
      Youtube.configure({
        HTMLAttributes: { class: 'w-full aspect-video rounded-xl my-4' },
        inline: false,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-5 py-4 text-primary',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Sync external value changes (e.g., when switching between editing different posts)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // Only re-sync when value identity changes from outside, not from internal edits
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${className}`}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
