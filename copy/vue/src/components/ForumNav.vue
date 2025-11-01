<template>
  <div class="menu_content">
    <div v-for="board in boards" :key="board.id">
      <span class="subtitle">
        <a
          href="#"
          @click.prevent="$emit('selectBoard', board)"
          class="js-forum-alliances-list-link"
          :class="{ active: isActive(board) }"
        >
          {{ board.name }}
        </a>
      </span>
      <div class="subtitle_item" v-if="board.children?.length">
        <a
          v-for="child in board.children"
          :key="child.id"
          href="#"
          @click.prevent="$emit('selectBoard', child)"
          class="js-forum-alliances-list-link"
          :class="{ active: isActive(child) }"
        >
          {{ child.name }}
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ForumBoard } from '../api/types';

const props = defineProps<{ boards: ForumBoard[]; activeId?: number | null; activeSlug?: string | null }>();
defineEmits<{ (e: 'selectBoard', payload: ForumBoard): void }>();

function isActive(board: ForumBoard): boolean {
  if (props.activeId != null && board.id === props.activeId) return true;
  if (props.activeSlug && board.slug === props.activeSlug) return true;
  return false;
}
</script>

<style scoped>
.active {
  font-weight: bold;
  color: #d9534f !important;
}
</style>
