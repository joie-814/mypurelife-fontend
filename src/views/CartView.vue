<!-- 顯示購物車裡的所有商品 -->

<template>
  <div class="cart-container">
    <div class="cart-header">
      <h1>購物車</h1>
      <p class="item-count">{{ cartStore.totalItems }} 件商品</p>
    </div>

    <!-- 載入中 -->
    <div v-if="cartStore.isLoading && cartStore.cartItems.length === 0" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <!-- 購物車為空 -->
    <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <p>購物車是空的</p>
      <router-link to="/" class="btn-continue">繼續購物</router-link>
    </div>

    <!-- 購物車有商品 -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <CartItem 
          v-for="item in cartStore.cartItems" 
          :key="item.productId"
          :item="item"
          @update-quantity="(newQty) => handleUpdateQuantity(item, newQty)"
          @remove="() => handleRemove(item)"
        />
      </div>

      <div class="cart-summary">
        <h2>訂單摘要</h2>
        <div class="summary-row">
          <span>小計</span>
          <span>NT$ {{ formattedTotalPrice }}</span>
        </div>
        <div class="summary-row">
          <span>運費</span>
          <span>NT$ {{ shippingFee }}</span>
        </div>

        <p class="free-shipping-hint" v-if="cartStore.totalPrice < 1200">
          再買 NT$ {{freeShippingGap }} 即可免運
        </p>

        <div class="summary-divider"></div>
        <div class="summary-row total">
          <span>總計</span>
          <span>NT$ {{ formattedFinalTotal }}</span>
        </div>
        <button class="btn-checkout" @click="goToCheckout" :disabled="cartStore.isLoading">前往結帳</button>
        <button class="btn-clear" @click="confirmClearCart" :disabled="cartStore.isLoading">清空購物車</button>
      </div>
    </div>
    <!-- 錯誤訊息 -->
    <div v-if="cartStore.error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ cartStore.error }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch} from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore.js'
import { useAuthStore } from '@/stores/authStore.js' 
import CartItem from '@/components/cart/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore() 

// 頁面載入時取得購物車資料
onMounted(async () => {
  if (authStore.isLoggedIn) {
    await cartStore.loadCart()
  }
})

// 監聽登入狀態變化，重新載入購物車
watch(() => authStore.isLoggedIn, async (newVal) => {
  if (newVal) {
    await cartStore.syncCartAfterLogin()
  }
})

// 運費計算（滿額免運）
const shippingFee = computed(() => {
  return cartStore.totalPrice >= 1200 ? 0 : 60
})

// 最終總計
const finalTotal = computed(() => {
  return cartStore.totalPrice + shippingFee.value
})

// 格式化金額
// 小計
const formattedTotalPrice = computed(() => {
  return Number(cartStore.totalPrice).toLocaleString()
})

// 小計 + 運費
const formattedFinalTotal = computed(() => {
  return Number(finalTotal.value).toLocaleString()
})

// 距離免運還差多少
const freeShippingGap = computed(() => {
  return (1200 - cartStore.totalPrice).toLocaleString()
})

// 更新數量 使用 getItemId 取得正確的 ID
const handleUpdateQuantity = async (item, newQuantity) => {
  const itemId = cartStore.getItemId(item)
  const result = await cartStore.updateQuantity(itemId, newQuantity)
  if (!result.success) {
    alert(result.message)
  }
}

// 刪除商品
const handleRemove = async (item) => {
  if (confirm('確定要移除此商品嗎？')) {
    const itemId = cartStore.getItemId(item)
    const result = await cartStore.removeFromCart(itemId)
    if (!result.success) {
      alert(result.message)
    }
  }
}

// 清空購物車
const confirmClearCart = async () => {
  if (confirm('確定要清空購物車嗎？')) {
    const result = await cartStore.clearCart()
    if (!result.success) {
      alert(result.message)
    }
  }
}

// 前往結帳
const goToCheckout = () => {
  // 結帳時檢查是否登入
  if (!authStore.isLoggedIn) {
    if (confirm('請先登入才能結帳，是否前往登入頁面？')) {
      router.push({
        path: '/login',
        query: { redirect: '/checkout' }
      })
    }
    return
  }
  
  router.push('/checkout')
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.cart-header h1 {
  font-size: 25px;
  color: #2c3e50;
}

.item-count {
  color: #7f8c8d;
  font-size: 16px;
}

/* 載入中 */
.loading {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i {
  font-size: 48px;
  margin-bottom: 20px;
}

.loading p {
  font-size: 18px;
}


/* 空購物車 */
.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-cart i {
  font-size: 80px;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-cart p {
  font-size: 20px;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.btn-continue {
  display: inline-block;
  padding: 12px 40px;
  background-color: #3A6B5C;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-continue:hover {
  background-color: #2a6626;
}

/* 購物車內容 */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 訂單摘要 */
.cart-summary {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  color: #34495e;
}

.free-shipping-hint {
  font-size: 13px;
  color: #e67e22;
  margin: 0 0 15px 0;
}

.summary-divider {
  border-top: 2px solid #dee2e6;
  margin: 20px 0;
}

.summary-row.total {
  font-size: 22px;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
}

.btn-checkout {
  width: 100%;
  padding: 15px;
  background-color: #3A6B5C;;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.btn-checkout:hover:not(:disabled) {
  background-color: #2d5447;
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-clear {
  width: 100%;
  padding: 12px;
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-clear:hover:not(:disabled) {
  background-color: #e74c3c;
  color: white;
}

.btn-clear:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 錯誤訊息 */
.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #fee;
  color: #e74c3c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    position: static;
  }
}
</style>