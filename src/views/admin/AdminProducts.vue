<template>
  <div class="products-page">
    <header class="page-header">
      <h1>商品管理</h1>
      <button class="btn-add" @click="openAddModal">
        <i class="fas fa-plus"></i> 新增商品
      </button>
    </header>

    <div class="content-card">
      <!-- 載入中 -->
      <div v-if="isLoading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>載入中...</p>
      </div>

      <!-- 商品列表 -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px">ID</th>
              <th style="width: 80px">圖片</th>
              <th>商品名稱</th>
              <th style="width: 100px">分類</th>
              <th style="width: 110px">價格</th>
              <th style="width: 80px">庫存</th>
              <th style="width: 100px">狀態</th>
              <th style="width: 100px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.productId">
              <td>{{ product.productId }}</td>
              <td>
                <img 
                  v-if="product.imageUrl" 
                  :src="getProductImageUrl(product.imageUrl)" 
                  class="product-image"
                  alt="商品圖片"
                >
                <div v-else class="no-image">
                  <i class="fas fa-image"></i>
                </div>
              </td>
              <td class="product-name">{{ product.productName }}</td>
              <td>{{ product.category }}</td>
              <td>
                <div class="price-cell">
                  <span class="original-price" :class="{ 'has-promo': product.promotionPrice }">
                    NT$ {{ Number(product.price).toLocaleString() }}
                  </span>
                  <span v-if="product.promotionPrice" class="promo-price">
                    NT$ {{ Number(product.promotionPrice).toLocaleString() }}
                  </span>
                </div>
              </td>
              <td>{{ product.stockQuantity }}</td>
              <td>
                <select 
                  class="status-select" 
                  :class="getStatusClass(product.productStatus)"
                  v-model="product.productStatus"
                  @change="updateStatus(product)"
                >
                  <option value="available">上架中</option>
                  <option value="unavailable">已下架</option>
                </select>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-edit" @click="openEditModal(product)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-delete" @click="deleteProduct(product)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="products.length === 0" class="no-data">目前沒有商品</p>
      </div>
    </div>

    <!-- 新增/編輯 Modal -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEdit ? '編輯商品' : '新增商品' }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- 圖片上傳區域 -->
          <div class="form-group">
            <label>商品圖片</label>
            <div class="image-upload-area">
              <!-- 圖片預覽 -->
              <div class="image-preview" v-if="imagePreview || form.imageUrl">
                <img :src="imagePreview || getProductImageUrl(form.imageUrl)" alt="預覽">
                <button class="btn-remove-image" @click="removeImage" type="button">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <!-- 上傳區塊 -->
              <div 
                class="upload-zone" 
                v-else
                @click="triggerFileInput"
                @dragover.prevent="onDragOver"
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop"
                :class="{ 'drag-over': isDragOver }"
              >
                <i class="fas fa-cloud-upload-alt"></i>
                <p>點擊或拖曳圖片上傳</p>
                <span>支援 JPG、PNG、GIF，最大 5MB</span>
              </div>
              
              <!-- 隱藏的 file input -->
              <input 
                type="file" 
                ref="fileInput"
                @change="onFileSelect"
                accept="image/jpeg,image/png,image/gif,image/webp"
                style="display: none"
              >
            </div>
            
            <!-- 上傳進度 -->
            <div class="upload-progress" v-if="isUploading">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <span>上傳中... {{ uploadProgress }}%</span>
            </div>

            <!-- 重新選擇按鈕 -->
            <button 
              v-if="imagePreview || form.imageUrl" 
              class="btn-reselect" 
              @click="triggerFileInput"
              type="button"
            >
              <i class="fas fa-redo"></i> 重新選擇圖片
            </button>
          </div>

          <div class="form-group">
            <label>商品名稱 <span class="required">*</span></label>
            <input type="text" v-model="form.productName" placeholder="請輸入商品名稱">
          </div>

          <div class="form-group">
            <label>分類 <span class="required">*</span></label>
            <input type="text" v-model="form.category" placeholder="例如：維他命、益生菌">
          </div>

          <div class="form-group">
            <label>商品描述</label>
            <textarea v-model="form.description" rows="3" placeholder="請輸入商品描述"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>原價 <span class="required">*</span></label>
              <input type="number" v-model="form.price" placeholder="0">
            </div>
            <div class="form-group">
              <label>促銷價</label>
              <input type="number" v-model="form.promotionPrice" placeholder="選填">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>庫存數量 <span class="required">*</span></label>
              <input type="number" v-model="form.stockQuantity" placeholder="0">
            </div>
            <div class="form-group">
              <label>狀態</label>
              <select v-model="form.productStatus">
                <option value="available">上架中</option>
                <option value="unavailable">已下架</option>
              </select>
            </div>
          </div>
          <!-- 定期購設定區塊 -->
          <div class="subscription-section">
            <div class="section-header">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="form.enableSubscription"
                  class="toggle-checkbox"
                >
                <span class="toggle-switch"></span>
                <span class="toggle-text">啟用定期購</span>
              </label>
            </div>

            <div class="subscription-plans" v-if="form.enableSubscription">
              <p class="section-hint">
                <i class="fas fa-info-circle"></i>
                設定此商品可選的定期購方案，會員可依需求選擇配送週期
              </p>

              <div 
                class="plan-item" 
                v-for="(plan, index) in form.subscriptionPlans" 
                :key="index"
              >
                <div class="plan-row">
                  <div class="plan-field">
                    <label>週期類型</label>
                    <select v-model="plan.cycleType" @change="onCycleTypeChange(plan)">
                      <option value="monthly">每月</option>
                      <option value="quarterly">每三個月</option>
                      <option value="biannual">每六個月</option>
                    </select>
                  </div>
                  <div class="plan-field">
                    <label>週期天數</label>
                    <input 
                      type="number" 
                      v-model="plan.cycleDays" 
                      placeholder="天數"
                      min="1"
                    >
                  </div>
                  <div class="plan-field">
                    <label>折扣 (%)</label>
                    <input 
                      type="number" 
                      v-model="plan.discountRate" 
                      placeholder="0-100"
                      min="0"
                      max="100"
                    >
                  </div>
                  <button 
                    class="btn-remove-plan" 
                    @click="removePlan(index)"
                    type="button"
                    v-if="form.subscriptionPlans.length > 1"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                <div class="plan-preview">
                  <span class="preview-label">預覽：</span>
                  <span class="preview-text">
                    {{ getCycleTypeName(plan.cycleType) }}配送（{{ plan.cycleDays || 0 }}天）
                    <template v-if="plan.discountRate > 0">
                      ，享 {{ plan.discountRate }}% 折扣
                      <span class="discount-price" v-if="form.price">
                        （NT$ {{ formatDiscount(plan.discountRate) }}）
                      </span>
                    </template>
                  </span>
                </div>
              </div>

              <button class="btn-add-plan" @click="addPlan" type="button">
                <i class="fas fa-plus"></i> 新增方案
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-save" @click="saveProduct" :disabled="isSaving || isUploading">
            {{ isSaving ? '儲存中...' : '儲存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '@/utils/adminAxios'

const products = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const editingId = ref(null)

// 圖片上傳相關
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const isDragOver = ref(false)

const defaultPlan = () => ({
  cycleType: 'monthly',
  cycleDays: 30,
  discountRate: 0.95
})

const form = ref({
  productName: '',
  category: '',
  description: '',
  price: '',
  promotionPrice: '',
  stockQuantity: '',
  productStatus: 'available',
  imageUrl: '',
  enableSubscription: false,
  subscriptionPlans: [defaultPlan()]
})

const cycleTypeDefaults = {
  monthly: 30,
  quarterly: 90,
  biannual: 180
}

const onCycleTypeChange = (plan) => {
  plan.cycleDays = cycleTypeDefaults[plan.cycleType] || 30
}

const getCycleTypeName = (type) => {
  const names = {
    'monthly': '每月配送',
    'quarterly': '每三個月配送',
    'biannual': '每六個月配送'
  }
  return names[type] || type
}

// 格式化折扣顯示
const formatDiscount = (discountRate) => {
  if (!discountRate || discountRate === 1) return ''
  
  // 0.95 → 95折, 0.90 → 9折, 0.85 → 85折
  const discount = discountRate * 100
  
  if (discount % 10 === 0) {
    return `${discount / 10} 折`
  } else {
    return `${discount.toFixed(0)} 折`
  }
}

const addPlan = () => {
  if (!form.value.subscriptionPlans) {
    form.value.subscriptionPlans = [defaultPlan()]
  } else {
    form.value.subscriptionPlans.push(defaultPlan())
  }
}

const removePlan = (index) => {
  form.value.subscriptionPlans.splice(index, 1)
}

// 取得商品圖片 URL
const getProductImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  if (imageUrl.startsWith('/uploads')) return "http://localhost:8080" + imageUrl
  if (imageUrl.startsWith('/')) return "http://localhost:8080" + imageUrl
  return "http://localhost:8080/uploads/products/" + imageUrl
}

// 載入商品
onMounted(async () => {
  await loadProducts()
})

const loadProducts = async () => {
  isLoading.value = true
  try {
    const response = await adminApi.get('/admin/products')
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('載入商品失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 觸發檔案選擇
const triggerFileInput = () => {
  fileInput.value.click()
}

// 檔案選擇處理
const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

// 拖曳相關
const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFile(file)
  }
}

// 處理檔案
const handleFile = (file) => {
  // 驗證檔案類型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    alert('只支援 JPG、PNG、GIF、WebP 格式的圖片')
    return
  }

  // 驗證檔案大小（5MB）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('圖片大小不能超過 5MB')
    return
  }

  selectedFile.value = file

  // 建立預覽
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 上傳圖片
const uploadImage = async () => {
  if (!selectedFile.value) return null

  isUploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await adminApi.post('/admin/upload/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })

    if (response.success) {
      return response.data.imageUrl // 回傳檔案名稱
    } else {
      throw new Error(response.message || '上傳失敗')
    }
  } catch (error) {
    console.error('圖片上傳失敗:', error)
    throw error
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// 移除圖片
const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  form.value.imageUrl = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 開啟新增 Modal
const openAddModal = () => {
  isEdit.value = false
  editingId.value = null
  selectedFile.value = null
  imagePreview.value = null
  form.value = {
    productName: '',
    category: '',
    description: '',
    price: '',
    promotionPrice: '',
    stockQuantity: '',
    productStatus: 'available',
    imageUrl: ''
  }
  showModal.value = true
}

// 開啟編輯 Modal
const openEditModal = (product) => {
  isEdit.value = true
  editingId.value = product.productId
  selectedFile.value = null
  imagePreview.value = null
  form.value = {
    productName: product.productName,
    category: product.category,
    description: product.description || '',
    price: product.price,
    promotionPrice: product.promotionPrice || '',
    stockQuantity: product.stockQuantity,
    productStatus: product.productStatus,
    imageUrl: product.imageUrl || ''
  }
  showModal.value = true
}

// 關閉 Modal
const closeModal = () => {
  showModal.value = false
  selectedFile.value = null
  imagePreview.value = null
}

// 儲存商品
const saveProduct = async () => {
  if (!form.value.productName.trim()) { alert('請輸入商品名稱'); return }
  if (!form.value.category.trim()) { alert('請輸入分類'); return }
  if (!form.value.price || form.value.price <= 0) { alert('請輸入有效的價格'); return }

  if (form.value.enableSubscription) {
    for (const plan of form.value.subscriptionPlans) {
      if (!plan.cycleDays || plan.cycleDays <= 0) {
        alert('請輸入有效的週期天數')
        return
      }
    }
  }

  isSaving.value = true

  try {
    let imageUrl = form.value.imageUrl
    if (selectedFile.value) {
      imageUrl = await uploadImage()
    }
    const formData = new FormData()
    formData.append('productName', form.value.productName)
    formData.append('category', form.value.category)
    formData.append('description', form.value.description)
    formData.append('price', Number(form.value.price))
    formData.append('promotionPrice', form.value.promotionPrice ? Number(form.value.promotionPrice) : 0)
    formData.append('stockQuantity', Number(form.value.stockQuantity) || 0)
    formData.append('productStatus', form.value.productStatus)
    formData.append('imageUrl', form.value.imageUrl || '') // 可選
    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }

    formData.append('subscriptionPlans', JSON.stringify(form.value.enableSubscription ? form.value.subscriptionPlans : []))
    if (isEdit.value) {
      await adminApi.put(`/admin/products/${editingId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('商品更新成功')
    } else {
      await adminApi.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('商品新增成功')
    }

    closeModal()
    await loadProducts()
  } catch (error) {
    alert(error.response?.data?.message || error.message || '操作失敗')
  } finally {
    isSaving.value = false
  }
}

// 更新狀態
const updateStatus = async (product) => {
  try {
    await adminApi.put(`/admin/products/${product.productId}/status?status=${product.productStatus}`)
  } catch (error) {
    alert('更新失敗')
    loadProducts()
  }
}

// 刪除商品
const deleteProduct = async (product) => {
  if (!confirm(`確定要刪除「${product.productName}」嗎？`)) return

  try {
    await adminApi.delete(`/admin/products/${product.productId}`)
    alert('商品已刪除')
    await loadProducts()
  } catch (error) {
    alert(error.response?.data?.message || '刪除失敗')
  }
}

// 狀態樣式
const getStatusClass = (status) => status === 'available' ? 'status-available' : 'status-unavailable'
</script>

<style scoped>
.products-page {
  padding: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 26px;
  color: #2c3e50;
  margin: 0;
}

.btn-add {
  padding: 12px 24px;
  background: #3A6B5C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #2d5447;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #7f8c8d;
}

.loading i {
  font-size: 40px;
  margin-bottom: 15px;
  display: block;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #34495e;
  font-size: 13px;
}

.data-table td {
  font-size: 14px;
  color: #2c3e50;
}

/* 商品圖片 */
.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.no-image {
  width: 50px;
  height: 50px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  font-size: 18px;
}

.product-name {
  font-weight: 500;
  max-width: 180px;
  white-space: normal;
}

/* 價格欄位 */
.price-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.original-price {
  color: #2c3e50;
}

.original-price.has-promo {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
}

.promo-price {
  color: #e74c3c;
  font-weight: 600;
}

/* 狀態選擇 */
.status-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.status-available {
  background: #d4edda;
  color: #155724;
}

.status-unavailable {
  background: #f8d7da;
  color: #721c24;
}

/* 操作按鈕 */
.actions {
  display: inline-flex;
  gap: 8px;
  justify-content: center;
}

.btn-edit,
.btn-delete {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: #e3f2fd;
  color: #1565c0;
}

.btn-edit:hover {
  background: #1565c0;
  color: white;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #c62828;
  color: white;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #7f8c8d;
  cursor: pointer;
}

.modal-body {
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
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3A6B5C;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* 圖片上傳 */
.image-upload-area {
  margin-bottom: 10px;
}

.upload-zone {
  width: 100%;
  height: 180px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-zone:hover {
  border-color: #3A6B5C;
  background: #f0f7f4;
}

.upload-zone.drag-over {
  border-color: #3A6B5C;
  background: #e8f5e9;
}

.upload-zone i {
  font-size: 48px;
  color: #bdc3c7;
  margin-bottom: 12px;
}

.upload-zone:hover i {
  color: #3A6B5C;
}

.upload-zone p {
  font-size: 16px;
  color: #666;
  margin: 0 0 5px 0;
}

.upload-zone span {
  font-size: 12px;
  color: #999;
}

.image-preview {
  position: relative;
  width: 180px;
  height: 180px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
}

.btn-remove-image:hover {
  background: #e74c3c;
}

.btn-reselect {
  margin-top: 10px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.btn-reselect:hover {
  background: #e9ecef;
  border-color: #3A6B5C;
  color: #3A6B5C;
}

.upload-progress {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3A6B5C, #5a9a7c);
  border-radius: 4px;
  transition: width 0.3s;
}

.upload-progress span {
  font-size: 12px;
  color: #666;
}

/* 定期購設定 */
.subscription-section {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e0e0e0;
}

.section-header {
  margin-bottom: 15px;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-switch {
  width: 48px;
  height: 26px;
  background: #ddd;
  border-radius: 13px;
  position: relative;
  transition: background 0.3s;
  margin-right: 12px;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-checkbox:checked + .toggle-switch {
  background: #3A6B5C;
}

.toggle-checkbox:checked + .toggle-switch::after {
  transform: translateX(22px);
}

.toggle-text {
  font-weight: 600;
  color: #2c3e50;
  font-size: 15px;
}

.section-hint {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0 0 15px 0;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.section-hint i {
  margin-right: 6px;
  color: #3A6B5C;
}

.plan-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #e9ecef;
}

.plan-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.plan-field label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.plan-field input,
.plan-field select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.plan-field input:focus,
.plan-field select:focus {
  outline: none;
  border-color: #3A6B5C;
}

.btn-remove-plan {
  padding: 10px 12px;
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-remove-plan:hover {
  background: #c62828;
  color: white;
}

.plan-preview {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
  font-size: 13px;
}

.preview-label {
  color: #999;
}

.preview-text {
  color: #2c3e50;
}

.discount-price {
  color: #e74c3c;
  font-weight: 600;
}

.btn-add-plan {
  width: 100%;
  padding: 12px;
  background: white;
  border: 2px dashed #3A6B5C;
  border-radius: 8px;
  color: #3A6B5C;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-add-plan:hover {
  background: #f0f7f4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-save {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
}

.btn-cancel:hover {
  background: #e9ecef;
}

.btn-save {
  background: #3A6B5C;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #2d5447;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .products-page {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .form-row,
  .plan-row {
    grid-template-columns: 1fr;
  }
}
</style>