<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="p-3">
      <ForumNav :nav-links="navLinks" :categories="categories" @select-board="onSelectBoard" />
      <section>
        <h3 class="text-lg font-semibold">文章列表</h3>
        <div class="mb-2 text-neutral-600">
          <span v-if="selectedBoard"
            >篩選：{{ selectedBoard.category }} / {{ selectedBoard.board }}</span
          >
        </div>
        <ForumList
          :posts="displayPosts"
          :pages="pagination?.pages"
          :current="pagination?.current"
          :last="lastPage"
          :sort="sort"
          @page="onPage"
          @sort="onSort"
        />
      </section>
    </div>
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import ForumNav from '../components/ForumNav.vue';
import ForumList from '../components/ForumList.vue';
import { loadLegacyForumHtml, parseForum, type ForumPostRow } from '../utils/legacyParser';

const route = useRoute();
const router = useRouter();

const navLinks = ref<{ text: string; href: string }[]>([]);
const categories = ref<{ title: string; boards: string[] }[]>([]);
const posts = ref<ForumPostRow[]>([]);
const pagination = ref<{ current: number; pages: number[] } | null>(null);
const selectedBoard = ref<{ category: string; board: string } | null>(null);
const sort = ref<'latestReply' | 'latestPost'>('latestReply');
const currentPage = ref<number>(1);

const displayPosts = computed(() => {
  if (!selectedBoard.value) return posts.value;
  const keyword = selectedBoard.value.board;
  return posts.value.filter((p) => p.boardTag === keyword || p.title.includes(keyword));
});

const lastPage = computed(() => pagination.value?.pages?.[pagination.value.pages.length - 1]);

async function load(page?: number) {
  let html: string;
  if (!page || page === 1) {
    html = await loadLegacyForumHtml();
  } else {
    const res = await fetch(`/legacy/www.playsport.cc/forum/${page}.html`, { cache: 'no-store' });
    html = await res.text();
  }
  const parsed = parseForum(html);
  navLinks.value = parsed.navLinks;
  categories.value = parsed.categories;
  posts.value = parsed.posts;
  pagination.value = parsed.pagination;
}

function syncQuery() {
  const q: Record<string, string> = {};
  if (selectedBoard.value) q.board = selectedBoard.value.board;
  if (sort.value) q.sort = sort.value;
  if (currentPage.value && currentPage.value !== 1) q.page = String(currentPage.value);
  router.replace({ query: q });
}

function initFromQuery() {
  const q = route.query;
  if (q.board && typeof q.board === 'string')
    selectedBoard.value = { category: '', board: q.board };
  if (q.sort === 'latestPost' || q.sort === 'latestReply') sort.value = q.sort;
  if (q.page && !Array.isArray(q.page)) currentPage.value = parseInt(String(q.page), 10) || 1;
}

function onPage(n: number) {
  currentPage.value = n;
  syncQuery();
  load(n);
}
function onSelectBoard(payload: { category: string; board: string }) {
  selectedBoard.value = payload;
  syncQuery();
}
function onSort(v: 'latestReply' | 'latestPost') {
  sort.value = v;
  syncQuery();
}

watch(
  () => route.query,
  () => {
    initFromQuery();
  },
);

onMounted(async () => {
  initFromQuery();
  await load(currentPage.value);
});
</script>
