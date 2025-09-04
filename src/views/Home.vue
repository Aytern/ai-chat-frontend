<template>
  <div class="home">
    <h2>欢迎使用AI智能问答系统</h2>
    <p>请选择您要进行的操作：</p>
    <div class="action-buttons">
      <router-link to="/chat" class="btn btn-primary">开始聊天</router-link>
      <router-link to="/login" class="btn btn-secondary">登录账户</router-link>
      <router-link to="/register" class="btn btn-outline">注册新账户</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #2ecc71;
  color: white;
}

.btn-secondary:hover {
  background-color: #27ae60;
}

.btn-outline {
  border: 2px solid #3498db;
  color: #3498db;
  background: transparent;
}

.btn-outline:hover {
  background-color: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
}
</style>