/**
 * 賽事相關 API
 */

import api from './client';
import type { Game, GamesResponse, GamesQueryParams } from '../types/game';
import type { PredictionStats } from '../types/prediction';
import type { PredictionStatsResponse } from './types';

/**
 * 獲取賽事列表
 */
export async function getGames(params?: GamesQueryParams): Promise<GamesResponse> {
  const response = await api.get<GamesResponse>('/games', { params });
  return response.data;
}

/**
 * 獲取單一賽事詳情
 */
export async function getGame(gameId: string): Promise<{ success: boolean; data: Game }> {
  const response = await api.get<{ success: boolean; data: Game }>(`/games/${gameId}`);
  return response.data;
}

/**
 * 查詢單一賽事的預測比例統計
 */
export async function getGamePredictionStats(gameId: string): Promise<PredictionStats> {
  const response = await api.get<PredictionStatsResponse>(`/games/${gameId}/prediction-stats`);
  if (!response.data.success || !response.data.data) {
    throw new Error('取得賽事預測統計失敗');
  }
  return response.data.data;
}

export const gamesAPI = {
  getGames,
  getGame,
  getGamePredictionStats,
};

