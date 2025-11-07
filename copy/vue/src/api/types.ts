import type { JSONContent } from '@tiptap/vue-3';

// API 類型定義

// ==================== 通用類型 ====================

export interface ApiResponse<T = unknown> {
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
  user?: {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
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
    role?: 'user' | 'admin';
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

export interface MemberSearchParams {
  nickname: string;
  page?: number;
  pageSize?: number;
}

export interface PageMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export interface MemberSearchRelationships {
  isSelf: boolean;
  isFollowing?: boolean;
  canFollow?: boolean;
}

export interface MemberSearchResult {
  id: number;
  name: string;
  avatarUrl?: string | null;
  level: string;
  levelInfo?: LevelInfo;
  score: number;
  followersCount: number;
  followingCount: number;
  joinedAt: string;
  bio?: string | null;
  relationships?: MemberSearchRelationships;
}

export type MemberRecommendationType = 'accuracy' | 'level';

export interface MemberRecommendationMeta {
  type: MemberRecommendationType;
  accuracy?: number;
  winCount?: number;
  totalPredictions?: number;
  reason?: string;
}

export interface MemberRecommendation extends MemberSearchResult {
  recommendation?: MemberRecommendationMeta;
}

export interface MemberSearchResponse {
  success: boolean;
  keyword: string;
  results: MemberSearchResult[];
  pagination: PageMeta;
}

export interface MemberRecommendationsResponse {
  success: boolean;
  recommendations: MemberRecommendation[];
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

// ==================== 管理員相關 ====================

export interface AdminGame {
  id: string;
  allianceId: number;
  gameDate: string;
  gameTime: string;
  homeTeamName: string;
  awayTeamName: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  gameMode: 'international' | 'taiwan';
  finalScoreHome?: number;
  finalScoreAway?: number;
  internationalOdds?: {
    spread?: {
      home?: { line: string; odds: string };
      away?: { line: string; odds: string };
    };
    total?: {
      over?: { line: string; odds: string };
      under?: { line: string; odds: string };
    };
    moneyline?: {
      home?: { odds: string };
      away?: { odds: string };
    };
  };
  taiwanOdds?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPrediction {
  id: number;
  userId: number;
  userName?: string;
  gameId: string;
  predictionType: string;
  selection: string;
  odds: string;
  price: number;
  status: 'pending' | 'win' | 'lose' | 'cancelled';
  purchaseCount: number;
  createdAt: string;
}

export interface AdminStats {
  users: {
    total: number;
  };
  games: {
    total: number;
    scheduled: number;
    live: number;
    finished: number;
  };
  predictions: {
    total: number;
    pending: number;
    win: number;
    lose: number;
  };
  purchases?: {
    total: number;
  };
  coins: {
    totalBalance: number;
    totalEarned: number;
    totalSpent: number;
    transactions: number;
  };
}

export interface GameResultUpdate {
  finalScoreHome: number;
  finalScoreAway: number;
  autoCalculate?: boolean;
}

export interface CalculateResultsRequest {
  gameIds?: string[];
  force?: boolean;
}

export interface CalculateResultsResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      processed: number;
      wins: number;
      loses: number;
      cancelled: number;
      errors: number;
    };
    details: {
      totalProcessed: number;
      wins: number;
      loses: number;
      cancelled: number;
      errors: number;
    };
  };
}

export interface AdminStatsResponse {
  success: boolean;
  stats: AdminStats;
}

export interface AdminPredictionsResponse {
  success: boolean;
  data: AdminPrediction[];
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
}

export interface AdminGamesResponse {
  success: boolean;
  data: AdminGame[];
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
}

export interface Alliance {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  sportType: string;
}

export interface AlliancesResponse {
  success: boolean;
  data: Alliance[];
}

// ==================== 即時比分 ====================

export type LivescoreStatus = 'scheduled' | 'live' | 'finished';

export interface LivescoreQueryParams {
  status?: LivescoreStatus;
  allianceId?: number;
  leagueCode?: string;
  soccerLeagueId?: number;
  date?: string; // YYYY-MM-DD
  page?: number;
  size?: number;
}

export interface LivescoreTeam {
  id: number;
  name: string;
  pitcher?: string | null;
}

export interface LivescoreScoreboardPeriod {
  label: string;
  home: number | null;
  away: number | null;
}

export interface LivescoreScoreboardDetail {
  periods?: LivescoreScoreboardPeriod[];
  innings?: Array<{
    label?: string;
    inning?: string | number;
    home?: number | null;
    away?: number | null;
  }>;
  totals?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface LivescoreOdds {
  international?: Record<string, unknown> | null;
  taiwan?: Record<string, unknown> | null;
  live?: Record<string, unknown> | null;
}

export interface LivescoreItem {
  game_id: string;
  alliance_id: number;
  league_code: string;
  alliance_name?: string;
  sport_type: string;
  status: LivescoreStatus;
  start_time: string;
  home_team: LivescoreTeam;
  away_team: LivescoreTeam;
  home_score: number | null;
  away_score: number | null;
  live_phase?: string | null;
  scoreboard_detail?: LivescoreScoreboardDetail | null;
  live_stats?: Record<string, unknown> | null;
  odds_info?: LivescoreOdds | null;
  soccer_league?: {
    id: number;
    name?: string | null;
  } | null;
  last_updated: string;
}

export interface LivescoreResponse {
  success: boolean;
  data: LivescoreItem[];
  pagination: PageMeta;
}

// ==================== 論壇相關 ====================

export interface ForumUser {
  id: number;
  name: string;
  avatarUrl?: string;
  title?: string;
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

export interface ForumBoardPayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: number | null;
  allowPost?: string;
  allowComment?: string;
  isPublic?: boolean;
  isActive?: boolean;
}

export interface ForumBoardOrderItem {
  id: number;
  order: number;
}

export interface AdminForumBoard extends ForumBoard {
  parentId?: number | null;
  order?: number;
  allowPost?: string;
  allowComment?: string;
  isPublic?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: AdminForumBoard[];
}

export type TipTapNode = JSONContent;

export type TipTapDoc = JSONContent;

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

export interface ForumPostDetail extends ForumPost {
  content: TipTapDoc; // TipTap JSON 結構
  isLikedByMe: boolean;
  attachments: ForumAttachment[];
  tags: ForumTag[];
}

export interface ForumComment {
  id: number;
  postId: number;
  content: TipTapDoc;
  author: ForumUser;
  floor: number;
  likeCount: number;
  isLikedByMe: boolean;
  parentId?: number;
  replies?: ForumComment[];
  createdAt: string;
  updatedAt: string;
  contentText?: string;
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

export interface AdminForumPost extends ForumPost {
  status: 'draft' | 'published' | 'locked' | 'hidden';
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: number;
  deleteReason?: string;
}

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

export interface ForumBoardsResponse {
  success: boolean;
  data: ForumBoard[];
}

export interface AdminForumBoardsResponse {
  success: boolean;
  data: AdminForumBoard[];
}

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
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
}

export interface CommentPayload {
  content: TipTapDoc;
  parentId?: number;
}

export interface ForumTagsResponse {
  success: boolean;
  data: ForumTag[];
}

export interface ForumAdminPostsResponse {
  success: boolean;
  data: AdminForumPost[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface ForumStatsResponse {
  success: boolean;
  stats: ForumStats;
}
