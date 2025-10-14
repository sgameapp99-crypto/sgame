// 模拟API服务
// 用于前端开发时的数据模拟，方便后续与后端对接

import mockData from './mock-data.json';
import type { UnifiedGame, Alliance, BasketballGame, IceHockeyGame, AmericanFootballGame, TennisGame, GamesApiResponse, AlliancesApiResponse, GamesRequestParams } from './types';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取比赛列表 - 支持所有類型的比賽數據
export async function getGames(params?: GamesRequestParams): Promise<GamesApiResponse> {
  await delay(300); // 模拟网络延迟

  // 根據聯盟類型決定數據源
  let dataSource: (UnifiedGame | BasketballGame | IceHockeyGame | AmericanFootballGame | TennisGame)[] = [];

  if (params?.alliance === 2 || params?.alliance === 7) {
    // 籃球聯盟 (NBA/WNBA)
    dataSource = [...mockData.basketballGames] as BasketballGame[];
  } else if (params?.alliance === 87 || params?.alliance === 91) {
    // 冰球聯盟 (俄羅斯冰球/NHL冰球)
    dataSource = [...mockData.iceHockeyGames] as IceHockeyGame[];
  } else if (params?.alliance === 93) {
    // 美式足球聯盟 (NFL)
    dataSource = [...mockData.americanFootballGames] as AmericanFootballGame[];
  } else if (params?.alliance === 21) {
    // 網球聯盟
    dataSource = [...mockData.tennisGames] as TennisGame[];
  } else {
    // 其他聯盟 (棒球、足球等)
    dataSource = [...mockData.games] as UnifiedGame[];
  }

  let filteredGames = dataSource;

  // 根据联盟ID过滤
  if (params?.alliance) {
    if (params.alliance === 2 || params.alliance === 7) {
      // 籃球聯盟 - 直接通過allianceId匹配
      filteredGames = filteredGames.filter(game => game.allianceId === params.alliance);
    } else if (params.alliance === 87 || params.alliance === 91) {
      // 冰球聯盟 - 直接通過allianceId匹配
      filteredGames = filteredGames.filter(game => game.allianceId === params.alliance);
    } else if (params.alliance === 93) {
      // 美式足球聯盟 - 直接通過allianceId匹配
      filteredGames = filteredGames.filter(game => game.allianceId === params.alliance);
    } else if (params.alliance === 21) {
      // 網球聯盟 - 直接通過allianceId匹配
      filteredGames = filteredGames.filter(game => game.allianceId === params.alliance);
    } else {
      // 其他聯盟 - 通過league字段匹配
      filteredGames = filteredGames.filter(game => {
        const gameLeague = (game as UnifiedGame).league;
        switch (params.alliance) {
          case 1: return gameLeague === 'MLB';
          case 3: return gameLeague === '日棒';
          case 4: return gameLeague === '中職';
          case 5: return gameLeague === '足球';
          case 6: return gameLeague === '韓棒';
          case 9: return gameLeague === '韓棒';
          case 12: return gameLeague === '澳洲職籃';
          case 83: return gameLeague === '澳洲職棒';
          case 97: return gameLeague === '日本職籃';
          case 114: return gameLeague === '國際棒賽';
          default: return true;
        }
      });
    }
  }

  // 根据日期过滤
  if (params?.date) {
    filteredGames = filteredGames.filter(game => {
      const gameDate = game.time.split(' ')[0];
      return gameDate === params.date;
    });
  }

  // 根据状态过滤
  if (params?.status) {
    filteredGames = filteredGames.filter(game => game.status === params.status);
  }

  // 根据足球联赛ID过滤
  if (params?.soccerLeagueId !== undefined && params?.soccerLeagueId !== 0) {
    filteredGames = filteredGames.filter(game =>
      (game as any).soccerLeagueId === params.soccerLeagueId
    );
  }

  // 分页处理
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedGames as UnifiedGame[],
    total: filteredGames.length,
    page,
    pageSize,
    timestamp: new Date().toISOString(),
    filters: params
  };
}

// 获取联盟列表
export async function getAlliances(): Promise<AlliancesApiResponse> {
  await delay(200); // 模拟网络延迟

  return {
    success: true,
    data: mockData.alliances as Alliance[],
    timestamp: new Date().toISOString()
  };
}

// 获取单个比赛详情
export async function getGameById(id: number): Promise<{ success: boolean; data: UnifiedGame | null; timestamp: string }> {
  await delay(200);

  const game = mockData.games.find(g => g.id === id);

  return {
    success: !!game,
    data: game ? game as UnifiedGame : null,
    timestamp: new Date().toISOString()
  };
}


// 获取今天有比赛的联盟
export async function getActiveAlliances(): Promise<Alliance[]> {
  await delay(100);

  // 获取今天有比赛的联盟ID
  const today = new Date().toISOString().split('T')[0];
  const todayGames = mockData.games.filter(game =>
    game.time.startsWith(today) && game.status !== 'scheduled'
  );

  const activeAllianceIds = [...new Set(todayGames.map(game => {
    // 根据游戏联盟名称映射到联盟ID
    const allianceMap: Record<string, number> = {
      'MLB': 1,
      'NBA': 2,
      '日棒': 3,
      '中職': 4,
      'WNBA': 5,
      '韓棒': 6,
      '澳洲職棒': 11,
      '國際棒賽': 12,
      '澳洲職籃': 9,
      '日本職籃': 10
    };
    return allianceMap[game.league];
  }).filter(Boolean))];

  return mockData.alliances.filter(alliance =>
    activeAllianceIds.includes(alliance.id)
  ) as Alliance[];
}

// 导出原始数据（用于开发调试）
export { mockData };

// 使用说明：
// 1. 这个文件模拟了实际API的行为
// 2. 前端可以直接调用这些函数来获取数据
// 3. 当后端API准备好时，只需要修改这些函数的实现
// 4. 数据结构已经在 types.ts 中定义，后端需要按照这个结构返回数据
