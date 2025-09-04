<!-- ChatHistory.vue -->
<template>
  <div class="chat-history">
    <h2>对话历史</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div class="history-list">
        <div class="history-item" v-for="item in historyItems" :key="item.id">
          <div class="question">{{ item.question }}</div>
          <div class="answer">{{ item.answer }}</div>
          <div class="timestamp">{{ formatDate(item.created_at) }}</div>
          <div class="actions">
            <button class="btn-view" @click="viewChat(item)">查看</button>
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
      try {
        await ElMessageBox.confirm('确定要删除这条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const response = await chatAPI.deleteHistory(id)
        if (response.success) {
          ElMessage.success('删除成功')
          await this.loadChatHistory()
        } else {
          ElMessage.error(response.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除记录失败:', error)
          ElMessage.error('删除失败')
        }
      }
    },
    viewChat(item) {
      // 跳转到聊天页面并加载特定历史记录
      this.$router.push({ path: '/chat', query: { historyId: item.id } })
    },
    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN')
    }
  }
}
</script>