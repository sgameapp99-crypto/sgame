// 模擬遊戲數據API服務
export interface Game {
  id: string;
  alliance_id: number;
  alliance_name: string;
  home_team: Team;
  away_team: Team;
  scheduled_time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'finished';
}

export interface Team {
  id: number;
  name: string;
  short_name: string;
  logo: string;
  city?: string;
  stadium?: string;
  founded?: number;
  stats?: {
    wins: number;
    losses: number;
    win_rate: number;
    games_behind?: number;
  };
}

export interface StandingDivision {
  name: string;
  teams: StandingTeam[];
}

export interface StandingTeam {
  rank: number;
  team: Team;
  wins: number;
  losses: number;
  win_rate: number;
  games_behind: number;
  streak: string;
}

export interface GameResult {
  id: string;
  date: string;
  alliance_id: number;
  home_team: Team;
  away_team: Team;
  home_score: number;
  away_score: number;
  winner: 'home' | 'away';
  status: string;
  inning?: number;
  venue: string;
}

export interface BattleData {
  game: Game;
  starting_pitchers: {
    away: Pitcher;
    home: Pitcher;
  };
  team_stats: {
    away: TeamStats;
    home: TeamStats;
  };
  recent_matches: {
    away_team: MatchRecord[];
    home_team: MatchRecord[];
  };
}

export interface Pitcher {
  name: string;
  wins: number;
  losses: number;
  era: number;
  whip: number;
}

export interface TeamStats {
  batting_avg: number;
  obp: number;
  slg: number;
}

export interface MatchRecord {
  id: string;
  date: string;
  opponent: string;
  result: 'W' | 'L';
  score: string;
}

// 模擬數據
const mockTeams: Team[] = [
  {
    id: 1,
    name: '芝加哥小熊',
    short_name: '小熊',
    logo: '/images/teams/cubs.png',
    city: '芝加哥',
    stadium: 'Wrigley Field',
    founded: 1876,
    stats: { wins: 75, losses: 65, win_rate: 0.536, games_behind: 2.5 }
  },
  {
    id: 2,
    name: '匹茲堡海盜',
    short_name: '海盜',
    logo: '/images/teams/pirates.png',
    city: '匹茲堡',
    stadium: 'PNC Park',
    founded: 1882,
    stats: { wins: 68, losses: 72, win_rate: 0.486, games_behind: 9.5 }
  },
  {
    id: 3,
    name: '洛杉磯道奇',
    short_name: '道奇',
    logo: '/images/teams/dodgers.png',
    city: '洛杉磯',
    stadium: 'Dodger Stadium',
    founded: 1883,
    stats: { wins: 88, losses: 52, win_rate: 0.629, games_behind: 0 }
  },
  {
    id: 4,
    name: '舊金山巨人',
    short_name: '巨人',
    logo: '/images/teams/giants.png',
    city: '舊金山',
    stadium: 'Oracle Park',
    founded: 1883,
    stats: { wins: 72, losses: 68, win_rate: 0.514, games_behind: 16 }
  }
];

const mockGames: Game[] = [
  {
    id: '2025091611001',
    alliance_id: 1,
    alliance_name: 'MLB',
    home_team: mockTeams[0],
    away_team: mockTeams[1],
    scheduled_time: '2025-09-16T06:40:00Z',
    venue: 'Wrigley Field',
    status: 'scheduled'
  },
  {
    id: '2025091711002',
    alliance_id: 1,
    alliance_name: 'MLB',
    home_team: mockTeams[1],
    away_team: mockTeams[2],
    scheduled_time: '2025-09-17T07:10:00Z',
    venue: 'PNC Park',
    status: 'scheduled'
  }
];

// 模擬API服務
export class GamesApiService {
  // 延遲模擬網絡請求
  private async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 賽事列表API
  async getGamesList(allianceId: number): Promise<Game[]> {
    await this.delay();
    return mockGames.filter(game => game.alliance_id === allianceId);
  }

