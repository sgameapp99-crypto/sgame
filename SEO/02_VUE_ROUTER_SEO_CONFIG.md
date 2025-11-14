# 🔧 Vue Router SEO 配置詳解

## 📋 概述

**目標**：為Vue專案配置動態SEO標題和描述  
**文件位置**：`copy/vue/src/router/index.ts`  
**技術**：Vue Router 4 + TypeScript  
**時間**：30分鐘

---

## 🎯 為什麼需要動態SEO？

1. **不同頁面不同標題** - 每個頁面都應該有獨特的標題和描述
2. **搜索引擎友好** - 幫助搜索引擎理解每個頁面的內容
3. **用戶體驗** - 用戶在瀏覽器標籤頁看到有意義的標題
4. **社交分享** - 分享時顯示正確的頁面信息

---

## 📝 完整配置方案

### 第一步：定義路由元數據類型

**文件位置**：`copy/vue/src/types/router.ts`（新建）

```typescript
// 路由元數據類型定義
export interface RouteMeta {
  title?: string;
  description?: string;
  keywords?: string;
  requiresAuth?: boolean;
  hideFromNav?: boolean;
}

// 擴展 Vue Router 的 RouteMeta 類型
declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}
```

### 第二步：更新路由配置

**文件位置**：`copy/vue/src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '../stores/session';
import HomePage from '../pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 首頁
    { 
      path: '/', 
      name: 'home', 
      component: HomePage,
      meta: { 
        title: '運彩王預測平台 - 專業運動預測分析 | 籃球足球棒球預測',
        description: '專業的運動預測分享平台，提供籃球、足球、棒球等各類運動的預測分析服務，與高手一起分析賽事，提升預測準確率。',
        keywords: '運動預測,籃球預測,足球預測,棒球預測,運彩分析,預測師'
      }
    },
    
    // 測試頁面
    { 
      path: '/test-nav', 
      name: 'test-nav', 
      component: () => import('../pages/TestNavigationPage.vue'),
      meta: { 
        title: '測試導覽 - 運彩王預測平台',
        description: '測試頁面導覽功能',
        hideFromNav: true
      }
    },
    
    // 論壇相關
    { 
      path: '/forum', 
      name: 'forum', 
      component: () => import('../pages/ForumPage.vue'),
      meta: { 
        title: '討論區 - 運彩王預測平台',
        description: '與其他用戶討論運動預測，分享分析心得和預測技巧',
        keywords: '運動預測討論,預測分析,運彩討論'
      }
    },
    
    // 用戶認證
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../pages/LoginPage.vue'),
      meta: { 
        title: '登入 - 運彩王預測平台',
        description: '登入您的帳戶，開始使用專業的運動預測服務',
        hideFromNav: true
      }
    },
    { 
      path: '/register', 
      name: 'register', 
      component: () => import('../pages/RegisterPage.vue'),
      meta: { 
        title: '註冊 - 運彩王預測平台',
        description: '註冊新帳戶，加入專業的運動預測社群',
        hideFromNav: true
      }
    },
    
    // 文章詳情
    { 
      path: '/post/:id', 
      name: 'post', 
      component: () => import('../pages/PostPage.vue'),
      meta: { 
        title: '文章詳情 - 運彩王預測平台',
        description: '查看詳細的運動預測分析文章',
        hideFromNav: true
      }
    },
    
    // 會員相關
    { 
      path: '/member', 
      name: 'member', 
      component: () => import('../pages/MemberPage.vue'),
      meta: { 
        title: '會員中心 - 運彩王預測平台',
        description: '管理您的個人資料、預測記錄和統計數據',
        requiresAuth: true
      }
    },
    { 
      path: '/member/:id', 
      name: 'member-view', 
      component: () => import('../pages/MemberPage.vue'),
      meta: { 
        title: '會員資料 - 運彩王預測平台',
        description: '查看其他會員的公開資料和預測記錄',
        hideFromNav: true
      }
    },
    
    // 預測功能
    { 
      path: '/predict', 
      name: 'predict', 
      component: () => import('../pages/PredictPage.vue'),
      meta: { 
        title: '運動預測 - 運彩王預測平台',
        description: '查看最新的運動預測分析，包括籃球、足球、棒球等各類運動賽事預測',
        keywords: '運動預測,籃球預測,足球預測,棒球預測,賽事預測'
      }
    },
    { 
      path: '/predict/buy', 
      name: 'predict-buy', 
      component: () => import('../pages/PredictPurchasePage.vue'),
      meta: { 
        title: '購買預測 - 運彩王預測平台',
        description: '購買專業的運動預測分析，提升您的預測準確率',
        requiresAuth: true
      }
    },
    
    // 賽事資料
    { 
      path: '/games', 
      name: 'games', 
      component: () => import('../pages/GamesPage.vue'),
      meta: { 
        title: '賽事資料 - 運彩王預測平台',
        description: '查看最新的運動賽事資料和統計分析，包括籃球、足球、棒球等各類運動',
        keywords: '賽事資料,運動統計,籃球資料,足球資料,棒球資料'
      }
    },
    { 
      path: '/games/list', 
      name: 'games-list', 
      component: () => import('../pages/GamesListPage.vue'),
      meta: { 
        title: '賽事清單 - 運彩王預測平台',
        description: '瀏覽所有可用的運動賽事，查看詳細的賽事信息和預測分析',
        keywords: '賽事清單,運動賽事,籃球賽事,足球賽事,棒球賽事'
      }
    },
    { 
      path: '/games/detail/:id?', 
      name: 'game-detail', 
      component: () => import('../pages/GameDetailPage.vue'),
      meta: { 
        title: '賽事詳情 - 運彩王預測平台',
        description: '查看特定賽事的詳細資料、歷史數據和預測分析',
        hideFromNav: true
      }
    },
    
    // 法律條款
    { 
      path: '/legal', 
      name: 'legal', 
      component: () => import('../pages/LegalPage.vue'),
      meta: { 
        title: '法律條款 - 運彩王預測平台',
        description: '查看平台的使用條款、隱私政策和相關法律聲明',
        hideFromNav: true
      }
    },
    
    // 404頁面
    { 
      path: '/:pathMatch(.*)*', 
      name: 'not-found', 
      component: () => import('../pages/NotFound.vue'),
      meta: { 
        title: '頁面未找到 - 運彩王預測平台',
        description: '抱歉，您訪問的頁面不存在',
        hideFromNav: true
      }
    },
  ],
});

// 路由守衛：認證檢查
router.beforeEach(async (to) => {
  const session = useSessionStore();
  if (to.meta && (to.meta as any).requiresAuth) {
    await session.fetchSession();
    if (!session.loggedIn) {
      const redirect = encodeURIComponent(to.fullPath);
      return { name: 'login', query: { redirect } };
    }
  }
  return true;
});

// 路由守衛：SEO優化
router.afterEach((to) => {
  // 設置頁面標題
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
  
  // 設置 meta description
  if (to.meta?.description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', to.meta.description as string);
  }
  
  // 設置 meta keywords
  if (to.meta?.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', to.meta.keywords as string);
  }
  
  // 設置 Open Graph 標籤
  if (to.meta?.title) {
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', to.meta.title as string);
  }
  
  if (to.meta?.description) {
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', to.meta.description as string);
  }
  
  // 設置 canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', window.location.origin + to.fullPath);
});

export default router;
```

