import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component:() => import('@/views/HomeView.vue'),
      meta:{
        requiresAuth: true,
      }
    },
    {
      path:'/register',
      component:() => import('@/views/auth/Authentication.vue'),
    },
    {
      path:'/login',
      component:() => import('@/views/auth/Authentication.vue'),
    }
  ]
})

export default router
