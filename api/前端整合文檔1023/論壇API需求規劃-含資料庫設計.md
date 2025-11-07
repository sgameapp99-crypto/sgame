# 論壇系統 API 需求規劃

## 📅 文檔時間
**2025年10月23日**

---

## 📋 目錄

1. [資料庫結構設計](#資料庫結構設計)
2. [API 端點規劃](#api-端點規劃)
3. [前端整合計劃](#前端整合計劃)
4. [實作優先順序](#實作優先順序)

---

## 一、資料庫結構設計

### 設計決策

根據後端團隊建議（參考：`論壇相關討論.md`），採用以下設計：

| 項目 | 決策 | 理由 |
|------|------|------|
| **文章內容儲存** | 富文本 JSON（TipTap/Quill） | 格式豐富、XSS 防護、多端支援、PostgreSQL JSONB 原生支援 |
| **圖片/附件處理** | 獨立附件表 | 更好的管理、可重複使用、清理機制、統計分析 |
| **用戶關聯** | 直接關聯現有用戶表 | 統一用戶系統、單一登入、完整用戶畫像 |
| **看板管理** | 動態管理 | 靈活性高、易於擴展、精準管理、數據驅動 |
| **刪除機制** | 軟刪除 | 資料安全、審計追蹤、法規遵循、內容審查 |

---

### 核心資料表

#### 1. boards（看板）

```sql
CREATE TABLE boards (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  description     TEXT,
  icon            VARCHAR(255),
  color           VARCHAR(20),
  "order"         INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  is_public       BOOLEAN DEFAULT true,
  allow_post      VARCHAR(20) DEFAULT 'all',  -- 'all', 'member', 'admin'
  allow_comment   VARCHAR(20) DEFAULT 'all',
  post_count      INTEGER DEFAULT 0,
  parent_id       INTEGER REFERENCES boards(id),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_boards_slug ON boards(slug);
CREATE INDEX idx_boards_active_order ON boards(is_active, "order");
```

**欄位說明**：
- `slug`: URL 友善的識別碼，如 "sports-betting"
- `parent_id`: 支援子看板結構
- `allow_post/allow_comment`: 權限控制（all=所有人, member=會員, admin=管理員）

---

#### 2. posts（文章）

```sql
CREATE TABLE posts (
  id                SERIAL PRIMARY KEY,
  board_id          INTEGER NOT NULL REFERENCES boards(id),
  author_id         INTEGER NOT NULL REFERENCES users(id),
  title             VARCHAR(255) NOT NULL,
  content           JSONB NOT NULL,           -- 富文本 JSON
  content_text      TEXT,                     -- 純文字（用於搜尋）
  content_html      TEXT,                     -- HTML 快取（選填）
  status            VARCHAR(20) DEFAULT 'published',  -- 'draft', 'published', 'locked', 'hidden'
  is_sticky         BOOLEAN DEFAULT false,    -- 置頂
  is_locked         BOOLEAN DEFAULT false,    -- 鎖定回覆
  view_count        INTEGER DEFAULT 0,
  comment_count     INTEGER DEFAULT 0,
  like_count        INTEGER DEFAULT 0,
  is_deleted        BOOLEAN DEFAULT false,
  deleted_at        TIMESTAMP,
  deleted_by        INTEGER REFERENCES users(id),
  delete_reason     TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),
  last_comment_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_board_active ON posts(board_id, is_deleted, last_comment_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(is_deleted, status);
CREATE INDEX idx_posts_fulltext ON posts USING gin(to_tsvector('chinese', content_text));
```

**富文本 JSON 格式範例**（TipTap）：
```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "這是一段" },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "粗體" },
        { "type": "text", "text": "文字" }
      ]
    },
    {
      "type": "image",
      "attrs": {
        "src": "https://example.com/image.jpg",
        "alt": "描述"
      }
    }
  ]
}
```

---

#### 3. comments（回覆）

```sql
CREATE TABLE comments (
  id                SERIAL PRIMARY KEY,
  post_id           INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id         INTEGER NOT NULL REFERENCES users(id),
  content           TEXT NOT NULL,
  parent_id         INTEGER REFERENCES comments(id),  -- 回覆某則留言
  floor             INTEGER NOT NULL,                 -- 樓層號碼
  like_count        INTEGER DEFAULT 0,
  is_deleted        BOOLEAN DEFAULT false,
  deleted_at        TIMESTAMP,
  deleted_by        INTEGER REFERENCES users(id),
  delete_reason     TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, is_deleted, floor);
CREATE INDEX idx_comments_author ON comments(author_id);
```

---

#### 4. attachments（附件）

```sql
CREATE TABLE attachments (
  id                SERIAL PRIMARY KEY,
  post_id           INTEGER REFERENCES posts(id) ON DELETE CASCADE,  -- 可為 null（暫存）
  user_id           INTEGER NOT NULL REFERENCES users(id),
  filename          VARCHAR(255) NOT NULL,
  mime_type         VARCHAR(100) NOT NULL,
  size              INTEGER NOT NULL,         -- bytes
  url               VARCHAR(500) NOT NULL,
  thumbnail_url     VARCHAR(500),
  width             INTEGER,
  height            INTEGER,
  uploaded_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attachments_post ON attachments(post_id);
CREATE INDEX idx_attachments_user ON attachments(user_id);
```

**使用流程**：
1. 用戶上傳圖片 → 儲存到 `attachments` 表（`post_id` 為 null）→ 返回 URL
2. 編輯時文章內容引用 `attachment.url`
3. 發布時關聯 `attachments.post_id` 到文章
4. 刪除文章時 CASCADE 自動清理附件

---

#### 5. post_likes（文章按讚）

```sql
CREATE TABLE post_likes (
  id                SERIAL PRIMARY KEY,
  post_id           INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id           INTEGER NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

---

#### 6. comment_likes（回覆按讚）

```sql
CREATE TABLE comment_likes (
  id                SERIAL PRIMARY KEY,
  comment_id        INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id           INTEGER NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);
```

---

#### 7. tags（標籤）

```sql
CREATE TABLE tags (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(50) UNIQUE NOT NULL,
  slug              VARCHAR(50) UNIQUE NOT NULL,
  post_count        INTEGER DEFAULT 0,
  created_at        TIMESTAMP DEFAULT NOW()
);
```

---

#### 8. post_tags（文章標籤關聯）

```sql
CREATE TABLE post_tags (
  post_id           INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id            INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

---

#### 9. forum_user_profiles（論壇用戶資料，選填）

```sql
CREATE TABLE forum_user_profiles (
  user_id           INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  signature         TEXT,
  title             VARCHAR(50),
  post_count        INTEGER DEFAULT 0,
  comment_count     INTEGER DEFAULT 0,
  reputation        INTEGER DEFAULT 0
);
```

---

### 資料表關聯圖

```
users (現有)
  ├── posts (1:N)
  ├── comments (1:N)
  ├── attachments (1:N)
  ├── post_likes (1:N)
  ├── comment_likes (1:N)
  └── forum_user_profiles (1:1)

boards
  ├── posts (1:N)
  └── children boards (1:N, self-reference)

posts
  ├── comments (1:N, CASCADE DELETE)
  ├── attachments (1:N, CASCADE DELETE)
  ├── post_likes (1:N, CASCADE DELETE)
  └── post_tags (N:M via post_tags)

comments
  ├── replies (1:N, self-reference)
  └── comment_likes (1:N, CASCADE DELETE)

tags
  └── posts (N:M via post_tags)
```

---

## 二、API 端點規劃

### 2.1 公開 API

#### 看板相關

##### GET /api/forum/boards
取得看板列表

**查詢參數**：
- `includeInactive` (boolean): 是否包含未啟用的看板（管理員用）

**回應**：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "運彩版",
      "slug": "sports-betting",
      "description": "運彩討論區",
      "icon": "https://...",
      "color": "#FF5722",
      "postCount": 1000,
      "children": [
        {
          "id": 2,
          "name": "NBA 討論",
          "slug": "nba",
          "postCount": 500
        }
      ]
    }
  ]
}
```

##### GET /api/forum/boards/:slug
取得看板詳情

---

#### 文章相關

##### GET /api/forum/posts
取得文章列表

**查詢參數**：
- `page` (number, default: 1): 頁碼
- `size` (number, default: 20): 每頁筆數
- `boardSlug` (string): 看板 slug 篩選
- `boardId` (number): 看板 ID 篩選
- `sort` (string, default: 'latestReply'): 排序方式
  - `latestReply`: 最新回覆
  - `latestPost`: 最新發文
  - `popular`: 熱門（瀏覽數 + 按讚數）
- `sticky` (boolean): 只顯示置頂文章

**回應**：
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "title": "今日賽事分析",
      "contentPreview": "文章預覽（前200字）",
      "author": {
        "id": 456,
        "name": "運彩達人",
        "avatar": "https://..."
      },
      "board": {
        "id": 1,
        "name": "運彩版",
        "slug": "sports-betting"
      },
      "isSticky": false,
      "isLocked": false,
      "viewCount": 100,
      "commentCount": 5,
      "likeCount": 10,
      "createdAt": "2025-10-23T10:00:00Z",
      "updatedAt": "2025-10-23T12:00:00Z",
      "lastCommentAt": "2025-10-23T12:00:00Z",
      "lastCommentUser": {
        "id": 789,
        "name": "回覆者"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

##### GET /api/forum/posts/:id
取得單一文章（含完整內容）

**回應**：
```json
{
  "success": true,
  "data": {
    "id": 123,
    "title": "今日賽事分析",
    "content": { /* 富文本 JSON */ },
    "contentHtml": "<p>文章內容 HTML</p>",
    "author": {
      "id": 456,
      "name": "運彩達人",
      "avatar": "https://...",
      "title": "資深會員"
    },
    "board": {
      "id": 1,
      "name": "運彩版",
      "slug": "sports-betting"
    },
    "isSticky": false,
    "isLocked": false,
    "viewCount": 100,
    "commentCount": 5,
    "likeCount": 10,
    "isLikedByMe": false,
    "attachments": [
      {
        "id": 1,
        "url": "https://...",
        "thumbnailUrl": "https://...",
        "filename": "image.jpg",
        "mimeType": "image/jpeg",
        "size": 102400
      }
    ],
    "tags": [
      { "id": 1, "name": "NBA", "slug": "nba" }
    ],
    "createdAt": "2025-10-23T10:00:00Z",
    "updatedAt": "2025-10-23T12:00:00Z"
  }
}
```

##### POST /api/forum/posts
建立文章（需登入）

**請求體**：
```json
{
  "boardId": 1,
  "title": "文章標題",
  "content": { /* 富文本 JSON */ },
  "attachmentIds": [1, 2],  // 已上傳的附件 ID
  "tagIds": [1, 2],
  "status": "published"  // 'draft' or 'published'
}
```

**回應**：
```json
{
  "success": true,
  "message": "文章發表成功",
  "data": {
    "id": 123,
    "title": "文章標題",
    "createdAt": "2025-10-23T10:00:00Z"
  }
}
```

##### PATCH /api/forum/posts/:id
更新文章（需作者或管理員）

**請求體**：
```json
{
  "title": "新標題",
  "content": { /* 富文本 JSON */ },
  "attachmentIds": [1, 2],
  "tagIds": [1, 2]
}
```

##### DELETE /api/forum/posts/:id
刪除文章（軟刪除，需作者或管理員）

**請求體**（選填）：
```json
{
  "reason": "違反社群規範"
}
```

---

#### 回覆相關

##### GET /api/forum/posts/:postId/comments
取得文章回覆列表

**查詢參數**：
- `page` (number, default: 1)
- `size` (number, default: 50)

**回應**：
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "postId": 123,
      "content": "回覆內容",
      "author": {
        "id": 456,
        "name": "回覆者",
        "avatar": "https://..."
      },
      "floor": 1,
      "likeCount": 5,
      "isLikedByMe": false,
      "parentId": null,
      "replies": [
        {
          "id": 790,
          "content": "回覆的回覆",
          "author": { "id": 457, "name": "另一位" },
          "floor": 2,
          "createdAt": "2025-10-23T11:05:00Z"
        }
      ],
      "createdAt": "2025-10-23T11:00:00Z",
      "updatedAt": "2025-10-23T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 50,
    "total": 100
  }
}
```

##### POST /api/forum/posts/:postId/comments
新增回覆（需登入）

**請求體**：
```json
{
  "content": "回覆內容",
  "parentId": null  // 如果是回覆某則留言，填入該留言 ID
}
```

##### PATCH /api/forum/comments/:id
編輯回覆（需作者或管理員）

**請求體**：
```json
{
  "content": "新的回覆內容"
}
```

##### DELETE /api/forum/comments/:id
刪除回覆（軟刪除，需作者或管理員）

---

#### 按讚相關

##### POST /api/forum/posts/:id/like
按讚文章（需登入）

**回應**：
```json
{
  "success": true,
  "message": "已按讚",
  "likeCount": 11
}
```

##### DELETE /api/forum/posts/:id/like
取消按讚文章

##### POST /api/forum/comments/:id/like
按讚回覆

##### DELETE /api/forum/comments/:id/like
取消按讚回覆

---

#### 附件相關

##### POST /api/forum/attachments
上傳附件（需登入）

**請求**：
- Content-Type: `multipart/form-data`
- 欄位：`file` (檔案)

**回應**：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "url": "https://cdn.example.com/uploads/abc123.jpg",
    "thumbnailUrl": "https://cdn.example.com/uploads/abc123_thumb.jpg",
    "filename": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "width": 1920,
    "height": 1080
  }
}
```

---

#### 標籤相關

##### GET /api/forum/tags
取得標籤列表

**查詢參數**：
- `popular` (boolean): 只顯示熱門標籤（postCount > 0）
- `limit` (number): 限制數量

**回應**：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "NBA",
      "slug": "nba",
      "postCount": 500
    }
  ]
}
```

