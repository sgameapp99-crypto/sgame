// 認證相關 API

import api from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SessionData,
  VerificationStatusResponse,
  PasswordExpiryStatus,
  ForgotPasswordRequest,
  VerifyResetTokenRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './types';

/**
 * 認證 API 模組
 */
export const authAPI = {
  /**
   * 登入
   * POST /api/auth/login
   */
  async login(data: LoginRequest) {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * 註冊
   * POST /api/auth/register
   */
  async register(data: RegisterRequest) {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * 登出
   * POST /api/auth/logout
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response;
  },

  /**
   * 獲取 Session 狀態
   * GET /api/auth/session
   */
  async getSession() {
    const response = await api.get<SessionData>('/auth/session');
    return response.data;
  },

  /**
   * 發送郵箱驗證碼
   * POST /api/auth/send-verification
   * 需要登入
   */
  async sendVerificationCode() {
    const response = await api.post('/auth/send-verification');
    return response.data;
  },

  /**
   * 驗證郵箱
   * POST /api/auth/verify-email
   * 需要登入
   */
  async verifyEmail(code: string) {
    const response = await api.post('/auth/verify-email', { code });
    return response.data;
  },

  /**
   * 獲取郵箱驗證狀態
   * GET /api/auth/verification-status
   * 需要登入
   */
  async getVerificationStatus() {
    const response = await api.get<VerificationStatusResponse>('/auth/verification-status');
    return response.data;
  },

  /**
   * 忘記密碼 - 發送重設郵件
   * POST /api/auth/forgot-password
   */
  async forgotPassword(data: ForgotPasswordRequest) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * 驗證密碼重設 Token
   * POST /api/auth/verify-reset-token
   */
  async verifyResetToken(data: VerifyResetTokenRequest) {
    const response = await api.post('/auth/verify-reset-token', data);
    return response.data;
  },

  /**
   * 重設密碼
   * POST /api/auth/reset-password
   */
  async resetPassword(data: ResetPasswordRequest) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * 修改密碼
   * POST /api/auth/change-password
   * 需要登入
   */
  async changePassword(data: ChangePasswordRequest) {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  /**
   * 獲取密碼過期狀態
   * GET /api/auth/password-expiry-status
   * 需要登入
   */
  async getPasswordExpiryStatus() {
    const response = await api.get<PasswordExpiryStatus>('/auth/password-expiry-status');
    return response.data;
  },

  /**
   * Google OAuth 登入啟動
   * GET /api/auth/oauth/google/start?redirectUrl=xxx
   * 注意: 開發環境不支援 (私有IP限制)
   */
  getGoogleOAuthUrl(redirectUrl: string = '/member') {
    return `/api/auth/oauth/google/start?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  },
};

export default authAPI;


