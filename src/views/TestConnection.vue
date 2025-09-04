<template>
  <div class="test-connection">
    <h2>API 连接测试</h2>
    
    <div class="test-buttons">
      <button @click="testBackendConnection" class="test-btn">
        测试后端连接
      </button>
      
      <button @click="testLoginAPI" class="test-btn">
        测试登录API
      </button>
      
      <button @click="testChatAPI" class="test-btn">
        测试聊天API
      </button>
    </div>
    
    <div v-if="testResult" class="test-result">
      <h3>测试结果:</h3>
      <pre>{{ testResult }}</pre>
    </div>
    
    <div v-if="error" class="error-message">
      <h3>错误信息:</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script>
import { authAPI, chatAPI } from '@/api'

export default {
  name: 'TestConnection',
  data() {
    return {
      testResult: null,
      error: null
    }
  },
  methods: {
    async testBackendConnection() {
      try {
        this.testResult = null
        this.error = null
        
        // 简单的连接测试
        const response = await fetch('http://localhost:5000/')
        const data = await response.text()
        
        this.testResult = {
          status: response.status,
          statusText: response.statusText,
          data: data
        }
      } catch (error) {
        this.error = error.message
      }
    },
    
    async testLoginAPI() {
      try {
        this.testResult = null
        this.error = null
        
        // 测试登录API
        const response = await authAPI.login({
          username: 'testuser',
          password: 'testpass',
          captcha: 'test123'
        })
        
        this.testResult = response
      } catch (error) {
        this.error = error.response?.data || error.message
      }
    },
    
    async testChatAPI() {
      try {
        this.testResult = null
        this.error = null
        
        // 测试聊天API
        const response = await chatAPI.getResponse({
          text: '你好，测试消息'
        })
        
        this.testResult = response
      } catch (error) {
        this.error = error.response?.data || error.message
      }
    }
  }
}
</script>

<style scoped>
.test-connection {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.test-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.test-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.test-btn:hover {
  background-color: #2980b9;
}

.test-result, .error-message {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #2ecc71;
  margin-top: 1rem;
}

.error-message {
  border-left-color: #e74c3c;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>