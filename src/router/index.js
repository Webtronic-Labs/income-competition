import { createRouter, createWebHistory } from 'vue-router'
import useUserStore from '@/stores/user'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home', params: {} }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const userStore = useUserStore()

  if (userStore.isLoggedIn) {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default router
