<template>
	<div>
		<div class="flex items-center gap-2 mb-2">
			<label>排序：</label>
			<select v-model="localSort" class="input w-auto" @change="$emit('sort', localSort)">
				<option value="latestReply">最新回覆</option>
				<option value="最新文章">最新文章</option>
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
					<tr v-for="p in sortedPosts" :key="p.href + p.title" :class="p.pinned ? 'bg-yellow-50' : ''">
						<td class="p-2 border-b border-neutral-100">
							<RouterLink :to="toPostRoute(p.href, p.subjectId)" class="hover:underline">{{ p.title }}</RouterLink>
							<span v-if="p.boardTag" class="ml-1 text-green-700">[{{ p.boardTag }}]</span>
							<span v-if="p.pushCount!=null" class="ml-2 text-red-700 font-semibold">推 {{ p.pushCount }}</span>
							<span v-if="p.replyCount!=null || p.viewCount!=null" class="ml-2 text-neutral-600">(
								<span v-if="p.replyCount!=null">回 {{ p.replyCount }}</span>
								<span v-if="p.viewCount!=null"> / 看 {{ p.viewCount }}</span>
							)</span>
						</td>
						<td class="p-2 border-b border-neutral-100 text-center">
							<div>{{ p.author }}</div>
							<div v-if="p.authorDate" class="text-xs text-neutral-500">{{ p.authorDate }}</div>
						</td>
						<td class="p-2 border-b border-neutral-100 text-center">
							<div>{{ p.lastReplyUser }}</div>
							<div v-if="p.lastReplyDate" class="text-xs text-neutral-500">{{ p.lastReplyDate }}</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-if="pages && pages.length" class="mt-3 flex gap-2 items-center flex-wrap">
			<button class="btn-outline" @click="$emit('page', 1)" :disabled="current && current<=1">« 首頁</button>
			<button class="btn-outline" @click="$emit('page', (current||1)-1)" :disabled="current && current<=1">‹ 上一頁</button>
			<button class="btn-outline" v-for="n in pages" :key="n" @click="$emit('page', n)" :disabled="current===n">{{ n }}</button>
			<button class="btn-outline" @click="$emit('page', (current||1)+1)" :disabled="current && last && current>=last">下一頁 ›</button>
			<button class="btn-outline" @click="$emit('page', last||pages[pages.length-1])" :disabled="current && last && current>=last">末頁 »</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ForumPostRow } from '../utils/legacyParser';
const props = defineProps<{
  posts: ForumPostRow[];
  pages?: number[];
  sort?: 'latestReply' | 'latestPost';
  current?: number;
  last?: number;
}>();

defineEmits<{
  (e: 'page', n: number): void;
  (e: 'sort', v: 'latestReply' | '最新文章' | 'latestPost'): void;
}>();

type SortKey = 'latestReply' | 'latestPost' | '最新文章';
const localSort = ref<SortKey>(props.sort || 'latestReply');
watch(
  () => props.sort,
  (v?: SortKey) => {
    if (v) localSort.value = v;
  },
);

const sortedPosts = computed(() => {
  const arr = [...(props.posts || [])];
  if (localSort.value === '最新文章' || localSort.value === 'latestPost') {
    arr.sort((a, b) => (b.authorDate || '').localeCompare(a.authorDate || ''));
  } else {
    arr.sort((a, b) => (b.lastReplyDate || '').localeCompare(a.lastReplyDate || ''));
  }
  return arr;
});

function toPostRoute(href?: string, subjectId?: string) {
  if (subjectId) return { name: 'post', params: { id: subjectId } };
  const m = (href || '').match(/forum\/post\/([^?&#]+)/);
  if (m) return { name: 'post', params: { id: m[1] } };
  return href || '#';
}
</script>