##### GET /api/forum/tags/:slug
取得標籤詳情及相關文章

---

### 2.2 管理員 API

#### 看板管理

##### POST /api/admin/forum/boards
建立看板（需管理員）

**請求體**：
```json
{
  "name": "新看板",
  "slug": "new-board",
  "description": "看板描述",
  "icon": "https://...",
  "color": "#FF5722",
  "parentId": null,
  "allowPost": "all",
  "allowComment": "all",
  "isPublic": true
}
```

##### PATCH /api/admin/forum/boards/:id
編輯看板

##### DELETE /api/admin/forum/boards/:id
刪除看板（軟刪除，設定 isActive = false）

##### PATCH /api/admin/forum/boards/reorder
調整看板順序

**請求體**：
```json
{
  "orders": [
    { "id": 1, "order": 0 },
    { "id": 2, "order": 1 }
  ]
}
```

---

#### 文章管理

##### GET /api/admin/forum/posts
取得所有文章（管理員視角，含已刪除）

**查詢參數**：
- `page`, `size`: 分頁
- `boardId`: 看板篩選
- `authorId`: 作者篩選
- `status`: 狀態篩選（published/draft/locked/hidden）
- `isDeleted`: 是否已刪除
- `startDate`, `endDate`: 日期範圍（ISO 8601 格式）
- `keyword`: 關鍵字搜尋（標題或內容）

