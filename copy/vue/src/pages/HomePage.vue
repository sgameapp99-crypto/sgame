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
      <tr v-for="post in latestPosts" :key="post.id" :bgcolor="post.isSticky ? '#ffff99' : '#ffffff'">
        <td class="helpBodf article-title" height="55">
          <div class="betrec listlabel_ab">
            <span v-if="post.likeCount && post.likeCount > 0" class="push-tag">{{ post.likeCount }}</span>
          </div>
          <span class="article-title_content article-title_content_ab list_titlefont">
            <span v-if="post.board?.name" class="board-tag">[{{ post.board.name }}]</span>
            <RouterLink :to="{ name: 'post', params: { id: post.id } }">
              {{ post.title }}
            </RouterLink>
          </span>
        </td>
        <td class="helpBodf avatartd" height="55">
          <RouterLink :to="{ name: 'member-view', params: { id: post.author?.id } }" style="color:#3C3C3C;">
            <img class="avatar" :src="post.author?.avatarUrl || '/images/default-avatar.jpg'" width="35" height="35" border="0">
          </RouterLink>
        </td>
        <td class="helpBodf" style="text-align:center;" nowrap>
          <RouterLink :to="{ name: 'member-view', params: { id: post.author?.id } }" style="color:#3C3C3C;">
            {{ post.author?.name }}<br>
            <span class="articleDateTime">{{ formatDate(post.createdAt) }}</span>
          </RouterLink>
        </td>
        <td class="helpBodf" style="text-align:center;">
          <RouterLink :to="{ name: 'member-view', params: { id: post.lastCommentUser?.id } }" style="color:#3C3C3C;">
            {{ post.lastCommentUser?.name || post.author?.name }}<br>
            <span class="articleDateTime">{{ formatDate(post.lastCommentAt || post.updatedAt) }}</span>
          </RouterLink>
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { forumAPI } from '../api/forum';
import type { ForumBoard, ForumPost } from '../api/types';
import '../assets/css/forum-original.css';

const boards = ref<ForumBoard[]>([]);
const posts = ref<ForumPost[]>([]);
const loading = ref<boolean>(true);
const errorMessage = ref<string>('');
const sortBy = ref<'latestReply' | 'latestPost'>('latestReply');

const latestPosts = computed(() => {
  const sticky = posts.value.filter((post) => post.isSticky);
  const normal = posts.value.filter((post) => !post.isSticky);
  const sorted = normal.sort((a, b) => {
    if (sortBy.value === 'latestReply') {
      return new Date(b.lastCommentAt || b.updatedAt).getTime() - new Date(a.lastCommentAt || a.updatedAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return [...sticky.slice(0, 5), ...sorted.slice(0, 20)];
});

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

onMounted(async () => {
  loading.value = true;
  try {
    const [boardRes, postRes] = await Promise.all([
      forumAPI.getBoards(),
      forumAPI.getPosts({ page: 1, size: 50, sort: 'latestReply' }),
    ]);
    boards.value = boardRes.data || [];
    posts.value = postRes.data || [];
  } catch (error) {
    console.error('載入首頁資料失敗', error);
    errorMessage.value = '載入首頁資料失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
});
</script>
