<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <label>排序：</label>
      <select v-model="localSort" class="input w-auto" @change="$emit('sort', localSort)">
        <option value="latestReply">最新回覆</option>
        <option value="latestPost">最新文章</option>
      </select>
    </div>
    <div class="overflow-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left p-2 border-b border-neutral-200">主題</th>
            <th class="text-center p-2 border-b border-neutral-200">作者</th>
            <th class="text-center p-2 border-b border-neutral-200">最新回覆</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in sortedPosts" :key="p.id" :class="p.isSticky ? 'bg-yellow-50' : ''">
            <td class="p-2 border-b border-neutral-100">
              <RouterLink :to="{ name: 'post', params: { id: p.id } }" class="hover:underline">
                {{ p.title }}
              </RouterLink>
              <span v-if="p.board?.name" class="ml-1 text-green-700">[{{ p.board.name }}]</span>
              <span v-if="p.likeCount != null" class="ml-2 text-red-700 font-semibold"
                >推 {{ p.likeCount }}</span
              >
              <span
                v-if="p.commentCount != null || p.viewCount != null"
                class="ml-2 text-neutral-600"
              >
                (
                <span v-if="p.commentCount != null">回 {{ p.commentCount }}</span>
                <span v-if="p.viewCount != null"> / 看 {{ p.viewCount }}</span>
                )
              </span>
            </td>
            <td class="p-2 border-b border-neutral-100 text-center">
              <div>{{ p.author?.name }}</div>
              <div class="text-xs text-neutral-500">{{ formatDate(p.createdAt) }}</div>
            </td>
            <td class="p-2 border-b border-neutral-100 text-center">
              <div>{{ p.lastCommentUser?.name }}</div>
              <div class="text-xs text-neutral-500">{{ formatDate(p.lastCommentAt) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pagination" class="mt-3 flex gap-2 items-center flex-wrap">
      <button class="btn-outline" :disabled="pagination.page <= 1" @click="$emit('page', 1)">
        « 首頁
      </button>
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
      <button
        class="btn-outline"
        :disabled="pagination.page >= totalPages"
        @click="$emit('page', totalPages)"
      >
        末頁 »
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ForumPost } from '../api/types';

const props = defineProps<{
  posts: ForumPost[];
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
  sort?: 'latestReply' | 'latestPost';
}>();

defineEmits<{
  (e: 'page', n: number): void;
  (e: 'sort', v: 'latestReply' | 'latestPost'): void;
}>();

const localSort = ref<'latestReply' | 'latestPost'>(props.sort || 'latestReply');
watch(
  () => props.sort,
  (v) => {
    if (v) localSort.value = v;
  },
);

const sortedPosts = computed(() => {
  const arr = [...(props.posts || [])];
  const timeComparator = (a: ForumPost, b: ForumPost) => {
    if (localSort.value === 'latestPost') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return (
      new Date(b.lastCommentAt || b.updatedAt).getTime() -
      new Date(a.lastCommentAt || a.updatedAt).getTime()
    );
  };

  arr.sort((a, b) => {
    const stickyDiff = Number(b.isSticky) - Number(a.isSticky);
    if (stickyDiff !== 0) return stickyDiff;
    return timeComparator(a, b);
  });

  return arr;
});

const pagination = computed(() => props.pagination);
const totalPages = computed(() => {
  if (!pagination.value) return 1;
  return Math.max(1, Math.ceil((pagination.value.total || 0) / (pagination.value.size || 20)));
});

const pageNumbers = computed(() => {
  if (!pagination.value) return [1];
  const { page } = pagination.value;
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
</script>