  // 對戰詳細資訊API
  async getBattleData(gameId: string): Promise<BattleData> {
    await this.delay(1200);

    const game = mockGames.find(g => g.id === gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return {
      game,
      starting_pitchers: {
        away: {
          name: 'Jameson Taillon',
          wins: 26,
          losses: 25,
          era: 3.82,
          whip: 1.18
        },
        home: {
          name: 'Braxton Ashcraft',
          wins: 32,
          losses: 37,
          era: 4.04,
          whip: 1.23
        }
      },
      team_stats: {
        away: {
          batting_avg: 0.241,
          obp: 0.312,
          slg: 0.398
        },
        home: {
          batting_avg: 0.239,
          obp: 0.308,
          slg: 0.385
        }
      },
      recent_matches: {
        away_team: [
          { id: '1', date: '09-15', opponent: 'vs 勇士', result: 'W', score: '5-3' },
          { id: '2', date: '09-14', opponent: '@ 紅雀', result: 'L', score: '2-7' },
          { id: '3', date: '09-13', opponent: 'vs 紅人', result: 'W', score: '8-1' },
          { id: '4', date: '09-12', opponent: '@ 大都會', result: 'L', score: '1-4' },
          { id: '5', date: '09-11', opponent: 'vs 費城人', result: 'W', score: '6-2' }
        ],
        home_team: [
          { id: '6', date: '09-15', opponent: '@ 勇士', result: 'L', score: '3-5' },
          { id: '7', date: '09-14', opponent: 'vs 紅雀', result: 'W', score: '7-2' },
          { id: '8', date: '09-13', opponent: '@ 紅人', result: 'L', score: '1-8' },
          { id: '9', date: '09-12', opponent: 'vs 大都會', result: 'W', score: '5-1' },
          { id: '10', date: '09-11', opponent: '@ 費城人', result: 'L', score: '2-6' }
        ]
      }
    };
  }

  // 球隊列表API
  async getTeams(allianceId: number): Promise<Team[]> {
    await this.delay();
    // 模擬不同聯盟的球隊數據
    return mockTeams.slice(0, allianceId === 1 ? 4 : 2);
  }

  // 球隊詳細資訊API
  async getTeamDetail(teamId: number): Promise<Team> {
    await this.delay();
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  // 戰績排名API
  async getStandings(allianceId: number): Promise<{
    divisions: StandingDivision[];
    wildcards: StandingTeam[];
    updated_at: string;
  }> {
    await this.delay();

    const divisions: StandingDivision[] = [
      {
        name: allianceId === 1 ? '國聯中區' : '東區',
        teams: [
          {
            rank: 1,
            team: mockTeams[2],
            wins: 88,
            losses: 52,
            win_rate: 0.629,
            games_behind: 0,
            streak: 'W5'
          },
          {
            rank: 2,
            team: mockTeams[0],
            wins: 75,
            losses: 65,
            win_rate: 0.536,
            games_behind: 13,
            streak: 'L2'
          },
          {
            rank: 3,
            team: mockTeams[1],
            wins: 68,
            losses: 72,
            win_rate: 0.486,
            games_behind: 20,
            streak: 'W1'
          },
          {
            rank: 4,
            team: mockTeams[3],
            wins: 62,
            losses: 78,
            win_rate: 0.443,
            games_behind: 26,
            streak: 'L3'
          }
        ]
      }
    ];

    const wildcards: StandingTeam[] = [
      {
        rank: 1,
        team: mockTeams[3],
        wins: 72,
        losses: 68,
        win_rate: 0.514,
        games_behind: 16,
        streak: 'W3'
      }
    ];

    return {
      divisions,
      wildcards,
      updated_at: new Date().toISOString()
    };
  }

  // 賽事結果查詢API
  async getGameResults(params: {
    alliance_id?: string;
    team_id?: string;
    date_from?: string;
    date_to?: string;
    season?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    results: GameResult[];
    total: number;
  }> {
    await this.delay();

    // 生成模擬的歷史賽事結果
    const results: GameResult[] = [];
    const totalResults = 2450;

    // 生成最近30天的比賽結果
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < Math.min(params.limit || 20, 100); i++) {
      const randomDays = Math.floor(Math.random() * 30);
      const gameDate = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);

      const homeScore = Math.floor(Math.random() * 15) + 1;
      const awayScore = Math.floor(Math.random() * 15) + 1;

      const homeTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      let awayTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      while (awayTeam.id === homeTeam.id) {
        awayTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
      }

      results.push({
        id: `2025${String(gameDate.getMonth() + 1).padStart(2, '0')}${String(gameDate.getDate()).padStart(2, '0')}1${String(i + 1).padStart(3, '0')}`,
        date: gameDate.toISOString().split('T')[0],
        alliance_id: 1,
        home_team: homeTeam,
        away_team: awayTeam,
        home_score: Math.max(homeScore, awayScore),
        away_score: Math.min(homeScore, awayScore),
        winner: homeScore >= awayScore ? 'home' : 'away',
        status: 'final',
        inning: 9,
        venue: homeTeam.stadium || 'Unknown Stadium'
      });
    }

    return {
      results,
      total: totalResults
    };
  }
}

// 導出單例實例
export const gamesApi = new GamesApiService();
