<template>
  <div class="member-container">
    <h1 class="page-title">會員中心</h1>

    <!-- 載入中 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>載入中...</p>
    </div>

    <div v-else class="member-content">
      <!-- 左側：會員資訊 -->
      <div class="member-info-section">
        <!-- 會員基本資訊 -->
        <div class="info-card">
          <div class="card-header">
            <h2><i class="fas fa-user"></i> 會員資訊</h2>
            <button class="btn-edit" @click="toggleEditMode" v-if="!isEditing">
              <i class="fas fa-edit"></i> 編輯
            </button>
          </div>

          <!-- 顯示模式 -->
          <div class="info-content" v-if="!isEditing">
            <div class="info-row">
              <span class="label">帳號</span>
              <span class="value">{{ member.account }}</span>
            </div>
            <div class="info-row">
              <span class="label">姓名</span>
              <span class="value">{{ member.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Email</span>
              <span class="value">{{ member.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">電話</span>
              <span class="value">{{ member.phone || '未設定' }}</span>
            </div>
            <div class="info-row">
              <span class="label">會員等級</span>
              <span class="value level-badge">{{ getMemberLevelText(member.memberLevel) }}</span>
            </div>
            <div class="info-row">
              <span class="label">註冊時間</span>
              <span class="value">{{ formatDate(member.registrationTime) }}</span>
            </div>
          </div>

          <!-- 編輯模式 -->
          <div class="edit-form" v-else>
            <div class="form-group">
              <label>姓名</label>
              <input type="text" v-model="editForm.name" placeholder="請輸入姓名">
            </div>
            <div class="form-group">
              <label>電話</label>
              <input type="tel" v-model="editForm.phone" placeholder="請輸入電話">
            </div>
            <div class="form-actions">
              <button class="btn-save" @click="saveProfile" :disabled="isSaving">
                <i class="fas fa-check"></i> {{ isSaving ? '儲存中...' : '儲存' }}
              </button>
              <button class="btn-cancel" @click="cancelEdit">
                <i class="fas fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>

        <!-- 修改密碼 -->
        <div class="info-card">
          <div class="card-header">
            <h2><i class="fas fa-lock"></i> 修改密碼</h2>
          </div>
          
          <div class="password-form">
            <div class="form-group">
              <label>目前密碼</label>
              <input 
                type="password" 
                v-model="passwordForm.currentPassword" 
                placeholder="請輸入目前密碼"
              >
            </div>
            <div class="form-group">
              <label>新密碼</label>
              <input 
                type="password" 
                v-model="passwordForm.newPassword" 
                placeholder="請輸入新密碼（至少8個字元）"
              >
            </div>
            <div class="form-group">
              <label>確認新密碼</label>
              <input 
                type="password" 
                v-model="passwordForm.confirmPassword" 
                placeholder="請再次輸入新密碼"
              >
            </div>
            <button 
              class="btn-change-password" 
              @click="changePassword"
              :disabled="isChangingPassword"
            >
              <i class="fas fa-key"></i>
              {{ isChangingPassword ? '處理中...' : '修改密碼' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/utils/axios'

const authStore = useAuthStore()

// 狀態
const isLoading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const isChangingPassword = ref(false)

// 會員資料
const member = ref({})

// 編輯表單
const editForm = ref({
  name: '',
  phone: ''
})

// 密碼表單
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 載入會員資料
onMounted(async () => {
  await fetchMemberInfo()
})

const fetchMemberInfo = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/members/me')
    if (response.success) {
      member.value = response.data
      // 同步更新 authStore
      authStore.user = response.data
    }
  } catch (error) {
    console.error('載入會員資料失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 切換編輯模式
const toggleEditMode = () => {
  isEditing.value = true
  editForm.value = {
    name: member.value.name,
    phone: member.value.phone || ''
  }
}

// 取消編輯
const cancelEdit = () => {
  isEditing.value = false
}

// 儲存資料
const saveProfile = async () => {
  if (!editForm.value.name.trim()) {
    alert('請輸入姓名')
    return
  }

  isSaving.value = true
  try {
    const response = await api.put('/members/me', editForm.value)
    if (response.success) {
      member.value = response.data
      authStore.user = response.data
      isEditing.value = false
      alert('資料更新成功')
    }
  } catch (error) {
    alert(error.response?.data?.message || '更新失敗')
  } finally {
    isSaving.value = false
  }
}

// 修改密碼
const changePassword = async () => {
  // 驗證
  if (!passwordForm.value.currentPassword) {
    alert('請輸入目前密碼')
    return
  }
  if (!passwordForm.value.newPassword) {
    alert('請輸入新密碼')
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    alert('新密碼至少需要 8 個字元')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('新密碼與確認密碼不一致')
    return
  }

  isChangingPassword.value = true
  try {
    const response = await api.put('/members/me/password', passwordForm.value)
    if (response.success) {
      alert('密碼修改成功')
      // 清空表單
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  } catch (error) {
    alert(error.response?.data?.message || '密碼修改失敗')
  } finally {
    isChangingPassword.value = false
  }
}

// 會員等級文字
const getMemberLevelText = (level) => {
  const map = {
    'general': '一般會員',
    'vip': 'VIP 會員',
    'premium': '尊榮會員'
  }
  return map[level] || level
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.member-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 25px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

/* 載入中 */
.loading {
  text-align: center;
  padding: 80px 20px;
  color: #7f8c8d;
}

.loading i {
  font-size: 48px;
  margin-bottom: 20px;
}

/* 內容區塊 */
.member-content {
  display: grid;
  gap: 30px;
}

/* 卡片樣式 */
.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.card-header h2 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header h2 i {
  color: #3A6B5C;
}

.btn-edit {
  padding: 8px 16px;
  background: #3A6B5C;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.3s;
}

.btn-edit:hover {
  background: #2d5447;
}

/* 資訊內容 */
.info-content {
  padding: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #7f8c8d;
  font-size: 14px;
}

.info-row .value {
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
}

.level-badge {
  background: #f0f7f4;
  color: #3A6B5C;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px !important;
}

/* 編輯表單 */
.edit-form,
.password-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3A6B5C;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-save,
.btn-cancel,
.btn-change-password {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-save {
  background: #3A6B5C;
  color: white;
  flex: 1;
}

.btn-save:hover:not(:disabled) {
  background: #2d5447;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-change-password {
  width: 100%;
  background: #3A6B5C;
  color: white;
}

.btn-change-password:hover:not(:disabled) {
  background: #2d5447;
}

.btn-save:disabled,
.btn-change-password:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}


/* 響應式 */
@media (max-width: 900px) {
  .member-content {
    grid-template-columns: 1fr;
  }
}
</style>