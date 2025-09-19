<template>
  <div class="forum-container">
    <!-- 看板分類區域 -->
    <div class="board-categories">
      <table class="helpTfTop" width="100%">
        <tr>
          <td class="helpClearf" width="660">
            <div class="menu_title">看板</div>
            <div class="menu_content">
              <div v-for="cat in categories" :key="cat.title">
                <span class="subtitle">{{ cat.title }}</span>
                <div class="subtitle_item">
                  <a 
                    v-for="board in cat.boards" 
                    :key="board" 
                    :href="`forum/${typeof board === 'string' ? board : board}.html`"
                    class="js-forum-alliances-list-link"
                  >
                    {{ board }}
                  </a>
                </div>
              </div>
            </div>
          </td>
          <td class="helpClearf" colspan="2" valign="top">
            <div class="menu_category">
              <div class="row">
                <div class="title">排序</div>
                <div class="content">
                  <span v-if="sortBy === 'latestReply'" style="font:bold;color:red;">最新回覆</span>
                  <a v-else href="#" @click.prevent="sortBy = 'latestReply'">最新回覆</a>
                  <a v-if="sortBy !== 'latestReply'" href="#" @click.prevent="sortBy = 'latestPost'">最新文章</a>
                  <span v-else style="font:bold;color:red;">最新文章</span>
                </div>
              </div>
              <div class="row" style="display: block;margin-top:30px;" align="right">
                <a href="#" class="headerLoginButton">
                  <span class="button orange" style="color:black;font-size:16px;padding:6px 15px; font-family:微軟正黑體,Arial, Helvetica, sans-serif;">發表文章</span>
                </a>
                <a href="/test-nav" style="margin-left: 10px;">
                  <span class="button" style="background:#28a745;color:white;font-size:14px;padding:6px 15px; font-family:微軟正黑體,Arial, Helvetica, sans-serif;">🧪 測試導覽</span>
                </a>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- 文章列表表格 -->
    <div v-if="loading" class="loading-message">載入中…</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <table v-else class="forum helpTf" width="100%" cellspacing="0" style="margin-top:20px;">
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

      <!-- 置頂文章 -->
      <tr v-for="post in pinnedPosts" :key="post.href" bgcolor="#ffff99">
        <td class="helpBodf article-title" height="55">
          <span>
            <div class="betrec listlabel_ab">
              <img v-if="post.pushCount && post.pushCount > 60" src="/images/forum/icon_push_over60.gif" alt="推文">
            </div>
          </span>
          <span class="article-title_content article-title_content_ab list_titlefont">
            <span v-if="post.boardTag" class="board-tag">[{{ post.boardTag }}]</span>
            <a :href="postRoute(post).href || '#'">{{ cleanTitle(post.title) }}</a>
            <span v-if="post.pages && post.pages.length > 0" class="pg_mini"> …
              <a 
                v-for="page in post.pages" 
                :key="page" 
                :href="`${postRoute(post).href}?pageno=${page}`"
                style="color:#3c3c3c;"
              >
                {{ page }}
              </a>
            </span>
          </span>
        </td>
        <td class="helpBodf avatartd" height="55">
          <a :href="`visit_member.html?visit=${post.author}`" style="color:#3C3C3C;">
            <img class="avatar" :src="post.avatar || '/images/default-avatar.jpg'" width="35" height="35" border="0">
          </a>
        </td>
        <td class="helpBodf" style="text-align:center;" nowrap>
          <a :href="`visit_member.html?visit=${post.author}`" style="color:#3C3C3C;">
            {{ post.author }}<br>
            <span class="articleDateTime">{{ post.authorDate }}</span>
          </a>
        </td>
        <td class="helpBodf" style="text-align:center;">
          <a :href="`visit_member.html?visit=${post.lastReplyAuthor || post.lastReplyUser || post.author}`" style="color:#3C3C3C;">
            {{ post.lastReplyAuthor || post.lastReplyUser || post.author }}<br>
            <span class="articleDateTime">{{ post.lastReplyDate || post.authorDate }}</span>
          </a>
        </td>
      </tr>

      <!-- 一般文章 -->
      <tr v-for="post in normalPosts" :key="post.href" bgcolor="#ffffff">
        <td class="helpBodf article-title" height="55">
          <div class="betrec listlabel_ab">
            <span v-if="post.pushCount && post.pushCount > 0" class="push-tag">{{ post.pushCount }}</span>
          </div>
          <span class="article-title_content article-title_content_ab list_titlefont">
            <span v-if="post.boardTag" class="board-tag">[{{ post.boardTag }}]</span>
            <a :href="postRoute(post).href || '#'">{{ cleanTitle(post.title) }}</a>
            <span v-if="post.pages && post.pages.length > 0" class="pg_mini"> …
              <a 
                v-for="page in post.pages" 
                :key="page" 
                :href="`${postRoute(post).href}?pageno=${page}`"
                style="color:#3c3c3c;"
              >
                {{ page }}
              </a>
            </span>
          </span>
        </td>
        <td class="helpBodf avatartd" height="55">
          <a :href="`visit_member.html?visit=${post.author}`" style="color:#3C3C3C;">
            <img class="avatar" :src="post.avatar || '/images/default-avatar.jpg'" width="35" height="35" border="0">
          </a>
        </td>
        <td class="helpBodf" style="text-align:center;" nowrap>
          <a :href="`visit_member.html?visit=${post.author}`" style="color:#3C3C3C;">
            {{ post.author }}<br>
            <span class="articleDateTime">{{ post.authorDate }}</span>
          </a>
        </td>
        <td class="helpBodf" style="text-align:center;">
          <a :href="`visit_member.html?visit=${post.lastReplyAuthor || post.lastReplyUser || post.author}`" style="color:#3C3C3C;">
            {{ post.lastReplyAuthor || post.lastReplyUser || post.author }}<br>
            <span class="articleDateTime">{{ post.lastReplyDate || post.authorDate }}</span>
          </a>
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import type { ForumCategory, ForumPostRow } from '../utils/legacyParser';
import { loadLegacyForumHtml, parseForum } from '../utils/legacyParser';
import '../assets/css/forum-original.css';

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
  return {
    name: id ? 'post' : 'forum',
    params: id ? { id } : {},
    href: post.href || (id ? `forum/post/${id}.html` : 'forum.html')
  };
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

// 分離置頂文章和一般文章
const pinnedPosts = computed(() => {
  return posts.value.filter(post => post.pinned).slice(0, 5);
});

const normalPosts = computed(() => {
  const sorted = [...posts.value.filter(post => !post.pinned)].sort((a, b) => {
    if (sortBy.value === 'latestReply') {
      return toTimestamp(b.lastReplyDate) - toTimestamp(a.lastReplyDate);
    }
    // latestPost
    return toTimestamp(b.authorDate) - toTimestamp(a.authorDate);
  });
  return sorted.slice(0, 20);
});

const latestPosts = computed(() => {
  return [...pinnedPosts.value, ...normalPosts.value];
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
