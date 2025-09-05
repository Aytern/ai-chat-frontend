<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">AI问答系统</router-link>
    </div>
    
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/chat" class="navbar-item" v-if="isAuthenticated">聊天</router-link>
            <router-link to="/chat/history" class="nav-link">历史记录</router-link>
      </div>
      
      <div class="navbar-end">
        <template v-if="isAuthenticated">
          <div class="navbar-item">
            <span>欢迎，{{ currentUser?.username }}</span>
          </div>
          <div class="navbar-item">
            <button @click="handleLogout" class="logout-btn">退出登录</button>
          </div>
        </template>
        
        <template v-else>
          <div class="navbar-item">
            <router-link to="/register" class="navbar-item">注册</router-link>
            <router-link to="/login" class="navbar-item">登录</router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, isAuthenticated, logout } from '@/utils/auth'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const currentUser = ref(null)
    const authenticated = ref(false)
    
    const updateAuthState = () => {
      currentUser.value = getCurrentUser()
      authenticated.value = isAuthenticated()
    }
    
    const handleLogout = () => {
      logout()
      router.push('/login')
    }
    
    onMounted(() => {
      updateAuthState()
    })
    
    return {
      currentUser,
      isAuthenticated: authenticated,
      handleLogout,
      updateAuthState
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-logo {
  color: white;
  text-decoration: none;
}

.navbar-logo:hover {
  color: #ecf0f1;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-start {
  display: flex;
  gap: 1rem;
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-item {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background: none;
  border: 1px solid #ecf0f1;
  color: #ecf0f1;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: #e74c3c;
  border-color: #e74c3c;
}
</style>