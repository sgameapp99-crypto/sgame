# 组件和数据层重构说明

## 重构概述

本次重构主要解决了以下问题：

1. **组件组织混乱**: 将所有比赛相关的组件统一组织到 `components/games/` 目录
2. **数据管理混乱**: 将硬编码数据提取到独立的 `data/` 目录，使用模拟API服务
3. **类型安全**: 添加完整的TypeScript类型定义
4. **代码可维护性**: 清晰的目录结构和文档说明

## 重构内容

### 1. 组件重组

#### 原结构
```
components/
├── BaseballGameCard.vue
├── BasketballGameCard.vue
├── GameCard.vue
├── SoccerGameCard.vue
└── ... (其他组件)
```

#### 新结构
```
components/
├── games/                    # 比赛相关组件
│   ├── BaseballGameCard.vue
│   ├── BasketballGameCard.vue
│   ├── GameCard.vue
│   ├── SoccerGameCard.vue
│   └── README.md
└── ... (其他组件)
```

### 2. 数据层重组

#### 原结构
- 硬编码数据直接在组件文件中

#### 新结构
```
data/
├── mock-data.json       # 模拟数据
├── mockApi.ts          # API服务模拟
├── types.ts            # 类型定义
└── README.md           # 文档说明
```

### 3. 动态组件选择

实现了根据联盟ID自动选择合适的比赛显示组件：

- **棒球联盟** → BaseballGameCard
- **篮球联盟** → BasketballGameCard
- **足球联盟** → SoccerGameCard
- **其他** → GameCard (默认)

## API接口规范

### 比赛列表接口
```
GET /api/games?alliance={id}&date={date}&status={status}

Response:
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "timestamp": "2025-10-09T12:00:00Z"
}
```

### 联盟列表接口
```
GET /api/alliances

Response:
{
  "success": true,
  "data": [...],
  "timestamp": "2025-10-09T12:00:00Z"
}
```

## 数据结构说明

### UnifiedGame (统一比赛类型)
```typescript
interface UnifiedGame {
  id: number;
  league: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
  // 运动特定字段...
}
```

### Alliance (联盟类型)
```typescript
interface Alliance {
  id: number;
  name: string;
  sport: 'baseball' | 'basketball' | 'soccer' | ...;
  displayName: string;
  hasGames: boolean;
}
```

## 后端对接指南

### 步骤1: 保持接口一致性
确保后端API返回的数据结构与 `types.ts` 中定义的类型完全匹配。

### 步骤2: 替换模拟服务
修改 `data/mockApi.ts` 中的函数，将模拟数据调用替换为实际的HTTP请求：

```typescript
// 修改前 (模拟)
export async function getGames(params?: GamesRequestParams): Promise<GamesApiResponse> {
  await delay(300);
  // 返回模拟数据...
}

// 修改后 (真实API)
export async function getGames(params?: GamesRequestParams): Promise<GamesApiResponse> {
  const response = await fetch(`/api/games?${new URLSearchParams(params)}`);
  return response.json();
}
```

### 步骤3: 错误处理
添加适当的错误处理和重试逻辑。

### 步骤4: 数据验证
在接收数据时进行类型验证，确保数据完整性。

## 优势

### 1. 代码组织更清晰
- 相关组件集中管理
- 数据和类型定义分离
- 文档完善

### 2. 开发效率提升
- 模拟数据方便前端独立开发
- 类型安全减少运行时错误
- 模块化设计便于维护

### 3. 后端对接顺畅
- 明确的API接口规范
- 完整的数据类型定义
- 渐进式迁移策略

### 4. 可扩展性强
- 易于添加新的运动类型
- 组件复用性好
- 数据结构灵活

## 后续改进建议

1. **添加单元测试**: 为组件和API服务添加测试用例
2. **性能优化**: 实现数据缓存和懒加载
3. **国际化**: 支持多语言显示
4. **实时数据**: 集成WebSocket实现实时比分更新
5. **离线支持**: 添加Service Worker支持离线浏览

## 迁移检查清单

- [x] 组件重新组织到games目录
- [x] 模拟数据提取到独立文件
- [x] TypeScript类型定义完成
- [x] API服务模拟实现
- [x] 动态组件选择逻辑
- [x] 文档编写完成
- [ ] 后端API对接 (待后端准备就绪)
- [ ] 端到端测试 (待后端准备就绪)
