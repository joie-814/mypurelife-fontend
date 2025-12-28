<template>
  <div class="checkout-container">
    <h1 class="page-title">訂閱結帳</h1>

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <!-- 找不到方案 -->
    <div v-else-if="!plan" class="error">
      <p>找不到訂閱方案</p>
      <router-link to="/" class="btn-back">返回首頁</router-link>
    </div>

    <!-- 結帳表單 -->
    <div v-else class="checkout-content">
      <!-- 左側：收件資訊 -->
      <div class="checkout-form">
        <section class="form-section">
          <h2><i class="fas fa-truck"></i> 收件資訊</h2>
          
          <div class="form-group">
            <label for="recipientName">收件人姓名 <span class="required">*</span></label>
            <input 
              type="text" 
              id="recipientName"
              v-model="form.recipientName"
              placeholder="請輸入收件人姓名"
              :class="{ 'error': errors.recipientName }"
            >
            <p class="error-message" v-if="errors.recipientName">{{ errors.recipientName }}</p>
          </div>

          <div class="form-group">
            <label for="recipientPhone">收件人電話 <span class="required">*</span></label>
            <input 
              type="tel" 
              id="recipientPhone"
              v-model="form.recipientPhone"
              placeholder="請輸入手機號碼（09xxxxxxxx）"
              :class="{ 'error': errors.recipientPhone }"
            >
            <p class="error-message" v-if="errors.recipientPhone">{{ errors.recipientPhone }}</p>
          </div>

          <div class="form-group">
            <label for="recipientAddress">收件地址 <span class="required">*</span></label>
            <input 
              type="text" 
              id="recipientAddress"
              v-model="form.recipientAddress"
              placeholder="請輸入完整收件地址"
              :class="{ 'error': errors.recipientAddress }"
            >
            <p class="error-message" v-if="errors.recipientAddress">{{ errors.recipientAddress }}</p>
          </div>
        </section>

        <!-- 付款方式 -->
        <section class="form-section">
          <h2><i class="fas fa-credit-card"></i> 付款方式</h2>
          
          <div class="payment-options">
            <label class="payment-option" :class="{ 'selected': form.paymentMethod === 'credit_card' }">
              <input type="radio" v-model="form.paymentMethod" value="credit_card">
              <i class="fas fa-credit-card"></i>
              <span>信用卡付款</span>
            </label>
            
            <label class="payment-option" :class="{ 'selected': form.paymentMethod === 'atm' }">
              <input type="radio" v-model="form.paymentMethod" value="atm">
              <i class="fas fa-university"></i>
              <span>ATM 轉帳</span>
            </label>
            
            <label class="payment-option" :class="{ 'selected': form.paymentMethod === 'cvs' }">
              <input type="radio" v-model="form.paymentMethod" value="cvs">
              <i class="fas fa-store"></i>
              <span>超商代碼</span>
            </label>
          </div>
          <p class="error-message" v-if="errors.paymentMethod">{{ errors.paymentMethod }}</p>
        </section>

        <section class="info-section">
          <h2><i class="fas fa-info-circle"></i> 訂閱說明</h2>
          <ul class="info-list">
            <li><i class="fas fa-check"></i> 訂閱後將於下次配送日自動出貨</li>
            <li><i class="fas fa-check"></i> 可隨時暫停或取消訂閱</li>
            <li><i class="fas fa-check"></i> 每次配送前會發送通知</li>
          </ul>
        </section>
      </div>

      <!-- 右側：訂閱摘要 -->
      <div class="order-summary">
        <h2>訂閱摘要</h2>
        
        <div class="product-info">
          <h3>{{ plan.productName }}</h3>
          <span class="cycle-badge">{{ plan.cycleText }}</span>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-row">
          <span>原價</span>
          <span class="original-price">NT$ {{ Number(plan.originalPrice).toLocaleString() }}</span>
        </div>
        
        <div class="summary-row">
          <span>訂閱折扣</span>
          <span class="discount">{{ formatDiscount(plan.discountRate) }}</span>
        </div>

        <div class="summary-row">
          <span>訂閱價</span>
          <span class="subscription-price">NT$ {{ Number(plan.subscriptionPrice).toLocaleString() }}</span>
        </div>

        <div class="summary-row">
          <span>數量</span>
          <span>{{ quantity }} 件</span>
        </div>

        <div class="delivery-info">
          <div class="delivery-item">
            <span class="label">首次配送：</span>
            <span class="value highlight">{{ firstDeliveryDate }}（立即出貨）</span>
          </div>
          <div class="delivery-item">
            <span class="label">下次配送：</span>
            <span class="value">{{ nextDeliveryDate }}</span>
          </div>
          <div class="delivery-item">
            <span class="label">配送週期：</span>
            <span class="value">每 {{ plan?.cycleDays }} 天</span>
          </div>
        </div>

        <div class="summary-row total">
          <span>每期金額</span>
          <span>NT$ {{ totalPrice.toLocaleString() }}</span>
        </div>

        <button 
          class="btn-submit" 
          @click="submitSubscription"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <i class="fas fa-spinner fa-spin"></i> 處理中...
          </span>
          <span v-else>
            <i class="fas fa-calendar-check"></i> 確認訂閱
          </span>
        </button>

        <router-link :to="`/product/${plan.productId}`" class="btn-back">
          <i class="fas fa-arrow-left"></i> 返回商品頁
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/utils/axios'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 狀態
const isLoading = ref(true)
const isSubmitting = ref(false)
const plan = ref(null)
const quantity = ref(1)
const productId = ref(null)

// 表單
const form = ref({
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  paymentMethod: 'credit_card'
})

