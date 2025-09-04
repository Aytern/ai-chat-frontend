<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <h2>用户个人信息</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="profile-card">
      <div class="profile-info">
        <div class="info-item">
          <label>用户名:</label>
          <span>{{ userInfo.username }}</span>
        </div>
        <div class="info-item">
          <label>邮箱:</label>
          <span>{{ userInfo.email }}</span>
        </div>
        <div class="info-item">
          <label>注册时间:</label>
          <span>{{ userInfo.created_at }}</span>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn-primary">编辑资料</button>
        <button class="btn-secondary">修改密码</button>
      </div>
    </div>
  </div>
</template>

<script>
import { userAPI } from '@/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserProfile',
  data() {
    return {
      userInfo: {
        username: '',
        email: '',
        created_at: ''
      },
      loading: false
    }
  },
  async mounted() {
    this.loading = true
    try {
      const response = await userAPI.getInfo()
      if (response.success) {
        this.userInfo = response.data
      } else {
        ElMessage.error(response.message || '获取用户信息失败')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    } finally {
      this.loading = false
    }
  }
}
</script>