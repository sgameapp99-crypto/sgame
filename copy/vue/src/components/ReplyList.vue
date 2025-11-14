<template>
  <div>
    <div
      v-for="reply in replies"
      :key="reply.id"
      :class="['reply-item', { editing: editingId === reply.id }]"
    >
      <div class="reply-header">
        <div class="reply-author">
          {{ reply.author?.name }}
          <span v-if="reply.createdAt" class="reply-time">· {{ formatDate(reply.createdAt) }}</span>
        </div>
        <div class="reply-actions">
          <el-button type="primary" plain size="small" @click="$emit('like', reply)">
            {{ reply.isLikedByMe ? '取消按讚' : '按讚' }} ({{ reply.likeCount || 0 }})
          </el-button>
          <el-button
            v-if="canEdit(reply)"
            type="primary"
            plain
            size="small"
            @click="$emit('edit', reply)"
          >
            編輯
          </el-button>
          <el-button
            v-if="canDelete(reply)"
            type="danger"
            plain
            size="small"
            @click="$emit('delete', reply)"
          >
            刪除
          </el-button>
        </div>
      </div>
      <TipTapViewer :content="reply.content" />
    </div>
    <div v-if="pagination" class="mt-3 flex gap-2">
      <button
        class="btn-outline"
        :disabled="pagination.page <= 1"
        @click="$emit('page', pagination.page - 1)"
      >
        ‹ 上一頁
      </button>
      <button
        v-for="n in pageNumbers"
        :key="n"
        class="btn-outline"
        :disabled="pagination.page === n"
        @click="$emit('page', n)"
      >
        {{ n }}
      </button>
      <button
        class="btn-outline"
        :disabled="pagination.page >= totalPages"
        @click="$emit('page', pagination.page + 1)"
      >
        下一頁 ›
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TipTapViewer from './TipTapViewer.vue';
import type { ForumComment } from '../api/types';

const props = defineProps<{
  replies: ForumComment[];
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
  currentUserId?: number | string;
  isAdmin?: boolean;
  editingId?: number | null;
}>();

defineEmits<{
  (e: 'page', n: number): void;
  (e: 'edit', reply: ForumComment): void;
  (e: 'delete', reply: ForumComment): void;
  (e: 'like', reply: ForumComment): void;
}>();

const totalPages = computed(() => {
  if (!props.pagination) return 1;
  return Math.max(1, Math.ceil((props.pagination.total || 0) / (props.pagination.size || 20)));
});

const pageNumbers = computed(() => {
  if (!props.pagination) return [1];
  const { page } = props.pagination;
  const pages: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages.value, page + 2); i += 1) {
    pages.push(i);
  }
  return pages;
});

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function canEdit(reply: ForumComment) {
  if (props.currentUserId == null) return false;
  if (!reply.author?.id) return false;
  return String(reply.author.id) === String(props.currentUserId);
}

function canDelete(reply: ForumComment) {
  return props.isAdmin || canEdit(reply);
}
</script>

<style scoped>
.reply-item {
  border-top: 1px solid #e5e7eb;
  padding: 12px 0;
}

.reply-item.editing {
  background: #fff7e6;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.reply-author {
  color: #1f2937;
  font-weight: 600;
}

.reply-time {
  color: #6b7280;
  font-weight: 400;
  margin-left: 4px;
}

.reply-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.reply-actions :deep(.el-button),
.reply-actions :deep(.el-button *),
.reply-actions :deep(.el-button__text) {
  cursor: pointer !important;
}
</style>
