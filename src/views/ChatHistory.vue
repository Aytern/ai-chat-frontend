<template>
  <div class="chat-history">
    <h2>对话历史</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div class="history-list">
        <div class="history-item" v-for="item in historyItems" :key="item.id">
          <div class="question">{{ truncateText(item.question, 100) }}</div>
          <div class="answer">{{ truncateText(item.answer, 100) }}</div>
          <div class="timestamp">{{ formatDate(item.created_at) }}</div>
          <div class="actions">
            <button class="btn-view" @click="viewChat(item)">查看对话</button>
            <button class="btn-delete" @click="deleteChat(item.id)">删除</button>
          </div>
        </div>
      </div>
      <div v-if="historyItems.length === 0" class="empty-state">
        <p>暂无对话历史</p>
      </div>
      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadChatHistory"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { chatAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ChatHistory',
  data() {
    return {
      historyItems: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  async mounted() {
    await this.loadChatHistory()
  },
  methods: {
    async loadChatHistory() {
      this.loading = true
      try {
        const response = await chatAPI.getHistory({
          page: this.currentPage,
          size: this.pageSize
        })
        if (response.success) {
          this.historyItems = response.data.list || response.data
          this.total = response.data.total || response.data.length
        } else {
          ElMessage.error(response.message || '加载历史记录失败')
        }
      } catch (error) {
        console.error('加载历史记录失败:', error)
        ElMessage.error('加载历史记录失败')
      } finally {
        this.loading = false
      }
    },
    async deleteChat(id) {
      // 保持不变...
    },
    viewChat(item) {
      // 跳转到聊天页面并传递历史记录ID
      this.$router.push({ 
        path: '/chat', 
        query: { historyId: item.id } 
      })
    },
    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN')
    },
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
  }
}
</script>

<style scoped>
/* 添加一些样式改进 */
.history-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: white;
  transition: box-shadow 0.3s;
}

.history-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.question {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.answer {
  color: #666;
  margin-bottom: 10px;
}

.timestamp {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-view {
  background: #007aff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-view:hover {
  background: #0062cc;
}

.btn-delete {
  background: #ff3b30;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-delete:hover {
  background: #d70015;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>