# 登入 API 更新 - 返回 role 欄位

## 📅 更新時間

**2025年10月23日**

---

## ✅ 更新內容

### 修改的 API

**端點**: `POST /api/auth/login`

### 更新說明

登入 API 現在會在回應中返回用戶的角色資訊（`role` 欄位），用於前端判斷是否為管理員。

---

## 📋 API 變更詳情

### 請求（無變化）

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 回應（新增 user 物件）

#### 之前的回應格式

```json
{
  "success": true,
  "message": "登入成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "passwordExpiry": {
    "isExpired": false,
    "isWarning": false,
    "daysUntilExpiry": 179,
    "message": "您的密碼狀態正常，距離過期還有 179 天"
  }
}
```

#### 現在的回應格式 ✨

```json
{
  "success": true,
  "message": "登入成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {                    // ← 新增
    "id": 11,
    "email": "admin@sgame.com",
    "name": "管理員",
    "role": "admin"            // ← 關鍵欄位
  },
  "passwordExpiry": {
    "isExpired": false,
    "isWarning": false,
    "daysUntilExpiry": 179,
    "message": "您的密碼狀態正常，距離過期還有 179 天"
  }
}
```

---

## 🎯 角色類型

| 角色值 | 說明 | 權限 |
|--------|------|------|
| `"user"` | 普通用戶 | 基本功能使用權限 |
| `"admin"` | 管理員 | 完整管理後台權限 |

---

## 📝 測試結果

### 測試 1: 管理員登入

**請求**:
```bash
curl -X POST "https://10.2.0.2:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sgame.com","password":"Admin1234!@#"}'
```

**回應**:
```json
{
  "success": true,
  "message": "登入成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 11,
    "email": "admin@sgame.com",
    "name": "管理員",
    "role": "admin"  // ✅ 管理員角色
  },
  "passwordExpiry": { ... }
}
```

### 測試 2: 普通用戶登入

**請求**:
```bash
curl -X POST "https://10.2.0.2:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@test.com","password":"Test1234!@#"}'
```

**回應**:
```json
{
  "success": true,
  "message": "登入成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 32,
    "email": "testuser@test.com",
    "name": "測試用戶",
    "role": "user"  // ✅ 普通用戶角色
  },
  "passwordExpiry": { ... }
}
```

---

## 💻 前端整合指南

### 1. 更新登入回應類型定義

```typescript
// types/auth.ts
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';  // ← 新增
  };
  passwordExpiry: {
    isExpired: boolean;
    isWarning: boolean;
    daysUntilExpiry: number;
    message: string;
  };
}
```

### 2. 儲存用戶角色資訊

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as number | null,
    email: null as string | null,
    name: null as string | null,
    role: 'user' as 'user' | 'admin',  // ← 新增
    token: null as string | null,
  }),
  
  getters: {
    isAdmin: (state) => state.role === 'admin',  // ← 新增
    isLoggedIn: (state) => !!state.token,
  },
  
  actions: {
    async login(email: string, password: string) {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      
      if (response.success) {
        this.id = response.user.id;
        this.email = response.user.email;
        this.name = response.user.name;
        this.role = response.user.role;  // ← 儲存角色
        this.token = response.token;
        
        // 儲存到 localStorage
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('token', response.token);
      }
      
      return response;
    },
    
    logout() {
      this.id = null;
      this.email = null;
      this.name = null;
      this.role = 'user';
      this.token = null;
      
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
    },
  },
});
```

### 3. 在 AppHeader 中顯示管理入口

```vue
<!-- components/AppHeader.vue -->
<template>
  <el-header>
    <el-menu mode="horizontal" router>
      <el-menu-item index="/">首頁</el-menu-item>
      <el-menu-item index="/predictions">預測</el-menu-item>
      <el-menu-item index="/profile">會員中心</el-menu-item>
      
      <!-- 管理員專屬入口 -->
      <el-menu-item 
        v-if="userStore.isAdmin" 
        index="/admin"
        class="admin-menu-item"
      >
        <el-icon><Setting /></el-icon>
        <span>管理後台</span>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { Setting } from '@element-plus/icons-vue';

