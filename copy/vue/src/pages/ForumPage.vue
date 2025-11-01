<template>
  <div>
    <!-- 主要內容區域 -->
    <div class="mainconbox">
      <div class="mainconboxin mainconboxinwide">
        <!-- 上方分類和操作區域 -->
        <table class="helpTfTop" width="100%">
          <tr>
            <td class="helpClearf" width="660">
              <div class="menu_title">看板</div>
              <ForumNav
                :boards="boards"
                :active-id="selectedBoard?.id || null"
                :active-slug="selectedBoard?.slug || null"
                @select-board="onSelectBoard"
              />
            </td>
            <td class="helpClearf" colspan="2" valign="top">
              <div class="menu_category">
                <div class="row">
                  <div class="title">排序</div>
                  <div class="content">
                    <a
                      href="#"
                      :style="
                        sort === 'latestReply'
                          ? 'font-weight: bold; color: red;'
                          : 'color: #0066CC;'
                      "
                      @click.prevent="onSort('latestReply')"
                    >
                      最新回覆
                    </a>
                    <span style="margin: 0 8px">|</span>
                    <a
                      href="#"
                      :style="
                        sort === 'latestPost' ? 'font-weight: bold; color: red;' : 'color: #0066CC;'
                      "
                      @click.prevent="onSort('latestPost')"
                    >
                      最新文章
                    </a>
                  </div>
                </div>
                <div class="row" style="display: block; margin-top: 30px; text-align: right">
                  <button class="button orange" type="button" @click="handleCreatePost">
                    發文
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- 文章列表區域 -->
        <div class="forum-content">
          <div class="mb-2 text-neutral-600">
            <span v-if="selectedBoard">篩選：{{ selectedBoard.name }}</span>
          </div>

          <div v-if="loading" class="text-center py-6 text-neutral-500">資料載入中…</div>
          <div v-else-if="errorMessage" class="text-center py-6 text-red-600">
            {{ errorMessage }}
          </div>
          <div v-else-if="!posts.length" class="text-center py-6 text-neutral-500">
            目前沒有文章
          </div>
          <ForumList
            v-else
            :posts="posts"
            :pagination="pagination"
            :sort="sort"
            @page="onPage"
            @sort="onSort"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ForumNav from '../components/ForumNav.vue';
import ForumList from '../components/ForumList.vue';
import { forumAPI } from '../api/forum';
import type { ForumBoard, ForumPost, ForumPostsResponse } from '../api/types';
import '../assets/css/forum-original.css';
import { useSessionStore } from '../stores/session';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const boards = ref<ForumBoard[]>([]);
const posts = ref<ForumPost[]>([]);
const pagination = ref<ForumPostsResponse['pagination']>();
const selectedBoard = ref<ForumBoard | null>(null);
const sort = ref<'latestReply' | 'latestPost'>('latestReply');
const currentPage = ref<number>(1);
const loading = ref(false);
const errorMessage = ref('');
const boardQuery = ref<string | null>(null);

const flattenedBoards = computed(() => {
  const list: ForumBoard[] = [];
  boards.value.forEach((board) => {
    list.push(board);
    (board.children || []).forEach((child) => list.push(child));
  });
  return list;
});

function resolveSelectedBoard() {
  if (!boardQuery.value) {
    selectedBoard.value = null;
    return;
  }
  const match = flattenedBoards.value.find(
    (board) => board.slug === boardQuery.value || String(board.id) === boardQuery.value,
  );
  selectedBoard.value = match || null;
}

async function loadBoards() {
  try {
    const res = await forumAPI.getBoards();
    boards.value = res.data || [];
    resolveSelectedBoard();
  } catch (error) {
    console.error('載入看板失敗', error);
  }
}

async function loadPosts() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await forumAPI.getPosts({
      page: currentPage.value,
      sort: sort.value,
      boardId: selectedBoard.value?.id,
    });
    posts.value = res.data || [];
    pagination.value = res.pagination;
  } catch (error) {
    console.error('載入文章失敗', error);
    errorMessage.value = '載入文章失敗，請稍後再試';
    posts.value = [];
  } finally {
    loading.value = false;
  }
}

function syncQuery() {
  const q: Record<string, string> = {};
  if (selectedBoard.value) q.board = selectedBoard.value.slug || String(selectedBoard.value.id);
  if (sort.value) q.sort = sort.value;
  if (currentPage.value && currentPage.value !== 1) q.page = String(currentPage.value);
  router.replace({ query: q });
}

