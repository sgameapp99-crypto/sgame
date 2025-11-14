# 🏠 Nuxt3 首頁設置指南

## 📋 概述

**目標**：創建SEO優化的Nuxt3首頁  
**技術棧**：Nuxt3 + Vue3 + TypeScript + Tailwind CSS  
**時間**：1-2天  
**複雜度**：中等 ⭐⭐⭐☆☆

---

## 🎯 為什麼需要Nuxt3首頁？

1. **服務器端渲染(SSR)** - 搜索引擎能直接抓取內容
2. **SEO友好** - 靜態內容，搜索引擎收錄效果好
3. **快速加載** - 首頁加載速度快
4. **混合架構** - 首頁SEO + 應用功能分離

---

## 🏗️ 架構設計

### 混合架構方案
```
主域名：https://sgame.com
├── 首頁 (/) → Nuxt3 (SSR) - SEO優化
└── 子域名：https://app.sgame.com
    ├── 預測功能 (/predict) → Vue+Vite (SPA)
    ├── 賽事資料 (/games) → Vue+Vite (SPA)
    └── 會員中心 (/member) → Vue+Vite (SPA)
```

### 技術棧選擇
- **首頁**：Nuxt3 + Vue3 + TypeScript + Tailwind CSS
- **應用**：Vue3 + Vite + TypeScript + Tailwind CSS
- **共享**：設計系統 + 組件庫 + 工具函數

---

## 📝 具體實施步驟

### 第一步：創建Nuxt3項目（30分鐘）

**在專案根目錄執行**：
```bash
# 創建首頁專案目錄
mkdir sgame-homepage
cd sgame-homepage

# 初始化 Nuxt3 項目
npx nuxi@latest init .

# 安裝依賴
npm install

# 安裝額外依賴
npm install @nuxtjs/tailwindcss @nuxtjs/color-mode @nuxtjs/google-fonts
```

### 第二步：配置項目結構（20分鐘）

**目錄結構**：
```
sgame-homepage/
├── pages/
│   └── index.vue          # 首頁
├── components/
│   ├── AppHeader.vue      # 頭部導航
│   ├── HeroSection.vue    # 英雄區塊
│   ├── FeaturesSection.vue # 功能特色
│   ├── StatsSection.vue   # 統計數據
│   ├── TestimonialsSection.vue # 用戶評價
│   └── AppFooter.vue      # 底部
├── assets/
│   └── css/
│       └── main.css       # 主樣式
├── public/
│   ├── images/            # 圖片資源
│   ├── favicon.ico        # 網站圖標
│   └── og-image.jpg       # Open Graph 圖片
├── nuxt.config.ts         # Nuxt 配置
└── package.json
```

### 第三步：配置Nuxt3（15分鐘）

**文件位置**：`sgame-homepage/nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  // 開發配置
  devtools: { enabled: true },
  
  // SEO 配置
  app: {
    head: {
      title: '運彩王預測平台 - 專業運動預測分析',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
        { name: 'description', content: '專業的運動預測分享平台，提供籃球、足球、棒球等各類運動的預測分析服務，與高手一起分析賽事，提升預測準確率。' },
        { name: 'keywords', content: '運動預測,籃球預測,足球預測,棒球預測,運彩分析,預測師' },
        { name: 'author', content: '運彩王預測平台' },
        
        // Open Graph 標籤
        { property: 'og:title', content: '運彩王預測平台 - 專業運動預測分析' },
        { property: 'og:description', content: '專業的運動預測分享平台，提供籃球、足球、棒球等各類運動的預測分析服務' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:url', content: 'https://sgame.com' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '運彩王預測平台' },
        
        // Twitter 卡片
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '運彩王預測平台 - 專業運動預測分析' },
        { name: 'twitter:description', content: '專業的運動預測分享平台，提供籃球、足球、棒球等各類運動的預測分析服務' },
        { name: 'twitter:image', content: '/og-image.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://sgame.com' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },

  // 模組配置
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts'
  ],

  // Tailwind CSS 配置
  tailwindcss: {
    configPath: './tailwind.config.ts'
  },

  // Google Fonts 配置
  googleFonts: {
    families: {
      'Noto+Sans+TC': [400, 500, 700],
      'Inter': [400, 500, 600, 700]
    }
  },

  // 構建配置
  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  // 性能優化
  experimental: {
    payloadExtraction: false
  }
})
```

### 第四步：創建首頁組件（2小時）

**文件位置**：`sgame-homepage/pages/index.vue`

```vue
<template>
  <div>
    <!-- SEO 優化的頭部 -->
    <Head>
      <Title>運彩王預測平台 - 專業運動預測分析</Title>
      <Meta name="description" content="專業的運動預測分享平台，提供籃球、足球、棒球等各類運動的預測分析服務，與高手一起分析賽事，提升預測準確率。" />
      <Meta name="keywords" content="運動預測,籃球預測,足球預測,棒球預測,運彩分析,預測師" />
      <Meta property="og:title" content="運彩王預測平台" />
      <Meta property="og:description" content="專業的運動預測分享平台" />
      <Meta property="og:image" content="/og-image.jpg" />
      <Meta name="twitter:card" content="summary_large_image" />
    </Head>

    <!-- 頁面內容 -->
    <AppHeader />
    <HeroSection />
    <FeaturesSection />
    <StatsSection />
    <TestimonialsSection />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 設置頁面元數據
useHead({
  title: '運彩王預測平台 - 專業運動預測分析',
  meta: [
    { name: 'description', content: '專業的運動預測分享平台，提供籃球、足球、棒球等各類運動的預測分析服務，與高手一起分析賽事，提升預測準確率。' }
  ]
})
</script>
```

