<template>
  <div class="orders-container">
    <h1 class="page-title">我的訂單</h1>

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <!-- 沒有訂單 -->
    <div v-else-if="orders.length === 0" class="empty-orders">
      <i class="fas fa-receipt"></i>
      <p>目前沒有訂單</p>
      <router-link to="/" class="btn-shop">開始購物</router-link>
    </div>

    <!-- 訂單列表 -->
    <div v-else class="orders-list">
      <div 
        class="order-card" 
        v-for="order in orders" 
        :key="order.orderId"
        @click="goToDetail(order.orderId)"
      >
        <div class="order-header">
          <div class="order-info">
            <span class="order-number">{{ order.orderNumber }}</span>
            <span v-if="order.orderType === 'subscription'" class="tag-subscription">
              定期購
            </span>
          </div>
          <span class="order-date">{{ formatDate(order.orderTime) }}</span>
          <div class="order-status" :class="getStatusClass(order.orderStatus)">
            {{ getStatusText(order.orderStatus) }}
          </div>
        </div>

        <div class="order-items">
          <div class="item-preview" v-for="item in order.items.slice(0, 3)" :key="item.productId">
            <span class="item-name">{{ item.productName }}</span>
            <span class="item-qty">x{{ item.quantity }}</span>
          </div>
          <p class="more-items" v-if="order.items.length > 3">
            ...還有 {{ order.items.length - 3 }} 件商品
          </p>
        </div>

        <div class="order-footer">
          <div class="payment-info">
            <span class="payment-method">{{ getPaymentMethodText(order.paymentMethod) }}</span>
            <span class="payment-status" :class="getPaymentStatusClass(order.paymentStatus)">
              {{ getPaymentStatusText(order.paymentStatus) }}
            </span>
          </div>
          <div class="order-total">
            NT$ {{ Number(order.grandTotal).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios'

const router = useRouter()
const orders = ref([])
const isLoading = ref(true)

// 載入訂單列表
onMounted(async () => {
  try {
    const response = await api.get('/orders')
    orders.value = response.data || []
  } catch (err) {
    console.error('載入訂單失敗:', err)
  } finally {
    isLoading.value = false
  }
})

// 前往訂單詳情
const goToDetail = (orderId) => {
  router.push(`/orders/${orderId}`)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 訂單狀態
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待處理',
    'confirmed': '已確認',
    'shipping': '配送中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    'pending': 'status-pending',
    'confirmed': 'status-confirmed',
    'shipping': 'status-shipping',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  }
  return classMap[status] || ''
}

// 付款狀態
const getPaymentStatusText = (status) => {
  const statusMap = {
    'unpaid': '未付款',
    'paid': '已付款',
    'refunded': '已退款'
  }
  return statusMap[status] || status
}

const getPaymentStatusClass = (status) => {
  const classMap = {
    'unpaid': 'payment-unpaid',
    'paid': 'payment-paid',
    'refunded': 'payment-refunded'
  }
  return classMap[status] || ''
}

// 付款方式
const getPaymentMethodText = (method) => {
  const methodMap = {
    'credit_card': '信用卡',
    'atm': 'ATM 轉帳',
    'cvs': '超商代碼'
  }
  return methodMap[method] || method
}
</script>

<style scoped>
.orders-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 25px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

/* 載入中 & 空訂單 */
.loading,
.empty-orders {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i,
.empty-orders i {
  font-size: 60px;
  margin-bottom: 20px;
}

.btn-shop {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 30px;
  background-color: #3A6B5C;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.btn-shop:hover {
  background-color: #2d5447;
}

/* 訂單列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 訂單標頭 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-number {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.tag-subscription {
  background-color: #3A6B5C;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.order-date {
  font-size: 14px;
  color: #7f8c8d;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background-color: #cce5ff;
  color: #004085;
}

.status-shipping {
  background-color: #d4edda;
  color: #155724;
}

.status-completed {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

/* 訂單商品 */
.order-items {
  margin-bottom: 15px;
}

.item-preview {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #34495e;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
}

.item-qty {
  color: #7f8c8d;
}

.more-items {
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 5px;
}

/* 訂單底部 */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-method {
  font-size: 14px;
  color: #7f8c8d;
}

.payment-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.payment-unpaid {
  background-color: #fee;
  color: #e74c3c;
}

.payment-paid {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.payment-refunded {
  background-color: #fff3e0;
  color: #e65100;
}

.order-total {
  font-size: 20px;
  font-weight: bold;
  color: #3A6B5C;
}

/* 響應式 */
@media (max-width: 600px) {
  .order-header {
    flex-direction: column;
    gap: 10px;
  }

  .order-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .order-total {
    align-self: flex-end;
  }
}
</style>