function initFromQuery() {
  const q = route.query;
  boardQuery.value = typeof q.board === 'string' ? q.board : null;
  if (q.sort === 'latestPost' || q.sort === 'latestReply') sort.value = q.sort;
  currentPage.value = q.page && !Array.isArray(q.page) ? parseInt(String(q.page), 10) || 1 : 1;
  resolveSelectedBoard();
}

async function onPage(n: number) {
  if (n === currentPage.value) return;
  currentPage.value = n;
  syncQuery();
  await loadPosts();
}

async function onSelectBoard(payload: ForumBoard) {
  selectedBoard.value = payload;
  boardQuery.value = payload.slug || String(payload.id);
  currentPage.value = 1;
  syncQuery();
  await loadPosts();
}

async function onSort(v: 'latestReply' | 'latestPost') {
  if (sort.value === v) return;
  sort.value = v;
  currentPage.value = 1;
  syncQuery();
  await loadPosts();
}

async function handleCreatePost() {
  await session.fetchSession(true);
  if (!session.loggedIn) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  const query = selectedBoard.value
    ? { board: selectedBoard.value.slug || String(selectedBoard.value.id) }
    : undefined;
  router.push({ name: 'forum-create', query });
}

watch(
  () => route.query,
  async () => {
    initFromQuery();
    await loadPosts();
  },
);

onMounted(async () => {
  initFromQuery();
  await loadBoards();
  await loadPosts();
});
</script>

<style scoped>
/* 原始網站樣式 */
.mainconbox {
  margin: 0 auto;
  max-width: 1000px;
  padding: 0 10px;
}

.mainconboxin {
  width: 100%;
}

.mainconboxinwide {
  max-width: 100%;
}

/* 論壇表格樣式 */
.helpTfTop {
  border: 1px solid #dcdcdc;
  background: #fff;
  margin-bottom: 20px;
}

.helpClearf {
  padding: 10px;
  vertical-align: top;
}

.menu_title {
  float: left;
  width: 40px;
  line-height: 34px;
}

.menu_content {
  float: left;
  line-height: 34px;
}

.menu_content .subtitle {
  color: #009900;
  padding-right: 10px;
  vertical-align: top;
}

.menu_content .subtitle_item {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 5px;
}

.menu_category {
  float: left;
  line-height: 34px;
}

.row {
  margin-bottom: 10px;
}

.title {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.content a {
  color: #0066cc;
  text-decoration: none;
  margin-right: 10px;
}

.content a:hover {
  text-decoration: underline;
}

/* 按鈕樣式 */
.button {
  display: inline-block;
  zoom: 1;
  vertical-align: baseline;
  margin: 0 2px;
  outline: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  font:
    14px/100% Arial,
    Helvetica,
    sans-serif;
  padding: 0.5em 2em 0.55em;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 0.5em;
  -moz-border-radius: 0.5em;
  border-radius: 0.5em;
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.button:hover {
  text-decoration: none;
}

.button:active {
  position: relative;
  top: 1px;
}

.orange {
  color: #fef4e9;
  color: black;
  border: solid 1px #da7c0c;
  background: #f78d1d;
  background: -webkit-gradient(linear, left top, left bottom, from(#faa51a), to(#ffcc00));
  background: -moz-linear-gradient(top, #faa51a, #ffcc00);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#faa51a', endColorstr='#FFCC00');
}

.orange:hover {
  background: #f47c20;
  background: -webkit-gradient(linear, left top, left bottom, from(#f88e11), to(#f06015));
  background: -moz-linear-gradient(top, #f88e11, #f06015);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f88e11', endColorstr='#f06015');
}

.orange:active {
  color: #fcd3a5;
  color: black;
  background: -webkit-gradient(linear, left top, left bottom, from(#f47a20), to(#faa51a));
  background: -moz-linear-gradient(top, #f47a20, #faa51a);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f47a20', endColorstr='#faa51a');
}

.forum-content {
  margin-top: 20px;
}

/* 分頁樣式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 20px;
}

/* 推文標籤樣式 */
.push-tag {
  background: #ff6c00;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
}

/* 看板標籤樣式 */
.board-tag {
  color: #009900;
  font-weight: bold;
  margin-right: 5px;
}
</style>
