<!-- 點進去後的商品詳情頁 -->

<template>
  <div class="product-detail-container">
    <!-- Loading 狀態 -->
    <div v-if="isLoading" class="loading">
      <p>商品載入中...</p>
    </div>

    <!-- 錯誤訊息 -->
    <div v-else-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
      <button @click="goBack">返回商品列表</button>
    </div>

    <!-- 商品詳情 -->
    <div v-else class="product-detail">
      <!-- 商品圖片 -->
      <div class="detail-image">
        <img :src="productImage" :alt="product.productName">
        <div class="product-badge" v-if="product.promotionPrice">特價</div>
      </div>
      
      <!-- 商品資訊 -->
      <div class="detail-info">
        <h1>{{ product.productName }}</h1>
        <p class="detail-description">{{ product.description }}</p>
        
        <!-- 購買方式選擇 -->
        <div class="purchase-type-section">
          <div class="purchase-type-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: purchaseType === 'once' }"
              @click="purchaseType = 'once'"
            >
              單次購買
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: purchaseType === 'subscribe' }"
              @click="purchaseType = 'subscribe'"
              v-if="subscriptionPlans.length > 0"
            >
              定期購
              <span class="discount-badge">更優惠</span>
            </button>
          </div>
        </div>

        <!-- 單次購買價格 -->
        <div class="price-section" v-if="purchaseType === 'once'">
          <span class="current-price">NT$ {{ displayPrice.toLocaleString() }}</span>
          <span class="original-price" v-if="product.promotionPrice">
            NT$ {{ product.price.toLocaleString() }}
          </span>
        </div>

        <!-- 定期購方案選擇 -->
        <div class="subscription-section" v-if="purchaseType === 'subscribe'">
          <p class="subscription-hint">
            <i class="fas fa-check-circle"></i>
            訂閱享優惠，可隨時暫停或取消
          </p>
          
          <div class="plan-options">
            <label 
              v-for="plan in subscriptionPlans" 
              :key="plan.planId"
              class="plan-option"
              :class="{ selected: selectedPlanId === plan.planId }"
            >
              <input 
                type="radio" 
                :value="plan.planId" 
                v-model="selectedPlanId"
              >
              <div class="plan-info">
                <span class="plan-cycle">{{ plan.cycleText }}</span>
                <span class="plan-discount">{{ formatDiscount(plan.discountRate) }}</span>
              </div>
              <div class="plan-price">
                <span class="subscription-price">NT$ {{ Number(plan.subscriptionPrice).toLocaleString() }}</span>
                <span class="original-price-small">NT$ {{ Number(plan.originalPrice).toLocaleString() }}</span>
              </div>
            </label>
          </div>
        </div>
        
        <!-- 數量選擇 -->
        <div class="quantity-section">
          <label>數量：</label>
          <div class="quantity-selector">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">
              <i class="fas fa-minus"></i>
            </button>
            <input 
              v-model.number="quantity" 
              type="number" 
              min="1" 
              :max="product.stock || 99"
              @input="validateQuantityInput"
            >
            <button @click="increaseQuantity" :disabled="quantity >= (product.stock || 99)">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <span class="stock-info">庫存：{{ product.stockQuantity || 0 }} 件</span>
        </div>
        
        <!-- 操作按鈕:單次購買 -->
        <template v-if="purchaseType === 'once'">
          <button class="btn-add-to-cart" @click="addToCart">
            <i class="fas fa-shopping-cart"></i>
            加入購物車
          </button>
          
          <button class="btn-buy-now" @click="buyNow">
            <i class="fas fa-bolt"></i>
            立即購買
          </button>
        </template>

        <!-- 操作按鈕 - 定期購 -->
        <template v-else>
          <button 
            class="btn-subscribe" 
            @click="subscribe"
            :disabled="!selectedPlanId || isSubscribing"
          >
            <i class="fas fa-calendar-check"></i>
            <span v-if="isSubscribing">處理中...</span>
            <span v-else>立即訂閱</span>
          </button>
          
          <p class="subscribe-note">
            <i class="fas fa-info-circle"></i>
            訂閱後將於下次配送日自動出貨
          </p>
        </template>


        <!-- 返回按鈕 -->
        <button class="btn-back" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          返回商品列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { getProductByIdApi } from '@/api/product.js'
