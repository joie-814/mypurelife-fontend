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
        
        <!-- 價格區塊 -->
        <div class="price-section">
          <span class="current-price">NT$ {{ displayPrice.toLocaleString() }}</span>
          <span class="original-price" v-if="product.originalPrice">
            NT$ {{ product.price.toLocaleString() }}
          </span>
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
        
        <!-- 操作按鈕 -->
        <button class="btn-add-to-cart" @click="addToCart">
          <i class="fas fa-shopping-cart"></i>
          加入購物車
        </button>
        
        <button class="btn-buy-now" @click="buyNow">
          <i class="fas fa-bolt"></i>
          立即購買
        </button>

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
import { getProductByIdApi } from '@/api/product.js'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// 狀態
const product = ref({})
const quantity = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

// 顯示價格（有促銷價用促銷價，沒有用原價）
const displayPrice = computed(() => {
  return product.value.promotionPrice || product.value.price || 0
})

// 商品圖片
const productImage = computed(() => {
  return product.value.imageUrl || '/images/products/default.jpeg'
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

// 生命週期
onMounted(() => {
  fetchProduct()
})

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
    productName: product.value.productName,
    price: displayPrice.value,
    imageUrl: productImage.value,
    stock: product.value.stockQuantity || 99
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
.btn-back {
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
  background: #229954;
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
}
</style>