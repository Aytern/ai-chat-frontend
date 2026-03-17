<template>
  <div class="admin-models">
    <h2>模型管理</h2>
    <p class="description">在此页面启用或禁用 AI 模型。用户只能使用已启用的模型进行对话。</p>

    <el-table :data="modelList" v-loading="loading" border>
      <el-table-column prop="model_id" label="模型 ID" min-width="180" />
      <el-table-column prop="name" label="模型名称" min-width="160" />
      <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
            {{ scope.row.enabled ? '已启用' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button
            size="small"
            :type="scope.row.enabled ? 'danger' : 'primary'"
            :loading="scope.row._loading"
            @click="toggleModel(scope.row)"
          >
            {{ scope.row.enabled ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { adminAPI } from '@/api/admin'
import { ElMessage } from 'element-plus'

export default {
  name: 'AdminModels',
  data() {
    return {
      modelList: [],
      loading: false
    }
  },
  async mounted() {
    await this.loadModels()
  },
  methods: {
    async loadModels() {
      this.loading = true
      try {
        const response = await adminAPI.getModels()
        this.modelList = (response.data || response || []).map(m => ({ ...m, _loading: false }))
      } catch (error) {
        console.error('加载模型列表失败:', error)
        ElMessage.error('加载模型列表失败')
      } finally {
        this.loading = false
      }
    },

    async toggleModel(model) {
      model._loading = true
      try {
        const response = await adminAPI.updateModel(model.model_id, { enabled: !model.enabled })
        if (response.success !== false) {
          model.enabled = response.data?.enabled !== undefined ? response.data.enabled : !model.enabled
          ElMessage.success(`模型已${model.enabled ? '启用' : '禁用'}`)
        } else {
          ElMessage.error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('更新模型状态失败:', error)
        ElMessage.error('操作失败，请稍后重试')
      } finally {
        model._loading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-models {
  padding: 20px;
}

.description {
  color: #606266;
  margin-bottom: 20px;
}
</style>
