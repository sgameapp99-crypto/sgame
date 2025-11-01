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
</style>


