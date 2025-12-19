// 認證相關 API

import api from '@/utils/axios'


// 註冊
export const registerApi = (data) => {
  return api.post('/auth/register', data)
}

// 登入
export const loginApi = (email, password) => {
  return api.post('/auth/login', { email, password })
}