### 第三步：創建SEO工具函數

**文件位置**：`copy/vue/src/utils/seo.ts`（新建）

```typescript
// SEO 工具函數
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

/**
 * 設置頁面SEO信息
 * @param data SEO數據
 */
export function setSEOData(data: SEOData) {
  // 設置標題
  document.title = data.title;
  
  // 設置 meta description
  setMetaTag('name', 'description', data.description);
  
  // 設置 meta keywords
  if (data.keywords) {
    setMetaTag('name', 'keywords', data.keywords);
  }
  
  // 設置 Open Graph 標籤
  setMetaTag('property', 'og:title', data.title);
  setMetaTag('property', 'og:description', data.description);
  if (data.image) {
    setMetaTag('property', 'og:image', data.image);
  }
  if (data.url) {
    setMetaTag('property', 'og:url', data.url);
  }
  
  // 設置 Twitter 卡片
  setMetaTag('name', 'twitter:title', data.title);
  setMetaTag('name', 'twitter:description', data.description);
  if (data.image) {
    setMetaTag('name', 'twitter:image', data.image);
  }
}

/**
 * 設置或更新 meta 標籤
 * @param attribute 屬性名稱
 * @param name 標籤名稱
 * @param content 內容
 */
function setMetaTag(attribute: string, name: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * 生成頁面標題
 * @param pageTitle 頁面標題
 * @param siteName 網站名稱
 * @returns 完整標題
 */
export function generatePageTitle(pageTitle: string, siteName: string = '運彩王預測平台'): string {
  return `${pageTitle} | ${siteName}`;
}

/**
 * 生成頁面描述
 * @param content 內容描述
 * @param maxLength 最大長度
 * @returns 優化的描述
 */
export function generatePageDescription(content: string, maxLength: number = 160): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength - 3) + '...';
}
```

### 第四步：在組件中使用SEO

**示例：在頁面組件中使用**

```vue
<!-- pages/PredictPage.vue -->
<template>
  <div class="predict-page">
    <!-- 頁面內容 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { setSEOData } from '@/utils/seo';

// 設置頁面SEO
onMounted(() => {
  setSEOData({
    title: '運動預測 - 運彩王預測平台',
    description: '查看最新的運動預測分析，包括籃球、足球、棒球等各類運動賽事預測',
    keywords: '運動預測,籃球預測,足球預測,棒球預測,賽事預測',
    image: '/images/predict-og-image.jpg',
    url: window.location.href
  });
});
</script>
```

---

## ✅ 檢查清單

### 配置檢查
- [ ] 創建路由元數據類型定義
- [ ] 更新所有路由的 meta 標籤
- [ ] 添加路由守衛處理SEO
- [ ] 創建SEO工具函數
- [ ] 測試動態標題和描述

### 功能測試
- [ ] 檢查頁面標題是否正確更新
- [ ] 檢查 meta 描述是否正確更新
- [ ] 檢查 Open Graph 標籤是否正確
- [ ] 檢查 canonical URL 是否正確
- [ ] 測試所有頁面的SEO效果

---

## 🚀 預期效果

### 立即效果
- 每個頁面都有獨特的標題和描述
- 瀏覽器標籤頁顯示有意義的標題
- 社交媒體分享時顯示正確的預覽

### 長期效果
- 提升搜索引擎排名
- 改善用戶體驗
- 增加頁面點擊率

---

## ⚠️ 注意事項

1. **標題長度** - 保持標題在60字符以內
2. **描述長度** - 保持描述在160字符以內
3. **關鍵詞密度** - 避免關鍵詞堆砌
4. **內容相關性** - 確保SEO內容與頁面內容相關
5. **定期更新** - 根據內容變化更新SEO信息

---

## 📞 技術支持

如有問題，請聯繫：
- **技術負責人**：AI輔助工程師團隊
- **文檔更新**：2024年1月
- **版本**：v1.0

---

**💡 提醒：這個配置可以讓每個頁面都有獨特的SEO優化！**







