<template>
  <div class="register-container">
    <div class="form-container">
      <h2 style="text-align: center; margin-bottom: 24px;">注册新账户</h2>
      
      <el-form :model="form" :rules="rules" ref="registerForm">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱"
            prefix-icon="Message"
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
        
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请确认密码"
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
          <el-checkbox v-model="form.agreeTerms">我已阅读并同意</el-checkbox>
          <el-link type="primary" :underline="false">服务条款</el-link>
          和
          <el-link type="primary" :underline="false">隐私政策</el-link>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            style="width: 100%" 
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <div style="text-align: center; margin-top: 20px;">
        <span>已有账号？</span>
        <el-link type="primary" :underline="false" @click="$router.push('/login')">
          立即登录
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api'

export default {
  name: 'Register',
  data() {
    // 确认密码验证规则
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        captcha: '',
        agreeTerms: false
      },
      loading: false,
      captchaUrl: '/api/login/captcha',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleRegister() {
      // 表单验证
      try {
        await this.$refs.registerForm.validate()
      } catch (error) {
        console.log('表单验证失败:', error)
        return
      }
      
      // 检查是否同意条款
      if (!this.form.agreeTerms) {
        ElMessage.warning('请同意服务条款和隐私政策')
        return
      }
      
      this.loading = true
      
      try {
        // 调用后端注册 API
        const response = await authAPI.register({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          captcha: this.form.captcha
        })
        
        // 显示成功消息
        ElMessage.success('注册成功！请登录')
        
        // 跳转到登录页面
        this.$router.push('/login')
        
      } catch (error) {
        console.error('注册失败:', error)
        
        // 显示错误消息
        let errorMessage = '注册失败，请稍后重试'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        ElMessage.error(errorMessage)
        
        // 刷新验证码
        this.refreshCaptcha()
        
      } finally {
        this.loading = false
      }
    },
    
    refreshCaptcha() {
      this.captchaUrl = `/api/register/captcha?t=${Date.now()}`
      // 注意：如果后端注册和登录使用不同的验证码接口，需要调整URL
    }
  },
  mounted() {
    this.refreshCaptcha()
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>