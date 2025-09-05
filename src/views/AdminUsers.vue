<template>
  <div class="admin-users">
    <h2>用户管理</h2>
    
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名或邮箱"
        style="width: 300px; margin-right: 10px;"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>
    
    <!-- 用户表格 -->
    <el-table :data="userList" v-loading="loading">
      <el-table-column prop="user_id" label="用户ID" width="100" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="created_at" label="注册时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="viewUser(scope.row)">查看</el-button>
          <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { adminAPI } from '@/api' // 需要创建adminAPI
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminUsers',
  data() {
    return {
      userList: [],
      loading: false,
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  async mounted() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      this.loading = true
      try {
        const response = await adminAPI.getUsers({
          page: this.currentPage,
          size: this.pageSize,
          keyword: this.searchKeyword
        })
        this.userList = response.data.list
        this.total = response.data.total
      } catch (error) {
        console.error('加载用户列表失败:', error)
        ElMessage.error('加载用户列表失败')
      } finally {
        this.loading = false
      }
    },
    
    handleSearch() {
      this.currentPage = 1
      this.loadUsers()
    },
    
    resetSearch() {
      this.searchKeyword = ''
      this.currentPage = 1
      this.loadUsers()
    },
    
    viewUser(user) {
      // 查看用户详情
      this.$router.push(`/admin/user/${user.user_id}`)
    },
    
    async deleteUser(user) {
      try {
        await ElMessageBox.confirm(`确定要删除用户 "${user.username}" 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await adminAPI.deleteUser(user.user_id)
        ElMessage.success('删除成功')
        await this.loadUsers() // 重新加载数据
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error)
          ElMessage.error('删除用户失败')
        }
      }
    },
    
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1
      this.loadUsers()
    },
    
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.loadUsers()
    }
  }
}
</script>

<style scoped>
.admin-users {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>