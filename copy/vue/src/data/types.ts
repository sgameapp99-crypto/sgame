// 模拟数据类型定义
// 用于前后端数据结构对接

export interface Pitcher {
  name?: string;
  hand?: string;
  record?: string;
  era?: string;
  whip?: string;
  postseasonRecord?: string;
  postseasonEra?: string;
  postseasonWhip?: string;
  recentRecord?: string;
  recentEra?: string;
  recentWhip?: string;
  homeAwayRecord?: string;
  homeAwayEra?: string;
  homeAwayWhip?: string;
  seasonVsOpponent?: string;
  seasonVsOpponentEra?: string;
  seasonVsOpponentWhip?: string;
  careerVsOpponent?: string;
  careerVsOpponentEra?: string;
  careerVsOpponentWhip?: string;
  dayNightRecord?: string;
  dayNightEra?: string;
  dayNightWhip?: string;
}

export interface TeamStats {
  battingAvg?: string;
  onBasePct?: string;
  avgRuns?: number;
  homeAwayBattingAvg?: string;
  homeAwayOnBasePct?: string;
  homeAwayAvgRuns?: number;
  vsOpponentBattingAvg?: string;
  vsOpponentOnBasePct?: string;
  vsOpponentAvgRuns?: number;
  recentBattingAvg?: string;
  recentOnBasePct?: string;
  recentAvgRuns?: number;
  seasonBattingAvg?: string;
  seasonOnBasePct?: string;
  seasonAvgRuns?: number;
  monthBattingAvg?: string;
  monthOnBasePct?: string;
  monthAvgRuns?: number;
  vsRightBattingAvg?: string;
  vsRightOnBasePct?: string;
  vsRightAvgRuns?: number;
  vsLeftBattingAvg?: string;
  vsLeftOnBasePct?: string;
  vsLeftAvgRuns?: number;
  dayBattingAvg?: string;
  dayOnBasePct?: string;
  dayAvgRuns?: number;
  nightBattingAvg?: string;
  nightOnBasePct?: string;
  nightAvgRuns?: number;
  bullpenRecord?: string;
  bullpenEra?: string;
  bullpenWhip?: string;
  seasonRecord?: string;
  homeAwayRecord?: string;
  recentRecord?: string;
  vsRightHanded?: string;
  vsLeftHanded?: string;
  avgRunsScored?: number;
  avgRunsAllowed?: number;
  recentAvgRunsScored?: number;
  recentAvgRunsAllowed?: number;
}

export interface Odds {
  awaySpread?: string;
  awaySpreadOdds?: string;
  awaySpreadWinRate?: string;
  awaySpreadRecentWinRate?: string;
  awayRecent10SpreadWinRate?: string;
  awayRecent10SpreadRecentWinRate?: string;
  awayOverUnder?: string;
  awayOverUnderOdds?: string;
  awayOverUnderWinRate?: string;
  awayOverUnderRecentWinRate?: string;
  homeSpread?: string;
  homeSpreadOdds?: string;
  homeSpreadWinRate?: string;
  homeSpreadRecentWinRate?: string;
  homeRecent10SpreadWinRate?: string;
  homeRecent10SpreadRecentWinRate?: string;
  homeOverUnder?: string;
  homeOverUnderOdds?: string;
  homeOverUnderWinRate?: string;
  homeOverUnderRecentWinRate?: string;
}

