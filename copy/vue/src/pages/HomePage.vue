<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="bg-primary-600 text-neutral-50">
      <div class="container mx-auto px-lg py-lg">
        <h1 class="heading-1">運動彩券論壇</h1>
        <p class="mt-sm text-neutral-100">重構為 Vue 的首頁，快速進入各看板與最新文章</p>
        <div class="mt-md flex gap-sm">
          <RouterLink class="btn btn-secondary" :to="{ name: 'forum' }">進入論壇</RouterLink>
          <RouterLink
            class="btn btn-outline text-neutral-50 border-neutral-100"
            :to="{ name: 'login' }"
            >會員登入</RouterLink
          >
        </div>
      </div>
    </div>

    <div class="container mx-auto px-lg py-xl grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <div class="lg:col-span-2 space-y-lg">
        <section class="card">
          <div class="flex items-center justify-between gap-md">
            <div class="heading-2">最新文章</div>
            <div class="flex items-center gap-sm">
              <label class="text-sm text-neutral-600">排序</label>
              <select v-model="sortBy" class="input text-sm">
                <option value="latestReply">最新回覆</option>
                <option value="latestPost">最新發文</option>
              </select>
            </div>
          </div>
          <div v-if="loading" class="mt-md text-neutral-600">載入中…</div>
          <div v-else-if="errorMessage" class="mt-md text-red-600">{{ errorMessage }}</div>
          <ul class="mt-md divide-y divide-neutral-200">
            <li v-for="post in latestPosts" :key="post.href" class="py-sm flex items-start gap-md">
              <span
                v-if="post.boardTag"
                class="px-xs py-1 rounded-sm bg-neutral-200 text-neutral-700 text-xs shrink-0"
                >{{ post.boardTag }}</span
              >
              <div class="min-w-0">
                <RouterLink
                  class="text-primary-700 hover:underline break-words"
                  :to="postRoute(post)"
                  >{{ cleanTitle(post.title) }}</RouterLink
                >
                <div class="text-neutral-500 text-sm mt-1">
                  <span>作者：{{ post.author }}</span>
                  <span v-if="post.authorDate"> · {{ post.authorDate }}</span>
                  <span v-if="post.replyCount !== undefined"> · 回覆 {{ post.replyCount }}</span>
                  <span v-if="post.viewCount !== undefined"> · 閱讀 {{ post.viewCount }}</span>
                  <span v-if="post.pushCount !== undefined"> · 推 {{ post.pushCount }}</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="mt-md">
            <RouterLink class="btn btn-outline" :to="{ name: 'forum' }">瀏覽更多</RouterLink>
          </div>
        </section>

        <section class="card">
          <div class="heading-2">公告 / 精華</div>
          <div class="text-neutral-600">（預留區塊：可接後端或以置頂文自動填入）</div>
        </section>
      </div>

      <aside class="space-y-lg">
        <section class="card">
          <div class="heading-3">看板分類</div>
          <div class="mt-sm space-y-md">
            <div v-for="cat in categories" :key="cat.title">
              <div class="font-semibold text-neutral-800">{{ cat.title }}</div>
              <div class="mt-xs flex flex-wrap gap-xs">
                <RouterLink
                  v-for="b in cat.boards"
                  :key="b"
                  :to="{ name: 'forum', query: { board: b } }"
                  class="btn btn-outline text-sm"
                >
                  {{ b }}
                </RouterLink>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="heading-3">快速連結</div>
          <ul class="mt-sm list-disc list-inside text-primary-700">
            <li>
              <RouterLink :to="{ name: 'forum' }">論壇首頁</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'login' }">會員登入</RouterLink>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import type { ForumCategory, ForumPostRow } from '../utils/legacyParser';
import { loadLegacyForumHtml, parseForum } from '../utils/legacyParser';

const categories = ref<ForumCategory[]>([]);
const posts = ref<ForumPostRow[]>([]);
const loading = ref<boolean>(true);
const errorMessage = ref<string>('');
const sortBy = ref<'latestReply' | 'latestPost'>('latestReply');

function extractSubjectId(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const m1 = href.match(/subjectid=([a-zA-Z0-9]+)/);
  if (m1) return m1[1];
  const m2 = href.match(/\/post\/([a-z0-9]+)\.(?:html|php)/i);
  if (m2) return m2[1];
  const m3 = href.match(/forum\/?detail\/?([a-z0-9]+)/i);
  if (m3) return m3[1];
  return undefined;
}

function postRoute(post: ForumPostRow) {
  const id = post.subjectId || extractSubjectId(post.href);
  return id ? { name: 'post', params: { id } } : { name: 'forum' };
}

function cleanTitle(title: string): string {
  return title.replace(/^\[(.+?)\]\s*/, '');
}

function toTimestamp(value: string | undefined): number {
  if (!value) return 0;
  // 嘗試直接 Date.parse，失敗則回退抽取數字
  const t = Date.parse(value);
  if (!Number.isNaN(t)) return t;
  const digits = value.match(/(\d{4}).?(\d{1,2}).?(\d{1,2}).?(\d{1,2}).?(\d{1,2})?/);
  if (digits) {
    const year = parseInt(digits[1], 10);
    const month = Math.max(1, Math.min(12, parseInt(digits[2] || '1', 10))) - 1;
    const day = Math.max(1, Math.min(31, parseInt(digits[3] || '1', 10)));
    const hour = parseInt(digits[4] || '0', 10);
    const minute = parseInt(digits[5] || '0', 10);
    return new Date(year, month, day, hour, minute).getTime();
  }
  return 0;
}

const latestPosts = computed(() => {
  const sorted = [...posts.value].sort((a, b) => {
    if (sortBy.value === 'latestReply') {
      return toTimestamp(b.lastReplyDate) - toTimestamp(a.lastReplyDate);
    }
    // latestPost
    return toTimestamp(b.authorDate) - toTimestamp(a.authorDate);
  });
  return sorted.slice(0, 12);
});

onMounted(async () => {
  const CACHE_KEY = 'home_forum_cache_v1';
  const TTL_MS = 5 * 60 * 1000; // 5 分鐘
  try {
    // 讀取快取
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw) as {
        ts: number;
        categories: ForumCategory[];
        posts: ForumPostRow[];
      };
      if (cached && Date.now() - cached.ts < TTL_MS) {
        categories.value = cached.categories || [];
        posts.value = cached.posts || [];
        loading.value = false;
        return;
      }
    }

    const html = await loadLegacyForumHtml();
    const { categories: cats, posts: rows } = parseForum(html);
    categories.value = cats;
    // 置頂到後面
    const sticky = rows.filter((r) => r.pinned);
    const normal = rows.filter((r) => !r.pinned);
    posts.value = [...normal, ...sticky];
    // 寫入快取
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), categories: categories.value, posts: posts.value }),
    );
  } catch (err) {
    errorMessage.value = '載入首頁資料失敗，請稍後再試';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
