/**
 * 預測相關類型定義
 */

export type PredictionType = 
  | 'international_spread' 
  | 'international_total' 
  | 'taiwan_spread' 
  | 'taiwan_moneyline' 
  | 'taiwan_total';

export type PredictionSelection = 'home' | 'away' | 'over' | 'under';

export type PredictionStatus = 'pending' | 'win' | 'lose' | 'cancelled';

export type GameMode = 'international' | 'taiwan' | 'all';

export type DateRange = 'today' | 'week' | 'month' | 'past7' | 'past30' | 'all';

export type PredictionSortField = 'createdAt' | 'settledAt' | 'featuredAt';

export interface PredictionSelectionStats {
  count: number;
  percentage: number;
}

export interface PredictionTypeStats {
  total: number;
  selections: Record<string, PredictionSelectionStats>;
}

export interface PredictionStats {
  totalPredictions: number;
  byType: Record<string, PredictionTypeStats>;
}

export const PREDICTION_TYPE_LABELS: Record<PredictionType, string> = {
  international_spread: '國際盤讓分',
  international_total: '國際盤大小分',
  taiwan_spread: '台灣盤讓分',
  taiwan_moneyline: '台灣盤獨贏',
  taiwan_total: '台灣盤大小分',
};

export const PREDICTION_SELECTION_LABELS: Record<PredictionSelection, string> = {
  home: '主隊',
  away: '客隊',
  over: '大分',
  under: '小分',
};

export interface GameInfo {
  allianceId: number;
  allianceName: string;
  sportType: string;
  gameDate: string;
  gameTime: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: {
    home: number;
    away: number;
  } | null;
}

export interface Prediction {
  id: number;
  userId: number;
  userName: string;
  userAvatarUrl: string;
  gameId: string;
  gameInfo: GameInfo;
  predictionType: PredictionType;
  predictionTypeLabel: string;
  selection: PredictionSelection | null; // 未購買時為 null
  selectionLabel: string; // 未購買時為 "***"
  odds: string;
  price: number;
  isMainPick: boolean;
  isFeatured?: boolean;
  featuredAt?: string | null;
  featuredBy?: number | null;
  featuredNote?: string | null;
  note: string | null; // 未購買時為 null
  status: PredictionStatus;
  isPurchased: boolean;
  isOwn: boolean;
  purchaseCount?: number; // 購買人數（後端提供）
  settledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePredictionRequest {
  gameId: string;
  predictionType: PredictionType;
  selection: PredictionSelection;
  odds: string;
  price: number;
  isMainPick: boolean;
  note?: string;
}

export interface CreatePredictionResponse {
  success: boolean;
  message: string;
  predictionId: number; // 後端實際返回 predictionId
}

export interface UpdatePredictionRequest {
  price?: number;
  note?: string;
}

export interface PredictionsQueryParams {
  memberId?: string | number; // 後端使用 memberId 查詢目標會員的預測
  userId?: string; // 保留向後兼容（已廢棄，請使用 memberId）
  allianceId?: number;
  gameId?: string;
  dateRange?: DateRange;
  gameMode?: GameMode;
  status?: PredictionStatus | 'all';
  page?: number;
  size?: number;
  startDate?: string; // 開始日期 (YYYY-MM-DD)
  endDate?: string; // 結束日期 (YYYY-MM-DD)，未設置時表示不限結束日期
  isFeatured?: boolean;
  sortBy?: PredictionSortField;
  order?: 'asc' | 'desc';
}

export interface PredictionsResponse {
  success: boolean;
  data: Prediction[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface PurchasePredictionResponse {
  success: boolean;
  message: string;
  remainingCoins: number;
  prediction: Partial<Prediction>;
}

export interface PurchaseStatusResponse {
  success: boolean;
  isPurchased: boolean;
  purchasedAt?: string;
}

export interface PredictionSettings {
  defaultPrice: number;
  allowPurchase: boolean;
  autoPublish: boolean;
}

export interface PredictionSettingsResponse {
  success: boolean;
  settings: PredictionSettings;
}

export interface UpdatePredictionSettingsRequest {
  defaultPrice?: number;
  allowPurchase?: boolean;
  autoPublish?: boolean;
}

export interface FeaturePredictionRequest {
  note?: string;
}

export interface FeaturePredictionResponse {
  success: boolean;
  data: Prediction;
}


