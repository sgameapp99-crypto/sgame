# 論壇系統 API 整合指南

**文檔版本**: 1.0  
**建立日期**: 2025年10月23日  
**狀態**: ✅ 後端實作完成，可開始前端整合

---

## 📋 目錄

1. [API 總覽](#api-總覽)
2. [重要提醒](#重要提醒)
3. [快速開始](#快速開始)
4. [核心功能](#核心功能)
5. [管理員功能](#管理員功能)
6. [錯誤處理](#錯誤處理)
7. [測試資料](#測試資料)

---

## API 總覽

### 公開 API（無需認證）

- `GET /api/forum/boards` - 取得看板列表
- `GET /api/forum/boards/:slug` - 取得單一看板
- `GET /api/forum/posts` - 取得文章列表
- `GET /api/forum/posts/:id` - 取得文章詳情
- `GET /api/forum/posts/:postId/comments` - 取得回覆列表
- `GET /api/forum/tags` - 取得標籤列表
- `GET /api/forum/tags/:slug` - 取得標籤詳情

### 用戶 API（需要認證）

- `POST /api/forum/posts` - 建立文章
- `PATCH /api/forum/posts/:id` - 更新文章
- `DELETE /api/forum/posts/:id` - 刪除文章
- `POST /api/forum/posts/:postId/comments` - 建立回覆
- `PATCH /api/forum/comments/:id` - 更新回覆
- `DELETE /api/forum/comments/:id` - 刪除回覆
- `POST /api/forum/posts/:id/like` - 按讚文章
- `DELETE /api/forum/posts/:id/like` - 取消按讚文章
- `POST /api/forum/comments/:id/like` - 按讚回覆
- `DELETE /api/forum/comments/:id/like` - 取消按讚回覆
- `POST /api/forum/attachments` - 上傳附件

### 管理員 API（需要管理員權限）

- `POST /api/admin/forum/boards` - 建立看板
- `PATCH /api/admin/forum/boards/:id` - 更新看板
- `DELETE /api/admin/forum/boards/:id` - 刪除看板
- `PATCH /api/admin/forum/boards/reorder` - 調整看板順序
- `GET /api/admin/forum/posts` - 取得所有文章（含已刪除）
- `PATCH /api/admin/forum/posts/:id/sticky` - 置頂/取消置頂文章
- `PATCH /api/admin/forum/posts/:id/lock` - 鎖定/解鎖文章
- `POST /api/admin/forum/posts/:id/restore` - 恢復已刪除文章
- `POST /api/admin/forum/posts/batch-delete` - 批量刪除文章
- `GET /api/admin/forum/stats` - 取得論壇統計

---

## ⚠️ 重要提醒

### 1. 富文本格式

**content 欄位使用 TipTap JSON 格式，前端需自行渲染為 HTML**

後端：
- ✅ 儲存原始 TipTap JSON
- ✅ 自動提取 `contentText`（用於搜尋）
- ❌ **不提供** `contentHtml` 欄位

前端責任：
- 使用 TipTap 編輯器處理 `content` JSON
- 自行渲染為 HTML 顯示
- 確保 XSS 防護

**範例 content 格式**：
```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {"type": "text", "text": "這是一段"},
        {"type": "text", "marks": [{"type": "bold"}], "text": "粗體"},
        {"type": "text", "text": "文字"}
      ]
    }
  ]
}
```

### 2. 附件處理

- 後端使用 Sharp **自動生成縮圖**
- 上傳後會返回 `url` 和 `thumbnailUrl`
- 最大檔案大小：10MB
- 支援格式：JPEG、PNG、WebP、GIF
- **欄位名稱固定為 `file`，請使用 `multipart/form-data` 上傳**

### 3. contentText 欄位

- `contentText` 是後端自動從 TipTap JSON 提取的純文字
- 用於全文搜尋
- **前端不需要處理此欄位**

---

## 快速開始

### 1. 安裝依賴（前端）

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit
# 或
npm install @tiptap/react @tiptap/starter-kit
```

### 2. API 服務函數

**檔案**: `src/api/forum.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/forum',
  withCredentials: true,
});

export const forumAPI = {
  // 看板
  getBoards: () => api.get('/boards'),
  getBoard: (slug: string) => api.get(`/boards/${slug}`),

  // 文章
  getPosts: (params?: {
    page?: number;
    size?: number;
    boardSlug?: string;
    boardId?: number;
    sort?: 'latestReply' | 'latestPost' | 'popular';
    sticky?: boolean;
  }) => api.get('/posts', { params }),

  getPost: (id: number) => api.get(`/posts/${id}`),

  createPost: (data: {
    boardId: number;
    title: string;
    content: TipTapDoc;
    attachmentIds?: number[];
    tagIds?: number[];
    status?: 'draft' | 'published';
  }) => api.post('/posts', data),

  updatePost: (id: number, data: {
    title?: string;
    content?: TipTapDoc;
    attachmentIds?: number[];
    tagIds?: number[];
  }) => api.patch(`/posts/${id}`, data),

  deletePost: (id: number, reason?: string) =>
    api.delete(`/posts/${id}`, { data: { reason } }),

  // 回覆
  getComments: (postId: number, params?: { page?: number; size?: number }) =>
    api.get(`/posts/${postId}/comments`, { params }),

  createComment: (postId: number, data: { content: TipTapDoc; parentId?: number }) =>
    api.post(`/posts/${postId}/comments`, data),

  updateComment: (id: number, content: TipTapDoc) =>
    api.patch(`/comments/${id}`, { content }),

  deleteComment: (id: number, reason?: string) =>
    api.delete(`/comments/${id}`, { data: { reason } }),

  // 按讚
  likePost: (id: number) => api.post(`/posts/${id}/like`),
  unlikePost: (id: number) => api.delete(`/posts/${id}/like`),
  likeComment: (id: number) => api.post(`/comments/${id}/like`),
  unlikeComment: (id: number) => api.delete(`/comments/${id}/like`),

  // 附件
  uploadAttachment: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 標籤
  getTags: (params?: { popular?: boolean; limit?: number }) =>
    api.get('/tags', { params }),

  getTag: (slug: string) => api.get(`/tags/${slug}`),
};
```

### 3. TypeScript 類型定義

**檔案**: `src/api/types.ts`

```typescript
export interface TipTapDoc {
  type: 'doc';
  content: TipTapNode[];
}

export interface TipTapNode {
  type?: string;
  text?: string;
  content?: TipTapNode[];
  marks?: Array<Record<string, unknown>>;
  attrs?: Record<string, unknown>;
}

export interface ForumBoard {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount: number;
  children?: ForumBoard[];
}

export interface ForumPost {
  id: number;
  title: string;
  contentPreview?: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  board: {
    id: number;
    name: string;
    slug: string;
  };
  isSticky: boolean;
  isLocked: boolean;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  lastCommentAt?: string;
  lastCommentUser?: {
    id: number;
    name: string;
  };
}

export interface ForumPostDetail extends ForumPost {
  content: TipTapDoc;
  isLikedByMe: boolean;
  attachments: ForumAttachment[];
  tags: ForumTag[];
}

export interface ForumComment {
  id: number;
  postId: number;
  content: TipTapDoc;
  contentText?: string; // 純文字快取
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  floor: number;
  likeCount: number;
  isLikedByMe: boolean;
  parentId?: number;
  replies?: ForumComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumAttachment {
  id: number;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface ForumTag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}
```

---

## 核心功能

### 1. 顯示看板列表

```typescript
// 取得所有看板
const { data } = await forumAPI.getBoards();
console.log(data.data); // ForumBoard[]
```

### 2. 顯示文章列表

```typescript
// 取得特定看板的文章
const { data } = await forumAPI.getPosts({
  boardSlug: 'sports-betting',
  page: 1,
  size: 20,
  sort: 'latestReply'
});

console.log(data.data); // ForumPost[]
console.log(data.pagination); // { page, size, total, totalPages }
```

### 3. 建立文章（需要認證）

```typescript
// 1. 先上傳附件（如果有）
const attachment = await forumAPI.uploadAttachment(file);
const attachmentId = attachment.data.data.id;

// 2. 建立文章
const postData = {
  boardId: 1,
  title: '我的文章標題',
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '文章內容' }
        ]
      }
    ]
  },
  attachmentIds: [attachmentId],
  tagIds: [1, 2],
  status: 'published'
};

const { data } = await forumAPI.createPost(postData);
console.log(data.data.id); // 新建立的文章 ID
```

### 4. 顯示文章詳情與回覆

```typescript
// 取得文章
const postResponse = await forumAPI.getPost(123);
const post = postResponse.data.data;

// 取得回覆
const commentsResponse = await forumAPI.getComments(123, { page: 1, size: 50 });
const comments = commentsResponse.data.data;
```

### 5. 按讚功能

```typescript
// 按讚文章
await forumAPI.likePost(123);

// 取消按讚
await forumAPI.unlikePost(123);

// 按讚回覆
await forumAPI.likeComment(456);
```

---

## 管理員功能

### 管理員 API 服務

**檔案**: `src/api/admin.ts`

```typescript
import axios from 'axios';

const adminAPI = axios.create({
  baseURL: '/api/admin/forum',
  withCredentials: true,
});

export const forumAdminAPI = {
  // 看板管理
  createBoard: (data: any) => adminAPI.post('/boards', data),
  updateBoard: (id: number, data: any) => adminAPI.patch(`/boards/${id}`, data),
  deleteBoard: (id: number) => adminAPI.delete(`/boards/${id}`),
  reorderBoards: (orders: Array<{ id: number; order: number }>) =>
    adminAPI.patch('/boards/reorder', { orders }),

  // 文章管理
  getAdminPosts: (params?: {
    page?: number;
    size?: number;
    boardId?: number;
    authorId?: number;
    status?: string;
    isDeleted?: boolean;
    startDate?: string;
    endDate?: string;
    keyword?: string;
  }) => adminAPI.get('/posts', { params }),

  stickyPost: (id: number, isSticky: boolean) =>
    adminAPI.patch(`/posts/${id}/sticky`, { isSticky }),

  lockPost: (id: number, isLocked: boolean, reason?: string) =>
    adminAPI.patch(`/posts/${id}/lock`, { isLocked, reason }),

  restorePost: (id: number) => adminAPI.post(`/posts/${id}/restore`),

  batchDeletePosts: (postIds: number[], reason?: string) =>
    adminAPI.post('/posts/batch-delete', { postIds, reason }),

  // 統計
  getForumStats: (params?: { startDate?: string; endDate?: string }) =>
    adminAPI.get('/stats', { params }),
};
```

---

## 錯誤處理

### 標準錯誤格式

```json
{
  "success": false,
  "message": "錯誤訊息",
  "code": "ERROR_CODE"
}
```

### 常見錯誤代碼

| Code | 說明 | HTTP Status |
|------|------|-------------|
| `BOARD_NOT_FOUND` | 看板不存在 | 404 |
| `POST_NOT_FOUND` | 文章不存在 | 404 |
| `COMMENT_NOT_FOUND` | 回覆不存在 | 404 |
| `TAG_NOT_FOUND` | 標籤不存在 | 404 |
| `MISSING_FIELDS` | 缺少必填欄位 | 400 |
| `MISSING_CONTENT` | 缺少回覆內容 | 400 |
| `FORBIDDEN` | 無權限操作 | 403 |
| `POST_LOCKED` | 文章已鎖定 | 403 |
| `ALREADY_LIKED` | 已經按過讚 | 409 |
| `NOT_LIKED` | 尚未按讚 | 409 |
| `FILE_TOO_LARGE` | 檔案太大 | 413 |
| `INVALID_FILE_TYPE` | 不支援的檔案格式 | 415 |

### 錯誤處理範例

```typescript
try {
  await forumAPI.createPost(postData);
} catch (error: any) {
  const { code, message } = error.response?.data || {};
  
  switch (code) {
    case 'BOARD_NOT_FOUND':
      alert('看板不存在，請重新選擇');
      break;
    case 'MISSING_FIELDS':
      alert('請填寫所有必填欄位');
      break;
    default:
      alert(message || '操作失敗，請稍後再試');
  }
}
```

---

## 測試資料

### 預設看板

後端已初始化以下看板：

| ID | slug | name | description |
|----|------|------|-------------|
| 1 | `announcements` | 公告區 | 系統公告與更新 |
| 2 | `sports-betting` | 運彩討論 | 運動彩券討論專區 |
| 3 | `match-analysis` | 賽事分析 | 深度賽事分析與預測 |
| 4 | `newbie-guide` | 新手教學 | 新手入門指南 |
| 5 | `off-topic` | 閒聊水區 | 輕鬆聊天區 |

### 測試流程

1. 取得看板列表：`GET /api/forum/boards`
2. 建立文章：`POST /api/forum/posts`
3. 查看文章：`GET /api/forum/posts/:id`
4. 建立回覆：`POST /api/forum/posts/:postId/comments`
5. 按讚文章：`POST /api/forum/posts/:id/like`

### 測試腳本

後端提供了測試腳本：`/home/gogofire1774/test-forum-api.sh`

---

## 常見問題 FAQ

### Q1: 為什麼後端不返回 contentHtml？

**A**: 為了讓前端完全控制渲染邏輯，避免 XSS 風險，並確保富文本編輯器的一致性。前端使用 TipTap 可以輕鬆渲染 JSON 格式。

### Q2: 附件上傳失敗怎麼辦？

**A**: 檢查：
1. 檔案大小是否超過 10MB
2. 檔案格式是否為 JPEG、PNG、WebP 或 GIF
3. 是否已登入（需要 Authorization header）

### Q3: 如何判斷用戶是否有權限編輯文章？

**A**: 文章詳情 API 會返回 `author.id`，前端比對當前登入用戶 ID 即可。管理員始終有權限。

### Q4: 按讚狀態如何顯示？

**A**: 文章詳情和回覆列表都會包含 `isLikedByMe` 欄位（需要登入）。

### Q5: contentText 是什麼？

**A**: 後端自動從 TipTap JSON 提取的純文字，用於全文搜尋。**前端不需要處理**。

---

## 聯絡資訊

如有任何問題或需要調整，請隨時討論！

**後端狀態**: ✅ 已完成實作與測試  
**前端可開始整合**: ✅ 是  
**文檔版本**: 1.0


