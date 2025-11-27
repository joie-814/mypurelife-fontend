<!-- 顯示單一商品，並提供修改數量、刪除的按鈕 -->

<template>
  <div class="cart-item">
    <div class="item-image">
      <img :src="item.imageUrl || '/images/default-product.jpg'" :alt="item.productName">
    </div>

    <div class="item-info">
      <h3 class="item-name">{{ item.productName }}</h3>
      <p class="item-price">NT$ {{ item.price.toLocaleString() }}</p>
      <p class="item-stock" v-if="item.maxStock <= 10">
        <i class="fas fa-exclamation-circle"></i>
        剩餘 {{ item.maxStock }} 件
      </p>
    </div>

    <div class="item-quantity">
      <button 
        class="qty-btn" 
        @click="decreaseQuantity"
        :disabled="item.quantity <= 1"
      >
        <i class="fas fa-minus"></i>
      </button>
      <input 
        type="number" 
        class="qty-input" 
        :value="item.quantity"
        @input="handleQuantityInput"
        @blur="validateQuantity"
        min="1"
        :max="item.maxStock"
      >
      <button 
        class="qty-btn" 
        @click="increaseQuantity"
        :disabled="item.quantity >= item.maxStock"
      >
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <div class="item-subtotal">
      <p class="subtotal-label">小計</p>
      <p class="subtotal-price">NT$ {{ subtotal.toLocaleString() }}</p>
    </div>

    <button class="btn-remove" @click="removeItem">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove'])

// 計算小計
const subtotal = computed(() => {
  return props.item.price * props.item.quantity
})

// 暫存輸入的數量
const tempQuantity = ref(props.item.quantity)

// 減少數量
const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.productId, props.item.quantity - 1)
  }
}

// 增加數量
const increaseQuantity = () => {
  if (props.item.quantity < props.item.maxStock) {
    emit('update-quantity', props.item.productId, props.item.quantity + 1)
  }
}

// 處理手動輸入數量
const handleQuantityInput = (event) => {
  tempQuantity.value = event.target.value
}

// 驗證並更新數量
const validateQuantity = () => {
  let newQuantity = parseInt(tempQuantity.value)
  
  // 驗證輸入值
  if (isNaN(newQuantity) || newQuantity < 1) {
    newQuantity = 1
  } else if (newQuantity > props.item.maxStock) {
    newQuantity = props.item.maxStock
    alert(`此商品庫存僅剩 ${props.item.maxStock} 件`)
  }
  
  tempQuantity.value = newQuantity
  emit('update-quantity', props.item.productId, newQuantity)
}

// 刪除商品
const removeItem = () => {
  emit('remove', props.item.productId)
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr 150px 120px 50px;
  gap: 20px;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 商品圖片 */
.item-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品資訊 */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.item-price {
  font-size: 20px;
  color: #27ae60;
  font-weight: bold;
  margin: 0;
}

.item-stock {
  font-size: 14px;
  color: #e74c3c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 數量控制 */
.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}

.qty-btn:hover:not(:disabled) {
  background-color: #27ae60;
  color: white;
  border-color: #27ae60;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 36px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
}

.qty-input:focus {
  outline: none;
  border-color: #27ae60;
}

/* 隱藏數字輸入框的上下箭頭 */
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type=number] {
  -moz-appearance: textfield;
}

/* 小計 */
.item-subtotal {
  text-align: right;
}

.subtotal-label {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 5px 0;
}

.subtotal-price {
  font-size: 22px;
  color: #2c3e50;
  font-weight: bold;
  margin: 0;
}

/* 刪除按鈕 */
.btn-remove {
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  color: #95a5a6;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-remove:hover {
  background-color: #fee;
  color: #e74c3c;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 15px;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-info {
    grid-column: 2;
  }

  .item-name {
    font-size: 16px;
  }

  .item-price {
    font-size: 18px;
  }

  .item-quantity {
    grid-column: 1 / -1;
    justify-content: flex-start;
    padding-left: 10px;
  }

  .item-subtotal {
    grid-column: 1 / -1;
    text-align: left;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .subtotal-label {
    margin: 0;
  }

  .btn-remove {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>