import { createApp } from 'vue'

// 创建一个最简单的Vue组件
const App = {
  template: `
    <div>
      <h1>Vue应用测试</h1>
      <p>如果看到这段文字，说明Vue应用已成功运行</p>
    </div>
  `
}

// 创建并挂载应用
createApp(App).mount('#app')