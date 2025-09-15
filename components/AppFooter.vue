<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- 主要內容區域 -->
      <div class="footer-main">
        <!-- 品牌資訊 -->
        <div class="footer-brand">
          <div class="brand-info">
            <img src="/images/logo.png" alt="玩運彩預測平台" class="footer-logo" />
            <h3 class="brand-title">玩運彩預測平台</h3>
          </div>
          <p class="brand-description">
            專業的運動預測分享平台，提供籃球、足球、棒球等各類運動預測分析，與高手一起贏得更多收益！
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <el-icon><Share /></el-icon>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <el-icon><Share /></el-icon>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <el-icon><Share /></el-icon>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <el-icon><Share /></el-icon>
            </a>
          </div>
        </div>

        <!-- 快速鏈接 -->
        <div class="footer-links">
          <div class="link-group">
            <h4 class="group-title">平台功能</h4>
            <ul class="link-list">
              <li><NuxtLink to="/predictions">預測中心</NuxtLink></li>
              <li><NuxtLink to="/discussion">討論區</NuxtLink></li>
              <li><NuxtLink to="/leaderboard">排行榜</NuxtLink></li>
              <li><NuxtLink to="/analysis">數據分析</NuxtLink></li>
            </ul>
          </div>

          <div class="link-group">
            <h4 class="group-title">用戶服務</h4>
            <ul class="link-list">
              <li><NuxtLink to="/help">幫助中心</NuxtLink></li>
              <li><NuxtLink to="/contact">聯絡我們</NuxtLink></li>
              <li><NuxtLink to="/feedback">意見回饋</NuxtLink></li>
              <li><NuxtLink to="/tutorial">新手教學</NuxtLink></li>
            </ul>
          </div>

          <div class="link-group">
            <h4 class="group-title">關於我們</h4>
            <ul class="link-list">
              <li><NuxtLink to="/about">公司介紹</NuxtLink></li>
              <li><NuxtLink to="/team">團隊成員</NuxtLink></li>
              <li><NuxtLink to="/careers">加入我們</NuxtLink></li>
              <li><NuxtLink to="/news">最新消息</NuxtLink></li>
            </ul>
          </div>

          <div class="link-group">
            <h4 class="group-title">法律條款</h4>
            <ul class="link-list">
              <li><NuxtLink to="/terms">使用條款</NuxtLink></li>
              <li><NuxtLink to="/privacy">隱私政策</NuxtLink></li>
              <li><NuxtLink to="/disclaimer">免責聲明</NuxtLink></li>
              <li><NuxtLink to="/responsible-gaming">負責任博彩</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 聯絡資訊 -->
      <div class="footer-contact">
        <div class="contact-info">
          <div class="contact-item">
            <el-icon><Phone /></el-icon>
            <span>客服專線: 0800-123-456</span>
          </div>
          <div class="contact-item">
            <el-icon><Message /></el-icon>
            <span>客服信箱: support@sgame.com</span>
          </div>
          <div class="contact-item">
            <el-icon><Clock /></el-icon>
            <span>服務時間: 週一至週日 09:00-21:00</span>
          </div>
        </div>
      </div>

      <!-- 底部版權 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2024 玩運彩預測平台. 版權所有.</p>
          <p class="disclaimer-text">
            本平台僅提供運動預測分析服務，不涉及任何形式的賭博行為。請理性分析，謹慎投資。
          </p>
        </div>
        <div class="footer-meta">
          <span>版本 {{ config.public.appVersion }}</span>
          <span class="separator">|</span>
          <span>最後更新: {{ formatDate(new Date()) }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Share, Phone, Message, Clock } from '@element-plus/icons-vue'

// 應用配置
const config = useRuntimeConfig()

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 1rem;
}

/* 主要內容區域 */
.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

/* 品牌資訊 */
.footer-brand {
  max-width: 400px;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-logo {
  height: 40px;
  width: auto;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  margin: 0;
}

.brand-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #bdc3c7;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #ecf0f1;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: #3498db;
  transform: translateY(-2px);
}

/* 快速鏈接 */
.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.link-group {
  min-width: 0;
}

.group-title {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #3498db;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 0.5rem;
}

.link-list a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.link-list a:hover {
  color: #3498db;
}

/* 聯絡資訊 */
.footer-contact {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.contact-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ecf0f1;
  font-size: 0.9rem;
}

.contact-item .el-icon {
  color: #3498db;
}

/* 底部版權 */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  flex: 1;
}

.copyright p {
  margin: 0;
  font-size: 0.875rem;
  color: #bdc3c7;
}

.disclaimer-text {
  font-size: 0.75rem !important;
  color: #95a5a6 !important;
  margin-top: 0.5rem !important;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #95a5a6;
}

.separator {
  color: #7f8c8d;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 2rem 1rem 1rem;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .brand-info {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .brand-title {
    font-size: 1.25rem;
  }
  
  .contact-item {
    font-size: 0.8rem;
  }
}
</style>
