<template>
  <div class="payment-page">
    <!-- 頂部橫幅 -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1>付款方式</h1>
        <p class="hero-subtitle">多元支付方式，安全便利有保障</p>
      </div>
    </section>

    <main class="payment-content">
      <!-- 付款方式總覽 -->
      <section class="payment-overview">
        <div class="section-container">
          <span class="section-label center">Payment Methods</span>
          <h2 class="section-title">我們提供以下付款方式</h2>
          <p class="section-desc">
            pureLife 提供多種安全便利的付款方式，讓您購物無憂
          </p>

          <div class="payment-cards">
            <!-- 信用卡 -->
            <div class="payment-card">
              <div class="card-header">
                <div class="card-icon credit-card">
                  <i class="fas fa-credit-card"></i>
                </div>
                <h3>信用卡付款</h3>
                <span class="recommend-badge">推薦</span>
              </div>
              <div class="card-body">
                <p class="card-desc">使用信用卡線上即時付款，快速又安全</p>
                
                <div class="card-brands">
                  <div class="brand-item">
                    <i class="fab fa-cc-visa"></i>
                    <span>VISA</span>
                  </div>
                  <div class="brand-item">
                    <i class="fab fa-cc-mastercard"></i>
                    <span>MasterCard</span>
                  </div>
                  <div class="brand-item">
                    <i class="fab fa-cc-jcb"></i>
                    <span>JCB</span>
                  </div>
                </div>

                <ul class="feature-list">
                  <li><i class="fas fa-check"></i>即時完成付款</li>
                  <li><i class="fas fa-check"></i>SSL 加密安全交易</li>
                  <li><i class="fas fa-check"></i>支援 3D 驗證</li>
                  <li><i class="fas fa-check"></i>可累積信用卡紅利</li>
                </ul>

                <div class="payment-steps">
                  <h4>付款流程</h4>
                  <div class="steps">
                    <div class="step">
                      <span class="step-number">1</span>
                      <span class="step-text">選擇信用卡付款</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-chevron-right"></i></div>
                    <div class="step">
                      <span class="step-number">2</span>
                      <span class="step-text">輸入卡片資訊</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-chevron-right"></i></div>
                    <div class="step">
                      <span class="step-number">3</span>
                      <span class="step-text">完成驗證付款</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ATM 轉帳 -->
            <div class="payment-card">
              <div class="card-header">
                <div class="card-icon atm">
                  <i class="fas fa-university"></i>
                </div>
                <h3>ATM 轉帳</h3>
              </div>
              <div class="card-body">
                <p class="card-desc">取得虛擬帳號後，透過 ATM 或網路銀行轉帳</p>

                <div class="info-box">
                  <i class="fas fa-info-circle"></i>
                  <div>
                    <strong>付款期限</strong>
                    <span>請於訂單成立後 <em>3 天內</em> 完成轉帳</span>
                  </div>
                </div>

                <ul class="feature-list">
                  <li><i class="fas fa-check"></i>免手續費</li>
                  <li><i class="fas fa-check"></i>支援所有銀行</li>
                  <li><i class="fas fa-check"></i>可使用網路銀行</li>
                  <li><i class="fas fa-check"></i>24 小時皆可轉帳</li>
                </ul>

                <div class="payment-steps">
                  <h4>付款流程</h4>
                  <div class="steps">
                    <div class="step">
                      <span class="step-number">1</span>
                      <span class="step-text">取得虛擬帳號</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-chevron-right"></i></div>
                    <div class="step">
                      <span class="step-number">2</span>
                      <span class="step-text">ATM/網銀轉帳</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-chevron-right"></i></div>
                    <div class="step">
                      <span class="step-number">3</span>
                      <span class="step-text">系統自動確認</span>
                    </div>
                  </div>
                </div>

                <div class="notice-box">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span>轉帳金額須與訂單金額完全相符，系統才會自動確認入帳</span>
                </div>
              </div>
            </div>

            <!-- 超商代碼 -->
            <div class="payment-card">
              <div class="card-header">
                <div class="card-icon convenience">
                  <i class="fas fa-store"></i>
                </div>
                <h3>超商代碼繳費</h3>
              </div>
              <div class="card-body">
                <p class="card-desc">取得繳費代碼後，至超商多媒體機台列印繳費單</p>

                <div class="store-logos">
                  <div class="store-item">
                    <span class="store-icon">7</span>
                    <span>7-ELEVEN</span>
                  </div>
                  <div class="store-item">
                    <span class="store-icon">F</span>
                    <span>全家</span>
                  </div>
                  <div class="store-item">
                    <span class="store-icon">H</span>
                    <span>萊爾富</span>
                  </div>
                  <div class="store-item">
                    <span class="store-icon">O</span>
                    <span>OK</span>
                  </div>
                </div>

                <div class="info-box">
                  <i class="fas fa-info-circle"></i>
                  <div>
                    <strong>付款期限</strong>
                    <span>請於訂單成立後 <em>7 天內</em> 完成繳費</span>
                  </div>
                </div>

                <ul class="feature-list">
                  <li><i class="fas fa-check"></i>免轉帳手續費</li>
                  <li><i class="fas fa-check"></i>全台超商皆可繳費</li>
                  <li><i class="fas fa-check"></i>現金付款免信用卡</li>
                </ul>

                <div class="payment-steps">
                  <h4>付款流程</h4>
                  <div class="steps vertical">
                    <div class="step">
                      <span class="step-number">1</span>
                      <span class="step-text">取得繳費代碼</span>
                    </div>
                    <div class="step">
                      <span class="step-number">2</span>
                      <span class="step-text">至超商多媒體機台輸入代碼</span>
                    </div>
                    <div class="step">
                      <span class="step-number">3</span>
                      <span class="step-text">列印繳費單至櫃檯繳費</span>
                    </div>
                    <div class="step">
                      <span class="step-number">4</span>
                      <span class="step-text">系統自動確認入帳</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 安全保障 -->
      <section class="security-section">
        <div class="section-container">
          <span class="section-label center">Security</span>
          <h2 class="section-title">交易安全保障</h2>
          
          <div class="security-grid">
            <div class="security-item">
              <div class="security-icon">
                <i class="fas fa-lock"></i>
              </div>
              <h4>SSL 加密傳輸</h4>
              <p>所有交易資料皆採用 256 位元 SSL 加密，確保傳輸安全</p>
            </div>
            <div class="security-item">
              <div class="security-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h4>PCI DSS 認證</h4>
              <p>金流系統通過國際支付卡產業資料安全標準認證</p>
            </div>
            <div class="security-item">
              <div class="security-icon">
                <i class="fas fa-user-shield"></i>
              </div>
              <h4>隱私保護</h4>
              <p>個人資料依法保護，絕不外洩或作其他用途</p>
            </div>
            <div class="security-item">
              <div class="security-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h4>客服支援</h4>
              <p>如有付款問題，可聯繫客服協助處理</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 常見問題 -->
      <section class="faq-section">
        <div class="section-container">
          <span class="section-label center">FAQ</span>
          <h2 class="section-title">付款常見問題</h2>

          <div class="faq-list">
            <div class="faq-item">
              <div class="faq-question">
                <i class="fas fa-question-circle"></i>
                <span>付款後多久會出貨？</span>
              </div>
              <p class="faq-answer">
                確認收到款項後，我們將於 1-3 個工作天內安排出貨。信用卡付款確認最快，ATM 及超商付款需等待銀行端確認入帳。
              </p>
            </div>
            <div class="faq-item">
              <div class="faq-question">
                <i class="fas fa-question-circle"></i>
                <span>可以開立發票嗎？</span>
              </div>
              <p class="faq-answer">
                可以！結帳時可選擇電子發票或紙本發票。如需統編，請於結帳時填寫公司統一編號及抬頭。
              </p>
            </div>
            <div class="faq-item">
              <div class="faq-question">
                <i class="fas fa-question-circle"></i>
                <span>付款失敗怎麼辦？</span>
              </div>
              <p class="faq-answer">
                如遇付款失敗，請確認卡片額度是否足夠、卡片是否開啟線上交易功能。若問題持續，建議更換付款方式或聯繫客服。
              </p>
            </div>
          </div>

          <div class="more-questions">
            <p>還有其他問題嗎？</p>
            <router-link to="/faq" class="link-button">
              查看更多常見問題
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// 付款方式頁面 - 靜態展示頁面
</script>

