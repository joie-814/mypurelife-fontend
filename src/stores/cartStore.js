// 負責記憶和管理所有購物車資料

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 購物車商品清單
  const cartItems = ref([])

  // 從 localStorage 載入購物車資料
  // 打開網頁時，把 localStorage 裡的資料放回購物車
  const loadCart = () => {
    const savedCart = localStorage.getItem('pureLifeCart')
    if (savedCart) {
      cartItems.value = JSON.parse(savedCart)
    }
  }

  // 儲存購物車到 localStorage
  // JSON.stringify 物件/陣列 → 字串
  const saveCart = () => {
    localStorage.setItem('pureLifeCart', JSON.stringify(cartItems.value))
  }

  // 加入商品到購物車
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(item => item.productId === product.productId)
    
    if (existingItem) {
      // 如果商品已存在，增加數量
      existingItem.quantity += quantity
    } else {
      // 新增商品
      cartItems.value.push({
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        maxStock: product.stock // 庫存限制
      })
    }
    
    saveCart()
  }

  // 更新商品數量
  const updateQuantity = (productId, newQuantity) => {
    const item = cartItems.value.find(item => item.productId === productId)
    
    if (item) {
      if (newQuantity <= 0) {
        // 數量為 0 則刪除
        removeFromCart(productId)
      } else if (newQuantity <= item.maxStock) {
        // 不超過庫存限制
        item.quantity = newQuantity
        saveCart()
      }
    }
  }

  // 刪除商品
  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      saveCart()
    }
  }

  // 清空購物車
  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  // 計算購物車商品總數量
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 計算購物車總價
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  // 初始化時載入購物車
  loadCart()

  //匯出(export)可以在其他地方使用的函數和資料
  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  }
})