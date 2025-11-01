import api from './client';
import type {
  ForumBoardsResponse,
  ForumPostsResponse,
  ForumPostDetailResponse,
  ForumCommentsResponse,
  ForumTagsResponse,
  ForumAttachment,
  ForumTag,
  TipTapDoc,
  CommentPayload,
} from './types';

export const forumAPI = {
  // ==================== 看板 ====================
  getBoards(params?: { includeInactive?: boolean }) {
    return api.get<ForumBoardsResponse>('/forum/boards', { params }).then((res) => res.data);
  },

  getBoard(slug: string) {
    return api.get(`/forum/boards/${slug}`).then((res) => res.data);
  },

  // ==================== 文章 ====================
  getPosts(params?: {
    page?: number;
    size?: number;
    boardSlug?: string;
    boardId?: number;
    sort?: 'latestReply' | 'latestPost' | 'popular';
    sticky?: boolean;
  }) {
    return api.get<ForumPostsResponse>('/forum/posts', { params }).then((res) => res.data);
  },

  getPost(id: number) {
    return api.get<ForumPostDetailResponse>(`/forum/posts/${id}`).then((res) => res.data);
  },

  createPost(data: {
    boardId: number;
    title: string;
    content: TipTapDoc;
    attachmentIds?: number[];
    tagIds?: number[];
    status?: 'draft' | 'published';
  }) {
    return api.post('/forum/posts', data).then((res) => res.data);
  },

  updatePost(
    id: number,
    data: {
      title?: string;
      content?: TipTapDoc;
      attachmentIds?: number[];
      tagIds?: number[];
      status?: 'draft' | 'published' | 'locked' | 'hidden';
    },
  ) {
    return api.patch(`/forum/posts/${id}`, data).then((res) => res.data);
  },

  deletePost(id: number, reason?: string) {
    return api.delete(`/forum/posts/${id}`, { data: { reason } }).then((res) => res.data);
  },

  // ==================== 回覆 ====================
  getComments(postId: number, params?: { page?: number; size?: number }) {
    return api
      .get<ForumCommentsResponse>(`/forum/posts/${postId}/comments`, { params })
      .then((res) => res.data);
  },

  createComment(postId: number, data: CommentPayload) {
    return api.post(`/forum/posts/${postId}/comments`, data).then((res) => res.data);
  },

  updateComment(commentId: number, data: { content: TipTapDoc }) {
    return api.patch(`/forum/comments/${commentId}`, data).then((res) => res.data);
  },

  deleteComment(commentId: number, reason?: string) {
    return api.delete(`/forum/comments/${commentId}`, { data: { reason } }).then((res) => res.data);
  },

  // ==================== 按讚 ====================
  likePost(postId: number) {
    return api.post(`/forum/posts/${postId}/like`).then((res) => res.data);
  },

  unlikePost(postId: number) {
    return api.delete(`/forum/posts/${postId}/like`).then((res) => res.data);
  },

  likeComment(commentId: number) {
    return api.post(`/forum/comments/${commentId}/like`).then((res) => res.data);
  },

  unlikeComment(commentId: number) {
    return api.delete(`/forum/comments/${commentId}/like`).then((res) => res.data);
  },

  // ==================== 附件 ====================
  uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post<{ success: boolean; data: ForumAttachment }>(
        '/forum/attachments',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data);
  },

  // ==================== 標籤 ====================
  getTags(params?: { popular?: boolean; limit?: number }) {
    return api.get<ForumTagsResponse>('/forum/tags', { params }).then((res) => res.data);
  },

  getTag(slug: string) {
    return api
      .get<{ success: boolean; data: ForumTag }>(`/forum/tags/${slug}`)
      .then((res) => res.data);
  },
};

export default forumAPI;
