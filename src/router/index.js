import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import CartView from '../views/CartView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'


const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: Home 
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/cart',                              // 購物車路由
    name: 'cart',
    component: CartView,
    meta: { title: '購物車 - pureLife' }
  },
  {
    path: '/product/:id',                       // 商品詳情路由（分開）
    name: 'productDetail',
    component: ProductDetailView,
    meta: { title: '商品詳情 - pureLife' }
  },

  // ========== 新增：需要登入的頁面 ==========
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),  // 懶加載
    meta: { 
      title: '結帳 - pureLife',
      requiresAuth: true  // 標記需要登入
    }
  },
  {
    path: '/member',
    name: 'MemberCenter',
    component: () => import('../views/MemberCenter.vue'),
    meta: { 
      title: '會員中心 - pureLife',
      requiresAuth: true  // 標記需要登入
    }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/OrderList.vue'),
    meta: { 
      title: '訂單查詢 - pureLife',
      requiresAuth: true  // 標記需要登入
    }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: () => import('../views/SubscriptionView.vue'),
    meta: { 
      title: '我的定期購 - pureLife',
      requiresAuth: true  // 標記需要登入
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ========== 全域路由守衛 ==========
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 設定頁面標題
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 已登入但要去登入頁 → 導回首頁
  if (to.path === '/login' && authStore.isLoggedIn) {
    next({ path: '/' })
    return
  }

  // 需要登入但未登入 → 導去登入頁
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  next()
})

export default router