// 模拟API服务
// 用于前端开发时的数据模拟，方便后续与后端对接

import mockData from './mock-data.json';
import type { UnifiedGame, Alliance, GamesApiResponse, AlliancesApiResponse, GamesRequestParams } from './types';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取比赛列表
export async function getGames(params?: GamesRequestParams): Promise<GamesApiResponse> {
  await delay(300); // 模拟网络延迟

  let filteredGames = [...mockData.games];

  // 根据联盟ID过滤
  if (params?.alliance) {
    filteredGames = filteredGames.filter(game => {
      // 这里可以根据实际的联盟映射逻辑来过滤
      // 暂时简化处理
      return true; // 实际项目中需要根据联盟ID匹配
    });
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

  // 分页处理
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedGames,
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
    data: mockData.alliances,
    timestamp: new Date().toISOString()
  };
}

// 获取单个比赛详情
export async function getGameById(id: number): Promise<{ success: boolean; data: UnifiedGame | null; timestamp: string }> {
  await delay(200);

  const game = mockData.games.find(g => g.id === id);

  return {
    success: !!game,
    data: game || null,
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
  );
}

// 导出原始数据（用于开发调试）
export { mockData };

// 使用说明：
// 1. 这个文件模拟了实际API的行为
// 2. 前端可以直接调用这些函数来获取数据
// 3. 当后端API准备好时，只需要修改这些函数的实现
// 4. 数据结构已经在 types.ts 中定义，后端需要按照这个结构返回数据
