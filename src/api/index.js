import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加Token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API方法封装
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data), 
  register: (data) => api.post('/api/auth/register', data),
  logout: () => api.post('/api/auth/logout')  // 改为POST方法
}

export const chatAPI = {
  sendMessage: (data) => api.post('/api/chat/get_response', data),
  getHistory: (params) => api.get('/api/chat/history', { params }),
  deleteHistory: (id) => api.delete(`/api/chat/${id}`),
  clearHistory: () => api.delete('/api/chat/clear')
}

export const userAPI = {
  getInfo: () => api.get('/api/users/me'),
  updateInfo: (data) => api.put('/api/users/me', data)
}

export default api