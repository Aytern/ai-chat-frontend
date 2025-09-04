// Token管理工具函数
export const setToken = (token) => {
  sessionStorage.setItem('token', token)
}

export const getToken = () => {
  return sessionStorage.getItem('token')
}

export const removeToken = () => {
  sessionStorage.removeItem('token')
}

export const isLoggedIn = () => {
  return !!getToken()
}

export const getAuthHeader = () => {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}
