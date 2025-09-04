<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h2>个人信息</h2>
        </div>
      </template>
      
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="userInfo" class="user-info">
        <div class="info-item">
          <label>用户ID：</label>
          <span>{{ userInfo.id }}</span>
        </div>
        
        <div class="info-item">
          <label>用户名：</label>
          <span>{{ userInfo.username }}</span>
        </div>
        
        <div class="info-item">
          <label>邮箱：</label>
          <span>{{ userInfo.email || '未设置' }}</span>
        </div>
        
        <div class="info-item">
          <label>注册时间：</label>
          <span>{{ userInfo.created_at || '未知' }}</span>
        </div>
      </div>
      
      <div v-else class="error">
        <p>无法加载用户信息</p>
        <el-button @click="fetchUserInfo">重试</el-button>
      </div>
      
      <template #footer>
        <el-button type="primary" @click="$router.push('/chat')">返回聊天</el-button>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userAPI } from '@/api'

const userInfo = ref(null)
const loading = ref(true)

const fetchUserInfo = async () => {
  try {
    loading.value = true
    // 这里需要根据你的后端API调整
    // 假设后端有一个 /user/info 接口返回用户信息
    userInfo.value = await userAPI.getInfo()
  } catch (error) {
    ElMessage.error('获取用户信息失败')
    console.error('获取用户信息错误:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-profile {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.profile-card {
  width: 100%;
  max-width: 500px;
}

.card-header {
  text-align: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading .el-icon {
  margin-right: 8px;
}

.user-info {
  padding: 10px 0;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.info-item label {
  font-weight: bold;
  min-width: 80px;
}

.error {
  text-align: center;
  padding: 40px 0;
}

.error p {
  margin-bottom: 15px;
  color: #f56c6c;
}
</style>