import api from '@/utils/axios'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

// 狀態
const product = ref({})
const quantity = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

// 購買方式：once（單次）或 subscribe（訂閱）
const purchaseType = ref('once')

// 訂閱相關
const subscriptionPlans = ref([])
const selectedPlanId = ref(null)
const isSubscribing = ref(false)


// 顯示價格（有促銷價用促銷價，沒有用原價）
const displayPrice = computed(() => {
  return product.value.promotionPrice || product.value.price || 0
})

// 商品圖片
const productImage = computed(() => {
  return product.value.imageUrl || '/images/products/default.jpeg'
})

// 生命週期
onMounted(() => {
  fetchProduct()
  fetchSubscriptionPlans()
})

// 從 API 取得商品詳情
const fetchProduct = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const productId = route.params.id
    const response = await getProductByIdApi(productId)
    
    if (response.success) {
      product.value = response.data
    } else {
      errorMessage.value = response.message || '載入商品失敗'
    }
  } catch (error) {
    console.error('取得商品失敗:', error)
    errorMessage.value = '找不到此商品'
  } finally {
    isLoading.value = false
  }
}

// 取得訂閱方案
const fetchSubscriptionPlans = async () => {
  try {
    const productId = route.params.id
    const response = await api.get(`/subscriptions/plans/${productId}`)
    
    if (response.success && response.data) {
      subscriptionPlans.value = response.data
      // 預設選擇第一個方案
      if (response.data.length > 0) {
        selectedPlanId.value = response.data[0].planId
      }
    }
  } catch (error) {
    console.error('取得訂閱方案失敗:', error)
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

// 減少數量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 增加數量
const increaseQuantity = () => {
  if (quantity.value < (product.value.stockQuantity || 99)) {
    quantity.value++
  }
}

// 驗證數量輸入
const validateQuantityInput = (event) => {
  let value = parseInt(event.target.value)
  const maxStock = product.value.stockQuantity || 99
  
  if (isNaN(value) || value < 1) {
    quantity.value = 1
  } else if (value > maxStock) {
    quantity.value = maxStock
    alert(`庫存僅剩 ${maxStock || 99} 件`)
  } else {
    quantity.value = value
  }
}

// 加入購物車
const addToCart = () => {
  const cartProduct = {
    productId: product.value.productId,
    category: product.value.category,
    productName: product.value.productName,
    price: product.value.price,
    promotionPrice: product.value.promotionPrice,
    stockQuantity: product.value.stockQuantity, 
    imageUrl: product.value.imageUrl,
  }
  
  cartStore.addToCart(cartProduct, quantity.value)
  alert(`✓ 已將 ${quantity.value} 件「${product.value.productName}」加入購物車`)
  quantity.value = 1
}

// 立即購買（加入購物車後直接前往結帳）
const buyNow = () => {
  addToCart()
  router.push('/cart')
}

// 訂閱購買
const subscribe = async () => {
  // 檢查登入
  if (!authStore.isLoggedIn) {
    if (confirm('請先登入才能訂閱，是否前往登入頁面？')) {
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    }
    return
  }

  if (!selectedPlanId.value) {
    alert('請選擇訂閱方案')
    return
  }

  // 跳轉到訂閱結帳頁，帶上參數
  router.push({
    path: '/subscription-checkout',
    query: {
      planId: selectedPlanId.value,
      quantity: quantity.value,
      productId: product.value.productId
    }
  })
}


// 返回上一頁
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Loading 和 Error 樣式 */
.loading,
.error {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}

.error button {
  margin-top: 16px;
  padding: 10px 24px;
  background: #3A6B5C;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.error button:hover {
  background: #2d5447;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 商品圖片 */
.detail-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-image .product-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #ff6b6b;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

/* 商品資訊 */
.detail-info h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.detail-description {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 30px;
  line-height: 1.8;
}

/* 購買方式選擇 */
.purchase-type-section {
  margin-bottom: 20px;
}

.purchase-type-tabs {
  display: flex;
  gap: 10px;
}

.tab-btn {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.tab-btn:hover {
  border-color: #3A6B5C;
  color: #3A6B5C;
}

.tab-btn.active {
  border-color: #3A6B5C;
  background: #f0f7f4;
  color: #3A6B5C;
}

.discount-badge {
  background: #ff6b6b;
  color: white;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 500;
}

/* 價格區塊 */
.price-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.current-price {
  font-size: 36px;
  color: #3A6B5C;
  font-weight: bold;
  margin-right: 15px;
}

.original-price {
  font-size: 24px;
  color: #95a5a6;
  text-decoration: line-through;
}

/* 訂閱方案區塊 */
.subscription-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f0f7f4;
  border-radius: 12px;
  border: 2px solid #3A6B5C;
}

.subscription-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #3A6B5C;
  margin-bottom: 15px;
}

.subscription-hint i {
  color: #3A6B5C;
}

.plan-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.plan-option:hover {
  border-color: #3A6B5C;
}

.plan-option.selected {
  border-color: #3A6B5C;
  background: #fff;
  box-shadow: 0 0 0 1px #3A6B5C;
}

.plan-option input {
  display: none;
}

.plan-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-cycle {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
}

.plan-discount {
  background: #ff6b6b;
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.plan-price {
  text-align: right;
}

.subscription-price {
  font-size: 20px;
  font-weight: bold;
  color: #3A6B5C;
  display: block;
}

.original-price-small {
  font-size: 13px;
  color: #95a5a6;
  text-decoration: line-through;
}

/* 數量選擇 */
.quantity-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.quantity-section label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-selector button {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-selector button:hover:not(:disabled) {
  background: #3A6B5C;
  color: white;
  border-color: #3A6B5C;
}

.quantity-selector button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
}

.quantity-selector input:focus {
  outline: none;
  border-color: #3A6B5C;
}

/* 隱藏數字輸入框的箭頭 */
.quantity-selector input::-webkit-inner-spin-button,
.quantity-selector input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-selector input[type=number] {
  -moz-appearance: textfield;
}

.stock-info {
  color: #7f8c8d;
  font-size: 14px;
}

/* 按鈕樣式 */
.btn-add-to-cart,
.btn-buy-now,
.btn-back,
.btn-subscribe {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  margin-bottom: 12px;
}

.btn-add-to-cart {
  background: #3A6B5C;
  color: white;
}

.btn-add-to-cart:hover {
  background: #2d5447;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-buy-now {
  background: white;
  color: #3A6B5C;
  border: 2px solid #3A6B5C;
}

.btn-buy-now:hover {
  background: #3A6B5C;
  color: white;
  transform: translateY(-2px);
}

.btn-back {
  background: transparent;
  color: #7f8c8d;
  border: 1px solid #ddd;
  font-size: 16px;
}

.btn-back:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.btn-subscribe {
  background: linear-gradient(135deg, #3A6B5C, #2d5447);
  color: white;
}

.btn-subscribe:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 107, 92, 0.4);
}

.btn-subscribe:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.subscribe-note {
  text-align: center;
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-back {
  background: transparent;
  color: #7f8c8d;
  border: 1px solid #ddd;
  font-size: 16px;
}

.btn-back:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }

  .detail-info h1 {
    font-size: 24px;
  }

  .current-price {
    font-size: 28px;
  }

  .original-price {
    font-size: 18px;
  }

  .quantity-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .purchase-type-tabs {
    flex-direction: column;
  }

  .plan-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .plan-price {
    text-align: left;
  }
}
</style>