const userStore = useUserStore();
</script>

<style scoped>
.admin-menu-item {
  color: #f56c6c !important;
  font-weight: 600;
}

.admin-menu-item:hover {
  background-color: #fef0f0 !important;
}
</style>
```

### 4. 路由守衛

```typescript
// router/index.ts
import { useUserStore } from '@/stores/user';

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  // 檢查管理員路由
  if (to.path.startsWith('/admin')) {
    if (!userStore.isAdmin) {
      ElMessage.error('您沒有權限訪問管理後台');
      next('/');
      return;
    }
  }
  
  next();
});
```

### 5. 測試程式碼

```typescript
// 測試登入並檢查角色
async function testLogin() {
  const userStore = useUserStore();
  
  // 測試管理員登入
  const adminResult = await userStore.login(
    'admin@sgame.com',
    'Admin1234!@#'
  );
  
  console.log('管理員登入:', {
    isAdmin: userStore.isAdmin,  // 應該是 true
    role: userStore.role,         // 應該是 'admin'
  });
  
  // 測試普通用戶登入
  const userResult = await userStore.login(
    'user@test.com',
    'Test1234!@#'
  );
  
  console.log('普通用戶登入:', {
    isAdmin: userStore.isAdmin,  // 應該是 false
    role: userStore.role,         // 應該是 'user'
  });
}
```

---

## ✅ 向後兼容性

### 這個修改是完全向後兼容的！

1. **舊版前端不受影響**
   - 如果前端不讀取 `user` 欄位，完全不會有問題
   - 原有的 `token` 和 `passwordExpiry` 欄位都保持不變

2. **新版前端可以使用新功能**
   - 前端可以選擇性地使用 `user.role` 來判斷管理員
   - 不需要修改現有的登入邏輯，只需要增加角色判斷即可

3. **不需要建立管理員專用登入 API**
   - 管理員和普通用戶使用同一個登入端點
   - 根據資料庫中的 `role` 欄位自動返回對應角色

---

## 🔒 安全性說明

1. **角色存儲**
   - 用戶角色存儲在資料庫的 `users` 表中
   - 欄位名稱: `role`
   - 預設值: `"user"`

2. **權限驗證**
   - 後端管理 API 使用 `requireAdmin` 中間件驗證權限
   - 中間件會從資料庫查詢用戶的實際角色
   - 僅憑前端的 `role` 欄位無法繞過權限檢查

3. **Token 內容**
   - JWT Token 中僅包含 `userId` 和 `email`
   - 不包含 `role` 資訊
   - 每次請求都會從資料庫重新驗證用戶角色

---

## 📌 測試管理員帳號

```
Email: admin@sgame.com
Password: Admin1234!@#
Role: admin
```

---

## 🚀 下一步

前端可以開始實作：

1. ✅ 更新登入回應的類型定義
2. ✅ 在 store 中儲存 `role` 欄位
3. ✅ 在 AppHeader 中為管理員顯示「管理後台」入口
4. ✅ 建立 `/admin` 路由和管理後台頁面
5. ✅ 實作路由守衛，保護管理後台路由
6. ✅ 開始實作管理後台的核心功能

管理員 API 文檔請參考：
- [預測系統整合-管理員.md](./預測系統整合-管理員.md)

---

## 📝 注意事項

1. 前端應該將 `role` 存儲在 Pinia store 中，而不僅僅是 localStorage
2. 登出時記得清除 `role` 資訊
3. 路由守衛應該檢查 `isAdmin` 狀態
4. 管理後台入口應該只對管理員顯示（使用 `v-if="isAdmin"`）

---

**完成時間**: 2025年10月23日  
**測試狀態**: ✅ 已測試通過  
**向後兼容**: ✅ 完全兼容

