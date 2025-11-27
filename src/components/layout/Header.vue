<template>
  <header class="header">
    <!-- 頂部橫幅區域 -->
    <section class="top-banner">
      <div class="banner-content">
        <span class="banner-tag">🎁 健康定期購</span>
        <span class="banner-text">週期配送，健康宅到家！</span>
      </div>
      <div class="banner-right">
        <span class="free-shipping">🚚 購物滿 NT$1,200 免運費</span>
      </div>
    </section>
    <div class="container">
      <div class="logo">
        <router-link to="/">
            <h1>pureLife</h1>
        </router-link>
        <p>專科醫師推薦保健食品 | 你健康,我安心</p>
      </div>
      
    <!-- 導航選單 -->
    <nav class="nav">
        <!-- 有下拉選單的項目 -->
        <div class="nav-link" 
            @mouseenter="activeDropdown = 0" 
            @mouseleave="activeDropdown = null">
            全部商品
            <!-- 下拉選單 -->
            <div class="dropdown" v-show="activeDropdown === 0">
                <a href="newsellers" class="dropdown-item">新品專區</a>
                <a href="#" class="dropdown-item">成分分類</a>
                <a href="#" class="dropdown-item">功效分類</a>
                <a href="#" class="dropdown-item">族群分類</a>
            </div>
        </div>

        <!-- 其他普通連結 -->
        <router-link to="/bestsellers" class="nav-link">熱銷排行榜</router-link>
        <router-link to="/articles" class="nav-link">保健專欄</router-link>

        <div class="nav-link" 
            @mouseenter="activeDropdown = 1" 
            @mouseleave="activeDropdown = null">
            關於我們
            <!-- 下拉選單 -->
            <div class="dropdown" v-show="activeDropdown === 1">
                <a href="#" class="dropdown-item">品​牌理念​</a>
                <a href="#" class="dropdown-item">店​家​資訊</a>
                <a href="#" class="dropdown-item">消費者好評</a>
                <a href="#" class="dropdown-item">隱私權​及​網站​使用​條款</a>
            </div>
        </div>
        
      </nav>
      
      <!-- 右側功能 -->
      <div class="header-actions">
        <button class="icon-btn">🔍 搜尋</button>
        <button class="icon-btn" @click="$router.push('/login')">👤 會員中心</button>
        <router-link to="/cart" class="icon-btn cart-link">
          🛒 購物車
          <span class="cart-badge" v-if="cartStore.totalItems > 0">
            {{ cartStore.totalItems }}
          </span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore.js'
const cartStore = useCartStore()
const activeDropdown = ref(null) 


</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
/* 頂部橫幅 */
.top-banner {
  background: #327a2ea9;
  color: white;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
}

.banner-text {
  font-size: 0.9rem;
}

.banner-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.free-shipping {
  font-weight: 500;
}


.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo a {
  text-decoration: none;
  color: inherit;
}
.logo p {
  font-size: 0.8rem;
  color: #333;
  margin: 0;
}

.logo h1 {
  font-size: 2rem;
  color: #327a2ea9;
  margin: 0;
  cursor: pointer;
}

/* 導航選單 */
.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  transition: color 0.3s;
  padding: 0.5rem 0;
  position: relative;
}

/* Hover 底線效果 */
/* 在nav-link::after後面加東西 */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: 327a2ea9;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: #327a2ea9;
}

/* 當前頁面高亮 */
.nav-link.router-link-active {
  color: #327a2ea9;
  font-weight: 600;
}

/* 右側按鈕 */
.header-actions {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  transition: opacity 0.3s;
}

.icon-btn:hover {
  opacity: 0.6;
}

/* 購物車徽章(加入購物車的數量) */
.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #FF5722;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* ✅ 新增下拉選單樣式 */

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 4px;
  min-width: 150px;
  padding: 0.5rem 0;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
  color: #327a2ea9;
}

.cart-link {
  position: relative;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  line-height: 1.2;
}

/* 手機版 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .nav {
    display: none;  /* 手機版先隱藏選單 */
  }
  
  .logo h1 {
    font-size: 1.8rem;
  }
  
  .icon-btn {
    font-size: 1rem;
  }
}
</style>