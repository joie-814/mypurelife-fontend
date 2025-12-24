<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-image">
      <img :src="productImage" :alt="product.productName">
      <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
    </div>
    <div class="product-info">
      <h4 class="product-name">{{ product.productName }}</h4>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-footer">
        <div class="product-price">
          <span class="current-price">NT$ {{ displayPrice.toLocaleString()}}</span>
          <span class="original-price" v-if="product.promotionPrice">NT$ {{ product.price.toLocaleString() }}</span>
        </div>
        <button class="add-to-cart-btn" @click.stop= "handleAddToCart">
          <i class="fas fa-shopping-cart"></i>
          加入購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})


const cartStore = useCartStore()
const router = useRouter()

// 顯示價格（有促銷價用促銷價，沒有用原價）
const displayPrice = computed(() => {
  return props.product.promotionPrice || props.product.price
})

// 商品圖片
const productImage = computed(() => {
  return props.product.imageUrl || '/images/products/default.jpeg'
})

// 快速加入購物車（預設 1 件）
const handleAddToCart = () => {
  const cartProduct = {
    productId: props.product.productId,
    category: props.product.category,
    productName: props.product.productName,
    price: props.product.price,
    promotionPrice: props.product.promotionPrice,
    stock: props.product.stockQuantity,
    imageUrl: props.product.imageUrl
  }
  
  cartStore.addToCart(cartProduct, 1)
  alert(`✓ 已將「${props.product.productName}」加入購物車`)
}

// 點擊卡片跳轉到商品詳情頁
const goToDetail = () => {
  router.push(`/product/${props.product.productId}`)
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff6b6b;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  height: 2.8em;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b6b;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.add-to-cart-btn {
  background: #3A6B5C;;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-to-cart-btn:hover {
  background: #2d5447;
  transform: scale(1.05);
}

/* 按鈕按下效果 */
.add-to-cart-btn:active {
  transform: scale(0.98);
}

/* 購物車圖示樣式 */
.add-to-cart-btn i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .product-name {
    font-size: 14px;
  }

  .product-description {
    font-size: 12px;
  }

  .current-price {
    font-size: 18px;
  }

  .add-to-cart-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

    .add-to-cart-btn i {
    font-size: 12px;
  }
}
</style>