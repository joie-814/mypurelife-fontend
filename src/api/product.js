import api from '@/utils/axios'


// 取得所有商品（可選分類篩選）
export const getProductsApi = (category) => {
  return api.get('/products', { params: category ? { category } : {} })
}

// 取得單一商品
export const getProductByIdApi = (productId) => {
  return api.get(`/products/${productId}`)
}

// 取得所有分類
export const getCategoriesApi = () => {
  return api.get('/products/categories')

}

// 取得新品
export const getNewProductsApi = () => {
  return api.get('/products/new')
}

// 取得熱銷商品
export const getHotProductsApi = () => {
    return api.get('/products/hot')
}