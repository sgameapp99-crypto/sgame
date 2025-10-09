# 比赛组件组织说明

## 目录结构

```
src/components/games/
├── BaseballGameCard.vue     # 棒球比赛组件
├── BasketballGameCard.vue   # 篮球比赛组件
├── SoccerGameCard.vue       # 足球比赛组件
├── GameCard.vue            # 默认比赛组件
└── README.md               # 本文件
```

## 组件说明

### BaseballGameCard.vue
专用于棒球比赛的显示组件，基于原站设计，包含：

- **赛前预览**: 投手数据、团队打击数据、盘口数据
- **比赛进行中**: 实时比分、局数统计
- **比赛结束**: 完整统计表
- **特色功能**: 先发投手数据、团队打击统计、详细比分表

### BasketballGameCard.vue
专用于篮球比赛的显示组件，包含：

- **现代化的卡片设计**
- **球队Logo显示**
- **节数和时间显示**
- **统计信息展示**

### SoccerGameCard.vue
专用于足球比赛的显示组件，包含：

- **简洁的分数显示**
- **比赛时间指示器**
- **LIVE状态显示**

### GameCard.vue
通用比赛组件，作为其他组件的备选方案。

## 组件选择逻辑

在主组件中根据联盟ID自动选择合适的组件：

```typescript
// 棒球联盟: MLB、日棒、中职、韩棒、澳洲职棒、国际棒赛
const baseballAlliances = [1, 3, 4, 6, 11, 12, 83, 114];

// 篮球联盟: NBA、WNBA、澳洲职篮、日本职篮等
const basketballAlliances = [2, 5, 7, 8, 9, 10, 12, 97];

// 足球联盟
const soccerAlliances = [4];

function getGameComponent(allianceId: number) {
  if (baseballAlliances.includes(allianceId)) {
    return BaseballGameCard;
  } else if (basketballAlliances.includes(allianceId)) {
    return BasketballGameCard;
  } else if (soccerAlliances.includes(allianceId)) {
    return SoccerGameCard;
  } else {
    return GameCard; // 默认组件
  }
}
```

## 数据接口

所有组件都接受统一的 `game` prop，类型为 `UnifiedGame`：

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
  // 其他特定运动的字段...
}
```

## 添加新运动类型

要添加新的运动类型：

1. 在 `games/` 目录下创建新的组件
2. 在主组件的 `getGameComponent` 函数中添加新的联盟映射
3. 更新数据类型定义（如果需要新字段）
4. 在模拟数据中添加相应运动类型的比赛数据

## 样式说明

每个组件都有独特的样式设计，针对不同运动的特点：

- **棒球**: 复杂的数据表格，适合统计密集型运动
- **篮球**: 现代化的卡片布局，突出球队标识
- **足球**: 简洁明了的传统足球比分显示

所有组件都支持响应式设计，适配移动端显示。
