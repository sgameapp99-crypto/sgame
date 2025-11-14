<template>
  <div class="sales-prediction-rules">
    <div class="common-preface sellrule-preface">
      <h1>
        販售預測相關問題請看<a href="/qa?tb=3">常見問題</a>，
        亦可<a href="/contact">聯絡我們</a>及撥打09 XXXX XXX
      </h1>
      <div class="action-buttons">
        <a href="/qa" target="_blank" class="cbt-q">
          <span></span><strong>常見問題</strong>
        </a>
        <a href="/contact" target="_blank" class="cbt-c">
          <span></span><strong>聯絡我們</strong>
        </a>
        <a href="tel:09-XXXX-XXX" class="cbt-t">
          <span></span><strong>09 XXXX XXX</strong>
        </a>
      </div>
    </div>

    <div class="common-article-box">
      <h1>一般規定</h1>
      <ul class="common-liststyle">
        <li>同意消費者使用運彩王兌換券( 而非噱幣 )觀看已販售預測內容，並不計入分潤所得。</li>
        <li>同意若運彩王沒有收到消費者購買噱幣費用（小額付款、信用卡等），則退回從該消費者獲得的分潤。</li>
        <li>凡被運彩王討論區永久禁文者，將無條件取消<u>販售資格</u>及<u>殺手評選資格</u>。</li>
        <li>不得有任一下列違規行為，若有違規行為同意運彩王站方用販售預測違規處理辦法處理：
          <ul class="common-liststyle">
            <li>嚴重侵犯他人智慧財產權與專利權，抄襲其他會員公開或販售之賽事預測、詐欺、資料造假、蓄意破壞運彩王規範以及運彩王會員權益。</li>
            <li>於其他網站販售運彩王的預測或是以運彩王的名義販售預測。</li>
            <li>意圖於本站操作兩個以上帳號販售預測、操作兩個以上帳號點選預測或與他人討論後點選預測意圖成為殺手等行為，視同處理。</li>
            <li>不當使用運彩王帳號而影響運彩王商譽、風評、其他會員權益。</li>
            <li>未經允許，自行使用運彩王相關服務Logo於自身網站或未經允許使用運彩王官方名義。</li>
            <li>販售後又自行對外分享、或公布運彩王任何需要付費的內容(包含本身販售預測內容)。</li>
            <li>在運彩王討論區公布與實際預測內容不符合的資訊。</li>
            <li>
              會員於討論區、說明文及殺手小叮嚀張貼故意誇大、虛偽不實、引人錯誤之資訊、張貼對外連結或是暗示性宣傳同質性外站
              、張貼辱罵或挑釁等文字、張貼與賽事預測矛盾的資訊或是意圖私下通訊、或於說明文及殺手小叮嚀張貼非販售聯盟的資訊。
            </li>
            <li>將帳號出租、分享、出借、轉移、讓與、或販售給其他第三人使用</li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="common-article-box">
      <h1>權利歸屬</h1>
      <ul class="common-liststyle">
        <li>當您輸入賽事預測資訊，包括但不限於說明文及殺手小叮嚀，並經由運彩王站方系統成為販售預測內容時，即視為該等預測資訊之一切權益，包括但不限於著作權或營業祕密，皆屬於運彩王站方所有；未經運彩王站方書面同意，您不得再自行對外分享或販售。</li>
      </ul>
    </div>

    <div class="common-article-box">
      <h1>違規處理辦法</h1>
      <ul class="common-liststyle">
        <li>為了維護運彩王公平秩序以及消費者權益，訂有違規處理辦法，請勿以身試法。</li>
        <li><strong>若殺莊高手(或單月高手)有任一運彩王站方認定違反販售預測規範之行為，將被運彩王站方終止其販售資格、取消殺手評選資格，且分潤所得全數凍結歸零，不得申請提領。</strong></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 販售預測規範組件
</script>

<style scoped>
.sales-prediction-rules {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

.common-preface {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.common-preface h1 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  font-weight: 500;
}

.common-preface a {
  color: #ffd700;
  text-decoration: underline;
}

.common-preface a:hover {
  color: #ffed4e;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.cbt-q, .cbt-c, .cbt-t {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cbt-q:hover, .cbt-c:hover, .cbt-t:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.cbt-q span, .cbt-c span, .cbt-t span {
  margin-right: 8px;
  font-size: 1.2rem;
}

.common-article-box {
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.common-article-box h1 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.common-liststyle {
  margin: 15px 0;
  padding-left: 20px;
}

.common-liststyle li {
  margin-bottom: 10px;
  color: #555;
  position: relative;
}

.common-liststyle li::before {
  content: "•";
  color: #3498db;
  font-weight: bold;
  position: absolute;
  left: -15px;
}

.common-liststyle ul {
  margin-top: 10px;
  padding-left: 20px;
}

.common-liststyle ul li::before {
  content: "◦";
  color: #e74c3c;
}

.common-article-box u {
  text-decoration: underline;
  color: #e74c3c;
}

.common-article-box strong {
  color: #e74c3c;
  font-weight: bold;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cbt-q, .cbt-c, .cbt-t {
    width: 200px;
    justify-content: center;
  }
  
  .common-preface h1 {
    font-size: 1.2rem;
  }
}
</style>
