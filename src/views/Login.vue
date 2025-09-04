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
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div style="text-align: center; margin-top: 20px;">
        <span>还没有账号？</span>
        <el-link type="primary" :underline="false" @click="goToRegister">
          立即注册
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api'
import { setToken, setUser } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        captcha: '',
        remember: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      loading: false,
      captchaUrl: '/api/login/captcha'
    }
  },
  methods: {
    async handleLogin() {
      try {
        await this.$refs.loginForm.validate()
      } catch (error) {
        console.log('表单验证失败:', error)
        ElMessage.error('请填写完整信息')
        return
      }
      
      this.loading = true
      try {
        const response = await authAPI.login({
          username: this.form.username,
          password: this.form.password,
          captcha: this.form.captcha,
          remember: this.form.remember
        })
        
        console.log('登录响应:', response) // 添加响应日志
        
        // 简化响应处理逻辑
        let token, userData
        
        // 尝试从不同响应结构中提取token
        if (response && response.data) {
          // 情况1: response.data包含token
          if (response.data.token) {
            token = response.data.token
            userData = response.data.user || response.data.userData || {}
          } 
          // 情况2: response.data.data包含token
          else if (response.data.data && response.data.data.token) {
            token = response.data.data.token
            userData = response.data.data.user || response.data.data.userData || {}
          }
          // 情况3: 其他结构
          else {
            // 尝试直接查找token
            const findTokenInObject = (obj) => {
              for (let key in obj) {
                if (key.toLowerCase().includes('token') && obj[key]) {
                  return obj[key]
                }
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                  const found = findTokenInObject(obj[key])
                  if (found) return found
                }
              }
              return null
            }
            
            token = findTokenInObject(response.data)
            userData = {}
          }
        } 
        // 情况4: response本身就是数据对象
        else if (response && response.token) {
          token = response.token
          userData = response.user || response.userData || {}
        } 
        else {
          throw new Error('无效的API响应格式')
        }
        
        if (!token) {
          throw new Error('响应中未找到token信息')
        }
        
        // 保存token和用户信息
        setToken(token)
        setUser(userData)
        
        ElMessage.success('登录成功')
        console.log('登录成功，准备跳转到/chat') // 添加跳转前日志
        
        // 确保跳转到Chat页面
        this.$router.push('/chat').catch(err => {
          console.log('路由跳转异常:', err)
          // 如果路由跳转失败，尝试直接修改URL
          window.location.href = '/chat'
        })
        
      } catch (error) {
        console.error('登录失败:', error)
        
        let errorMessage = '登录失败，请稍后重试'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        ElMessage.error(errorMessage)
        this.refreshCaptcha()
        
      } finally {
        this.loading = false
      }
    },
    
    refreshCaptcha() {
      this.captchaUrl = `/api/login/captcha?t=${Date.now()}`
    },
    
    goToRegister() {
      this.$router.push('/register')
    }
  },
  mounted() {
    this.refreshCaptcha()
    
    // 检查是否有已保存的用户名
    const savedUsername = localStorage.getItem('rememberedUsername')
    if (savedUsername) {
      this.form.username = savedUsername
      this.form.remember = true
    }
  },
  watch: {
    'form.remember'(newVal) {
      if (newVal) {
        localStorage.setItem('rememberedUsername', this.form.username)
      } else {
        localStorage.removeItem('rememberedUsername')
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.form-container {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

/* 修复Element Plus组件样式 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__inner) {
  height: 44px;
}

:deep(.el-button) {
  height: 44px;
  font-size: 16px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}
</style>