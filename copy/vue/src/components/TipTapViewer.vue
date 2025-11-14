<template>
  <div class="tiptap-viewer" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

import type { TipTapDoc } from '../api/types';

type ViewerContent = TipTapDoc | string | null | undefined;

interface Props {
  content: ViewerContent;
}

const props = defineProps<Props>();

const extensions = [
  StarterKit.configure({ link: false }),
  Link.configure({ openOnClick: true }),
  Image.configure({ inline: false }),
];

const html = computed(() => {
  const value = props.content;
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return generateHTML(value, extensions);
  } catch (error) {
    console.error('渲染 TipTap 內容失敗', error);
    return '';
  }
});
</script>

<style scoped>
.tiptap-viewer :deep(p) {
  margin: 0 0 1em;
  line-height: 1.6;
}

.tiptap-viewer :deep(img) {
  max-width: 100%;
  display: block;
  margin: 8px 0;
}

.tiptap-viewer :deep(a) {
  color: #0d6efd;
  text-decoration: underline;
}

/* 無序列表樣式 */
.tiptap-viewer :deep(ul) {
  margin: 0.5em 0;
  padding-left: 2em;
  list-style-type: disc;
}

.tiptap-viewer :deep(ul ul) {
  list-style-type: circle;
  margin: 0.25em 0;
}

.tiptap-viewer :deep(ul ul ul) {
  list-style-type: square;
}

/* 有序列表樣式 */
.tiptap-viewer :deep(ol) {
  margin: 0.5em 0;
  padding-left: 2em;
  list-style-type: decimal;
}

.tiptap-viewer :deep(ol ol) {
  list-style-type: lower-alpha;
  margin: 0.25em 0;
}

.tiptap-viewer :deep(ol ol ol) {
  list-style-type: lower-roman;
}

/* 列表項目樣式 */
.tiptap-viewer :deep(li) {
  margin: 0.25em 0;
  line-height: 1.6;
}

.tiptap-viewer :deep(li p) {
  margin: 0;
}
</style>


