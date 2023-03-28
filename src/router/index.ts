import { useUserStore } from '@/stores';
import { createRouter, createWebHistory, useRouter } from 'vue-router';
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
    },{
      path:'/admin',
      component:() => import('@/views/forbidden/Forbidden.vue'),
    }
  ]
})

router.beforeEach((to,from) => {
  const userStore = useUserStore();

  if(userStore.currentUser && userStore.currentUser.IsAdmin && !to.path.includes("admin")){
    return {path:'/admin'}
  }
})

export default router