export interface UnifiedGame {
  id: number;
  league: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
  inning?: string;
  outs?: number;
  // 棒球特有字段
  officialId?: string;
  homeTeamId?: number;
  awayTeamId?: number;
  date?: string;
  winner?: string;
  betInfo?: string;
  allianceId?: number;
  awayPitcher?: Pitcher;
  homePitcher?: Pitcher;
  awayTeamStats?: TeamStats;
  homeTeamStats?: TeamStats;
  odds?: Odds;
  vsRecord?: string;
  scoreboard?: {
    innings: number[];
    awayScores: { inning: number; runs: number }[];
    homeScores: { inning: number; runs: number }[];
    awayTotal: { runs: number; hits: number; errors: number };
    homeTotal: { runs: number; hits: number; errors: number };
  };
  // 進行中比賽實時數據
  liveStats?: {
    strikes: number;
    balls: number;
    outs: number;
    inning: string;
    currentPitcher?: string;
    currentPosition?: string;
    currentBatter?: string;
    onDeck?: string;
    inHole?: string;
    pitcherStats?: {
      name: string;
      ip: string; // innings pitched
      er: number; // earned runs
      pitches: number;
      strikes: number;
      balls: number;
      hits: number;
      bb: number; // walks
      so: number; // strikeouts
    };
    batterStats?: {
      name: string;
      position: string;
      battingOrder: number;
      season: {
        avg: string;
        hr: number;
        rbi: number;
      };
      vsPitcher: {
        last3Years: string;
        season: string;
      };
      today: string;
    };
    onDeckStats?: {
      name: string;
      position: string;
      battingOrder: number;
      season: {
        avg: string;
        hr: number;
        rbi: number;
      };
    };
    inHoleStats?: {
      name: string;
      position: string;
      battingOrder: number;
      season: {
        avg: string;
        hr: number;
        rbi: number;
      };
    };
  };
  // 篮球特有字段
  period?: string;
  venue?: string;
  stats?: {
    timeRemaining: string;
    quarter: number;
  };
  // 足球特有字段
  matchMinute?: string;
  soccerLeagueId?: number; // 足球聯賽ID
  soccerLeague?: string;   // 足球聯賽名稱
}

export interface Alliance {
  id: number;
  name: string;
  sport: 'baseball' | 'basketball' | 'soccer' | 'football' | 'hockey' | 'tennis';
  displayName: string;
  hasGames: boolean;
}

// 足球聯賽接口
export interface SoccerLeague {
  id: number;
  name: string;
  displayName: string;
  allianceId: number; // 對應足球聯盟ID (5)
}

// 籃球比賽接口
export interface BasketballGame {
  id: number;
  league: string;
  allianceId: number;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  timeRemaining?: string;
  currentQuarter?: number;
  venue?: string;
  bettingInfo?: string;
  winner?: string;

  // 比賽前數據
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  recentForm?: string;
  headToHead?: string;
  avgPoints?: string;
  avgPointsAllowed?: string;

  // 比賽中數據
  scoreBreakdown?: ScoreBreakdown;

  // 比賽結束數據
  teamStats?: BasketballTeamStats;
}

// 籃球比賽數據接口
export interface QuarterScore {
  quarter: number;
  points: number;
}

export interface ScoreBreakdown {
  quarters: { label: string; quarter: number }[];
  awayScores: QuarterScore[];
  homeScores: QuarterScore[];
  ot?: boolean;
  awayOtScore?: number;
  homeOtScore?: number;
}

export interface TeamGameStats {
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  fieldGoalPct?: number;
  threePointsMade?: number;
  threePointsAttempted?: number;
  threePointPct?: number;
  freeThrowsMade?: number;
  freeThrowsAttempted?: number;
  freeThrowPct?: number;
  totalRebounds?: number;
  offensiveRebounds?: number;
  turnovers?: number;
}

export interface BasketballTeamStats {
  away?: TeamGameStats;
  home?: TeamGameStats;
}

// 冰球比赛数据结构
export interface IceHockeyPeriodScore {
  period: number;
  label: string; // '1', '2', '3', 'OT', 'SO'
  awayScore: number;
  homeScore: number;
}

export interface IceHockeyScoreBreakdown {
  periods: { label: string; period: number }[];
  awayScores: IceHockeyPeriodScore[];
  homeScores: IceHockeyPeriodScore[];
  awayTotal: number;
  homeTotal: number;
  hasOvertime?: boolean;
  hasShootout?: boolean;
}

export interface IceHockeyGame {
  id: number;
  league: string;
  allianceId: number;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  venue?: string;
  bettingInfo?: string;
  winner?: string;

  // 比賽前數據
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  recentForm?: string;
  headToHead?: string;
  avgGoals?: string;
  avgGoalsAllowed?: string;

  // 比賽狀態
  currentPeriod?: number; // 當前節數
  timeRemaining?: string; // 剩餘時間
  isPaused?: boolean; // 是否暫停

  // 詳細得分
  scoreBreakdown?: IceHockeyScoreBreakdown;
}

