// API 類型定義

// ==================== 通用類型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  statusCode?: number;
}

// ==================== 認證相關 ====================

export interface LoginRequest {
  email: string;
  password: string;
  rememberme?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  redirectUrl?: string;
  passwordExpiry?: PasswordExpiryStatus;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
  needsVerification?: boolean;
}

export interface SessionData {
  loggedIn: boolean;
  userId?: number | string;
  email?: string;
  name?: string;
  emailVerified?: boolean;
  user?: {
    id: number | string;
    email: string;
    name: string;
  };
  passwordExpiry?: PasswordExpiryStatus;
}

export interface VerificationStatusResponse {
  isVerified: boolean;
  email?: string;
  sentAt?: string;
  expiresAt?: string;
}

export interface PasswordExpiryStatus {
  isExpired: boolean;
  isWarning: boolean;
  daysUntilExpiry: number;
  expiresAt?: string;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== 會員相關 ====================

export interface MemberProfile {
  id: number | string;
  email: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  level: string;
  score: number;
  followersCount: number;
  followingCount: number;
  joinedAt?: string;
  bio?: string;
  levelInfo?: LevelInfo;
  levelProgress?: LevelProgress;
}

export interface MemberRelationships {
  isSelf: boolean;
  isFollowing: boolean;
  isMutual: boolean;
}

export interface MemberProfileResponse {
  success: boolean;
  profile: MemberProfile;
  relationships?: MemberRelationships;
}

export interface AvatarUploadResponse {
  success: boolean;
  url: string;
  updatedAt: string;
}

export interface UpdateNameRequest {
  name: string;
}

export interface UpdateNameResponse {
  success: boolean;
  name: string;
  updatedAt: string;
}

// ==================== 等級相關 ====================

export interface LevelInfo {
  code: string;
  name: string;
  nameEn?: string;
  color: string;
  icon: string;
  minScore: number;
  maxScore: number;
  description?: string;
  benefits?: string[];
}

export interface LevelProgress {
  percentage: number;
  currentScore: number;
  levelMinScore: number;
  levelMaxScore: number;
  pointsToNext: number;
}

export interface LevelStats {
  totalMembers: number;
  levelDistribution: {
    [key: string]: number;
  };
  averageScore: number;
}

export interface LevelsResponse {
  success: boolean;
  levels: LevelInfo[];
}

export interface LevelStatsResponse {
  success: boolean;
  stats: LevelStats;
}