### 第五步：創建組件（3小時）

#### HeroSection.vue
```vue
<template>
  <section class="hero-section bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          運彩王預測平台
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-8">
          專業的運動預測分析，與高手一起分析賽事，提升預測準確率
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="goToApp" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            立即開始預測
          </button>
          <button 
            @click="scrollToFeatures" 
            class="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            了解更多
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const goToApp = () => {
  window.location.href = 'https://app.sgame.com'
}

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
```

#### FeaturesSection.vue
```vue
<template>
  <section id="features" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">平台特色</h2>
        <p class="text-xl text-gray-600">專業的預測分析工具，助您提升預測準確率</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🏀</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">多種運動</h3>
          <p class="text-gray-600">支持籃球、足球、棒球等各類運動預測分析</p>
        </div>
        
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📊</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">數據分析</h3>
          <p class="text-gray-600">基於大數據的賽事分析和統計預測</p>
        </div>
        
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">專家社群</h3>
          <p class="text-gray-600">與認證專家預測師一起分析賽事</p>
        </div>
      </div>
    </div>
  </section>
</template>
```

#### StatsSection.vue
```vue
<template>
  <section class="py-20 bg-gray-900 text-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">平台數據</h2>
        <p class="text-xl text-gray-300">真實的用戶數據和預測統計</p>
      </div>
      
      <div class="grid md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
          <div class="text-gray-300">活躍用戶</div>
        </div>
        
        <div class="text-center">
          <div class="text-4xl font-bold text-green-400 mb-2">85%</div>
          <div class="text-gray-300">預測準確率</div>
        </div>
        
        <div class="text-center">
          <div class="text-4xl font-bold text-purple-400 mb-2">50,000+</div>
          <div class="text-gray-300">預測分析</div>
        </div>
        
        <div class="text-center">
          <div class="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
          <div class="text-gray-300">即時更新</div>
        </div>
      </div>
    </div>
  </section>
</template>
```

#### TestimonialsSection.vue
```vue
<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">用戶評價</h2>
        <p class="text-xl text-gray-600">聽聽用戶怎麼說</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-xl">👤</span>
            </div>
            <div>
              <div class="font-semibold text-gray-900">張先生</div>
              <div class="text-gray-600">籃球預測師</div>
            </div>
          </div>
          <p class="text-gray-600">"使用這個平台後，我的預測準確率提升了30%，非常推薦！"</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-xl">👤</span>
            </div>
            <div>
              <div class="font-semibold text-gray-900">李小姐</div>
              <div class="text-gray-600">足球預測師</div>
            </div>
          </div>
          <p class="text-gray-600">"數據分析非常詳細，幫助我做出更準確的預測判斷。"</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-xl">👤</span>
            </div>
            <div>
              <div class="font-semibold text-gray-900">王先生</div>
              <div class="text-gray-600">棒球預測師</div>
            </div>
          </div>
          <p class="text-gray-600">"社群討論很活躍，能學到很多預測技巧和經驗。"</p>
        </div>
      </div>
    </div>
  </section>
</template>
```

### 第六步：配置Tailwind CSS（15分鐘）

**文件位置**：`sgame-homepage/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      }
    }
  },
  plugins: []
} satisfies Config
```

### 第七步：創建樣式文件（10分鐘）

**文件位置**：`sgame-homepage/assets/css/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定義樣式 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .hero-section p {
    font-size: 1.125rem;
  }
}
```

---

## ✅ 檢查清單

### 項目設置
- [ ] 創建 Nuxt3 項目
- [ ] 安裝必要依賴
- [ ] 配置 nuxt.config.ts
- [ ] 設置 Tailwind CSS
- [ ] 創建項目目錄結構

### 組件開發
- [ ] 創建首頁主文件
- [ ] 開發 HeroSection 組件
- [ ] 開發 FeaturesSection 組件
- [ ] 開發 StatsSection 組件
- [ ] 開發 TestimonialsSection 組件
- [ ] 開發 AppHeader 和 AppFooter 組件

### SEO優化
- [ ] 設置頁面標題和描述
- [ ] 配置 Open Graph 標籤
- [ ] 設置 Twitter 卡片
- [ ] 添加結構化數據
- [ ] 配置 canonical URL

### 測試驗證
- [ ] 檢查頁面加載速度
- [ ] 測試響應式設計
- [ ] 驗證SEO元數據
- [ ] 測試跳轉功能
- [ ] 檢查移動端顯示

---

## 🚀 部署配置

### 本地開發
```bash
cd sgame-homepage
npm run dev
```

### 生產構建
```bash
cd sgame-homepage
npm run build
npm run preview
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name sgame.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📊 預期效果

### SEO效果
- 首頁被搜索引擎收錄
- 相關關鍵詞排名提升
- 頁面加載速度 < 3秒
- 移動端友好性測試通過

### 業務效果
- 增加自然流量
- 提升品牌曝光度
- 提高用戶轉換率
- 改善用戶體驗

---

## ⚠️ 注意事項

1. **域名配置** - 確保主域名正確配置
2. **SSL證書** - 配置HTTPS證書
3. **CDN設置** - 使用CDN加速靜態資源
4. **監控設置** - 設置性能監控和錯誤追蹤
5. **內容更新** - 定期更新首頁內容

---

## 📞 技術支持

如有問題，請聯繫：
- **技術負責人**：AI輔助工程師團隊
- **文檔更新**：2024年1月
- **版本**：v1.0

---

**💡 提醒：這個首頁專為SEO優化設計，可以大幅提升搜索引擎可見度！**