**回應**：
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "title": "文章標題",
      "author": { "id": 456, "name": "作者" },
      "board": { "id": 1, "name": "運彩版" },
      "status": "published",
      "isSticky": false,
      "isLocked": false,
      "isDeleted": false,
      "viewCount": 100,
      "commentCount": 5,
      "likeCount": 10,
      "createdAt": "2025-10-23T10:00:00Z",
      "deletedAt": null,
      "deletedBy": null,
      "deleteReason": null
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 5000
  }
}
```

##### PATCH /api/admin/forum/posts/:id/sticky
置頂/取消置頂文章

**請求體**：
```json
{
  "isSticky": true
}
```

##### PATCH /api/admin/forum/posts/:id/lock
鎖定/解鎖文章（鎖定後無法回覆）

**請求體**：
```json
{
  "isLocked": true,
  "reason": "討論已結束"
}
```

##### POST /api/admin/forum/posts/:id/restore
恢復已刪除的文章

##### POST /api/admin/forum/posts/batch-delete
批量刪除文章

**請求體**：
```json
{
  "postIds": [123, 456, 789],
  "reason": "違反社群規範"
}
```

**回應**：
```json
{
  "success": true,
  "message": "已刪除 3 篇文章",
  "deletedCount": 3
}
```

---

#### 統計資料

##### GET /api/admin/forum/stats
取得論壇統計

**查詢參數**：
- `startDate`, `endDate`: 日期範圍（選填）

**回應**：
```json
{
  "success": true,
  "stats": {
    "totalPosts": 5000,
    "totalComments": 15000,
    "totalUsers": 1000,
    "todayPosts": 50,
    "todayComments": 150,
    "todayNewUsers": 10,
    "topBoards": [
      {
        "boardId": 1,
        "boardName": "運彩版",
        "postCount": 2000,
        "commentCount": 6000
      }
    ],
    "topAuthors": [
      {
        "userId": 456,
        "userName": "運彩達人",
        "postCount": 100,
        "totalLikes": 500
      }
    ],
    "recentDeleted": [
      {
        "postId": 999,
        "title": "已刪除文章",
        "deletedAt": "2025-10-23T09:00:00Z",
        "deletedBy": 1,
        "deleteReason": "違規"
      }
    ]
  }
}
```

---

## 三、前端整合計劃

### 3.1 TypeScript 類型定義

**檔案**：`src/api/types.ts`

```typescript
// 論壇用戶
export interface ForumUser {
  id: number;
  name: string;
  avatar?: string;
  title?: string;
}