const errors = ref({})

// 計算首次配送日（立即出貨）
const firstDeliveryDate = computed(() => {
  return new Date().toLocaleDateString('zh-TW')  // 今天
})

// 計算下次配送日（第二次）
const nextDeliveryDate = computed(() => {
  if (!plan.value) return ''
  const date = new Date()
  date.setDate(date.getDate() + plan.value.cycleDays)
  return date.toLocaleDateString('zh-TW')
})

// 計算每期總金額
const totalPrice = computed(() => {
  if (!plan.value) return 0
  return Number(plan.value.subscriptionPrice) * quantity.value
})

// 頁面載入
onMounted(async () => {
  // 檢查登入
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // 取得參數
  const planId = route.query.planId
  quantity.value = parseInt(route.query.quantity) || 1

  if (!planId) {
    isLoading.value = false
    return
  }

  // 載入方案資訊
  await fetchPlanInfo(planId)

  // 預填會員資料
  if (authStore.user) {
    form.value.recipientName = authStore.user.name || ''
  }

  isLoading.value = false
})

// 取得方案資訊
const fetchPlanInfo = async (planId) => {
  try {
     console.log('查詢 planId:', planId)
    const response = await api.get(`/subscriptions/plans/byPlanId/${planId}`)
     console.log('回應:', response)
    if (response.success) {
      plan.value = response.data
    } else {
      console.error('方案不存在或載入失敗')
    }
  } catch (error) {
    console.error('載入方案失敗:', error)
  }
}

// 取得商品名稱
const getProductName = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`)
    return response.data?.productName || '未知商品'
  } catch (e) {
    return '未知商品'
  }
}

// 格式化折扣顯示
const formatDiscount = (discountRate) => {
  if (!discountRate || discountRate === 1) return ''
  
  // 0.95 → 95折, 0.90 → 9折, 0.85 → 85折
  const discount = discountRate * 100
  
  if (discount % 10 === 0) {
    return `${discount / 10} 折`
  } else {
    return `${discount.toFixed(0)} 折`
  }
}

// 驗證表單
const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!form.value.recipientName.trim()) {
    errors.value.recipientName = '請輸入收件人姓名'
    isValid = false
  }

  if (!form.value.recipientPhone.trim()) {
    errors.value.recipientPhone = '請輸入收件人電話'
    isValid = false
  } else if (!/^09\d{8}$/.test(form.value.recipientPhone)) {
    errors.value.recipientPhone = '請輸入正確的手機號碼格式（09xxxxxxxx）'
    isValid = false
  }

  if (!form.value.recipientAddress.trim()) {
    errors.value.recipientAddress = '請輸入收件地址'
    isValid = false
  }

  return isValid
}

// 提交訂閱
const submitSubscription = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const response = await api.post('/subscriptions', {
      planId: plan.value.planId,
      quantity: quantity.value,
      recipientName: form.value.recipientName,
      recipientPhone: form.value.recipientPhone,
      recipientAddress: form.value.recipientAddress,
      paymentMethod: form.value.paymentMethod
    })

    if (response.success) {
      alert(`✓ 訂閱成功！\n下次配送日：${response.data.nextDeliveryDate}`)
      router.push('/subscriptions')
    } else {
      alert(response.message || '訂閱失敗')
    }
  } catch (error) {
    console.error('訂閱失敗:', error)
    alert(error.response?.data?.message || '訂閱失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

/* 載入中 & 錯誤 */
.loading,
.error {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i {
  font-size: 48px;
  margin-bottom: 20px;
}

/* 結帳內容 */
.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
}

/* 表單區塊 */
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section,
.info-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-section h2,
.info-section h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-section h2 i,
.info-section h2 i {
  color: #3A6B5C;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
}

.required {
  color: #e74c3c;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  text-align: left;
}

.form-group input:focus {
  outline: none;
  border-color: #3A6B5C;
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

/* 付款方式 */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: #3A6B5C;
}

.payment-option.selected {
  border-color: #3A6B5C;
  background-color: #f0f7f4;
}

.payment-option input {
  display: none;
}

.payment-option i {
  font-size: 20px;
  color: #3A6B5C;
  width: 24px;
}

.payment-option span {
  font-size: 16px;
  color: #2c3e50;
}

/* 訂閱說明 */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  color: #34495e;
  font-size: 14px;
}

.info-list li i {
  color: #3A6B5C;
}

/* 訂閱摘要 */
.order-summary {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.order-summary h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.product-info {
  margin-bottom: 15px;
}

.product-info h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.cycle-badge {
  display: inline-block;
  background: #f0f7f4;
  color: #3A6B5C;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
}

.summary-divider {
  border-top: 1px solid #e0e0e0;
  margin: 15px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #34495e;
}

.original-price {
  text-decoration: line-through;
  color: #95a5a6;
}

.discount {
  color: #e74c3c;
  font-weight: 500;
}

.subscription-price {
  color: #3A6B5C;
  font-weight: 600;
}

.highlight {
  color: #3A6B5C;
  font-weight: 500;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px solid #e0e0e0;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3A6B5C, #2d5447);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 107, 92, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-back {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #7f8c8d;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.btn-back:hover {
  color: #3A6B5C;
}

.delivery-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.delivery-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.delivery-item:last-child {
  border-bottom: none;
}

.delivery-item .label {
  color: #666;
}

.delivery-item .value {
  font-weight: 500;
  color: #2c3e50;
}

.delivery-item .value.highlight {
  color: #3A6B5C;
  font-weight: 600;
}

/* 響應式 */
@media (max-width: 900px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}
</style>