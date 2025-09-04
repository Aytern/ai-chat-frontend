import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'

// 页面组件导入（使用懒加载优化）
const Login = () => import("@/views/Login.vue")
const Register = () => import("@/views/Register.vue")
const Chat = () => import("@/views/Chat.vue")
const UserProfile = () => import("@/views/UserProfile.vue")
const ChatHistory = () => import("@/views/ChatHistory.vue")
const routes = [
  {
    path: '/',
    redirect: '/chat'
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
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 权限控制
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn()
  
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && loggedIn) {
    next('/chat')
  } else {
    next()
  }
})

export default router