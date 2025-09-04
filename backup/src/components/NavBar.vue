<template>
  <div class="navbar">
    <div class="navbar-left">
      <h2>AI智能问答系统</h2>
    </div>
    <div class="navbar-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push('/user/me')">个人信息</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/chat/history')">历史记录</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userAPI, authAPI } from '@/api'
import { removeToken } from '@/utils/auth'

const router = useRouter()
const username = ref('用户')

onMounted(async () => {
  try {
    const userInfo = await userAPI.getInfo()
    username.value = userInfo.username
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await authAPI.logout()
    removeToken()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退出登录失败:', error)
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left h2 {
  color: #409EFF;
  margin: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: flex;
  align-items: center;
}
</style>