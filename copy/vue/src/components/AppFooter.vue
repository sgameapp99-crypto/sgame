<template>
  <div class="footerbox-whole">
    <div class="footerbox">
      <!-- 電腦版 -->
      <ul class="footerhint">
        <div class="service_time">09:30~24:00</div>
        <li>
          <strong class="service_phone">客服電話</strong>
          <span>09 XXXX XXX</span>
        </li>
        <li>
          <RouterLink to="/contact">聯絡我們</RouterLink>
        </li>
        <li>
          <RouterLink to="/qa">常見問題</RouterLink>
        </li>
        <li>
          <RouterLink to="/terms">服務條款</RouterLink>
        </li>
      </ul>
      
      <div class="footernav">
        <ul>
          <li>
            <RouterLink to="/about">關於我們</RouterLink>
          </li>
        </ul>
      </div>

      <p class="copyrights" v-if="false">
        © 2025 玩運彩 
        <span>法律顧問：XXXX法律事務所 XXXX律師</span>
      </p>
      
      <!-- reCAPTCHA服務的宣告說明 -->
      <p class="recaptcha">
        This site is protected by reCAPTCHA and the Google 
        <a class="recaptcha__link" href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a> 
        and 
        <a class="recaptcha__link" href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Service</a> 
        apply.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用 Vue Router 的 RouterLink 組件
</script>

<style scoped>
/* 底部欄位樣式 - 按照原始CSS */
.footerbox-whole {
  color: rgb(102, 102, 102);
  font-family: '微軟正黑體', 'Microsoft JhengHei', '新細明體', PMingLiU, Arial, Helvetica, sans-serif;
  font-size: 12px;
  padding: 0;
  margin: 30px auto 0;
  width: 100%;
  min-width: 100%;
  clear: both;
  position: relative;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.footerbox {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 15px;
}

/* 客服資訊區域 */
.footerhint {
  list-style: none;
  margin: 0 0 15px 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.service_time {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.service_phone,
.service_email {
  color: #333;
  margin-right: 5px;
}

.footerhint li {
  margin: 0;
  padding: 0;
}

.footerhint a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footerhint a:hover {
  color: #333;
  text-decoration: underline;
}

/* 導航區域 */
.footernav {
  margin-bottom: 15px;
}

.footernav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 15px;
}

.footernav a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footernav a:hover {
  color: #333;
  text-decoration: underline;
}

/* 版權聲明 */
.copyrights {
  margin: 15px 0 10px 0;
  padding: 0;
  color: #666;
  font-size: 11px;
  line-height: 1.4;
}

.copyrights span {
  display: block;
  margin-top: 5px;
  font-size: 10px;
  color: #999;
}

/* reCAPTCHA 聲明 */
.recaptcha {
  margin: 10px 0 0 0;
  padding: 0;
  color: #999;
  font-size: 10px;
  line-height: 1.4;
}

.recaptcha__link {
  color: #666;
  text-decoration: none;
}

.recaptcha__link:hover {
  color: #333;
  text-decoration: underline;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .footerbox {
    padding: 15px 10px;
  }
  
  .footerhint {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .service_time {
    margin-right: 0;
    margin-bottom: 5px;
  }
  
  .footernav ul {
    flex-direction: column;
    gap: 8px;
  }
  
  .copyrights {
    font-size: 10px;
  }
  
  .copyrights span {
    font-size: 9px;
  }
  
  .recaptcha {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .footerbox {
    padding: 10px 8px;
  }
  
  .footerhint {
    gap: 8px;
  }
  
  .footerhint li {
    font-size: 11px;
  }
  
  .copyrights {
    margin: 10px 0 8px 0;
  }
}
</style>