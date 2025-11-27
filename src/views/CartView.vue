<!-- 顯示購物車裡的所有商品 -->

<template>
  <div class="cart-container">
    <div class="cart-header">
      <h1>購物車</h1>
      <p class="item-count">{{ cartStore.totalItems }} 件商品</p>
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
          @update-quantity="handleUpdateQuantity"
          @remove="handleRemove"
        />
      </div>

      <div class="cart-summary">
        <h2>訂單摘要</h2>
        <div class="summary-row">
          <span>小計</span>
          <span>NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
        </div>
        <div class="summary-row">
          <span>運費</span>
          <span>NT$ {{ shippingFee.toLocaleString() }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total">
          <span>總計</span>
          <span>NT$ {{ finalTotal.toLocaleString() }}</span>
        </div>
        <button class="btn-checkout" @click="goToCheckout">前往結帳</button>
        <button class="btn-clear" @click="confirmClearCart">清空購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore.js'
import CartItem from '@/components/cart/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()

// 運費計算（滿額免運）
const shippingFee = computed(() => {
  return cartStore.totalPrice >= 1200 ? 0 : 60
})

// 最終總計
const finalTotal = computed(() => {
  return cartStore.totalPrice + shippingFee.value
})

// 更新數量
const handleUpdateQuantity = (productId, newQuantity) => {
  cartStore.updateQuantity(productId, newQuantity)
}

// 刪除商品
const handleRemove = (productId) => {
  if (confirm('確定要移除此商品嗎？')) {
    cartStore.removeFromCart(productId)
  }
}

// 清空購物車
const confirmClearCart = () => {
  if (confirm('確定要清空購物車嗎？')) {
    cartStore.clearCart()
  }
}

// 前往結帳
const goToCheckout = () => {
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
  font-size: 23px;
  color: #2c3e50;
}

.item-count {
  color: #7f8c8d;
  font-size: 16px;
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
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-continue:hover {
  background-color: #229954;
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
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.btn-checkout:hover {
  background-color: #229954;
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

.btn-clear:hover {
  background-color: #e74c3c;
  color: white;
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