<template>
  <div class="chat-page">
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
          <div class="message-content">{{ message.content }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
        
        <div v-if="loading" class="message bot-message">
          <div class="message-content">AI正在思考中...</div>
          <div class="message-time">{{ getCurrentTime() }}</div>
        </div>
      </div>
      
      <div class="chat-input-area">
        <el-input
          v-model="userInput"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="loading"
        >
          <template #append>
            <el-button 
              @click="sendMessage" 
              :loading="loading"
              :disabled="!userInput.trim()"
            >
              发送
            </el-button>
            <el-button @click="startNewTopic">新话题</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { chatAPI } from '@/api'

const messages = ref([])
const userInput = ref('')
const loading = ref(false)
const messagesContainer = ref(null)

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  const message = userInput.value.trim()
  if (!message || loading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    time: getCurrentTime()
  })
  
  userInput.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const response = await chatAPI.getResponse({ text: message })
    
    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: response.reply,
      time: getCurrentTime()
    })
  } catch (error) {
    ElMessage.error('发送消息失败')
    console.error('发送消息错误:', error)
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const startNewTopic = async () => {
  try {
    await chatAPI.updateChat({ new: true })
    messages.value = []
    ElMessage.success('新话题已开始')
  } catch (error) {
    ElMessage.error('开始新话题失败')
    console.error('新话题错误:', error)
  }
}

onMounted(() => {
  // 添加欢迎消息
  messages.value.push({
    role: 'assistant',
    content: '您好！我是AI助手，很高兴为您服务。有什么我可以帮助您的吗？',
    time: getCurrentTime()
  })
})
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

.user-message {
  background: #0078ff;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.bot-message {
  background: #f0f0f0;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message-content {
  margin-bottom: 4px;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  align-self: flex-end;
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #eaeaea;
  background: #f9f9f9;
}
</style>