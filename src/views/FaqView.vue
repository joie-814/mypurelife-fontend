<template>
  <div class="faq-page">
    <!-- 頂部橫幅 -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1>常見問題</h1>
        <p class="hero-subtitle">快速找到您需要的答案</p>
      </div>
    </section>

      <!-- 分類標籤 -->
      <section class="category-tabs">
        <div class="tabs-container">
          <button 
            class="tab-btn"
            :class="{ active: activeCategory === 'all' }"
            @click="setCategory('all')"
          >
            <i class="fas fa-th-large"></i>
            全部問題
          </button>
          <button 
            v-for="category in categories" 
            :key="category"
            class="tab-btn"
            :class="{ active: activeCategory === category }"
            @click="setCategory(category)"
          >
            <i :class="getCategoryIcon(category)"></i>
            {{ category }}
          </button>
        </div>
      </section>

      <!-- FAQ 列表 -->
      <section class="faq-list-section">
        <div class="faq-container">
          <!-- 按分類分組顯示 -->
          <div 
            v-for="category in displayCategories" 
            :key="category"
            class="faq-category"
          >
            <h2 class="category-title">
              <i :class="getCategoryIcon(category)"></i>
              {{ category }}
              <span class="count">{{ getFaqsByCategory(category).length }} 題</span>
            </h2>
            
            <div class="faq-items">
              <div 
                v-for="faq in getFaqsByCategory(category)" 
                :key="faq.faqId"
                class="faq-item"
                :class="{ expanded: expandedId === faq.faqId }"
              >
                <div 
                  class="faq-question"
                  @click="toggleExpand(faq.faqId)"
                >
                  <span class="question-text">{{ faq.question }}</span>
                  <i class="fas fa-chevron-down expand-icon"></i>
                </div>
                <div class="faq-answer">
                  <div class="answer-content">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 聯絡我們 -->
      <section class="contact-section">
        <div class="contact-container">
          <div class="contact-content">
            <i class="fas fa-headset"></i>
            <h3>還是找不到答案？</h3>
            <p>我們的客服團隊很樂意為您服務</p>
            <div class="contact-options">
              <a href="mailto:service@purelife.com" class="contact-btn email">
                <i class="fas fa-envelope"></i>
                service@purelife.com
              </a>
              <a href="tel:0800-123-456" class="contact-btn phone">
                <i class="fas fa-phone"></i>
                0800-123-456
              </a>
            </div>
            <p class="service-hours">
              <i class="fas fa-clock"></i>
              客服時間：週一至週五 09:00 - 18:00
            </p>
          </div>
        </div>
      </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 狀態
const faqs = ref([])
const activeCategory = ref('all')
const expandedId = ref(null)

const mockFaqs = [
  { faqId: 1, category: '購物相關', question: '如何下訂單？', answer: '請先註冊會員後登入，選擇商品加入購物車，即可進行結帳。', sortOrder: 1 },
  { faqId: 2, category: '購物相關', question: '有哪些付款方式？', answer: '我們提供信用卡、ATM轉帳、超商代碼等多種付款方式。', sortOrder: 2 },
  { faqId: 3, category: '配送相關', question: '運費如何計算？', answer: '單筆訂單滿1200元免運費，未滿則收取60元運費。', sortOrder: 3 },
  { faqId: 4, category: '配送相關', question: '多久會出貨？', answer: '付款完成後1-3個工作天內出貨。', sortOrder: 4 },
  { faqId: 5, category: '定期購', question: '什麼是定期購？', answer: '定期購是自動配送服務，系統會依照您設定的週期自動出貨並扣款。', sortOrder: 5 },
  { faqId: 6, category: '定期購', question: '如何取消定期購？', answer: '請至會員中心的定期購管理頁面，點選取消訂閱即可。', sortOrder: 6 }
]

// 取得所有分類
const categories = computed(() => {
  const cats = [...new Set(faqs.value.map(faq => faq.category))]
  return cats
})


// 要顯示的分類
const displayCategories = computed(() => {
  if (activeCategory.value !== 'all') {
    return [activeCategory.value]
  }
  return [...new Set(faqs.value.map(faq => faq.category))]
})

// 根據分類取得 FAQ
const getFaqsByCategory = (category) => {
  return faqs.value
    .filter(faq => faq.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

// 取得分類圖示
const getCategoryIcon = (category) => {
  const icons = {
    '購物相關': 'fas fa-shopping-cart',
    '配送相關': 'fas fa-truck',
    '定期購': 'fas fa-sync-alt',
    '帳戶相關': 'fas fa-user',
    '退換貨': 'fas fa-exchange-alt',
    '商品相關': 'fas fa-box'
  }
  return icons[category] || 'fas fa-question-circle'
}

// 設定分類
const setCategory = (category) => {
  activeCategory.value = category
  expandedId.value = null
}

// 展開/收合
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

onMounted(() => {
  faqs.value = mockFaqs
})
</script>

<style scoped>
/* ========== 全域變數 ========== */
.faq-page {
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

/* ========== 分類標籤 ========== */
.category-tabs {
  padding: 30px 20px;
}

.tabs-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid transparent;
  background: var(--bg-white);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.tab-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tab-btn i {
  font-size: 14px;
}

/* ========== 載入中 ========== */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--primary-lighter);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 16px;
}


/* ========== FAQ 列表 ========== */
.faq-list-section {
  padding: 0 20px 60px;
}

.faq-container {
  max-width: 900px;
  margin: 0 auto;
}

.faq-category {
  margin-bottom: 40px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-lighter);
}

.category-title i {
  color: var(--primary-color);
}

.category-title .count {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  margin-left: auto;
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--bg-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: var(--shadow-md);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.faq-question:hover {
  background: var(--primary-lighter);
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
  padding-right: 16px;
}

.expand-icon {
  color: var(--primary-color);
  font-size: 14px;
  transition: transform 0.3s ease;
}

.faq-item.expanded .expand-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-item.expanded .faq-answer {
  max-height: 500px;
}

.answer-content {
  padding: 0 24px 20px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.8;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

/* ========== 聯絡我們 ========== */
.contact-section {
  padding: 0 20px 60px;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-content {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
  color: white;
  text-align: center;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
}

.contact-content > i {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.contact-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.contact-content > p {
  opacity: 0.9;
  margin-bottom: 30px;
}

.contact-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: white;
  color: var(--primary-color);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.contact-btn i {
  font-size: 16px;
}

.service-hours {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.85;
  margin: 0;
}

/* ========== 響應式設計 ========== */
@media (max-width: 768px) {
  .hero-banner {
    padding: 50px 20px;
  }

  .hero-banner h1 {
    font-size: 32px;
  }

  .search-box {
    padding: 12px 20px;
  }

  .tabs-container {
    gap: 8px;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .category-title {
    font-size: 18px;
  }

  .faq-question {
    padding: 16px 20px;
  }

  .question-text {
    font-size: 15px;
  }

  .answer-content {
    padding: 0 20px 16px;
    font-size: 14px;
  }

  .contact-content {
    padding: 40px 24px;
  }

  .contact-options {
    flex-direction: column;
    align-items: center;
  }

  .contact-btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-banner h1 {
    font-size: 28px;
  }

  .tab-btn span {
    display: none;
  }

  .tab-btn {
    padding: 10px 14px;
  }
}
</style>