import { createRouter, createWebHistory } from 'vue-router'
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
    path: '/cart',                              // ✅ 購物車路由
    name: 'cart',
    component: CartView,
    meta: { title: '購物車 - pureLife' }
  },
  {
    path: '/product/:id',                       // ✅ 商品詳情路由（分開）
    name: 'productDetail',
    component: ProductDetailView,
    meta: { title: '商品詳情 - pureLife' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router