// src/utils/axios.js
// Axios 實例 + 攔截器

import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

// 建立 axios 實例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // 後端 API 網址
  timeout: 10000,  // 10 秒逾時
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器：自動加上 Token
// config 就是這次要送出去的請求資訊整包
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pureLifeToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => {
    // 成功回應，直接回傳 data
    return response.data
  },
  (error) => {
    // 處理錯誤
    if (error.response) {
      const status = error.response.status
      
      if (status === 401) {
        // Token 無效或過期，清除登入狀態並導向登入頁
        const authStore = useAuthStore()
        authStore.logout()
        router.push('/login')
        console.error('登入已過期，請重新登入')
      } else if (status === 403) {
        console.error('沒有權限存取此資源')
      } else if (status === 500) {
        console.error('伺服器錯誤')
      }
    } else {
      console.error('網路連線失敗')
    }
    
    return Promise.reject(error)
  }
)

export default api