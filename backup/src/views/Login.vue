<template>
  <div class="login-container">
    <div class="form-container">
      <h2 style="text-align: center; margin-bottom: 24px;">登录</h2>
      
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="captcha">
          <div style="display: flex; gap: 10px;">
            <el-input 
              v-model="form.captcha" 
              placeholder="请输入验证码"
              size="large"
            />
            <img 
              :src="captchaUrl" 
              alt="验证码" 
              style="height: 40px; cursor: pointer; border-radius: 4px;"
              @click="refreshCaptcha"
            />
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            style="width: 100%" 
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div style="text-align: center; margin-top: 20px;">
        <span>还没有账号？</span>
        <el-link type="primary" :underline="false" @click="$router.push('/register')">
          立即注册
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api'
import { setToken } from '@/utils/auth'

const router = useRouter()
const loginForm = ref(null)
const loading = ref(false)
const captchaUrl = ref('/api/login/captcha')

const form = ref({
  username: '',
  password: '',
  captcha: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const refreshCaptcha = () => {
  captchaUrl.value = `/api/login/captcha?t=${Date.now()}`
}

const handleLogin = async () => {
  if (!loginForm.value) return
  
  try {
    const valid = await loginForm.value.validate()
    if (!valid) return
    
    loading.value = true
    const response = await authAPI.login(form.value)
    
    if (response.token) {
      setToken(response.token)
      ElMessage.success('登录成功')
      router.push('/chat')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败')
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>