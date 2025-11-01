# ✅ 認證 API 更新完成 - role 欄位

## 📅 完成時間
**2025年10月23日**

---

## 🎯 更新概述

根據**前端團隊的建議**，我們更新了兩個認證相關的 API，在回應中都包含 `role` 欄位，讓前端可以更安全、更即時地獲取用戶角色資訊。

---

## ✅ 已更新的 API

### 1. 登入 API
**端點**: `POST /api/auth/login`

**變更**:
- 在回應中新增 `user` 物件
- 包含 `id`, `email`, `name`, `role`

**回應範例**:
```json
{
  "success": true,
  "message": "登入成功",
  "token": "...",
  "user": {
    "id": 11,
    "email": "admin@sgame.com",
    "name": "管理員",
    "role": "admin"  // ✅ 新增
  },
  "passwordExpiry": { ... }
}
```

### 2. Session API（根據前端建議）
**端點**: `GET /api/auth/session`

**變更**:
- 將原本的扁平結構改為 `user` 物件
- 新增 `role` 欄位

**回應範例**:
```json
{
  "success": true,
  "loggedIn": true,
  "user": {
    "id": 11,
    "email": "admin@sgame.com",
    "name": "管理員",
    "role": "admin",      // ✅ 新增
    "emailVerified": true
  },
  "passwordExpiry": { ... }
}
```

---

## 🎯 為什麼前端的建議很重要？

### Session API 返回 role 的好處

| 優點 | 說明 |
|------|------|
| 🔒 **安全性更好** | 不需要將 role 存在 localStorage，避免 XSS 風險 |
| ⚡ **即時性** | 如果角色被修改，下次檢查 session 時立即生效 |
| 🔄 **頁面刷新友好** | 前端可以在頁面刷新時重新獲取用戶資訊 |
| 📊 **單一真相來源** | 角色資訊始終從後端獲取，不會不同步 |

### 對比：舊方案 vs 新方案

#### ❌ 舊方案（localStorage）
```typescript
// 登入時存儲
localStorage.setItem('userRole', response.user.role);

// 使用時讀取
const role = localStorage.getItem('userRole');

問題：
- XSS 攻擊風險
- 角色變更不即時
- 可能與後端不一致
```

#### ✅ 新方案（Session API）
```typescript
// 頁面載入時檢查 session
const response = await api.get('/auth/session');
const role = response.user.role;

優點：
- 安全性高
- 即時生效
- 自動同步
```

---

## 📊 測試結果

### ✅ 登入 API 測試

**管理員登入**:
```bash
POST /api/auth/login
{"email":"admin@sgame.com","password":"Admin1234!@#"}

回應: role = "admin" ✅
```

**普通用戶登入**:
```bash
POST /api/auth/login
{"email":"user@test.com","password":"Test1234!@#"}

回應: role = "user" ✅
```

### ✅ Session API 測試

**管理員 Session**:
```bash
GET /api/auth/session (with cookie)

回應: user.role = "admin" ✅
```

**普通用戶 Session**:
```bash
GET /api/auth/session (with cookie)

回應: user.role = "user" ✅
```

---

## 💻 前端整合建議

### 1. 推薦的認證流程

```typescript
// App.vue 或 main.ts
import { useUserStore } from '@/stores/user';

async function initializeApp() {
  const userStore = useUserStore();
  
  try {
    // 檢查是否有有效的 session
    const response = await api.get('/auth/session');
    
    if (response.loggedIn) {
      // 從 session 恢復用戶狀態（包括 role）
      userStore.setUser(response.user);
      
      console.log('用戶已登入:', {
        email: response.user.email,
        role: response.user.role,
        isAdmin: response.user.role === 'admin',
      });
    }
  } catch (error) {
    console.log('未登入或 session 已過期');
  }
}

// 應用啟動時執行
initializeApp();
```

