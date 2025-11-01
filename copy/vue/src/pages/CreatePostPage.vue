<template>
  <div class="create-post">
    <el-card class="max-w-4xl mx-auto">
      <h2>發表文章</h2>
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="看板" prop="boardId" :rules="[{ required: true, message: '請選擇看板' }]">
          <el-select v-model="form.boardId" placeholder="選擇看板" filterable clearable>
            <el-option
              v-for="board in flatBoards"
              :key="board.id"
              :label="board.name"
              :value="board.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="標題" prop="title" :rules="[{ required: true, message: '請輸入標題' }]">
          <el-input v-model="form.title" placeholder="輸入文章標題" />
        </el-form-item>

        <el-form-item label="內容" prop="content" :rules="[{ required: true, message: '請輸入內容' }]">
          <TipTapEditor v-model="form.content" :upload-image="uploadAttachment" />
        </el-form-item>

        <el-form-item label="狀態">
          <el-radio-group v-model="form.status">
            <el-radio-button label="published">立即發布</el-radio-button>
            <el-radio-button label="draft">儲存草稿</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submitPost">提交</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance } from 'element-plus';
import TipTapEditor from '../components/TipTapEditor.vue';
import { forumAPI } from '../api/forum';
import { useSessionStore } from '../stores/session';
import type { ForumBoard } from '../api/types';

const router = useRouter();
const session = useSessionStore();
const formRef = ref<FormInstance>();
const boards = ref<ForumBoard[]>([]);
const submitting = ref(false);

const form = reactive({
  boardId: undefined as number | undefined,
  title: '',
  content: null as any,
  status: 'published' as 'draft' | 'published',
  attachmentIds: [] as number[],
  tagIds: [] as number[],
});

const flatBoards = computed(() => {
  const list: ForumBoard[] = [];
  boards.value.forEach((board) => {
    list.push(board);
    (board.children || []).forEach((child) => list.push(child));
  });
  return list;
});

async function uploadAttachment(file: File) {
  const res = await forumAPI.uploadAttachment(file);
  const id = res.data.id;
  if (!form.attachmentIds.includes(id)) form.attachmentIds.push(id);
  return res.data.url;
}

async function submitPost() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    await forumAPI.createPost({
      boardId: form.boardId!,
      title: form.title,
      content: form.content,
      attachmentIds: form.attachmentIds,
      tagIds: form.tagIds,
      status: form.status,
    });
    ElMessage.success(form.status === 'published' ? '文章已發布' : '草稿已儲存');
    router.push({ name: 'forum' });
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '發表文章失敗');
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await session.fetchSession(true);
  if (!session.loggedIn) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  const res = await forumAPI.getBoards();
  boards.value = res.data || [];
});
</script>

<style scoped>
.create-post {
  padding: 24px 16px;
}

.create-post h2 {
  margin-bottom: 16px;
}
</style>






