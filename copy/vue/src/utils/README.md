# Utils - 工具函數庫

## 頭像處理工具 (`avatar.ts`)

### 📖 說明

根據後端 API 文檔，`avatarUrl` 是**相對路徑**（如 `/uploads/avatars/2-xxx.jpg`），前端需要組合為完整 URL。

此工具函數統一處理頭像 URL 的轉換邏輯，確保所有頁面顯示頭像的方式一致。

### 🚀 快速開始

```typescript
import { getAvatarUrl, DEFAULT_AVATAR } from '@/utils/avatar';

// 基本使用
const avatarUrl = getAvatarUrl(profile.avatarUrl);
// 返回: "https://example.com/uploads/avatars/2-xxx.jpg"

// 添加時間戳避免快取
const avatarUrlWithTimestamp = getAvatarUrl(profile.avatarUrl, true);
// 返回: "https://example.com/uploads/avatars/2-xxx.jpg?v=1234567890"

// 沒有頭像時
const defaultAvatar = getAvatarUrl(null);
// 返回: DEFAULT_AVATAR (黑色 SVG)
```

### 📚 API 文檔

#### `getAvatarUrl(avatarUrl, addTimestamp)`

將後端返回的相對路徑轉換為完整 URL。

**參數:**
- `avatarUrl` (string | null | undefined): 後端返回的頭像 URL
- `addTimestamp` (boolean, 可選): 是否添加時間戳，預設 `false`

**返回值:**
- `string`: 完整的頭像 URL

**範例:**

```typescript
// 相對路徑
getAvatarUrl("/uploads/avatars/2-xxx.jpg")
// → "https://example.com/uploads/avatars/2-xxx.jpg"

// 已經是完整 URL
getAvatarUrl("https://cdn.example.com/avatar.jpg")
// → "https://cdn.example.com/avatar.jpg"

// Data URL
getAvatarUrl("data:image/svg+xml;base64,...")
// → "data:image/svg+xml;base64,..."

// null 或 undefined
getAvatarUrl(null)
// → DEFAULT_AVATAR
```

#### `addTimestampToUrl(url, timestamp)`

為 URL 添加時間戳參數。

**參數:**
- `url` (string): 原始 URL
- `timestamp` (number, 可選): 自訂時間戳，預設使用當前時間

**返回值:**
- `string`: 帶有時間戳的 URL

**範例:**

```typescript
addTimestampToUrl("/uploads/avatars/2-xxx.jpg")
// → "/uploads/avatars/2-xxx.jpg?v=1234567890"

addTimestampToUrl("/avatar.jpg?size=large")
// → "/avatar.jpg?size=large&v=1234567890"

addTimestampToUrl("/avatar.jpg", 999999)
// → "/avatar.jpg?v=999999"
```

#### `DEFAULT_AVATAR`

預設黑色頭像常數（SVG data URL）。

```typescript
const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,...';
```

### 💻 在 Vue 組件中使用

#### 範例 1: 基本使用

```vue
<template>
  <div class="user-profile">
    <img :src="getAvatarUrl(user.avatarUrl)" :alt="user.name" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAvatarUrl } from '@/utils/avatar';

const user = ref({
  name: 'Test User',
  avatarUrl: '/uploads/avatars/2-xxx.jpg'
});
</script>
```

#### 範例 2: 帶時間戳避免快取

```vue
<template>
  <img :src="avatarWithTimestamp" alt="Avatar" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getAvatarUrl } from '@/utils/avatar';

const props = defineProps<{
  avatarUrl?: string;
}>();

const avatarWithTimestamp = computed(() => 
  getAvatarUrl(props.avatarUrl, true)
);
</script>
```

#### 範例 3: 在會員頁面中使用

```typescript
import { getAvatarUrl, addTimestampToUrl } from '@/utils/avatar';

// 載入會員資料時
async function loadMemberData() {
  const data = await memberAPI.getProfile(memberId);
  const profile = data.profile;
  
  // 處理頭像 URL
  const avatarUrl = profile.avatarUrl || profile.avatar;
  memberInfo.value = {
    ...profile,
    avatarUrl: avatarUrl ? addTimestampToUrl(avatarUrl) : undefined
  };
}

// 在模板中顯示
// <img :src="getAvatarUrl(memberInfo.avatarUrl)" />
```

#### 範例 4: 處理頭像更新事件

```typescript
import { addTimestampToUrl } from '@/utils/avatar';

function handleAvatarUpdate(event: CustomEvent) {
  if (event.detail?.url) {
    const timestamp = new Date(event.detail.updatedAt || Date.now()).getTime();
    user.avatarUrl = addTimestampToUrl(event.detail.url, timestamp);
  }
}

window.addEventListener('avatar-updated', handleAvatarUpdate);
```

### 🎯 最佳實踐

1. **統一使用工具函數**
   - 不要在組件中重複實作頭像 URL 邏輯
   - 使用 `getAvatarUrl()` 確保一致性

2. **時間戳使用時機**
   - 頭像上傳後：使用時間戳避免快取
   - 一般顯示：不需要時間戳（減少 URL 長度）

3. **錯誤處理**
   - `getAvatarUrl()` 會自動處理 `null` 和 `undefined`
   - 使用 `<img>` 的 `onerror` 處理載入失敗：
     ```vue
     <img 
       :src="getAvatarUrl(avatarUrl)" 
       @error="handleImageError"
     />
     ```

4. **效能優化**
   - 使用 `computed` 避免重複計算
   - 只在需要時添加時間戳

### 🔧 與後端 API 整合

#### 後端返回格式

```json
{
  "success": true,
  "profile": {
    "id": 2,
    "name": "Test User",
    "avatarUrl": "/uploads/avatars/2-1761063369513.jpg",
    // ... 其他欄位
  }
}
```

#### 前端處理

```typescript
const profile = response.data.profile;

// ❌ 錯誤：直接使用相對路徑
// <img :src="profile.avatarUrl" />

// ✅ 正確：使用工具函數轉換
// <img :src="getAvatarUrl(profile.avatarUrl)" />
```

### 📝 相關文檔

- **後端 API 文檔**: `/api/前端整合文檔/頭像功能說明.md`
- **API Check**: `/api/前端整合文檔/API-Check.md`
- **完整交付清單**: `/api/前端整合文檔/前端團隊-API交付文檔.md`

### 🐛 常見問題

**Q: 為什麼頭像顯示不出來？**

A: 檢查以下幾點：
1. 是否使用了 `getAvatarUrl()` 函數？
2. 後端返回的 `avatarUrl` 格式是否正確？
3. 檢查瀏覽器開發者工具的 Network 標籤，確認圖片請求的 URL

**Q: 頭像更新後沒有變化？**

A: 使用時間戳避免快取：
```typescript
getAvatarUrl(avatarUrl, true)
// 或
addTimestampToUrl(avatarUrl)
```

**Q: 如何自訂預設頭像？**

A: 使用自己的 SVG 或圖片 URL：
```typescript
const myDefaultAvatar = '/assets/default-avatar.png';
const avatarUrl = profile.avatarUrl 
  ? getAvatarUrl(profile.avatarUrl) 
  : myDefaultAvatar;
```

---

**最後更新**: 2025-10-21  
**維護者**: SGame 前端團隊