### 2. User Store 實作

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as number | null,
    email: null as string | null,
    name: null as string | null,
    role: 'user' as 'user' | 'admin',
    emailVerified: false,
  }),
  
  getters: {
    isAdmin: (state) => state.role === 'admin',
    isLoggedIn: (state) => state.id !== null,
  },
  
  actions: {
    // 登入
    async login(email: string, password: string) {
      const response = await api.post('/auth/login', { email, password });
      if (response.success) {
        this.setUser(response.user);
      }
      return response;
    },
    
    // 檢查 session（頁面刷新時使用）
    async checkSession() {
      const response = await api.get('/auth/session');
      if (response.loggedIn) {
        this.setUser(response.user);
        return true;
      }
      return false;
    },
    
    // 設定用戶資訊
    setUser(user: any) {
      this.id = user.id;
      this.email = user.email;
      this.name = user.name;
      this.role = user.role;
      this.emailVerified = user.emailVerified;
    },
  },
});
```

### 3. 在 AppHeader 中顯示管理入口

```vue
<template>
  <el-menu mode="horizontal">
    <el-menu-item index="/">首頁</el-menu-item>
    <el-menu-item index="/predictions">預測</el-menu-item>
    
    <!-- 管理員專屬入口 -->
    <el-menu-item 
      v-if="userStore.isAdmin" 
      index="/admin"
      class="admin-menu-item"
    >
      <el-icon><Setting /></el-icon>
      管理後台
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>
```

---

## 🔄 前端需要調整的地方

### Session API 回應結構變更

**之前（扁平結構）**:
```typescript
const userId = response.userId;     // ❌ 已棄用
const email = response.email;       // ❌ 已棄用
const name = response.name;         // ❌ 已棄用
```

**現在（巢狀結構）**:
```typescript
const userId = response.user.id;        // ✅ 正確
const email = response.user.email;      // ✅ 正確
const name = response.user.name;        // ✅ 正確
const role = response.user.role;        // ✅ 新增
```

---

## 📄 詳細文檔

1. **[登入API更新-role欄位.md](./api文檔/前端整合文檔1023/登入API更新-role欄位.md)**
   - 登入 API 詳細說明
   - 前端整合程式碼範例

2. **[Session-API更新-role欄位.md](./api文檔/前端整合文檔1023/Session-API更新-role欄位.md)**
   - Session API 詳細說明
   - 推薦的認證流程
   - 為什麼不應該使用 localStorage

3. **[預測系統整合-管理員.md](./api文檔/前端整合文檔1023/預測系統整合-管理員.md)**
   - 管理員 API 完整文檔

---

## 🔑 測試帳號

```
管理員：
Email: admin@sgame.com
Password: Admin1234!@#
Role: admin

普通用戶：
可以註冊任何新帳號
Role: user (預設)
```

---

## ✅ 總結

### 已完成的更新

1. ✅ **登入 API** 返回 `user.role`
2. ✅ **Session API** 返回 `user.role`（根據前端建議）
3. ✅ 所有測試通過（管理員 & 普通用戶）
4. ✅ 文檔已完成

### 前端接下來要做的事

1. ✅ 更新類型定義（LoginResponse, SessionResponse）
2. ✅ 實作 User Store（包含 checkSession 方法）
3. ✅ 在應用初始化時呼叫 `checkSession()`
4. ✅ 調整 Session API 的使用方式（`response.user.id` 而非 `response.userId`）
5. ✅ 移除 localStorage 相關的 role 儲存程式碼
6. ✅ 在 AppHeader 中為管理員顯示管理入口
7. ✅ 建立管理後台路由和頁面

### 關鍵優勢

| 特性 | 說明 |
|------|------|
| 🔒 **安全** | 不依賴 localStorage |
| ⚡ **即時** | 角色變更立即生效 |
| 🔄 **可靠** | 頁面刷新自動同步 |
| 📊 **一致** | 單一真相來源 |

---

**完成時間**: 2025年10月23日  
**測試狀態**: ✅ 全部通過  
**前端建議**: ✅ 已採納並實作  
**文檔狀態**: ✅ 已完成

**前端可以開始整合了！** 🎉

