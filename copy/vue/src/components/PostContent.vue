<template>
  <article>
    <div class="post-header">
      <div class="post-heading">
        <h2>{{ title }}</h2>
        <p v-if="authorName" class="post-meta">
          <span class="post-author">{{ authorName }}</span>
          <span v-if="authorTitle" class="post-author-title">{{ authorTitle }}</span>
          <span v-if="formattedCreatedAt" class="post-created-at">· {{ formattedCreatedAt }}</span>
        </p>
      </div>
      <div class="post-actions">
        <el-button type="primary" plain size="small" :loading="likeLoading" @click="$emit('like')">
          {{ isLiked ? '取消按讚' : '按讚' }} ({{ likeCount }})
        </el-button>
        <el-button v-if="canEdit" type="primary" link size="small" @click="$emit('edit')"
          >編輯</el-button
        >
        <el-button v-if="canDelete" type="danger" link size="small" @click="$emit('delete')"
          >刪除</el-button
        >
      </div>
    </div>
    <TipTapViewer :content="content" />
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TipTapViewer from './TipTapViewer.vue';
import type { TipTapDoc } from '../api/types';

const props = defineProps<{
  title: string;
  content: TipTapDoc;
  likeCount?: number;
  isLiked?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  likeLoading?: boolean;
  authorName?: string;
  authorTitle?: string | null;
  createdAt?: string;
}>();

const formattedCreatedAt = computed(() => {
  if (!props.createdAt) return '';
  const date = new Date(props.createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
});

defineEmits<{ (e: 'like'): void; (e: 'edit'): void; (e: 'delete'): void }>();
</script>

<style scoped>
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-header h2 {
  margin: 0;
  font-size: 24px;
}

.post-meta {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.post-author {
  font-weight: 600;
  color: #374151;
}

.post-author-title {
  margin-left: 4px;
  color: #2563eb;
}

.post-created-at {
  margin-left: 4px;
}

.post-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