// 看板
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

// 文章（列表用）
export interface ForumPost {
  id: number;
  title: string;
  contentPreview?: string;
  author: ForumUser;
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
  lastCommentUser?: ForumUser;
}

// 文章詳情
export interface ForumPostDetail extends ForumPost {
  content: any; // 富文本 JSON
  contentHtml: string;
  isLikedByMe: boolean;
  attachments: ForumAttachment[];
  tags: ForumTag[];
}

// 回覆
export interface ForumComment {
  id: number;
  postId: number;
  content: string;
  author: ForumUser;
  floor: number;
  likeCount: number;
  isLikedByMe: boolean;
  parentId?: number;
  replies?: ForumComment[];
  createdAt: string;
  updatedAt: string;
}

// 附件
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

// 標籤
export interface ForumTag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

// 管理員：文章（含刪除資訊）
export interface AdminForumPost extends ForumPost {
  status: 'draft' | 'published' | 'locked' | 'hidden';
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: number;
  deleteReason?: string;
}

// 管理員：統計
export interface ForumStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  todayPosts: number;
  todayComments: number;
  todayNewUsers: number;
  topBoards: Array<{
    boardId: number;
    boardName: string;
    postCount: number;
    commentCount: number;
  }>;
  topAuthors: Array<{
    userId: number;
    userName: string;
    postCount: number;
    totalLikes: number;
  }>;
  recentDeleted: Array<{
    postId: number;
    title: string;
    deletedAt: string;
    deletedBy: number;
    deleteReason?: string;
  }>;
}

