<template>
  <div class="chat-history">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>对话历史</h2>
          <el-button 
            type="danger" 
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
      </template>
      
      <el-table 
        :data="historyList" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        
        <el-table-column prop="question" label="问题" min-width="200">
          <template #default="{ row }">
            <div class="question-preview">
              {{ row.question || '无问题内容' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="answer" label="回答预览" min-width="200">
          <template #default="{ row }">
            <div class="answer-preview">
              {{ row.answer ? row.answer.substring(0, 50) + '...' : '无回答内容' }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              size="small" 
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchHistory"
          @current-change="fetchHistory"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟数据 - 实际项目中应该从API获取
const historyList = ref([
  { id: 1, question: '你好，你是谁？', answer: '我是一个AI助手，很高兴为您服务。', timestamp: new Date('2024-01-15T10:30:00') },
  { id: 2, question: '你能做什么？', answer: '我可以回答各种问题，提供信息和建议，帮助您解决问题。', timestamp: new Date('2024-01-15T11:15:00') },
  { id: 3, question: '今天的天气怎么样？', answer: '抱歉，我无法获取实时天气信息。您可以查看天气预报应用或网站获取最新天气信息。', timestamp: new Date('2024-01-16T09:45:00') }
])

const loading = ref(false)
const selectedRows = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3) // 模拟总条数

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN')
}

const fetchHistory = async () => {
  // 这里应该调用API获取历史记录
  // 实际实现时会使用类似:
  // const response = await chatAPI.getHistory({
  //   page: currentPage.value,
  //   size: pageSize.value
  // })
  // historyList.value = response.data
  // total.value = response.total
  
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    ElMessage.error('获取历史记录失败')
    console.error('获取历史记录错误:', error)
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleView = (row) => {
  ElMessage.info(`查看对话 ${row.id}`)
  // 这里可以跳转到对话详情页面或显示对话框
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除对话 "${row.question.substring(0, 20)}..." 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里调用API删除单条记录
    // await chatAPI.deleteHistory(row.id)
    
    ElMessage.success('删除成功')
    fetchHistory() // 重新加载数据
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除错误:', error)
    }
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条对话记录吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里调用API批量删除记录
    // const ids = selectedRows.value.map(item => item.id)
    // await chatAPI.batchDeleteHistory(ids)
    
    ElMessage.success('批量删除成功')
    selectedRows.value = []
    fetchHistory() // 重新加载数据
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除错误:', error)
    }
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.chat-history {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-preview,
.answer-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>