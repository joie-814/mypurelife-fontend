<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="logo">
        <h1>pureLife</h1>
      </div>

      <!-- 切換按鈕 -->
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: isLogin }"
          @click="isLogin = true"
        >
          登入
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: !isLogin }"
          @click="isLogin = false"
        >
          註冊
        </button>
      </div>

      <!-- 表單區域 -->
      <div class="auth-form">
        <!-- 登入表單 -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="form">
          <h2 class="form-title">登入您的帳戶</h2>
          <p class="form-subtitle">請輸入您的電子信箱和密碼以開始使用。</p>

          <!-- API 錯誤訊息顯示區 -->
          <div v-if="apiError" class="api-error">
            {{ apiError }}
          </div>

          <div class="form-group">
            <label for="login-email">電子信箱</label>
            <input 
              type="email" 
              id="login-email"
              v-model="loginForm.email"
              placeholder="請輸入電子信箱"
              required
            />
            <!-- 錯誤訊息 -->
            <span v-if="loginErrors.email" class="error-message">
              {{ loginErrors.email }}
            </span>
          </div>

          <div class="form-group">
            <label for="login-password">密碼</label>
            <input 
              type="password" 
              id="login-password"
              v-model="loginForm.password"
              placeholder="請輸入密碼"
              required
              minlength="8"
            />
            <!-- 錯誤訊息 -->
            <span v-if="loginErrors.password" class="error-message">
              {{ loginErrors.password }}
            </span>
          </div>

          <!-- 加入 disabled 和 loading 狀態 -->
          <button type="submit" class="submit-btn" :disabled="isLoading">
             {{ isLoading ? '登入中...' : '立即登入' }}
          </button>

          <div class="form-footer">
            <a href="#" class="link">忘記密碼？</a>
          </div>
        </form>

        <!-- 註冊表單 -->
        <form v-else @submit.prevent="handleRegister" class="form">
          <h2 class="form-title">建立新帳戶</h2>
          <p class="form-subtitle">填寫以下資訊即可開始您的健康之旅！</p>

          <!-- API 錯誤訊息顯示區 -->
          <div v-if="apiError" class="api-error">
            {{ apiError }}
          </div>

          <div class="form-group">
            <label for="register-name">姓名</label>
            <input 
              type="text" 
              id="register-name"
              v-model="registerForm.name"
              placeholder="請輸入您的姓名"
              required
            />
            <span v-if="registerErrors.name" class="error-message">
              {{ registerErrors.name }}
            </span>
          </div>

          <div class="form-group">
            <label for="register-email">電子信箱</label>
            <input 
              type="email" 
              id="register-email"
              v-model="registerForm.email"
              placeholder="請輸入電子信箱"
              required
            />
            <span v-if="registerErrors.email" class="error-message">
              {{ registerErrors.email }}
            </span>
          </div>

          <div class="form-group">
            <label for="register-phone">手機號碼</label>
            <input 
              type="tel" 
              id="register-phone"
              v-model="registerForm.phone"
              placeholder="請輸入手機號碼 (例如: 0912345678)"
              required
              pattern="09[0-9]{8}"
            />
            <span v-if="registerErrors.phone" class="error-message">
              {{ registerErrors.phone }}
            </span>
          </div>

          <div class="form-group">
            <label for="register-password">密碼</label>
            <input 
              type="password" 
              id="register-password"
              v-model="registerForm.password"
              placeholder="請輸入密碼（至少8個字元）"
              required
              minlength="8"
            />
            <span v-if="registerErrors.password" class="error-message">
              {{ registerErrors.password }}
            </span>
          </div>

          <div class="form-group">
            <label for="register-password-confirm">確認密碼</label>
            <input 
              type="password" 
              id="register-password-confirm"
              v-model="registerForm.passwordConfirm"
              placeholder="請再次輸入密碼"
              required
            />
            <span v-if="registerErrors.passwordConfirm" class="error-message">
              {{ registerErrors.passwordConfirm }}
            </span>
          </div>

          <div class="checkbox-group">
            <input 
              type="checkbox" 
              id="agree-terms"
              v-model="registerForm.agreeTerms"
              required
            />
            <label for="agree-terms">
              我同意 <a href="#" class="link">服務條款</a> 和 <a href="#" class="link">隱私政策</a>
            </label>
            <span v-if="registerErrors.agreeTerms" class="error-message">
              {{ registerErrors.agreeTerms }}
            </span>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '註冊中...' : '立即註冊' }}
          </button>
        </form>
      </div>

      <!-- 為什麼選擇我們 -->
      <div class="benefits">
        <h3>為什麼選擇 pureLife？</h3>
        <div class="benefit-list">
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>專科醫師推薦保健食品</span>
          </div>
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>經過國際認證的品質保證</span>
          </div>
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>快速配送，健康宅到家</span>
          </div>
          <div class="benefit-item">
            <span class="icon">✓</span>
            <span>24小時客戶服務支援</span>
          </div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js' 