// API 回應
export interface ForumPostsResponse {
  success: boolean;
  data: ForumPost[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface ForumPostDetailResponse {
  success: boolean;
  data: ForumPostDetail;
}

export interface ForumCommentsResponse {
  success: boolean;
  data: ForumComment[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface ForumBoardsResponse {
  success: boolean;
  data: ForumBoard[];
}
```

---

### 3.2 API 服務函數

**檔案**：`src/api/forum.ts`

```typescript
import axios from 'axios';
import type {
  ForumBoardsResponse,
  ForumPostsResponse,
  ForumPostDetailResponse,
  ForumCommentsResponse,
  ForumAttachment,
  ForumTag,
} from './types';

const api = axios.create({
  baseURL: '/api/forum',
  withCredentials: true,
});

export const forumAPI = {
  // 看板
  getBoards: () => api.get<ForumBoardsResponse>('/boards'),
  getBoard: (slug: string) => api.get(`/boards/${slug}`),

  // 文章
  getPosts: (params?: {
    page?: number;
    size?: number;
    boardSlug?: string;
    boardId?: number;
    sort?: 'latestReply' | 'latestPost' | 'popular';
    sticky?: boolean;
  }) => api.get<ForumPostsResponse>('/posts', { params }),

  getPost: (id: number) => api.get<ForumPostDetailResponse>(`/posts/${id}`),

  createPost: (data: {
    boardId: number;
    title: string;
    content: any;
    attachmentIds?: number[];
    tagIds?: number[];
    status?: 'draft' | 'published';
  }) => api.post('/posts', data),

  updatePost: (id: number, data: {
    title?: string;
    content?: any;
    attachmentIds?: number[];
    tagIds?: number[];
  }) => api.patch(`/posts/${id}`, data),

  deletePost: (id: number, reason?: string) =>
    api.delete(`/posts/${id}`, { data: { reason } }),

  // 回覆
  getComments: (postId: number, params?: { page?: number; size?: number }) =>
    api.get<ForumCommentsResponse>(`/posts/${postId}/comments`, { params }),

  createComment: (postId: number, data: { content: string; parentId?: number }) =>
    api.post(`/posts/${postId}/comments`, data),

  updateComment: (id: number, content: string) =>
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
    return api.post<{ success: boolean; data: ForumAttachment }>('/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 標籤
  getTags: (params?: { popular?: boolean; limit?: number }) =>
    api.get<{ success: boolean; data: ForumTag[] }>('/tags', { params }),

  getTag: (slug: string) => api.get(`/tags/${slug}`),
};
```

**檔案**：`src/api/admin.ts`（擴充現有檔案）

```typescript
// 在現有的 adminAPI 物件中新增：

export const adminAPI = {
  // ... 現有的管理員 API ...

  // 論壇看板管理
  createBoard: (data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    parentId?: number;
    allowPost?: string;
    allowComment?: string;
    isPublic?: boolean;
  }) => api.post('/admin/forum/boards', data),

  updateBoard: (id: number, data: any) => api.patch(`/admin/forum/boards/${id}`, data),

  deleteBoard: (id: number) => api.delete(`/admin/forum/boards/${id}`),

  reorderBoards: (orders: Array<{ id: number; order: number }>) =>
    api.patch('/admin/forum/boards/reorder', { orders }),

  // 論壇文章管理
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
  }) => api.get('/admin/forum/posts', { params }),

  stickyPost: (id: number, isSticky: boolean) =>
    api.patch(`/admin/forum/posts/${id}/sticky`, { isSticky }),

  lockPost: (id: number, isLocked: boolean, reason?: string) =>
    api.patch(`/admin/forum/posts/${id}/lock`, { isLocked, reason }),

  restorePost: (id: number) => api.post(`/admin/forum/posts/${id}/restore`),

  batchDeletePosts: (postIds: number[], reason?: string) =>
    api.post('/admin/forum/posts/batch-delete', { postIds, reason }),

  // 論壇統計
  getForumStats: (params?: { startDate?: string; endDate?: string }) =>
    api.get<{ success: boolean; stats: ForumStats }>('/admin/forum/stats', { params }),
};
```

---

### 3.3 前端頁面更新

#### ForumPage.vue 更新重點

```typescript
// 移除
import { loadLegacyForumHtml, parseForum } from '../utils/legacyParser';

// 改用
import { forumAPI } from '../api/forum';

// 載入資料
const loadData = async () => {
  try {
    const [boardsRes, postsRes] = await Promise.all([
      forumAPI.getBoards(),
      forumAPI.getPosts({
        page: currentPage.value,
        boardSlug: selectedBoard.value,
        sort: sortBy.value,
      }),
    ]);
    
    categories.value = boardsRes.data.data;
    posts.value = postsRes.data.data;
    pagination.value = postsRes.data.pagination;
  } catch (error) {
    console.error('載入論壇資料失敗', error);
  }
};
```

#### PostPage.vue 更新重點

```typescript
// 載入文章和回覆
const loadPost = async () => {
  try {
    const [postRes, commentsRes] = await Promise.all([
      forumAPI.getPost(postId),
      forumAPI.getComments(postId, { page: 1, size: 50 }),
    ]);
    
    post.value = postRes.data.data;
    comments.value = commentsRes.data.data;
  } catch (error) {
    console.error('載入文章失敗', error);
  }
};
```

#### AdminPage.vue 新增論壇管理 Tab

在現有的 4 個 Tab 後新增第 5 個 Tab：

```vue
<el-tab-pane label="論壇管理" name="forum">
  <!-- 統計卡片 -->
  <div class="stats-cards">
    <el-card>
      <div class="stat-item">
        <span>總文章數</span>
        <strong>{{ forumStats.totalPosts }}</strong>
      </div>
    </el-card>
    <!-- 更多統計卡片 -->
  </div>

  <!-- 篩選表單 -->
  <el-form :inline="true">
    <el-form-item label="看板">
      <el-select v-model="filters.boardId">
        <el-option label="全部" :value="null" />
        <el-option v-for="board in boards" :key="board.id" :label="board.name" :value="board.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="狀態">
      <el-select v-model="filters.status">
        <el-option label="全部" :value="null" />
        <el-option label="已發布" value="published" />
        <el-option label="草稿" value="draft" />
        <el-option label="已刪除" value="deleted" />
      </el-select>
    </el-form-item>
    <el-form-item label="關鍵字">
      <el-input v-model="filters.keyword" placeholder="搜尋標題或內容" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchPosts">搜尋</el-button>
    </el-form-item>
  </el-form>

  <!-- 批量操作 -->
  <div class="batch-actions">
    <el-button :disabled="!selectedPosts.length" @click="batchDelete">批量刪除</el-button>
    <el-button :disabled="!selectedPosts.length" @click="batchSticky">批量置頂</el-button>
  </div>

  <!-- 文章列表 -->
  <el-table :data="posts" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="title" label="標題" min-width="200" />
    <el-table-column prop="author.name" label="作者" width="120" />
    <el-table-column prop="board.name" label="看板" width="120" />
    <el-table-column label="狀態" width="100">
      <template #default="{ row }">
        <el-tag v-if="row.isSticky" type="warning">置頂</el-tag>
        <el-tag v-if="row.isLocked" type="info">鎖定</el-tag>
        <el-tag v-if="row.isDeleted" type="danger">已刪除</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="viewCount" label="瀏覽" width="80" />
    <el-table-column prop="commentCount" label="回覆" width="80" />
    <el-table-column prop="createdAt" label="發布時間" width="180" />
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="{ row }">
        <el-button size="small" @click="toggleSticky(row)">
          {{ row.isSticky ? '取消置頂' : '置頂' }}
        </el-button>
        <el-button size="small" type="danger" @click="deletePost(row)">刪除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分頁 -->
  <el-pagination
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    @current-change="loadPosts"
  />
</el-tab-pane>
```

---

## 四、實作優先順序

### Phase 1: 核心功能（必須）

1. **資料庫 Schema 建立**
   - 建立所有資料表
   - 設定索引和外鍵
   - 資料遷移腳本

2. **基礎 API**
   - GET /api/forum/boards
   - GET /api/forum/posts
   - GET /api/forum/posts/:id
   - GET /api/forum/posts/:postId/comments

3. **前端整合**
   - 更新 ForumPage.vue
   - 更新 PostPage.vue
   - 移除 legacy 解析邏輯

### Phase 2: 互動功能（重要）

4. **發文和回覆**
   - POST /api/forum/posts
   - POST /api/forum/posts/:postId/comments
   - 附件上傳 API

5. **編輯和刪除**
   - PATCH /api/forum/posts/:id
   - DELETE /api/forum/posts/:id
   - DELETE /api/forum/comments/:id

### Phase 3: 管理功能（重要）

6. **管理員後台**
   - GET /api/admin/forum/posts
   - GET /api/admin/forum/stats
   - PATCH /api/admin/forum/posts/:id/sticky
   - POST /api/admin/forum/posts/batch-delete

7. **前端管理介面**
   - AdminPage.vue 新增論壇管理 Tab
   - 文章列表、篩選、批量操作

### Phase 4: 進階功能（可選）

8. **按讚和互動**
   - POST /api/forum/posts/:id/like
   - POST /api/forum/comments/:id/like

9. **標籤系統**
   - GET /api/forum/tags
   - 文章標籤管理

10. **看板管理**
    - POST /api/admin/forum/boards
    - 動態新增/編輯看板

---

## 五、測試檢查清單

### 後端 API 測試

- [ ] 看板列表正確返回
- [ ] 文章列表支援各種篩選和排序
- [ ] 文章詳情包含完整資訊
- [ ] 發文功能正常（含附件）
- [ ] 回覆功能正常（含樓層計算）
- [ ] 軟刪除正常運作
- [ ] 權限檢查正確（作者/管理員）
- [ ] 管理員 API 正確返回已刪除文章
- [ ] 統計資料準確
- [ ] 批量操作正常

### 前端整合測試

- [ ] 論壇首頁顯示正確
- [ ] 文章列表分頁正常
- [ ] 文章詳情頁顯示完整
- [ ] 發文表單正常運作
- [ ] 回覆功能正常
- [ ] 管理員後台正常顯示
- [ ] 篩選和搜尋功能正常
- [ ] 批量操作正常
- [ ] 錯誤處理正確

### 效能測試

- [ ] 文章列表查詢 < 100ms
- [ ] 文章詳情查詢 < 50ms
- [ ] 全文搜尋效能可接受
- [ ] 附件上傳速度正常

---

## 六、注意事項

### 資料遷移

- 需要將現有 legacy HTML 資料遷移到新資料庫
- 保留文章 ID 對應關係（如果可能）
- 處理圖片 URL 轉換
- 處理用戶名稱對應

### 安全性

- 所有寫入操作需要登入驗證
- 編輯/刪除需要權限檢查（作者或管理員）
- 附件上傳需要檔案類型和大小限制
- 內容需要 XSS 防護
- 防止 SQL Injection（使用 ORM）

### 效能優化

- 文章列表使用分頁
- 熱門文章可以快取
- 附件使用 CDN
- 資料庫查詢優化（善用索引）
- 全文搜尋使用 PostgreSQL GIN 索引

### SEO 優化

- 文章頁面設定適當的 meta 標籤
- 使用語意化 HTML
- 考慮 Server-Side Rendering（如果需要）

---

## 七、後續擴展功能

- 文章草稿自動儲存
- 文章版本歷史
- 用戶訂閱看板/標籤
- 推文/噓文功能
- 文章舉報系統
- 敏感詞過濾
- 用戶聲望系統
- 勳章/成就系統
- 私訊功能
- 通知系統

---

## 附錄：Prisma Schema 範例

```prisma
// 看板
model Board {
  id            Int      @id @default(autoincrement())
  name          String   @db.VarChar(100)
  slug          String   @unique @db.VarChar(100)
  description   String?  @db.Text
  icon          String?  @db.VarChar(255)
  color         String?  @db.VarChar(20)
  order         Int      @default(0)
  isActive      Boolean  @default(true) @map("is_active")
  isPublic      Boolean  @default(true) @map("is_public")
  allowPost     String   @default("all") @map("allow_post") @db.VarChar(20)
  allowComment  String   @default("all") @map("allow_comment") @db.VarChar(20)
  postCount     Int      @default(0) @map("post_count")
  parentId      Int?     @map("parent_id")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  parent        Board?   @relation("BoardHierarchy", fields: [parentId], references: [id])
  children      Board[]  @relation("BoardHierarchy")
  posts         Post[]

  @@index([slug])
  @@index([isActive, order])
  @@map("boards")
}

// 文章
model Post {
  id              Int       @id @default(autoincrement())
  boardId         Int       @map("board_id")
  authorId        Int       @map("author_id")
  title           String    @db.VarChar(255)
  content         Json      @db.JsonB
  contentText     String?   @map("content_text") @db.Text
  contentHtml     String?   @map("content_html") @db.Text
  status          String    @default("published") @db.VarChar(20)
  isSticky        Boolean   @default(false) @map("is_sticky")
  isLocked        Boolean   @default(false) @map("is_locked")
  viewCount       Int       @default(0) @map("view_count")
  commentCount    Int       @default(0) @map("comment_count")
  likeCount       Int       @default(0) @map("like_count")
  isDeleted       Boolean   @default(false) @map("is_deleted")
  deletedAt       DateTime? @map("deleted_at")
  deletedBy       Int?      @map("deleted_by")
  deleteReason    String?   @map("delete_reason") @db.Text
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  lastCommentAt   DateTime  @default(now()) @map("last_comment_at")

  board           Board     @relation(fields: [boardId], references: [id])
  author          User      @relation(fields: [authorId], references: [id])
  deletedByUser   User?     @relation("DeletedPosts", fields: [deletedBy], references: [id])
  comments        Comment[]
  attachments     Attachment[]
  likes           PostLike[]
  tags            PostTag[]

  @@index([boardId, isDeleted, lastCommentAt(sort: Desc)])
  @@index([authorId])
  @@index([isDeleted, status])
  @@map("posts")
}

// 回覆
model Comment {
  id            Int       @id @default(autoincrement())
  postId        Int       @map("post_id")
  authorId      Int       @map("author_id")
  content       String    @db.Text
  parentId      Int?      @map("parent_id")
  floor         Int
  likeCount     Int       @default(0) @map("like_count")
  isDeleted     Boolean   @default(false) @map("is_deleted")
  deletedAt     DateTime? @map("deleted_at")
  deletedBy     Int?      @map("deleted_by")
  deleteReason  String?   @map("delete_reason") @db.Text
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author        User      @relation(fields: [authorId], references: [id])
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[] @relation("CommentReplies")
  likes         CommentLike[]

  @@index([postId, isDeleted, floor])
  @@index([authorId])
  @@map("comments")
}

// 附件
model Attachment {
  id            Int      @id @default(autoincrement())
  postId        Int?     @map("post_id")
  userId        Int      @map("user_id")
  filename      String   @db.VarChar(255)
  mimeType      String   @map("mime_type") @db.VarChar(100)
  size          Int
  url           String   @db.VarChar(500)
  thumbnailUrl  String?  @map("thumbnail_url") @db.VarChar(500)
  width         Int?
  height        Int?
  uploadedAt    DateTime @default(now()) @map("uploaded_at")

  post          Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  user          User     @relation(fields: [userId], references: [id])

  @@index([postId])
  @@index([userId])
  @@map("attachments")
}

// 文章按讚
model PostLike {
  id        Int      @id @default(autoincrement())
  postId    Int      @map("post_id")
  userId    Int      @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])

