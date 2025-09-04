<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI 智能助手</h2>
      <button @click="startNewChat" class="new-chat-btn">新对话</button>
      <button @click="clearChatHistory" class="clear-chat-btn" :disabled="messages.length === 0">清空记录</button>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role]">
        <div class="message-avatar">
          <img v-if="message.role === 'assistant'" src="@/assets/ai-avatar.png" alt="AI">
          <img v-else src="@/assets/user-avatar.png" alt="User">
        </div>
        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      
      <div v-if="isLoading" class="message assistant">
        <div class="message-avatar">
          <img src="@/assets/ai-avatar.png" alt="AI">
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input-container">
      <textarea
        v-model="inputMessage"
        @keydown.enter.prevent="sendMessage"
        placeholder="输入您的问题..."
        :disabled="isLoading"
        rows="1"
        @input="autoResizeTextarea"
        ref="textareaRef"
      ></textarea>
      <button 
        @click="sendMessage" 
        :disabled="!inputMessage.trim() || isLoading"
        class="send-btn"
      >
        <span v-if="!isLoading">发送</span>
        <div v-else class="loading-spinner"></div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { chatAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'Chat',
  setup() {
    const messages = ref([])
    const inputMessage = ref('')
    const isLoading = ref(false)
    const messagesContainer = ref(null)
    const textareaRef = ref(null)
    const hasLoadedHistory = ref(false) // ✅ 只加载一次标记
    //新增清空聊天记录
    const clearChatHistory = async () => {
      try {
        await ElMessageBox.confirm('确定要清空所有聊天记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const response = await chatAPI.clearHistory()
        if (response.success) {
          messages.value = []
          ElMessage.success('清空成功')
        } else {
          ElMessage.error(response.message || '清空失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('清空聊天记录失败:', error)
          ElMessage.error('清空失败')
        }
      }
    }
    // 发送消息
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return

      const userMessage = {
        role: 'user',
        content: inputMessage.value.trim(),
        timestamp: new Date()
      }

      messages.value.push(userMessage)
      const currentInput = inputMessage.value
      inputMessage.value = ''
      isLoading.value = true

      scrollToBottom()

      try {
        const response = await chatAPI.sendMessage({ text: currentInput })

        const aiMessage = {
          role: 'assistant',
          content: response.reply,
          timestamp: new Date()
        }

        messages.value.push(aiMessage)
      } catch (error) {
        console.error('发送消息失败:', error)
      } finally {
        isLoading.value = false
        scrollToBottom()
      }
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    // 自动调整文本区域高度
    const autoResizeTextarea = () => {
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.style.height = 'auto'
          textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
        }
      })
    }

    // 开始新对话
    const startNewChat = async () => {
      try {
        await chatAPI.clearHistory()
        messages.value = [] // 清空消息
      } catch (error) {
        console.error('清空历史失败:', error)
      }
    }

    // 格式化时间
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 只在首次挂载时加载历史
    onMounted(() => {
      if (!hasLoadedHistory.value) {
        loadChatHistory()
        hasLoadedHistory.value = true
      }
    })

    const loadChatHistory = async () => {
      try {
        const history = await chatAPI.getHistory()
        messages.value = history.data
        scrollToBottom()
      } catch (error) {
        console.error('加载历史记录失败:', error)
      }
    }

    return {
      messages,
      inputMessage,
      isLoading,
      messagesContainer,
      textareaRef,
      sendMessage,
      startNewChat,
      autoResizeTextarea,
      formatTime,
      clearChatHistory
    }
  }
}
</script>


<style scoped>
/* 添加完整的样式 */

/* 添加清空按钮样式 */
.header-actions {
  display: flex;
  gap: 10px;
}

.clear-chat-btn {
  background: #ff3b30;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-chat-btn:hover:not(:disabled) {
  background: #d70015;
}

.clear-chat-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-header {
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: #007aff;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
}

.chat-input-container {
  background: white;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.chat-input-container textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  max-height: 120px;
}

.chat-input-container textarea:focus {
  border-color: #007aff;
}

.send-btn {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #666;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.new-chat-btn {
  background: #34c759;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.new-chat-btn:hover {
  background: #30a14e;
}
</style>