
import { authAPI } from '@/api'
// 用户认证状态管理工具函数
// 退出登录
export const logout = async () => {
  try {
    await authAPI.logout() // 调用后端logout接口
  } catch (error) {
    console.error('退出登录时后端调用失败', error)
  } finally {
    clearAuth()
    window.location.href = '/login'
  }
}
// 获取当前用户信息
export const getCurrentUser = () => {
  try {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 检查用户是否已认证
export const isAuthenticated = () => {
  return !!sessionStorage.getItem('token');
};

// 保存用户信息
export const setUser = (userData) => {
  try {
    sessionStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('保存用户信息失败:', error);
    return false;
  }
};

// 保存认证令牌
export const setToken = (token) => {
  try {
    sessionStorage.setItem('token', token);
    return true;
  } catch (error) {
    console.error('保存token失败:', error);
    return false;
  }
};

// 清除用户认证信息
export const clearAuth = () => {
  try {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('清除认证信息失败:', error);
    return false;
  }
};




// 检查 token 是否有效（简单版本）
export const isTokenValid = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return false;
  
  // 这里可以添加更复杂的 token 验证逻辑
  // 例如检查过期时间、格式等
  return true;
};

// 获取认证头信息（用于API请求）
export const getAuthHeader = () => {
  const token = sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 兼容旧的 import
export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const removeToken = () => {
  sessionStorage.removeItem('token');
};