<style scoped>
/* ========== 全域變數 ========== */
.payment-page {
  --primary-color: #3A6B5C;
  --primary-light: #4A7B6C;
  --primary-lighter: #E8F0EA;
  --primary-dark: #2A5B4C;
  --text-primary: #2C3E3A;
  --text-secondary: #5A6E6A;
  --bg-cream: #F5F3ED;
  --bg-white: #FFFFFF;
  --shadow-sm: 0 2px 8px rgba(58, 107, 92, 0.08);
  --shadow-md: 0 4px 16px rgba(58, 107, 92, 0.12);
  --shadow-lg: 0 8px 32px rgba(58, 107, 92, 0.16);
  
  background-color: var(--bg-cream);
  min-height: 100vh;
}

/* ========== Hero Banner ========== */
.hero-banner {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.hero-banner h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
}

/* ========== 共用樣式 ========== */
.payment-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-container {
  padding: 60px 0;
}

.section-label {
  display: inline-block;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 12px;
}

.section-label.center {
  display: block;
  text-align: center;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 16px;
}

.section-desc {
  text-align: center;
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 48px;
}

/* ========== 付款卡片 ========== */
.payment-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.payment-card {
  background: var(--bg-white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.payment-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card-header {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #eee;
  position: relative;
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.card-icon i {
  font-size: 28px;
  color: white;
}

.card-icon.credit-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-icon.atm {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.card-icon.convenience {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.recommend-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.card-body {
  padding: 24px;
}

.card-desc {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 20px;
  text-align: center;
}

/* 信用卡品牌 */
.card-brands {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.brand-item i {
  font-size: 32px;
  color: var(--text-secondary);
}

.brand-item span {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 超商 Logo */
.store-logos {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.store-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.store-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-lighter);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
}

.store-item span {
  font-size: 11px;
  color: var(--text-secondary);
}

/* 功能列表 */
.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.feature-list li i {
  color: var(--primary-color);
  font-size: 14px;
}

/* 資訊框 */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--primary-lighter);
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.info-box > i {
  color: var(--primary-color);
  font-size: 18px;
  margin-top: 2px;
}

.info-box div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-box strong {
  color: var(--text-primary);
  font-size: 14px;
}

.info-box span {
  color: var(--text-secondary);
  font-size: 13px;
}

.info-box em {
  color: var(--primary-color);
  font-style: normal;
  font-weight: 600;
}

/* 注意框 */
.notice-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFF8E6;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.notice-box i {
  color: #E6A23C;
  font-size: 16px;
}

.notice-box span {
  color: #865A00;
  font-size: 13px;
}

/* 付款流程 */
.payment-steps {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.payment-steps h4 {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 600;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.steps.vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 24px;
  height: 24px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.step-arrow {
  color: #ddd;
  font-size: 12px;
}

/* ========== 安全保障 ========== */
.security-section {
  background: var(--bg-white);
  margin: 0 -20px;
  padding: 0 20px;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.security-item {
  text-align: center;
  padding: 30px 20px;
  background: var(--bg-cream);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.security-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.security-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.security-icon i {
  font-size: 24px;
  color: white;
}

.security-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.security-item p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ========== FAQ ========== */
.faq-list {
  max-width: 800px;
  margin: 0 auto 40px;
}

.faq-item {
  background: var(--bg-white);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.faq-question i {
  color: var(--primary-color);
  font-size: 20px;
}

.faq-question span {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.faq-answer {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.7;
  padding-left: 32px;
  margin: 0;
}

.more-questions {
  text-align: center;
}

.more-questions p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  padding: 12px 24px;
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  transition: all 0.3s ease;
}

.link-button:hover {
  background: var(--primary-color);
  color: white;
}

.link-button i {
  transition: transform 0.3s ease;
}

.link-button:hover i {
  transform: translateX(4px);
}

/* ========== 響應式設計 ========== */
@media (max-width: 1024px) {
  .payment-cards {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }

  .security-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 50px 20px;
  }

  .hero-banner h1 {
    font-size: 32px;
  }

  .section-container {
    padding: 40px 0;
  }

  .section-title {
    font-size: 26px;
  }

  .security-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .steps:not(.vertical) {
    flex-direction: column;
    gap: 12px;
  }

  .step-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .hero-banner h1 {
    font-size: 28px;
  }

  .card-brands {
    gap: 12px;
  }

  .store-logos {
    flex-wrap: wrap;
  }
}
</style>