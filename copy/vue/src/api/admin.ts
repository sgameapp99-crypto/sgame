/**
 * 管理員 API 服務
 */

import api from './client';
import type {
  AdminForumBoard,
  AdminForumPost,
  AdminGame,
  AdminPrediction,
  AdminStats,
  AdminStatsResponse,
  AdminPredictionsResponse,
  AdminGamesResponse,
  AdminForumBoardsResponse,
  ForumBoardPayload,
  ForumBoardOrderItem,
  ForumAdminPostsResponse,
  ForumStatsResponse,
  GameResultUpdate,
  CalculateResultsRequest,
  CalculateResultsResponse,
  AlliancesResponse,
  ApiResponse,
} from './types';

/**
 * 管理員 API 模組
 */
export const adminAPI = {
  // ==================== 賽事管理 ====================

  /**
   * 建立賽事
   * POST /api/admin/games
   */
  async createGame(gameData: Partial<AdminGame>): Promise<ApiResponse<{ gameId: string }>> {
    const response = await api.post<ApiResponse<{ gameId: string }>>('/admin/games', gameData);
    return response.data;
  },

  /**
   * 更新賽事
   * PATCH /api/admin/games/:id
   */
  async updateGame(gameId: string, updates: Partial<AdminGame>): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(`/admin/games/${gameId}`, updates);
    return response.data;
  },

  /**
   * 刪除賽事
   * DELETE /api/admin/games/:id
   */
  async deleteGame(gameId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/admin/games/${gameId}`);
    return response.data;
  },

  /**
   * 更新賽事結果（支援自動判定預測）
   * PATCH /api/admin/games/:id/result
   */
  async updateGameResult(
    gameId: string,
    resultData: GameResultUpdate
  ): Promise<ApiResponse<AdminGame>> {
    const response = await api.patch<ApiResponse<AdminGame>>(
      `/admin/games/${gameId}/result`,
      resultData
    );
    return response.data;
  },

  /**
   * 取得賽事列表（管理員視角）
   * GET /api/admin/games
   */
  async getGames(params?: {
    allianceId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<AdminGamesResponse> {
    const response = await api.get<AdminGamesResponse>('/admin/games', { params });
    return response.data;
  },

  // ==================== 預測管理 ====================

  /**
   * 批量計算預測結果
   * POST /api/admin/predictions/calculate-results
   */
  async calculatePredictionResults(
    request: CalculateResultsRequest
  ): Promise<CalculateResultsResponse> {
    const response = await api.post<CalculateResultsResponse>(
      '/admin/predictions/calculate-results',
      request
    );
    return response.data;
  },

  /**
   * 查詢預測列表（管理後台）
   * GET /api/admin/predictions
   */
  async getPredictions(params?: {
    userId?: number;
    gameId?: string;
    status?: 'pending' | 'win' | 'lose' | 'cancelled';
    page?: number;
    size?: number;
  }): Promise<AdminPredictionsResponse> {
    const response = await api.get<AdminPredictionsResponse>('/admin/predictions', { params });
    return response.data;
  },

  // ==================== 系統統計 ====================

  /**
   * 取得系統統計
   * GET /api/admin/stats
   */
  async getStats(): Promise<AdminStatsResponse> {
    const response = await api.get<AdminStatsResponse>('/admin/stats');
    return response.data;
  },

  /**
   * 取得聯盟列表
   * GET /api/admin/alliances
   */
  async getAlliances(): Promise<AlliancesResponse> {
    const response = await api.get<AlliancesResponse>('/admin/alliances');
    return response.data;
  },

  // ==================== 論壇管理 ====================

  /**
   * 取得論壇看板列表（含停用看板）
   * GET /api/admin/forum/boards
   */
  async getForumBoards(params?: { includeInactive?: boolean }): Promise<AdminForumBoardsResponse> {
    const response = await api.get<AdminForumBoardsResponse>('/admin/forum/boards', { params });
    return response.data;
  },

  /**
   * 建立論壇看板
   * POST /api/admin/forum/boards
   */
  async createForumBoard(payload: ForumBoardPayload): Promise<ApiResponse<AdminForumBoard>> {
    const response = await api.post<ApiResponse<AdminForumBoard>>('/admin/forum/boards', payload);
    return response.data;
  },

  /**
   * 更新論壇看板
   * PATCH /api/admin/forum/boards/:id
   */
  async updateForumBoard(
    boardId: number,
    payload: Partial<ForumBoardPayload>
  ): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(`/admin/forum/boards/${boardId}`, payload);
    return response.data;
  },

  /**
   * 停用（軟刪除）論壇看板
   * DELETE /api/admin/forum/boards/:id
   */
  async deleteForumBoard(boardId: number): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/admin/forum/boards/${boardId}`);
    return response.data;
  },

  /**
   * 調整看板排序
   * PATCH /api/admin/forum/boards/reorder
   */
  async reorderForumBoards(orders: ForumBoardOrderItem[]): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>('/admin/forum/boards/reorder', { orders });
    return response.data;
  },

  /**
   * 取得所有論壇文章（含已刪除）
   * GET /api/admin/forum/posts
   */
  async getForumPosts(params?: {
    page?: number;
    size?: number;
    boardId?: number;
    authorId?: number;
    status?: 'draft' | 'published' | 'locked' | 'hidden';
    isDeleted?: boolean;
    startDate?: string;
    endDate?: string;
    keyword?: string;
  }): Promise<ForumAdminPostsResponse> {
    const response = await api.get<ForumAdminPostsResponse>('/admin/forum/posts', { params });
    return response.data;
  },

  /**
   * 置頂/取消置頂文章
   * PATCH /api/admin/forum/posts/:id/sticky
   */
  async updateForumPostSticky(postId: number, isSticky: boolean) {
    const response = await api.patch(`/admin/forum/posts/${postId}/sticky`, { isSticky });
    return response.data;
  },

  /**
   * 鎖定/解鎖文章
   * PATCH /api/admin/forum/posts/:id/lock
   */
  async updateForumPostLock(postId: number, isLocked: boolean, reason?: string) {
    const response = await api.patch(`/admin/forum/posts/${postId}/lock`, { isLocked, reason });
    return response.data;
  },

  /**
   * 恢復已刪除文章
   * POST /api/admin/forum/posts/:id/restore
   */
  async restoreForumPost(postId: number) {
    const response = await api.post(`/admin/forum/posts/${postId}/restore`);
    return response.data;
  },

  /**
   * 批量刪除文章
   * POST /api/admin/forum/posts/batch-delete
   */
  async batchDeleteForumPosts(postIds: number[], reason?: string) {
    const response = await api.post('/admin/forum/posts/batch-delete', { postIds, reason });
    return response.data;
  },

  /**
   * 取得論壇統計
   * GET /api/admin/forum/stats
   */
  async getForumStats(params?: { startDate?: string; endDate?: string }): Promise<ForumStatsResponse> {
    const response = await api.get<ForumStatsResponse>('/admin/forum/stats', { params });
    return response.data;
  },
};

export default adminAPI;


