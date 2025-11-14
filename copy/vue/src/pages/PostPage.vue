<template>
  <div>
    <div class="p-4 space-y-lg">
      <div class="card">
        <PostContent
          v-if="post"
          :title="post.title"
          :content="post.content"
          :like-count="post.likeCount"
          :is-liked="post.isLikedByMe"
          :can-edit="canEditPost"
          :can-delete="canEditPost"
          :like-loading="likeLoading"
          :author-name="post.author?.name"
          :author-title="post.author?.title"
          :created-at="post.createdAt"
          @like="handleArticleLike"
          @delete="handleArticleDelete"
          @edit="openArticleEditor"
        />
        <div v-else-if="loading" class="text-center py-6 text-neutral-500">文章載入中…</div>
        <div v-else-if="errorMessage" class="text-center py-6 text-red-600">{{ errorMessage }}</div>
      </div>

      <div class="card">
        <div class="comment-header">
          <h3>回覆</h3>
          <el-button v-if="!isPostLocked" type="primary" size="small" @click="openCommentForm"
            >發表回覆</el-button
          >
        </div>
        <p v-if="isPostLocked" class="lock-notice">此文章已鎖定，無法發佈新回覆。</p>
        <ReplyList
          v-if="post"
          :replies="comments"
          :pagination="commentsPagination"
          :current-user-id="session.user?.id"
          :is-admin="session.isAdmin"
          :editing-id="editingCommentId"
          @page="onReplyPage"
          @edit="openCommentForm"
          @delete="deleteComment"
          @like="toggleCommentLike"
        />
        <div
          v-if="commentFormVisible && (!isPostLocked || editingCommentId)"
          id="comment-form"
          class="comment-form"
        >
          <TipTapEditor 
            v-model="commentContent" 
            :upload-image="handleImageUpload"
            @upload-status-change="handleCommentUploadStatusChange"
          />
          <div class="comment-form-actions">
            <el-button 
              type="primary" 
              :loading="commentSubmitting" 
              :disabled="isCommentUploadingImage"
              @click="submitComment"
            >
              {{ isCommentUploadingImage ? '圖片上傳中...' : (editingCommentId ? '更新回覆' : '發佈回覆') }}
            </el-button>
            <el-button @click="closeCommentForm">取消</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-if="editDialogVisible" v-model="editDialogVisible" title="編輯文章" width="700px">
      <el-form label-width="80px" class="edit-form">
        <el-form-item label="標題">
          <el-input v-model="editTitle" placeholder="輸入文章標題" />
        </el-form-item>
        <el-form-item label="內容">
          <TipTapEditor 
            v-model="editContent" 
            :upload-image="handleImageUpload"
            @upload-status-change="handleEditUploadStatusChange"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button 
          type="primary" 
          :loading="editSubmitting"
          :disabled="isEditUploadingImage"
          @click="submitArticleEdit"
        >
          {{ isEditUploadingImage ? '圖片上傳中...' : '儲存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostContent from '../components/PostContent.vue';
import ReplyList from '../components/ReplyList.vue';
import TipTapEditor from '../components/TipTapEditor.vue';
import { forumAPI } from '../api/forum';
import { useSessionStore } from '../stores/session';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { ForumPostDetail, ForumComment, ForumCommentsResponse, TipTapDoc } from '../api/types';

const route = useRoute();
const router = useRouter();
const session = useSessionStore();
const post = ref<ForumPostDetail | null>(null);
const comments = ref<ForumComment[]>([]);
const commentsPagination = ref<ForumCommentsResponse['pagination']>();
const loading = ref(false);
const errorMessage = ref('');
const commentFormVisible = ref(false);
const commentSubmitting = ref(false);
const commentContent = ref<TipTapDoc | null>(null);
const replyingTo = ref<ForumComment | null>(null);
const editingCommentId = ref<number | null>(null);
const likeLoading = ref(false);
const editDialogVisible = ref(false);
const editTitle = ref('');
const editContent = ref<TipTapDoc | null>(null);
const editSubmitting = ref(false);
const commentLikeLoading = ref<Record<number, boolean>>({});
// 追蹤圖片上傳狀態
const isCommentUploadingImage = ref(false);
const isEditUploadingImage = ref(false);

interface ApiErrorPayload {
  response?: {
    data?: {
      code?: string;
      message?: string;
    };
  };
}

const canEditPost = computed(() => {
  if (!session.loggedIn || !post.value) return false;
  if (session.isAdmin) return true;
  return String(post.value.author.id) === String(session.user?.id);
});

const isPostLocked = computed(() => Boolean(post.value?.isLocked));

async function ensureLoggedIn() {
  await session.fetchSession(true);
  if (!session.loggedIn) {
    ElMessage.warning('請先登入');
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return false;
  }
  return true;
}

async function loadPost() {
  // 重置回覆表單避免在頁面載入時顯示編輯器
  closeCommentForm();
  const id = Number(route.params.id);
  if (!id || Number.isNaN(id)) {
    errorMessage.value = '無效的文章 ID';
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await forumAPI.getPost(id);
    post.value = res.data;
    if (post.value?.isLocked) {
      commentFormVisible.value = false;
    }
  } catch (error) {
    console.error('載入文章失敗', error);
    errorMessage.value = '載入文章失敗，請稍後再試';
  } finally {
    loading.value = false;
  }
}

async function loadComments(page = 1) {
  const id = Number(route.params.id);
  if (!id || Number.isNaN(id)) return;
  try {
    const res = await forumAPI.getComments(id, { page, size: 20 });
    comments.value = Array.isArray(res.data) ? res.data : [];
    commentsPagination.value = res.pagination ?? {
      page,
      size: 20,
      total: comments.value.length,
    };
  } catch (error) {
    console.error('載入回覆失敗', error);
    comments.value = [];
    commentsPagination.value = undefined;
  }
}

async function onReplyPage(page: number) {
  await loadComments(page);
}

function openCommentForm(comment?: ForumComment) {
  if (!comment && post.value?.isLocked) {
    ElMessage.warning('此文章已鎖定，暫時無法新增回覆');
    return;
  }

  if (!comment) {
    editingCommentId.value = null;
    commentContent.value = null;
    replyingTo.value = null;
  } else {
    editingCommentId.value = comment.id;
    commentContent.value = comment.content;
    replyingTo.value = comment.parentId ? comment : null;
  }
  commentFormVisible.value = true;
  window.requestAnimationFrame(() => {
    const el = document.querySelector('#comment-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function closeCommentForm() {
  commentFormVisible.value = false;
  editingCommentId.value = null;
  commentContent.value = null;
  replyingTo.value = null;
}

async function submitComment() {
  if (!(await ensureLoggedIn())) return;
  if (!commentContent.value || commentContent.value.type !== 'doc') {
    ElMessage.warning('請輸入回覆內容');
    return;
  }
  commentSubmitting.value = true;
  try {
    const postId = Number(route.params.id);
    if (!postId) throw new Error('Invalid post id');

    if (editingCommentId.value) {
      await forumAPI.updateComment(editingCommentId.value, { content: commentContent.value });
      ElMessage.success('回覆已更新');
    } else {
      await forumAPI.createComment(postId, {
        content: commentContent.value,
        parentId: replyingTo.value?.id,
      });
      ElMessage.success('回覆已發佈');
    }
    closeCommentForm();
    await loadComments(commentsPagination.value?.page || 1);
  } catch (error: unknown) {
    const err = error as ApiErrorPayload;
    const code = err.response?.data?.code;
    console.error('提交回覆失敗', err.response?.data || error);
    switch (code) {
      case 'MISSING_CONTENT':
        ElMessage.warning('請輸入回覆內容');
        break;
      case 'INVALID_CONTENT_FORMAT':
        ElMessage.error('回覆格式不正確，請重新編輯');
        break;
      case 'POST_LOCKED':
        ElMessage.error('文章已鎖定，無法新增回覆');
        break;
      case 'POST_NOT_FOUND':
        ElMessage.error('文章不存在或已被刪除');
        break;
      default:
        ElMessage.error(err.response?.data?.message || '回覆操作失敗');
    }
  } finally {
    commentSubmitting.value = false;
  }
}

async function deleteComment(comment: ForumComment) {
  if (!(await ensureLoggedIn())) return;
  try {
    await ElMessageBox.confirm('確定要刪除此回覆嗎？', '刪除回覆', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await forumAPI.deleteComment(comment.id);
    ElMessage.success('回覆已刪除');
    await loadComments(commentsPagination.value?.page || 1);
  } catch (error: unknown) {
    if (error !== 'cancel') {
      const err = error as ApiErrorPayload;
      ElMessage.error(err.response?.data?.message || '刪除失敗');
    }
  }
}

async function handleArticleDelete() {
  if (!post.value || !canEditPost.value) return;
  if (!(await ensureLoggedIn())) return;
  try {
    await ElMessageBox.confirm('確定要刪除這篇文章嗎？', '刪除文章', {
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await forumAPI.deletePost(post.value.id);
    ElMessage.success('文章已刪除');
    router.push({ name: 'forum' });
  } catch (error: unknown) {
    if (error !== 'cancel') {
      const err = error as ApiErrorPayload;
      ElMessage.error(err.response?.data?.message || '刪除文章失敗');
    }
  }
}

async function handleArticleLike() {
  if (!post.value) return;
  if (!(await ensureLoggedIn())) return;
  likeLoading.value = true;
  try {
    if (post.value.isLikedByMe) {
      await forumAPI.unlikePost(post.value.id);
      post.value.isLikedByMe = false;
      post.value.likeCount = Math.max(0, (post.value.likeCount || 0) - 1);
    } else {
      await forumAPI.likePost(post.value.id);
      post.value.isLikedByMe = true;
      post.value.likeCount = (post.value.likeCount || 0) + 1;
    }
  } catch (error: unknown) {
    const err = error as ApiErrorPayload;
    ElMessage.error(err.response?.data?.message || '操作失敗');
  } finally {
    likeLoading.value = false;
  }
}

function openArticleEditor() {
  if (!post.value) return;
  editTitle.value = post.value.title;
  editContent.value = post.value.content;
  editDialogVisible.value = true;
}

// 處理回覆表單的圖片上傳狀態變化
function handleCommentUploadStatusChange(uploading: boolean) {
  isCommentUploadingImage.value = uploading;
}

// 處理編輯對話框的圖片上傳狀態變化
function handleEditUploadStatusChange(uploading: boolean) {
  isEditUploadingImage.value = uploading;
}

async function handleImageUpload(file: globalThis.File) {
  if (!(await ensureLoggedIn())) return '';
  try {
    console.debug('準備上傳附件', { name: file.name, size: file.size, type: file.type });
    const res = await forumAPI.uploadAttachment(file);
    const url = res.data.url;
    console.log('圖片上傳成功，URL:', url);
    return url;
  } catch (error: unknown) {
    const err = error as ApiErrorPayload;
    const payload = err.response?.data;
    console.error('上傳圖片失敗', payload || error);
    switch (payload?.code) {
      case 'MISSING_FILE':
        ElMessage.error('上傳失敗：請重新選擇圖片');
        break;
      case 'FILE_TOO_LARGE':
        ElMessage.error('圖片超過 10MB，請重新選擇');
        break;
      case 'INVALID_FILE_TYPE':
        ElMessage.error('僅支援 JPEG、PNG、WebP 或 GIF');
        break;
      default:
        ElMessage.error(payload?.message || '上傳失敗');
    }
    throw error;
  }
}

async function toggleCommentLike(comment: ForumComment) {
  if (!(await ensureLoggedIn())) return;
  const id = comment.id;
  if (!commentLikeLoading.value[id]) commentLikeLoading.value[id] = false;
  if (commentLikeLoading.value[id]) return;
  commentLikeLoading.value[id] = true;
  try {
    if (comment.isLikedByMe) {
      await forumAPI.unlikeComment(comment.id);
      comment.isLikedByMe = false;
      comment.likeCount = Math.max(0, (comment.likeCount || 0) - 1);
    } else {
      await forumAPI.likeComment(comment.id);
      comment.isLikedByMe = true;
      comment.likeCount = (comment.likeCount || 0) + 1;
    }
  } catch (error: unknown) {
    const err = error as ApiErrorPayload;
    ElMessage.error(err.response?.data?.message || '操作失敗');
  } finally {
    commentLikeLoading.value[id] = false;
  }
}

function closeEditDialog() {
  editDialogVisible.value = false;
  editSubmitting.value = false;
}

async function submitArticleEdit() {
  if (!post.value) return;
  if (!(await ensureLoggedIn())) return;
  if (!editTitle.value) {
    ElMessage.warning('請輸入文章標題');
    return;
  }
  if (!editContent.value) {
    ElMessage.warning('請輸入文章內容');
    return;
  }
  editSubmitting.value = true;
  try {
    await forumAPI.updatePost(post.value.id, {
      title: editTitle.value,
      content: editContent.value,
    });
    ElMessage.success('文章已更新');
    closeEditDialog();
    await loadPost();
  } catch (error: unknown) {
    const err = error as ApiErrorPayload;
    ElMessage.error(err.response?.data?.message || '更新文章失敗');
  } finally {
    editSubmitting.value = false;
  }
}

onMounted(async () => {
  await session.fetchSession(true);
  await loadPost();
  await loadComments(1);
});
</script>

<style scoped>
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-form {
  margin-top: 20px;
}

.comment-form-actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}

.lock-notice {
  margin: 8px 0 0;
  padding: 8px 12px;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 0.95rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
