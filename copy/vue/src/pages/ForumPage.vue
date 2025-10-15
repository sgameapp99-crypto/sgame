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
              <ForumNav :categories="categories" @select-board="onSelectBoard" />
            </td>
            <td class="helpClearf" colspan="2" valign="top">
              <div class="menu_category">
                <div class="row">
                  <div class="title">排序</div>
                  <div class="content">
                    <a
                      href="#"
                      @click.prevent="onSort('latestReply')"
                      :style="sort === 'latestReply' ? 'font-weight: bold; color: red;' : 'color: #0066CC;'"
                    >
                      最新回覆
                    </a>
                    <span style="margin: 0 8px;">|</span>
                    <a
                      href="#"
                      @click.prevent="onSort('latestPost')"
                      :style="sort === 'latestPost' ? 'font-weight: bold; color: red;' : 'color: #0066CC;'"
                    >
                      最新文章
                    </a>
                  </div>
                </div>
                <div class="row" style="display: block; margin-top: 30px; text-align: right;">
                  <RouterLink to="/login" class="headerLoginButton">
                    <span class="button orange" style="color: black; font-size: 16px; padding: 6px 15px; font-family: '微軟正黑體', Arial, Helvetica, sans-serif;">發文</span>
                  </RouterLink>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- 文章列表區域 -->
        <div class="forum-content">
          <div class="mb-2 text-neutral-600">
            <span v-if="selectedBoard">篩選：{{ selectedBoard.category }} / {{ selectedBoard.board }}</span>
          </div>

          <!-- 文章列表表格 -->
          <table class="forum helpTf" width="100%" cellspacing="0" style="margin-top:20px;">
            <!-- 表頭 -->
            <tr>
              <td class="helpHedf" width="584" height="50">
                <p class="helpHedf-title">主題</p>
              </td>
              <td class="helpHedf" width="41">&nbsp;</td>
              <td class="helpHedf" width="120">
                <p class="helpHedf-author">作者</p>
              </td>
              <td class="helpHedf" width="120">
                <p class="helpHedf-newreply">最新回覆</p>
              </td>
            </tr>

            <!-- 文章列表 -->
            <tr v-for="post in displayPosts" :key="post.href" :bgcolor="post.pinned ? '#ffff99' : '#ffffff'">
              <td class="helpBodf article-title" height="55">
                <span>
                  <div class="betrec listlabel_ab">
                    <img v-if="post.pushCount && post.pushCount > 60" src="/images/forum/icon_push_over60.gif" alt="推文">
                  </div>
                </span>
                <span class="article-title_content article-title_content_ab list_titlefont">
                  <span v-if="post.boardTag" class="board-tag">[{{ post.boardTag }}]</span>
                  <RouterLink :to="postRoute(post)" class="hover:underline">{{ cleanTitle(post.title) }}</RouterLink>
                  <span v-if="post.pages && post.pages.length > 0" class="pg_mini"> …
                    <RouterLink
                      v-for="page in post.pages"
                      :key="page"
                      :to="`${postRoute(post).href}?pageno=${page}`"
                      style="color:#3c3c3c;"
                    >
                      {{ page }}
                    </RouterLink>
                  </span>
                </span>
              </td>
              <td class="helpBodf avatartd" height="55">
                <RouterLink :to="`/member/${post.author}`" style="color:#3C3C3C;">
                  <img class="avatar" :src="post.avatar || '/images/default-avatar.jpg'" width="35" height="35" border="0">
                </RouterLink>
              </td>
              <td class="helpBodf" style="text-align:center;" nowrap>
                <RouterLink :to="`/member/${post.author}`" style="color:#3C3C3C;">
                  {{ post.author }}<br>
                  <span class="articleDateTime">{{ post.authorDate }}</span>
                </RouterLink>
              </td>
              <td class="helpBodf" style="text-align:center;">
                <RouterLink :to="`/member/${post.lastReplyAuthor || post.lastReplyUser || post.author}`" style="color:#3C3C3C;">
                  {{ post.lastReplyAuthor || post.lastReplyUser || post.author }}<br>
                  <span class="articleDateTime">{{ post.lastReplyDate || post.authorDate }}</span>
                </RouterLink>
              </td>
            </tr>
          </table>

          <!-- 分頁 -->
          <div v-if="pagination?.pages && pagination.pages.length > 1" class="pagination mt-4 text-center">
            <button
              v-for="page in pagination.pages"
              :key="page"
              class="btn btn-outline btn-sm mx-1"
              :class="{ 'bg-blue-500 text-white': page === pagination.current }"
              @click="onPage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
        </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ForumNav from '../components/ForumNav.vue';
