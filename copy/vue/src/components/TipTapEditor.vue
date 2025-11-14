<template>
  <div class="tiptap-editor">
    <div class="toolbar">
      <button 
        type="button" 
        title="粗體 (Ctrl+B)" 
        :class="{ active: isActive('bold') }" 
        @click="toggle('bold')"
      >
        B
      </button>
      <button 
        type="button" 
        title="斜體 (Ctrl+I)" 
        :class="{ active: isActive('italic') }" 
        @click="toggle('italic')"
      >
        I
      </button>
      <button
        type="button"
        title="無序列表"
        :class="{ active: isActive('bulletList') }"
        @click="toggle('bulletList')"
      >
        •
      </button>
      <button
        type="button"
        title="有序列表（編號列表）"
        :class="{ active: isActive('orderedList') }"
        @click="toggle('orderedList')"
      >
        1.
      </button>
      <button type="button" title="插入連結" @click="insertLink">Link</button>
      <button type="button" title="上傳圖片" @click="insertImage">Image</button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch, ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/core';
import type { JSONContent } from '@tiptap/vue-3';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import type { TipTapDoc } from '../api/types';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

type EditorContentValue = TipTapDoc | JSONContent | string | null | undefined;
type UploadImageHandler = (file: globalThis.File) => Promise<string>;

interface Props {
  modelValue: EditorContentValue;
  placeholder?: string;
  uploadImage?: UploadImageHandler;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 
  (e: 'update:modelValue', value: EditorContentValue): void;
  (e: 'upload-status-change', uploading: boolean): void;
}>();

// 追蹤正在上傳的圖片數量
const uploadingCount = ref(0);

const defaultContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

const editor = useEditor({
  content: props.modelValue || defaultContent,
  extensions: [StarterKit, Image.configure({ inline: false })],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getJSON());
  },
});

watch(
  () => props.modelValue,
  (value) => {
    const instance = getEditor();
    if (!instance) return;
    const target = value || defaultContent;
    try {
      const current = instance.getJSON();
      const isSame = JSON.stringify(current) === JSON.stringify(target);
      if (!isSame) {
        setInstanceContent(target);
      }
    } catch {
      setInstanceContent(target);
    }
  },
);

onBeforeUnmount(() => {
  const instance = getEditor();
  if (instance && typeof instance.destroy === 'function') {
    instance.destroy();
  }
});

const getEditor = (): Editor | null => {
  const instance = editor.value;
  if (!instance || instance.isDestroyed) return null;
  return instance;
};

const toJsonContent = (target: EditorContentValue): JSONContent | string => {
  if (typeof target === 'string') return target || '';
  if (!target) return defaultContent;
  return target as JSONContent;
};

const setInstanceContent = (target: EditorContentValue) => {
  const instance = getEditor();
  if (!instance) return;
  const { commands } = instance;
  if (!commands || typeof commands.setContent !== 'function') return;
  commands.setContent(toJsonContent(target), { emitUpdate: false });
};

const isActive = (type: string) => {
  const instance = getEditor();
  if (!instance || typeof instance.isActive !== 'function') return false;
  return instance.isActive(type);
};
const toggle = (type: string): void => {
  const instance = getEditor();
  if (!instance) return;
  switch (type) {
    case 'bold':
      instance.chain().focus().toggleBold().run();
      break;
    case 'italic':
      instance.chain().focus().toggleItalic().run();
      break;
    case 'bulletList':
      instance.chain().focus().toggleBulletList().run();
      break;
    case 'orderedList':
      instance.chain().focus().toggleOrderedList().run();
      break;
  }
};

function findImageBySrc(instance: ReturnType<typeof getEditor>, src: string) {
  if (!instance) return null;
  let result: { pos: number; node: ProseMirrorNode } | null = null;
  instance.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.src === src) {
      result = { pos, node };
      return false;
    }
    return undefined;
  });
  return result;
}

