/**
 * 彩幣相關 API
 */

import { api } from './index';
import type {
  CoinInfo,
  CoinTransactionsResponse,
  CoinTransactionsQueryParams,
  PurchaseCoinsRequest,
  PurchaseCoinsResponse,
} from '../types/coin';

/**
 * 獲取彩幣資訊
 */
export async function getCoinInfo(): Promise<CoinInfo> {
  const response = await api.get<CoinInfo>('/me/coins');
  return response.data;
}

/**
 * 彩幣充值
 */
export async function purchaseCoins(data: PurchaseCoinsRequest): Promise<PurchaseCoinsResponse> {
  const response = await api.post<PurchaseCoinsResponse>('/me/coins/purchase', data);
  return response.data;
}

/**
 * 獲取彩幣交易記錄
 */
export async function getCoinTransactions(params?: CoinTransactionsQueryParams): Promise<CoinTransactionsResponse> {
  const response = await api.get<CoinTransactionsResponse>('/me/coins/transactions', { params });
  return response.data;
}

export const coinsAPI = {
  getCoinInfo,
  purchaseCoins,
  getCoinTransactions,
};