import { loginApi, registerApi } from '@/api/auth.js'

const router = useRouter()
const route = useRoute() 
const authStore = useAuthStore()
const isLogin = ref(true)
const isLoading = ref(false)
const apiError = ref('')

// 登入表單資料
const loginForm = ref({
  email: '',
  password: ''
})

// 登入錯誤訊息
const loginErrors = ref({
  email: '',
  password: ''
})

// 註冊表單資料
const registerForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: false
})

// 註冊錯誤訊息
const registerErrors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: ''
})

// 清除錯誤訊息
const clearErrors = (errorObj) => {
  // 1.取得 errorObj 裡所有的 key 名稱
  Object.keys(errorObj.value).forEach(key => {
    // 2.對每個 key，把對應的值設為空字串
    errorObj.value[key] = ''
  })
  apiError.value = ''  // 清除錯誤時也清除apiError
}

// 驗證 Email 格式
const validateEmail = (email) => {
  // 檢查是否包含 @
  if (!email.includes('@')) {
    return '電子郵件格式不正確，必須包含 @'
  }
  
  // 更嚴格的 Email 格式驗證
  //有 @，且左右兩邊都不能有空格 	/ 點號 . 後面至少有一個字元
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '請輸入有效的電子郵件格式'
  }
  
  return ''
}

// 驗證密碼長度
const validatePassword = (password) => {
  if (password.length < 8) {
    return '密碼長度至少需要 8 個字元'
  }
  return ''
}

// 驗證手機號碼
const validatePhone = (phone) => {
  const phoneRegex = /^09[0-9]{8}$/
  if (!phoneRegex.test(phone)) {
    return '請輸入正確的手機號碼格式 (例如: 0912345678)'
  }
  return ''
}

