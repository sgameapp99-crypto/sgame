// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 開發服務器配置
  devServer: {
    host: '0.0.0.0',
    port: 5173
  },

  // 兼容性日期
  compatibilityDate: '2024-01-01'
})