function updateImageSrc(instance: ReturnType<typeof getEditor>, fromSrc: string, toSrc: string) {
  if (!instance) return;
  const found = findImageBySrc(instance, fromSrc);
  if (!found) return;
  const { pos, node } = found as { pos: number; node: ProseMirrorNode };
  const transaction = instance.state.tr.setNodeMarkup(pos, undefined, {
    ...node.attrs,
    src: toSrc,
  });
  instance.view.dispatch(transaction);
}

function removeImageBySrc(instance: ReturnType<typeof getEditor>, src: string) {
  if (!instance) return;
  const found = findImageBySrc(instance, src);
  if (!found) return;
  const { pos, node } = found as { pos: number; node: ProseMirrorNode };
  const transaction = instance.state.tr.delete(pos, pos + node.nodeSize);
  instance.view.dispatch(transaction);
}

async function insertImage() {
  if (!props.uploadImage) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    
    // 開始上傳
    uploadingCount.value++;
    emit('upload-status-change', true);
    
    try {
      const editorInstance = getEditor();
      if (!editorInstance || typeof editorInstance.chain !== 'function') return;
      const previewUrl = globalThis.URL.createObjectURL(file);
      editorInstance.chain().focus().setImage({ src: previewUrl }).run();

      try {
        const uploadHandler = props.uploadImage;
        if (!uploadHandler) {
          removeImageBySrc(getEditor(), previewUrl);
          return;
        }
        const url = await uploadHandler(file);
        if (url) {
          updateImageSrc(getEditor(), previewUrl, url);
        } else {
          removeImageBySrc(getEditor(), previewUrl);
        }
      } catch (error) {
        removeImageBySrc(getEditor(), previewUrl);
        throw error;
      } finally {
        globalThis.URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      console.error('上傳圖片失敗', error);
    } finally {
      // 完成上傳
      uploadingCount.value--;
      if (uploadingCount.value === 0) {
        emit('upload-status-change', false);
      }
    }
  };
}

function insertLink() {
  const instance = getEditor();
  if (!instance) return;
  const prevUrl = instance.getAttributes('link').href;
  const url = window.prompt('輸入連結 URL', prevUrl);
  if (!url) return instance.chain().focus().extendMarkRange('link').unsetLink().run();
  instance.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

const html = computed(() => {
  const instance = getEditor();
  return instance ? instance.getHTML() : '';
});

defineExpose({ editor, html });
</script>
<style scoped>
.tiptap-editor {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.toolbar button {
  border: none;
  background: transparent;
  padding: 4px 6px;
  cursor: pointer;
}

.toolbar button:hover {
  background: #e8e8e8;
  border-radius: 4px;
}

.toolbar button.active {
  background: #e0e0e0;
  border-radius: 4px;
}

.tiptap-editor :deep(.ProseMirror) {
  min-height: 200px;
  padding: 12px;
  outline: none;
}

.tiptap-editor :deep(img) {
  max-width: 100%;
  height: auto;
}

/* 無序列表樣式 */
.tiptap-editor :deep(ul) {
  margin: 0.5em 0;
  padding-left: 2em;
  list-style-type: disc;
}

.tiptap-editor :deep(ul ul) {
  list-style-type: circle;
  margin: 0.25em 0;
}

.tiptap-editor :deep(ul ul ul) {
  list-style-type: square;
}

/* 有序列表樣式 */
.tiptap-editor :deep(ol) {
  margin: 0.5em 0;
  padding-left: 2em;
  list-style-type: decimal;
}

.tiptap-editor :deep(ol ol) {
  list-style-type: lower-alpha;
  margin: 0.25em 0;
}

.tiptap-editor :deep(ol ol ol) {
  list-style-type: lower-roman;
}

/* 列表項目樣式 */
.tiptap-editor :deep(li) {
  margin: 0.25em 0;
  line-height: 1.6;
}

.tiptap-editor :deep(li p) {
  margin: 0;
}
</style>
