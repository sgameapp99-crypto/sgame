/**
 * 聯盟相關類型定義
 */

export type SportType = 'baseball' | 'basketball' | 'soccer' | 'ice_hockey' | 'american_football' | 'tennis' | 'other';

export interface Alliance {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  sportType: SportType;
  isActive: boolean;
}

// 足球子聯賽
export interface SoccerLeague {
  id: number;
  name: string;
}

// 聯盟ID常量
export const ALLIANCE_IDS = {
  // 棒球
  MLB: 1,
  NPB: 3,
  CPBL: 4,
  KBO: 6,
  ABL: 9,
  INTL_BASEBALL: 83,
  OTHER_BASEBALL: 114,
  
  // 籃球
  NBA: 2,
  WNBA: 7,
  NBL: 8,
  CBA: 12,
  EUROLEAGUE: 16,
  EUROCUP: 18,
  B_LEAGUE: 89,
  KBL: 92,
  SBL: 94,
  PLG: 97,
  T1_LEAGUE: 110,
  OTHER_BASKETBALL: 121,
  
  // 足球
  SOCCER: 5,
  
  // 冰球
  KHL: 87,
  NHL: 91,
  
  // 美式足球
  NFL: 93,
  
  // 網球
  TENNIS: 21,
  
  // 其他
  VOLLEYBALL: 10,
  ESPORTS: 11,
} as const;

// 足球子聯賽ID
export const SOCCER_LEAGUE_IDS = {
  ALL: 0,
  EPL: 1,
  LA_LIGA: 2,
  SERIE_A: 3,
  BUNDESLIGA: 4,
  LIGUE_1: 5,
} as const;

