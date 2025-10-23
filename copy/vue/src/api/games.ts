/**
 * 賽事相關 API
 */

import { api } from './index';
import type { Game, GamesResponse, GamesQueryParams } from '../types/game';

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

export const gamesAPI = {
  getGames,
  getGame,
};