import { loadLegacyForumHtml, parseForum, type ForumPostRow } from '../utils/legacyParser';
import '../assets/css/forum-original.css';

const route = useRoute();
const router = useRouter();

const categories = ref<{ title: string; boards: string[] }[]>([
  {
    title: '棒球',
    boards: ['MLB', '日棒', '中職', '韓棒', '澳棒', '國際棒賽']
  },
  {
    title: '籃球',
    boards: ['NBA', 'WNBA', '韓籃', '日籃', '歐籃', '中籃', '國際籃賽', '綜合籃賽', '菲籃', '澳籃', 'P+', 'TPBL']
  },
  {
    title: '其他',
    boards: ['玩競猜', '足球', 'NHL冰球', '俄冰', '美足', '網球', '賽馬', '電競', '猜數字', '彩球', '排球', '乒乓球', '羽球']
  },
  {
    title: '全部',
    boards: ['全部', '閒聊', '都蘭特區', '炫耀', '公告']
  }
]);
const posts = ref<ForumPostRow[]>([]);
const pagination = ref<{ current: number; pages: number[] } | null>(null);
const selectedBoard = ref<{ category: string; board: string } | null>(null);
const sort = ref<'latestReply' | 'latestPost'>('latestReply');
const currentPage = ref<number>(1);

const displayPosts = computed(() => {
  let filteredPosts = posts.value;

  // 先根據看板過濾
  if (selectedBoard.value) {
    const keyword = selectedBoard.value.board;
    filteredPosts = filteredPosts.filter((p) => p.boardTag === keyword || p.title.includes(keyword));
  }

  // 根據排序方式排序
  return filteredPosts.sort((a, b) => {
    if (sort.value === 'latestReply') {
      // 最新回覆：按最後回覆時間排序
      const aDate = new Date(a.lastReplyDate || a.authorDate || 0);
      const bDate = new Date(b.lastReplyDate || b.authorDate || 0);
      return bDate.getTime() - aDate.getTime();
    } else {
      // 最新文章：按發文時間排序
      const aDate = new Date(a.authorDate || 0);
      const bDate = new Date(b.authorDate || 0);
      return bDate.getTime() - aDate.getTime();
    }
  });
});

const lastPage = computed(() => pagination.value?.pages?.[pagination.value.pages.length - 1]);

// 輔助函數
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
  return {
    name: id ? 'post' : 'forum',
    params: id ? { id } : {},
    href: post.href || (id ? `forum/post/${id}.html` : 'forum.html')
  };
}

function cleanTitle(title: string): string {
  return title.replace(/^\[(.+?)\]\s*/, '');
}

async function load(page?: number) {
  let html: string;
  if (!page || page === 1) {
    html = await loadLegacyForumHtml();
  } else {
    const res = await fetch(`/legacy/www.playsport.cc/forum/${page}.html`, { cache: 'no-store' });
    html = await res.text();
  }
  const parsed = parseForum(html);
  // navLinks.value = parsed.navLinks; // 不再使用navLinks
  // categories.value = parsed.categories; // 不再從解析中獲取，使用硬編碼分類
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
  border: 1px solid #DCDCDC;
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
  color: #0066CC;
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
  font: 14px/100% Arial, Helvetica, sans-serif;
  padding: 0.5em 2em 0.55em;
  text-shadow: 0 1px 1px rgba(0,0,0,.3);
  -webkit-border-radius: 0.5em;
  -moz-border-radius: 0.5em;
  border-radius: 0.5em;
  -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  -moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
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
  background: -webkit-gradient(linear, left top, left bottom, from(#faa51a), to(#FFCC00));
  background: -moz-linear-gradient(top, #faa51a, #FFCC00);
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
