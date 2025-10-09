# 数据层组织说明

## 目录结构

```
src/data/
├── mock-data.json      # 模拟数据文件
├── mockApi.ts         # 模拟API服务
├── types.ts          # TypeScript类型定义
└── README.md         # 本文件
```

## 文件说明

### mock-data.json
包含前端开发阶段使用的模拟数据，结构如下：

```json
{
  "games": [
    {
      "id": 1,
      "league": "MLB",
      "time": "2025-10-09 19:00",
      "homeTeam": "道奇",
      "awayTeam": "巨人",
      "homeScore": 3,
      "awayScore": 1,
      "status": "live",
      // ... 其他字段
    }
  ],
  "alliances": [
    {
      "id": 1,
      "name": "MLB",
      "sport": "baseball",
      "displayName": "美國職棒",
      "hasGames": true
    }
  ]
}
```

### mockApi.ts
模拟实际API的行为，包含以下函数：

- `getGames(params?)`: 获取比赛列表
- `getAlliances()`: 获取联盟列表
- `getGameById(id)`: 获取单个比赛详情
- `getActiveAlliances()`: 获取有比赛的联盟

### types.ts
TypeScript类型定义，包含：

- `UnifiedGame`: 统一的比赛数据类型
- `Alliance`: 联盟数据类型
- API响应类型定义
- 请求参数类型定义

## API接口规范

### 获取比赛列表
```
GET /api/games
Query Params: alliance, date, status, page, pageSize

Response:
{
  "success": true,
  "data": [UnifiedGame[]],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "timestamp": "2025-10-09T12:00:00Z"
}
```

### 获取联盟列表
```
GET /api/alliances

Response:
{
  "success": true,
  "data": [Alliance[]],
  "timestamp": "2025-10-09T12:00:00Z"
}
```

## 使用方式

在组件中使用：

```typescript
import { getGames, getAlliances } from '@/data/mockApi';

// 获取比赛数据
const games = await getGames({ alliance: 1, status: 'live' });

// 获取联盟数据
const alliances = await getAlliances();
```

## 后端对接说明

当后端API准备就绪时：

1. 修改 `mockApi.ts` 中的函数实现
2. 将模拟数据调用替换为实际的HTTP请求
3. 保持相同的函数签名和返回类型
4. 数据结构已在 `types.ts` 中定义，确保前后端一致性