// 處理登入
const handleLogin = async() => {
  // 清除之前的錯誤訊息
  clearErrors(loginErrors)
  
  let hasError = false

  // 驗證帳號
  const emailError = validateEmail(loginForm.value.email)
  if (emailError) {
    loginErrors.value.email = emailError
    hasError = true
  }

  // 驗證密碼
  const passwordError = validatePassword(loginForm.value.password)
  if (passwordError) {
    loginErrors.value.password = passwordError
    hasError = true
  }

  // 如果有錯誤就停止
  if (hasError) {
    return
  }

// 呼叫後端 API
  isLoading.value = true
  
  try {
    const response = await loginApi(loginForm.value.email, loginForm.value.password)
    
    if (response.success) {
      // 傳入整個 response.data（LoginResponse）
      authStore.login(response.data)
      
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      apiError.value = response.message || '登入失敗'
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    if (error.response?.data?.message) {
      apiError.value = error.response.data.message
    } else {
      apiError.value = '登入失敗，請稍後再試'
    }
  } finally {
    isLoading.value = false
  }
}

// 處理註冊（async/await 串接 API）
const handleRegister = async() => {
  // 清除之前的錯誤訊息
  clearErrors(registerErrors)
  
  let hasError = false

  // 驗證姓名
  if (!registerForm.value.name.trim()) {
    registerErrors.value.name = '請輸入姓名'
    hasError = true
  }

  // 驗證 Email
  const emailError = validateEmail(registerForm.value.email)
  if (emailError) {
    registerErrors.value.email = emailError
    hasError = true
  }

  // 驗證手機號碼
  const phoneError = validatePhone(registerForm.value.phone)
  if (phoneError) {
    registerErrors.value.phone = phoneError
    hasError = true
  }

  // 驗證密碼
  const passwordError = validatePassword(registerForm.value.password)
  if (passwordError) {
    registerErrors.value.password = passwordError
    hasError = true
  }

  // 驗證密碼確認
  if (registerForm.value.password !== registerForm.value.passwordConfirm) {
    registerErrors.value.passwordConfirm = '兩次輸入的密碼不一致'
    hasError = true
  }

  // 驗證同意條款
  if (!registerForm.value.agreeTerms) {
    registerErrors.value.agreeTerms = '請同意服務條款和隱私政策'
    hasError = true
  }

  // 如果有錯誤就停止
  if (hasError) {
    return
  }

  // 呼叫後端 API
  isLoading.value = true
  
  try {
    const response = await registerApi({
      name: registerForm.value.name,
      email: registerForm.value.email,
      phone: registerForm.value.phone,
      password: registerForm.value.password
    })
    
    if (response.success) {
      // 註冊成功後切換到登入，不自動登入
      alert('註冊成功！請登入')
      isLogin.value = true

      // 自動填入電子信箱方便登入
      loginForm.value.email = registerForm.value.email
      loginForm.value.password = ''
      
      // 清空註冊表單
      registerForm.value = {
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        agreeTerms: false
      }
    } else {
      apiError.value = response.message || '註冊失敗'
    }
  } catch (error) {
    console.error('註冊錯誤:', error)
    if (error.response?.data?.message) {
      apiError.value = error.response.data.message
    } else {
      apiError.value = '註冊失敗，請稍後再試'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e3 0%, #f0f9ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 2.5rem;
}

/* Logo */
.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h1 {
  font-size: 2.5rem;
  color: #3A6B5C;
  margin: 0;
  font-weight: bold;
  letter-spacing: 2px;
}

/* 切換按鈕 */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: white;
  color: #3A6B5C;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 表單 */
.form {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3A6B5C;
  box-shadow: 0 0 0 3px rgba(50, 122, 46, 0.1);
}

.form-group input::placeholder {
  color: #999;
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 0.25rem;
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.checkbox-group label {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  cursor: pointer;
}

/* 提交按鈕 */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #3A6B5C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2a6626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(50, 122, 46, 0.3);
}

.submit-btn:active:not(:disabled)  {
  transform: translateY(0);
}

/* 表單底部 */
.form-footer {
  text-align: center;
  margin-top: 1rem;
}

.link {
  color: #3A6B5C;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.link:hover {
  color: #2a6626;
  text-decoration: underline;
}

/* 優惠特點 */
.benefits {
  border-top: 1px solid #e0e0e0;
  padding-top: 2rem;
}

.benefits h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: bold;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #666;
}

.benefit-item .icon {
  width: 24px;
  height: 24px;
  background: #e8f5e3;
  color: #3A6B5C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

/* 錯誤訊息樣式 */
.error-message {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 輸入框有錯誤時的樣式 */
.form-group input:invalid:not(:focus):not(:placeholder-shown) {
  border-color: #dc3545;
}

.form-group input:valid:not(:focus):not(:placeholder-shown) {
  border-color: #28a745;
}

/* API 錯誤訊息樣式 */
.api-error {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #dc3545;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

/* 按鈕 disabled 樣式 */
.submit-btn:disabled {
  background: #9cb9b0;
  cursor: not-allowed;
  transform: none;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-container {
    padding: 1.5rem;
  }

  .logo h1 {
    font-size: 2rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-subtitle {
    font-size: 0.85rem;
  }
}
</style>