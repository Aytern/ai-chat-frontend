import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

// 路由组件（使用懒加载）
const TestConnection = () => import('@/views/TestConnection.vue')
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Chat = () => import('@/views/Chat.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const ChatHistory = () => import('@/views/ChatHistory.vue')
const NotFound = () => import('@/views/NotFound.vue')

// 路由配置
const routes = [
  {
    path: '/test-connection',
    name: 'TestConnection',
    component: TestConnection,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/me',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/history',
    name: 'ChatHistory',
    component: ChatHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuth = isAuthenticated()
  
  if (requiresAuth && !isAuth) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuth) {
    next({ path: '/chat' })  // 已登录用户访问登录页直接跳转到chat
  } else {
    next()
  }
})

// 导出路由实例
export default router