// 美式足球比赛数据结构
export interface AmericanFootballPeriodScore {
  period: number;
  label: string; // '1', '2', '3', '4', 'OT'
  awayScore: number;
  homeScore: number;
}

export interface AmericanFootballScoreBreakdown {
  periods: { label: string; period: number }[];
  awayScores: AmericanFootballPeriodScore[];
  homeScores: AmericanFootballPeriodScore[];
  awayTotal: number;
  homeTotal: number;
  hasOvertime?: boolean;
}

export interface AmericanFootballGame {
  id: number;
  league: string;
  allianceId: number;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  venue?: string;
  bettingInfo?: string;
  winner?: string;

  // 比賽前數據
  homeStats?: TeamStats;
  awayStats?: TeamStats;
  recentForm?: string;
  headToHead?: string;
  avgPoints?: string;
  avgPointsAllowed?: string;

  // 比賽狀態
  currentPeriod?: number; // 當前節數 (1-4, 5=OT)
  timeRemaining?: string; // 剩餘時間
  isPaused?: boolean; // 是否暫停

  // 詳細得分
  scoreBreakdown?: AmericanFootballScoreBreakdown;
}

// 網球比赛数据结构
export interface TennisSetScore {
  setNumber: number;
  awayGames: number;
  homeGames: number;
}

export interface TennisScoreBreakdown {
  sets: TennisSetScore[];
  awaySets: number;
  homeSets: number;
  awayTotalGames: number;
  homeTotalGames: number;
  currentSet?: number;
  currentGames?: { away: number; home: number };
}

export interface TennisGame {
  id: number;
  league: string;
  allianceId: number;
  status: 'scheduled' | 'live' | 'finished';
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  venue?: string;
  bettingInfo?: string;
  winner?: string;

  // 比賽前數據
  homeStats?: {
    overallRecord?: string; // 總戰績
    homeRecord?: string; // 主場戰績
    recentForm?: string; // 近十場
    avgGames?: string; // 平均得失分
  };
  awayStats?: {
    overallRecord?: string; // 總戰績
    awayRecord?: string; // 客場戰績
    recentForm?: string; // 近十場
    avgGames?: string; // 平均得失分
  };
  headToHead?: string; // 對戰記錄

  // 比賽狀態
  isLive?: boolean;
  currentSet?: number;
  currentGames?: { away: number; home: number };

  // 詳細得分
  scoreBreakdown?: TennisScoreBreakdown;
}

export interface MockData {
  games: UnifiedGame[];
  alliances: Alliance[];
  basketballGames: BasketballGame[];
  iceHockeyGames: IceHockeyGame[];
  americanFootballGames: AmericanFootballGame[];
  tennisGames: TennisGame[];
}

// API响应格式定义
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface GamesApiResponse extends ApiResponse<UnifiedGame[]> {
  total: number;
  page: number;
  pageSize: number;
  filters?: {
    alliance?: number;
    date?: string;
    status?: 'scheduled' | 'live' | 'finished';
  };
}

export interface AlliancesApiResponse extends ApiResponse<Alliance[]> {
  // 联盟数据通常不需要分页
}

// 请求参数类型
export interface GamesRequestParams {
  alliance?: number;
  date?: string;
  status?: 'scheduled' | 'live' | 'finished';
  page?: number;
  pageSize?: number;
  soccerLeagueId?: number; // 足球聯賽ID
}

// 后端期望的数据结构说明：
/*
API 接口规范：

1. 获取比赛列表
GET /api/games
Query Params: alliance, date, status, page, pageSize

Response:
{
  "success": true,
  "data": [UnifiedGame[]],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "timestamp": "2025-10-09T12:00:00Z",
  "filters": {
    "alliance": 1,
    "date": "2025-10-09",
    "status": "live"
  }
}

2. 获取联盟列表
GET /api/alliances

Response:
{
  "success": true,
  "data": [Alliance[]],
  "timestamp": "2025-10-09T12:00:00Z"
}

3. 获取单个比赛详情
GET /api/games/{id}

Response:
{
  "success": true,
  "data": UnifiedGame,
  "timestamp": "2025-10-09T12:00:00Z"
}
*/