  @@unique([postId, userId])
  @@map("post_likes")
}

// 回覆按讚
model CommentLike {
  id        Int      @id @default(autoincrement())
  commentId Int      @map("comment_id")
  userId    Int      @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])

  @@unique([commentId, userId])
  @@map("comment_likes")
}

// 標籤
model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique @db.VarChar(50)
  slug      String   @unique @db.VarChar(50)
  postCount Int      @default(0) @map("post_count")
  createdAt DateTime @default(now()) @map("created_at")

  posts     PostTag[]

  @@map("tags")
}

// 文章標籤關聯
model PostTag {
  postId    Int @map("post_id")
  tagId     Int @map("tag_id")

  post      Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag       Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@map("post_tags")
}

// 論壇用戶資料
model ForumUserProfile {
  userId        Int  @id @map("user_id")
  signature     String? @db.Text
  title         String? @db.VarChar(50)
  postCount     Int  @default(0) @map("post_count")
  commentCount  Int  @default(0) @map("comment_count")
  reputation    Int  @default(0)

  user          User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("forum_user_profiles")
}

// 更新 User model（新增關聯）
model User {
  // ... 現有欄位 ...

  // 論壇關聯
  posts             Post[]
  deletedPosts      Post[]   @relation("DeletedPosts")
  comments          Comment[]
  attachments       Attachment[]
  postLikes         PostLike[]
  commentLikes      CommentLike[]
  forumProfile      ForumUserProfile?
}
```

---

**文檔版本**: 1.0  
**建立日期**: 2025年10月23日  
**狀態**: ✅ 待後端確認  
**預計工作量**: 
- 資料庫設計與實作: 2-3 小時
- 核心 API 實作: 5-7 天
- 前端整合: 3-5 天
- 測試與優化: 2-3 天

---

## 聯絡資訊

如有任何問題或需要調整，請隨時討論！










