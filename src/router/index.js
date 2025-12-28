import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/authStore.js'
import { useAdminStore } from '@/stores/adminStore'

//前台頁面
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

// 後台頁面
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import AdminMembers from '@/views/admin/AdminMembers.vue'
import AdminSubscriptions from '@/views/admin/AdminSubscriptions.vue'
import AdminProducts from '@/views/admin/AdminProducts.vue'

const routes = [
  // ===== 前台路由 =====
  { 
    path: '/', component: () => import('@/layouts/MainLayout.vue'), // 前台 Layout（有 Header/Footer）
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'login', name: 'Login', component: Login },
      { path: 'cart', name: 'CartView', component: () => import('@/views/CartView.vue') },
      { path: 'product/:id', name: 'ProductDetailView', component: () => import('@/views/ProductDetailView.vue') },
      { path: 'about', name: 'About', component: () => import('@/views/AboutView.vue'), meta: { title: '品牌理念 - PureLife' }},
      { path: 'payment-info', name:'paymentInfo', component:() =>  import('@/views/PaymentInfoView.vue'), meta: { title: '付款方式 - PureLife' }},
      { path: 'faq', name:'FAQ', component:() =>  import('@/views/FaqView.vue'), meta: { title: '常見問題 - PureLife' }},
      // ========== 新增：需要登入的頁面 ==========
      { path: 'checkout', name: 'Checkout', component: () => import('@/views/CheckoutView.vue') },
      { path: 'order-complete', name: 'OrderComplete', component: () => import('@/views/OrderCompleteView.vue') },
      { path: 'orders', name: 'Orders', component: () => import('@/views/OrderListView.vue') },
      { path: 'orders/:id', name: 'OrderDetail', component: () => import('@/views/OrderDetailView.vue') },
      { path: 'member', name: 'MemberCenter', component: () => import('@/views/MemberCenter.vue') },
      { path: 'subscriptions', name: 'Subscriptions', component: () => import('../views/SubscriptionListView.vue') },
      { path: 'subscription-checkout', name: 'SubscriptionCheckout', component: () => import('@/views/SubscriptionCheckoutView.vue') },
      { path: 'subscription-complete', name: 'SubscriptionComplete', component: () => import('@/views/SubscriptionCompleteView.vue') }
    ]
  },

  // ===== 後台路由 =====
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'), // 後台專用 Layout
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'orders', name: 'AdminOrders', component: AdminOrders },
      { path: 'members', name: 'AdminMembers', component: AdminMembers },
      { path: 'subscriptions', name: 'AdminSubscriptions', component: AdminSubscriptions },
      {path: 'products', name: 'AdminProducts', component: AdminProducts}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ========== 全域路由守衛 ==========
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const adminStore = useAdminStore()

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
  
  // ===== 後台守衛 =====
  if (to.meta.requiresAdmin) {
    // 初始化 admin 狀態（從 localStorage 讀取）
    adminStore.initAdmin()
    
    if (!adminStore.isLoggedIn) {
      next({ path: '/admin/login' })
      return
    }
  }
  next()
})

export default router