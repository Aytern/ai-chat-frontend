import api from './index'

export const adminAPI = {
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  getModels: () => api.get('/api/admin/models'),
  updateModel: (id, data) => api.put(`/api/admin/models/${id}`, data)
}