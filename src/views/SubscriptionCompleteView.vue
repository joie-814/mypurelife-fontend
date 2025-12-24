<template>
  <div class="complete-container">
    <div class="complete-card">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      
      <h1>訂閱成功！</h1>
      
      <div class="info-box">
        <p class="next-delivery">
          <i class="fas fa-truck"></i>
          首次配送日：<strong>{{ nextDeliveryDate }}</strong>
        </p>
      </div>

      <div class="message">
        <p>感謝您的訂閱！</p>
        <p>我們將依照您選擇的週期自動為您配送。</p>
      </div>

      <div class="actions">
        <router-link to="/subscriptions" class="btn-primary">
          <i class="fas fa-list"></i> 查看我的訂閱
        </router-link>
        <router-link to="/" class="btn-secondary">
          <i class="fas fa-home"></i> 回到首頁
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const nextDeliveryDate = route.query.nextDeliveryDate || '---'
</script>

<style scoped>
.complete-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.complete-card {
  background: white;
  padding: 60px 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.success-icon {
  margin-bottom: 30px;
}

.success-icon i {
  font-size: 80px;
  color: #3A6B5C;
}

h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.info-box {
  background: #f0f7f4;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.next-delivery {
  font-size: 16px;
  color: #3A6B5C;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.next-delivery strong {
  font-size: 18px;
}

.message {
  margin-bottom: 40px;
}

.message p {
  font-size: 16px;
  color: #34495e;
  margin: 8px 0;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 30px;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3A6B5C;
  color: white;
}

.btn-primary:hover {
  background-color: #2d5447;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #34495e;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}
</style>