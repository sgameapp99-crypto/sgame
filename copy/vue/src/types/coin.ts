/**
 * 彩幣相關類型定義
 */

export type TransactionType = 'earn' | 'spend';

export interface CoinInfo {
  success: boolean;
  accountId: string;
  balance: number;
  earned: number;
  spent: number;
}

export interface CoinTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  balance: number;
  reason: string;
  relatedPredictionId: number | null;
  createdAt: string;
}

export interface CoinTransactionsResponse {
  success: boolean;
  data: CoinTransaction[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface CoinTransactionsQueryParams {
  type?: TransactionType | 'all';
  page?: number;
  size?: number;
}

export interface PurchaseCoinsRequest {
  amount: number;
  note?: string;
}

export interface PurchaseCoinsResponse {
  success: boolean;
  message: string;
  transaction: CoinTransaction;
}

