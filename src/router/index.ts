import { useManagementStore, useUserStore } from '@/stores';
import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';
import UserService from '@/apis/user-service';
import { PaymentType } from '@/enums';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '/',
          component: () => import('@/views/home/HomeView.vue')
        },
        {
          path: '/shoes',
          component: () => import('@/views/product/Product.vue')
        },
        {
          path: '/shoes/:id',
          component: () => import('@/views/product/ProductDetail.vue')
        },
        {
          path: '/about',
          component: () => import('@/views/about/About.vue')
        },
        {
          path: '/profile',
          component: () => import('@/views/profile/Profile.vue')
        },
        {
          path:'/payment',
          name:PaymentType.Full,
          component: () => import('@/views/payment/Payment.vue')
        },
        {
          path:'/payment/:id',
          name:PaymentType.One,
          component: () => import('@/views/payment/Payment.vue')
        },
      ],
      meta: {
        ForAdmin: false
      },
      component: () => import('@/views/ClientView.vue'),
    },
    {
      path: '/register',
      component: () => import('@/views/auth/Authentication.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/auth/Authentication.vue'),
    }, {
      path: '/admin',
      redirect: '/admin/overview',
      component: () => import('@/views/AdminView.vue'),
      children: [
        {
          path: '/admin/overview',
          component: () => import('@/views/overview/Overview.vue'),
        },
        {
          path: '/admin/shoes',
          component: () => import('@/views/shoes/Shoes.vue'),
        },
        {
          path: '/admin/orders',
          component: () => import('@/views/order/Order.vue'),
        },
        {
          path: '/admin/users',
          component: () => import('@/views/user/User.vue'),
        },
        {
          path: '/admin/vouchers',
          component: () => import('@/views/voucher/Voucher.vue'),
        }, {
          path: '/admin/settings',
          component: () => import('@/views/setting/Setting.vue'),
        },
        {
          path: '/admin/shoes/form',
          component: () => import('@/views/shoes/ShoesForm.vue')
        },
        {
          path: '/admin/shoes/form/:id',
          component: () => import('@/views/shoes/ShoesForm.vue')
        },
        {
          path: '/admin/vouchers/form',
          component: () => import('@/views/voucher/VoucherForm.vue')
        }
      ],
      meta: {
        ForAdmin: true
      }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const userService = new UserService();
  const management = useManagementStore();
  management.isLoadingOverlay = true;
  const uid = await (await getCurrentUser())?.uid;
  const userStore = useUserStore();

  if (uid != null && uid != '' && userStore.currentUser == null) {
    const user = await userService.getByField("FirebaseID", uid);
    if (user && user.Data && user.Data[0]) {
      userStore.currentUser = user.Data[0];
      userStore.getCartDetail();
      if (to.path == "/login" || to.path == "/register") {
        return { path: "/" }
      }
    }
  }


  if (to.meta.ForAdmin && !userStore.currentUser?.IsAdmin) {
    return { path: "/" }
  }

  if (!to.meta.ForAdmin && userStore.currentUser?.IsAdmin) {
    return { path: "/admin/overview" }
  }
})

router.afterEach(async () => {
  const management = useManagementStore();
  management.isLoadingOverlay = false;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})


export default router
