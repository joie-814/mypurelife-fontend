<template>
  <div class="subscriptions-container">
    <h1 class="page-title">我的定期購</h1>

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <!-- 沒有訂閱 -->
    <div v-else-if="subscriptions.length === 0" class="empty">
      <i class="fas fa-calendar-times"></i>
      <p>目前沒有訂閱</p>
      <router-link to="/" class="btn-shop">探索商品</router-link>
    </div>

    <!-- 訂閱列表 -->
    <div v-else class="subscriptions-list">
      <div 
        class="subscription-card" 
        v-for="sub in subscriptions" 
        :key="sub.subscriptionId"
      >
        <div class="card-header">
          <div class="product-info">
            <h3>{{ sub.productName }}</h3>
            <span class="category">{{ sub.category }}</span>
          </div>
          <span class="status-badge" :class="sub.subscriptionStatus">
            {{ getStatusText(sub.subscriptionStatus) }}
          </span>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">配送週期</span>
            <span class="value">{{ getCycleText(sub.cycleType) }}</span>
          </div>
          <div class="info-row">
            <span class="label">訂閱數量</span>
            <span class="value">{{ sub.quantity }} 件</span>
          </div>
          <div class="info-row">
            <span class="label">訂閱價格</span>
            <span class="value price">
              NT$ {{ Number(sub.subscriptionPrice).toLocaleString() }}
              <span class="discount">{{ formatDiscount(sub.discountRate) }}</span>
            </span>
          </div>
          <div class="info-row" v-if="sub.subscriptionStatus === 'active'">
            <span class="label">下次配送日</span>
            <span class="value highlight">{{ sub.nextDeliveryDate }}</span>
          </div>
          <div class="info-row">
            <span class="label">訂閱開始日</span>
            <span class="value">{{ sub.startDate }}</span>
          </div>
          <div class="info-row" v-if="sub.endDate">
            <span class="label">結束日期</span>
            <span class="value">{{ sub.endDate }}</span>
          </div>

          <div class="info-row">
            <span class="label">收件人</span>
            <span class="value">{{ sub.recipientName }}</span>
          </div>
          <div class="info-row">
            <span class="label">電話</span>
            <span class="value">{{ sub.recipientPhone }}</span>
          </div>
          <div class="info-row">
            <span class="label">地址</span>
            <span class="value">{{ sub.recipientAddress }}</span>
          </div>

            <div class="info-row">
                <span class="label">付款方式</span>
                <span class="value">{{ getPaymentMethodText(sub.paymentMethod) }}</span>
            </div>
        </div>

        <div class="card-actions" v-if="sub.subscriptionStatus !== 'cancelled'">
          <!-- 啟用中：可暫停或取消 -->
          <template v-if="sub.subscriptionStatus === 'active'">
            <button 
              class="btn-pause" 
              @click="pauseSubscription(sub.subscriptionId)"
              :disabled="isProcessing"
            >
              <i class="fas fa-pause"></i> 暫停
            </button>
            <button 
              class="btn-cancel" 
              @click="cancelSubscription(sub.subscriptionId)"
              :disabled="isProcessing"
            >
              <i class="fas fa-times"></i> 取消訂閱
            </button>
          </template>

          <!-- 暫停中：可恢復或取消 -->
          <template v-if="sub.subscriptionStatus === 'paused'">
            <button 
              class="btn-resume" 
              @click="resumeSubscription(sub.subscriptionId)"
              :disabled="isProcessing"
            >
              <i class="fas fa-play"></i> 恢復訂閱
            </button>
            <button 
              class="btn-cancel" 
              @click="cancelSubscription(sub.subscriptionId)"
              :disabled="isProcessing"
            >
              <i class="fas fa-times"></i> 取消訂閱
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'

const subscriptions = ref([])
const isLoading = ref(true)
const isProcessing = ref(false)

// 載入訂閱列表
onMounted(async () => {
  await fetchSubscriptions()
})

const fetchSubscriptions = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/subscriptions/my')
    subscriptions.value = response.data || []
  } catch (error) {
    console.error('載入訂閱失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 狀態文字
const getStatusText = (status) => {
  const map = {
    'active': '訂閱中',
    'paused': '已暫停',
    'cancelled': '已取消'
  }
  return map[status] || status
}

// 週期文字
const getCycleText = (cycleType) => {
  const map = {
    'monthly': '每月配送',
    'quarterly': '每三個月配送',
    'biannual': '每六個月配送'
  }
  return map[cycleType] || cycleType
}

// 付款方式文字
const getPaymentMethodText = (method) => {
  const map = {
    'credit_card': '信用卡',
    'atm': 'ATM 轉帳',
    'cvs': '超商代碼'
  }
  return map[method] || method
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

// 暫停訂閱
const pauseSubscription = async (subscriptionId) => {
  if (!confirm('確定要暫停此訂閱嗎？')) return

  isProcessing.value = true
  try {
    await api.put(`/subscriptions/${subscriptionId}/pause`)
    alert('訂閱已暫停')
    await fetchSubscriptions()
  } catch (error) {
    alert(error.response?.data?.message || '操作失敗')
  } finally {
    isProcessing.value = false
  }
}

// 恢復訂閱
const resumeSubscription = async (subscriptionId) => {
  if (!confirm('確定要恢復此訂閱嗎？')) return

  isProcessing.value = true
  try {
    await api.put(`/subscriptions/${subscriptionId}/resume`)
    alert('訂閱已恢復')
    await fetchSubscriptions()
  } catch (error) {
    alert(error.response?.data?.message || '操作失敗')
  } finally {
    isProcessing.value = false
  }
}

// 取消訂閱
const cancelSubscription = async (subscriptionId) => {
  if (!confirm('確定要取消此訂閱嗎？取消後無法恢復。')) return

  isProcessing.value = true
  try {
    await api.put(`/subscriptions/${subscriptionId}/cancel`)
    alert('訂閱已取消')
    await fetchSubscriptions()
  } catch (error) {
    alert(error.response?.data?.message || '操作失敗')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.subscriptions-container {
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

/* 載入中 & 空狀態 */
.loading,
.empty {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i,
.empty i {
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

/* 訂閱卡片 */
.subscriptions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subscription-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.product-info h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.category {
  font-size: 13px;
  color: #7f8c8d;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.active {
  background: #fff3cd;
  color: #856404;;
}

.status-badge.paused {
  background: #3A6B5C;
  color: #ffffff;
}

.status-badge.cancelled {
  background: #bf0111;
  color: #ffffff;
}

.card-body {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #7f8c8d;
  font-size: 14px;
}

.info-row .value {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
}

.info-row .value.price {
  color: #3A6B5C;
  font-weight: 600;
}

.info-row .value.highlight {
  color: #3A6B5C;
  font-weight: 600;
}

.discount {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: normal;
  margin-left: 5px;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.btn-pause,
.btn-cancel {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn-pause {
  background: #3A6B5C;
  color: #ffffff;
}

.btn-pause:hover:not(:disabled) {
  background: #2d5447;
}

.btn-resume {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #fff3cd;
  background: #fff3cd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #856404;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  transition: all 0.3s;
}

.btn-resume:hover:not(:disabled) {
  background: #856404;
  color: #ffffff;
}

.btn-cancel {
  background: #bf0111;
  color: #ffffff;
}

.btn-cancel:hover:not(:disabled) {
  background: #9d0615;
}

.btn-pause:disabled,
.btn-resume:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 響應式 */
@media (max-width: 600px) {
  .card-header {
    flex-direction: column;
    gap: 10px;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>