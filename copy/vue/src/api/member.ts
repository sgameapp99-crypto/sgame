// 會員相關 API

import api from './client';
import type {
  MemberProfileResponse,
  MemberRelationships,
  AvatarUploadResponse,
  UpdateNameRequest,
  UpdateNameResponse,
  MemberSearchParams,
  MemberSearchResponse,
  MemberRecommendationsResponse,
} from './types';

/**
 * 會員 API 模組
 */
export const memberAPI = {
  /**
   * 獲取會員資料
   * GET /api/members/{id}/profile
   */
  async getProfile(memberId: string | number) {
    const response = await api.get<MemberProfileResponse>(`/members/${memberId}/profile`);
    return response.data;
  },

  /**
   * 獲取會員關係
   * GET /api/members/{id}/relationships
   * 需要登入
   */
  async getRelationships(memberId: string | number) {
    const response = await api.get<{ success: boolean; data: MemberRelationships }>(`/members/${memberId}/relationships`);
    return response.data.data;
  },

  /**
   * 搜尋會員
   * GET /api/members/search
   */
  async search(params: MemberSearchParams) {
    const response = await api.get<MemberSearchResponse>('/members/search', {
      params,
    });
    return response.data;
  },

  /**
   * 取得推薦會員清單
   * GET /api/members/recommendations
   */
  async getRecommendations() {
    const response = await api.get<MemberRecommendationsResponse>('/members/recommendations');
    return response.data;
  },

  /**
   * 追蹤會員
   * POST /api/members/{id}/follow
   * 需要登入
   */
  async follow(memberId: string | number) {
    const response = await api.post(`/members/${memberId}/follow`);
    return response;
  },

  /**
   * 取消追蹤會員
   * DELETE /api/members/{id}/follow
   * 需要登入
   */
  async unfollow(memberId: string | number) {
    const response = await api.delete(`/members/${memberId}/follow`);
    return response;
  },

  /**
   * 上傳頭像
   * POST /api/me/avatar
   * 需要登入
   * 
   * @param file 圖片檔案 (最大5MB, JPEG/PNG/WebP)
   */
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<AvatarUploadResponse>('/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * 更新用戶名稱
   * PATCH /api/me/name
   * 需要登入
   * 
   * @param name 新名稱 (2-10字元，僅允許中文和英文字母)
   */
  async updateName(name: string) {
    const response = await api.patch<UpdateNameResponse>('/me/name', { name });
    return response.data;
  },
};

export default memberAPI;


