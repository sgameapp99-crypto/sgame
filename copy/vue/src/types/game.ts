/**
 * 賽事相關類型定義
 */

import type { SportType } from './alliance';

export type GameStatus = 'scheduled' | 'live' | 'finished';

export interface Team {
  id: number;
  name: string;
  pitcher?: string; // 投手（僅棒球）
}

export interface OddsLine {
  line: string;
  odds: string;
}

export interface MoneylineOdds {
  odds: string;
}

export interface SpreadOdds {
  home: OddsLine;
  away: OddsLine;
}

export interface TotalOdds {
  over: OddsLine;
  under: OddsLine;
}

export interface InternationalOdds {
  spread: SpreadOdds;
  total: TotalOdds;
}

export interface TaiwanOdds {
  spread: SpreadOdds;
  moneyline: {
    home: MoneylineOdds;
    away: MoneylineOdds;
  };
  total: TotalOdds;
}

export interface FinalScore {
  home: number;
  away: number;
}

export interface Game {
  gameId: string;
  allianceId: number;
  allianceName: string;
  sportType: SportType;
  gameDate: string; // YYYY-MM-DD
  gameTime: string; // HH:mm
  status: GameStatus;
  homeTeam: Team;
  awayTeam: Team;
  internationalOdds: InternationalOdds;
  taiwanOdds: TaiwanOdds;
  finalScore: FinalScore | null;
  soccerLeagueId?: number; // 足球子聯賽ID（僅足球）
  soccerLeagueName?: string; // 足球子聯賽名稱（僅足球）
}

export interface GamesResponse {
  success: boolean;
  data: Game[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

export interface GamesQueryParams {
  allianceId?: number;
  date?: string; // YYYY-MM-DD
  status?: GameStatus;
  soccerLeagueId?: number;
  page?: number;
  size?: number;
}

