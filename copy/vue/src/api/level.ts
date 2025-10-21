// 等級系統相關 API

import api from './client';
import type {
  LevelsResponse,
  LevelStatsResponse,
  LevelInfo,
  LevelStats,
} from './types';

/**
 * 等級 API 模組
 */
export const levelAPI = {
  /**
   * 獲取所有等級列表
   * GET /levels
   */
  async getLevels() {
    const response = await api.get<LevelsResponse>('/levels');
    // 相容不同的響應格式
    if (response.data.success && response.data.levels) {
      return response.data.levels;
    }
    // 如果直接返回陣列
    if (Array.isArray(response.data)) {
      return response.data as LevelInfo[];
    }
    return [];
  },

  /**
   * 獲取等級統計資訊
   * GET /levels/stats
   */
  async getStats() {
    const response = await api.get<LevelStatsResponse>('/levels/stats');
    // 相容不同的響應格式
    if (response.data.success && response.data.stats) {
      return response.data.stats;
    }
    // 如果直接返回統計資料
    if ('totalMembers' in response.data) {
      return response.data as LevelStats;
    }
    return null;
  },

  /**
   * 根據積分查找對應等級
   * @param score 會員積分
   * @param levels 等級列表 (選填,如未提供會自動獲取)
   */
  async getLevelByScore(score: number, levels?: LevelInfo[]) {
    const levelList = levels || await this.getLevels();
    
    // 找到符合積分範圍的等級
    const level = levelList.find(
      (l) => score >= l.minScore && score <= l.maxScore
    );

    return level || levelList[0]; // 如果找不到,返回第一個等級
  },

  /**
   * 計算等級進度
   * @param score 當前積分
   * @param level 等級資訊
   */
  calculateProgress(score: number, level: LevelInfo) {
    const range = level.maxScore - level.minScore;
    const progress = score - level.minScore;
    const percentage = range > 0 ? Math.min(100, Math.max(0, (progress / range) * 100)) : 0;

    return {
      percentage: Math.round(percentage * 100) / 100,
      currentScore: score,
      levelMinScore: level.minScore,
      levelMaxScore: level.maxScore,
      pointsToNext: Math.max(0, level.maxScore - score),
    };
  },
};

export default levelAPI;


