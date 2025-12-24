<template>
  <div class="home">
    <main class="main-content">
      <!-- 輪播區域 -->
      <section class="carousel-wrapper">
        <div class="carousel-container" ref="carouselContainer">
          <div class="slides-container" ref="slidesContainer">
            <div class="slide">
              <img :src="slide1" alt="新註冊會員優惠">
            </div>
            <div class="slide">
              <img :src="slide2" alt="五星好評送紅利點數">
            </div>
            <div class="slide">
              <img :src="slide3" alt="會員點數">
            </div>
          </div>
          <!-- 左右箭頭 -->
          <button class="nav-button prev" @click="changeSlide(-1)">&#10094;</button>
          <button class="nav-button next" @click="changeSlide(1)">&#10095;</button>
          <!-- 點擊點更換頁面 -->
          <div class="dots-container">
            <div 
              v-for="(dot, index) in totalSlides" 
              :key="index"
              class="dot"
              :class="{ active: currentIndex === index }" 
              @click="goToSlide(index)"
            ></div>
          </div>
        </div>
      </section>

      <!-- Loading 狀態 -->
      <div v-if="isLoading" class="loading">
        <p>商品載入中...</p>
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
        <button @click="fetchProducts">重新載入</button>
      </div>

      <!-- 商品區域 -->
      <template v-else>
        <!-- 新品上市區域 -->
        <section class="products-section">
          <div class="section-header">
            <h3>新品上市</h3>
            <a href="#" class="view-more">查看更多 →</a>
          </div>
          <div class="products-grid">
            <ProductCard 
              v-for="product in newProducts" 
              :key="product.id"
              :product="product"
            />
          </div>
        </section>

        <!-- 熱銷商品區域 -->
        <section class="products-section">
          <div class="section-header">
            <h3>熱銷商品</h3>
            <a href="#" class="view-more">查看更多 →</a>
          </div>
          <div class="products-grid">
            <ProductCard 
              v-for="product in bestProducts" 
              :key="product.id"
              :product="product"
            />
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProductCard from '@/components/productCard.vue'
import { getNewProductsApi, getHotProductsApi } from '@/api/product.js'

// 引入圖片
import slide1 from '@/assets/carousel/row1.png'
import slide2 from '@/assets/carousel/row2.png'
import slide3 from '@/assets/carousel/row3.png'


//輪播相關的程式碼
const currentIndex = ref(0)
const totalSlides = 3
const slidesContainer = ref(null)
const carouselContainer = ref(null)
let autoPlayInterval = null

// 商品資料
const newProducts = ref([])
const bestProducts = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

// 從 API 取得商品
const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
     // 同時呼叫兩個 API
    const [newRes, hotRes] = await Promise.all([
      getNewProductsApi(),
      getHotProductsApi()
    ])
    
    if (newRes.success) {
      newProducts.value = newRes.data.map(p => ({
        ...p,
        badge: 'NEW'
      }))
    }
    
    if (hotRes.success) {
      bestProducts.value = hotRes.data.map(p => ({
        ...p,
        badge: 'HOT'
      }))
    }
  } catch (error) {
    console.error('取得商品失敗:', error)
    errorMessage.value = '無法連接伺服器，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// 輪播功能
const goToSlide = (index) => {
  currentIndex.value = index
  updateSlidePosition()
}

const changeSlide = (direction) => {
  currentIndex.value += direction
  if (currentIndex.value < 0) {
    currentIndex.value = totalSlides - 1
  } else if (currentIndex.value >= totalSlides) {
    currentIndex.value = 0
  }
  updateSlidePosition()
}

const updateSlidePosition = () => {
  const offset = -currentIndex.value * 100
  if (slidesContainer.value) {
    slidesContainer.value.style.transform = `translateX(${offset}%)`
  }
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    changeSlide(1)
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
}

//手機或平板觸控輪播滑動
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX //記錄手指按下位置
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX //記錄手指放開位置
  handleSwipe()
}

const handleSwipe = () => {
  if (touchEndX < touchStartX - 50) {
    changeSlide(1) //往左滑，下一張
  }
  if (touchEndX > touchStartX + 50) {
    changeSlide(-1) //往右滑，上一張
  }
}

//鍵盤控制:使用左右方向鍵切換輪播。
const handleKeyDown = (e) => {
  if (e.key === 'ArrowLeft') changeSlide(-1)
  if (e.key === 'ArrowRight') changeSlide(1)
}

//Vue生命週期掛載
onMounted(() => {
  fetchProducts() // 載入商品
  startAutoPlay() //初始化時啟動自動輪播

  //滑鼠進入/離開時暫停或恢復自動輪播
  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('mouseenter', stopAutoPlay)
    carouselContainer.value.addEventListener('mouseleave', startAutoPlay)
  }

  //觸控事件
  if (slidesContainer.value) {
    slidesContainer.value.addEventListener('touchstart', handleTouchStart)
    slidesContainer.value.addEventListener('touchend', handleTouchEnd)
  }

  //鍵盤事件
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  stopAutoPlay() //卸載時停止計時器

  //移除所有事件監聽，避免 memory leak
  if (carouselContainer.value) {
    carouselContainer.value.removeEventListener('mouseenter', stopAutoPlay)
    carouselContainer.value.removeEventListener('mouseleave', startAutoPlay)
  }
  if (slidesContainer.value) {
    slidesContainer.value.removeEventListener('touchstart', handleTouchStart)
    slidesContainer.value.removeEventListener('touchend', handleTouchEnd)
  }

  //移除之前綁在document上的鍵盤事件監聽器
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.main-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Loading 和 Error 樣式 */
.loading,
.error {
  text-align: center;
  padding: 60px 20px;
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

/* 輪播樣式 */
.carousel-wrapper {
  max-width: 1800px;
  width: 100%;
  margin: 0 auto 4rem;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.slides-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  position: relative;
  aspect-ratio: 25 / 9;
  overflow: hidden;
  background: #f0f0f0;
}

.slide img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.dots-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.dot.active {
  background: #fff;
  width: 40px;
  border-radius: 6px;
}

/* 商品區域樣式 */
.products-section {
  margin-bottom: 4rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  font-size: 25px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.view-more {
  color: #3A6B5C;;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
}

.view-more:hover {
  color: #3A6B5C;
  transform: translateX(5px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .carousel-wrapper {
    margin-bottom: 2rem;
  }

  .slide {
    aspect-ratio: 4 / 3;
  }

  .nav-button {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  .nav-button.prev {
    left: 10px;
  }

  .nav-button.next {
    right: 10px;
  }

  .section-header h3 {
    font-size: 22px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .products-section {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>