<template>
  <div class="board-manager">
    <div class="manager-header">
      <div>
        <h3>論壇看板管理</h3>
        <p class="subtitle">維護看板階層、開關與排序，調整後會立即同步到前台。</p>
      </div>
      <el-button type="primary" @click="openCreateDialog">新增看板</el-button>
    </div>

    <el-alert
      class="hint"
      title="排序僅在同一層級調整，上下移動後會即時呼叫後端 API 更新順序。"
      type="info"
      show-icon
    />

    <el-table
      v-if="boardRows.length"
      :data="boardRows"
      v-loading="loading"
      :row-key="rowKey"
      :row-class-name="getRowClass"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="name" label="看板" min-width="220">
        <template #default="{ row }">
          <div class="board-name" :style="getIndentStyle(row.level)">
            <span>{{ row.board.name }}</span>
            <el-tag size="small" class="slug-tag">/{{ row.board.slug }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="160">
        <template #default="{ row }">
          <el-tag size="small" :type="row.board.isActive === false ? 'danger' : 'success'">
            {{ row.board.isActive === false ? '已停用' : '啟用中' }}
          </el-tag>
          <el-tag size="small" type="info" class="state-tag">
            {{ row.board.isPublic === false ? '僅限內部' : '公開' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="權限" min-width="160">
        <template #default="{ row }">
          <div class="permission">
            <span>發文：{{ describePermission(row.board.allowPost) }}</span>
            <span>回覆：{{ describePermission(row.board.allowComment) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="80">
        <template #default="{ row }">
          {{ row.board.order ?? 0 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320" fixed="right">
        <template #default="{ row }">
          <el-button
            size="small"
            @click="moveBoard(row, 'up')"
            :disabled="!canMove(row, 'up') || loading"
          >
            上移
          </el-button>
          <el-button
            size="small"
            @click="moveBoard(row, 'down')"
            :disabled="!canMove(row, 'down') || loading"
          >
            下移
          </el-button>
          <el-button size="small" type="primary" @click="openEditDialog(row.board)">
            編輯
          </el-button>
          <el-button
            size="small"
            type="warning"
            :loading="actionLoading[row.board.id]"
            @click="toggleActive(row.board)"
          >
            {{ row.board.isActive === false ? '啟用' : '停用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else-if="!loading" description="目前尚未建立任何看板" />

    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'create' ? '新增看板' : '編輯看板'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="boardFormRef" :model="boardForm" :rules="formRules" label-width="110px">
        <el-form-item label="名稱" prop="name">
          <el-input v-model="boardForm.name" placeholder="看板名稱" maxlength="30" />
        </el-form-item>
        <el-form-item label="Slug" prop="slug">
          <el-input v-model="boardForm.slug" placeholder="URL slug（例如 sports-news）" maxlength="60" />
        </el-form-item>
        <el-form-item label="父層看板" prop="parentId">
          <el-select v-model="boardForm.parentId" placeholder="選擇父層（可留空）" clearable filterable>
            <el-option
              v-for="option in parentOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否公開" prop="isPublic">
          <el-switch v-model="boardForm.isPublic" />
        </el-form-item>
        <el-form-item label="發文權限" prop="allowPost">
          <el-select v-model="boardForm.allowPost">
            <el-option v-for="opt in permissionOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="回覆權限" prop="allowComment">
          <el-select v-model="boardForm.allowComment">
            <el-option v-for="opt in permissionOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="boardForm.description" type="textarea" :rows="3" placeholder="簡短描述" />
        </el-form-item>
        <el-form-item label="圖示 URL" prop="icon">
          <el-input v-model="boardForm.icon" placeholder="看板圖示 URL" />
        </el-form-item>
        <el-form-item label="主題色" prop="color">
          <el-input v-model="boardForm.color" placeholder="#FF5722" maxlength="7" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formSubmitting" @click="submitBoardForm">
          {{ formMode === 'create' ? '建立' : '儲存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { adminAPI } from '../../api/admin';
import { forumAPI } from '../../api/forum';
import type { AdminForumBoard, ForumBoard, ForumBoardPayload } from '../../api/types';

interface FlattenedBoardRow {
  board: AdminForumBoard;
  level: number;
  parentId: number | null;
}

type MoveDirection = 'up' | 'down';

const enableAdminBoardList = import.meta.env.VITE_ENABLE_ADMIN_BOARD_LIST === 'true';

const loading = ref(false);
const boards = ref<AdminForumBoard[]>([]);
const adminBoardsEndpointAvailable = ref(enableAdminBoardList);
const boardsFallbackNotified = ref(false);
const dialogVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const formSubmitting = ref(false);
const boardFormRef = ref<FormInstance>();
const actionLoading = reactive<Record<number, boolean>>({});
const boardOverrides = reactive<Record<number, Partial<AdminForumBoard>>>({});
const emit = defineEmits<{ (e: 'refresh'): void }>();

const boardForm = reactive<ForumBoardPayload & { id?: number | null }>(getEmptyForm());

const formRules: FormRules = {
  name: [{ required: true, message: '請輸入看板名稱', trigger: 'blur' }],
  slug: [
    { required: true, message: '請輸入看板 slug', trigger: 'blur' },
    {
      pattern: /^[a-z0-9-]+$/,
      message: '僅能使用小寫英文字母、數字與連字符 (-)',
      trigger: 'blur',
    },
  ],
};

const permissionOptions = [
  { label: '所有人', value: 'all' },
  { label: '僅限專家', value: 'experts' },
  { label: '僅限管理員', value: 'admins' },
  { label: '不開放', value: 'none' },
];

const boardRows = computed<FlattenedBoardRow[]>(() => {
  return flattenBoards(boards.value);
});

const rowKey = (row: FlattenedBoardRow) => row.board.id;

const getRowClass = ({ row }: { row: FlattenedBoardRow }) => {
  return row.board.isActive === false ? 'board-row-disabled' : '';
};

const parentOptions = computed(() => {
  const blockedIds = collectBlockedParentIds(boardForm.id);
  return boardRows.value
    .filter((row) => !blockedIds.has(row.board.id))
    .map((row) => ({
      label: `${'﹂'.repeat(row.level)}${row.level ? ' ' : ''}${row.board.name}`,
      value: row.board.id,
    }));
});

function getEmptyForm(): ForumBoardPayload & { id?: number | null } {
  return {
    id: null,
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '',
    parentId: null,
    allowPost: 'all',
    allowComment: 'all',
    isPublic: true,
    isActive: true,
  };
}

function describePermission(value?: string) {
  switch (value) {
    case 'admins':
      return '管理員';
    case 'experts':
      return '專家';
    case 'none':
      return '不開放';
    default:
      return '所有人';
  }
}

function getIndentStyle(level: number) {
  return {
    paddingLeft: `${level * 24}px`,
  };
}

function flattenBoards(list: AdminForumBoard[], level = 0, parentId: number | null = null) {
  const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const result: FlattenedBoardRow[] = [];
  for (const board of sorted) {
    result.push({ board, level, parentId });
    if (board.children?.length) {
      result.push(...flattenBoards(board.children, level + 1, board.id));
    }
  }
  return result;
}

function collectBlockedParentIds(boardId?: number | null) {
  const blocked = new Set<number>();
  if (!boardId) return blocked;
  blocked.add(boardId);
  const current = findBoardById(boardId, boards.value);
  if (!current) return blocked;
  const stack = [...(current.children || [])];
  while (stack.length) {
    const item = stack.shift()!;
    blocked.add(item.id);
    if (item.children?.length) {
      stack.push(...item.children);
    }
  }
  return blocked;
}

function findBoardById(id: number, list: AdminForumBoard[]): AdminForumBoard | undefined {
  for (const board of list) {
    if (board.id === id) return board;
    const child = board.children ? findBoardById(id, board.children) : undefined;
    if (child) return child;
  }
  return undefined;
}

function getSiblingList(parentId: number | null) {
  if (parentId === null || parentId === undefined) {
    return boards.value;
  }
  const parent = findBoardById(parentId, boards.value);
  return parent?.children || [];
}

function canMove(row: FlattenedBoardRow, direction: MoveDirection) {
  const siblings = getSiblingList(row.parentId);
  if (!siblings?.length) return false;
  const index = siblings.findIndex((item) => item.id === row.board.id);
  if (index === -1) return false;
  if (direction === 'up') return index > 0;
  return index < siblings.length - 1;
}

async function moveBoard(row: FlattenedBoardRow, direction: MoveDirection) {
  const siblings = getSiblingList(row.parentId);
  if (!siblings?.length) return;
  const currentIndex = siblings.findIndex((item) => item.id === row.board.id);
  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= siblings.length) return;

  const [moved] = siblings.splice(currentIndex, 1);
  siblings.splice(targetIndex, 0, moved);

  const orders = siblings.map((item, index) => ({ id: item.id, order: index }));

  try {
    await adminAPI.reorderForumBoards(orders);
    ElMessage.success('看板排序已更新');
    await loadBoards();
    emit('refresh');
  } catch (error: any) {
    await loadBoards();
    ElMessage.error(error.response?.data?.message || '更新排序失敗');
  }
}

function openCreateDialog() {
  formMode.value = 'create';
  Object.assign(boardForm, getEmptyForm());
  dialogVisible.value = true;
  nextTick(() => boardFormRef.value?.clearValidate?.());
}

function openEditDialog(board: AdminForumBoard) {
  formMode.value = 'edit';
  Object.assign(boardForm, {
    id: board.id,
    name: board.name,
    slug: board.slug,
    description: board.description || '',
    icon: board.icon || '',
    color: board.color || '',
    parentId: board.parentId ?? null,
    allowPost: board.allowPost || 'all',
    allowComment: board.allowComment || 'all',
    isPublic: board.isPublic !== false,
    isActive: board.isActive !== false,
  });
  dialogVisible.value = true;
  nextTick(() => boardFormRef.value?.clearValidate?.());
}

async function submitBoardForm() {
  if (!boardFormRef.value) return;
  await boardFormRef.value.validate(async (valid) => {
    if (!valid) return;
    formSubmitting.value = true;
    try {
      const payload: ForumBoardPayload = {
        name: boardForm.name,
        slug: boardForm.slug,
        description: boardForm.description,
        icon: boardForm.icon,
        color: boardForm.color,
        parentId: boardForm.parentId ?? null,
        allowPost: boardForm.allowPost,
        allowComment: boardForm.allowComment,
        isPublic: boardForm.isPublic,
        isActive: boardForm.isActive,
      };

      if (formMode.value === 'create') {
        await adminAPI.createForumBoard(payload);
        ElMessage.success('看板已建立');
      } else if (boardForm.id) {
        await adminAPI.updateForumBoard(boardForm.id, payload);
        ElMessage.success('看板已更新');
      }

      dialogVisible.value = false;
      await loadBoards();
      emit('refresh');
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '儲存失敗');
    } finally {
      formSubmitting.value = false;
    }
  });
}

async function toggleActive(board: AdminForumBoard) {
  actionLoading[board.id] = true;
  try {
    let updatedStatus = true;
    if (board.isActive === false) {
      await adminAPI.updateForumBoard(board.id, { isActive: true });
      ElMessage.success('看板已啟用');
      updatedStatus = true;
    } else {
      await ElMessageBox.confirm('確定要停用此看板？停用後將從前台隱藏。', '停用確認', {
        confirmButtonText: '停用',
        cancelButtonText: '取消',
        type: 'warning',
      });
      await adminAPI.deleteForumBoard(board.id);
      ElMessage.success('看板已停用');
      updatedStatus = false;
    }

    if (!adminBoardsEndpointAvailable.value) {
      updateBoardOverride(board.id, { isActive: updatedStatus });
    }

    await loadBoards();
    emit('refresh');
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.response?.data?.message || '操作失敗');
    }
  } finally {
    actionLoading[board.id] = false;
  }
}

async function loadBoards() {
  loading.value = true;
  try {
    if (!adminBoardsEndpointAvailable.value) {
      await loadBoardsFromPublicAPI(!boardsFallbackNotified.value);
      return;
    }

    const response = await adminAPI.getForumBoards({ includeInactive: true });
    clearAllOverrides();
    boards.value = ensureChildren(response.data || []);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      adminBoardsEndpointAvailable.value = false;
      await loadBoardsFromPublicAPI(true);
    } else {
      ElMessage.error(error.response?.data?.message || '載入看板資料失敗');
      boards.value = [];
    }
  } finally {
    loading.value = false;
  }
}

function ensureChildren(list: AdminForumBoard[]): AdminForumBoard[] {
  return list.map((board) => ({
    ...board,
    children: board.children ? ensureChildren(board.children) : [],
  }));
}

async function loadBoardsFromPublicAPI(showNotice = false) {
  try {
    const response = await forumAPI.getBoards({ includeInactive: true });
    const fallbackBoards = applyOverrides(convertPublicBoards(response.data || []));
    boards.value = ensureChildren(fallbackBoards);
    if ((showNotice || !boardsFallbackNotified.value) && fallbackBoards.length) {
      ElMessage.info('管理端看板列表尚未提供，已改用公開資料顯示');
      boardsFallbackNotified.value = true;
    }
  } catch (fallbackError: any) {
    ElMessage.error(fallbackError.response?.data?.message || '載入看板資料失敗');
    boards.value = [];
  }
}

function convertPublicBoards(list: ForumBoard[]): AdminForumBoard[] {
  return list.map((board) => ({
    ...board,
    isActive: true,
    allowPost: 'all',
    allowComment: 'all',
    children: board.children ? convertPublicBoards(board.children) : [],
  }));
}

function updateBoardOverride(boardId: number, changes: Partial<AdminForumBoard>) {
  const merged = {
    ...(boardOverrides[boardId] || {}),
    ...changes,
  };

  const keys = Object.keys(merged) as Array<keyof typeof merged>;
  if (keys.length === 0) {
    delete boardOverrides[boardId];
    return;
  }

  if (keys.length === 1 && keys[0] === 'isActive' && merged.isActive !== false) {
    delete boardOverrides[boardId];
    return;
  }

  boardOverrides[boardId] = merged;
}

function applyOverrides(list: AdminForumBoard[]): AdminForumBoard[] {
  return list.map((board) => {
    const override = boardOverrides[board.id];
    const children = board.children ? applyOverrides(board.children) : [];
    return {
      ...board,
      ...(override || {}),
      children,
    };
  });
}

function clearAllOverrides() {
  Object.keys(boardOverrides).forEach((key) => {
    delete boardOverrides[Number(key)];
  });
}

onMounted(() => {
  loadBoards();
});
</script>

<style scoped>
.board-manager {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.manager-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.manager-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.subtitle {
  margin: 4px 0 0;
  color: #909399;
  font-size: 13px;
}

.hint {
  margin-bottom: 8px;
}

.board-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slug-tag {
  font-weight: normal;
}

.state-tag {
  margin-left: 8px;
}

.permission {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}

::v-deep(.el-table__row .el-button + .el-button) {
  margin-left: 6px;
}

::v-deep(.board-row-disabled) {
  background-color: #f4f4f5 !important;
  color: #a8abb2;
}

::v-deep(.board-row-disabled .el-tag) {
  filter: grayscale(0.5);
  opacity: 0.7;
}

::v-deep(.el-dialog__body) {
  padding-bottom: 0;
}

::v-deep(.el-dialog__footer) {
  padding-top: 0;
}
</style>

