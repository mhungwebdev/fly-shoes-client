<template>
  <div
    class="the-header-client dis-flex align-center jus-space-between width-100pc"
  >
    <div class="font-32 font-weight-900 cursor-pointer">Fly Shoes</div>
    <div class="dis-flex align-center">
      <div
        @click="$router.push('/')"
        :class="$route.path == '/' ? 'active' : ''"
        class="cursor-pointer header-navigation mr-20"
      >
        Trang chủ
      </div>
      <div
        @click="$router.push('/shoes')"
        :class="$route.path == '/shoes' ? 'active' : ''"
        class="cursor-pointer header-navigation"
      >
        Sản phẩm
      </div>
      <div
        @click="$router.push('/about')"
        :class="$route.path == '/about' ? 'active' : ''"
        class="mr-20 ml-20 cursor-pointer header-navigation"
      >
        Giới thiệu
      </div>
      <div v-if="!userStore.currentUser" class="dis-flex">
        <div
          @click="$router.push('/login')"
          class="cursor-pointer header-navigation"
        >
          Đăng nhập
        </div>
        <div class="mr-8 ml-8">/</div>
        <div
          @click="$router.push('/register')"
          class="cursor-pointer header-navigation"
        >
          Đăng ký
        </div>
      </div>

      <div v-if="userStore.currentUser" class="dis-flex align-center">
        <div class="pos-relative bell-container ml-32">
          <div class="icon-bell cursor-pointer"></div>
          <div class="pos-absolute back-red notify-circle">
            {{ userStore.notifications.length }}
          </div>
          <div class="notification-container pos-absolute">
            <div
              v-for="(notification, index) in userStore.notifications"
              :key="index"
              class="notification-item dis-flex align-center pl-10 pr-10 pt-10 pb-10"
            >
              <div class="icon-bell icon-logo mr-12"></div>
              <div>{{ notification.Message }}</div>
            </div>
          </div>
        </div>

        <div class="pos-relative">
          <div class="icon-cart cursor-pointer mr-20 ml-20"></div>
          <div class="pos-absolute back-red cart-circle">1</div>
        </div>
        <div class="user-avatar pos-relative cursor-pointer">
          {{ avatarText }}
          <div class="menu-user pos-absolute">
            <div class="menu-item">
              <div class="icon-user-black mr-16"></div>
              <div>Thông tin cá nhân</div>
            </div>

            <div @click="signOutApp" class="menu-item">
              <div class="icon-sign-out mr-16"></div>
              <div>Đăng xuất</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAvatarText } from "@/common/functions/string-function";
import { useUserStore } from "@/stores";
import { getAuth } from "@firebase/auth";
import { computed } from "vue";

const userStore = useUserStore();

const avatarText = computed(() => {
  if (userStore.currentUser)
    return getAvatarText(userStore.currentUser.FullName);
});

const signOutApp = () => {
  const auth = getAuth();
  userStore.currentUser = null;
  auth.signOut();
};
</script>

<style lang="scss" scoped>
.the-header-client {
  .header-navigation {
    color: black;
    font-weight: 700;
    opacity: 0.5;
    &:hover {
      opacity: 1;
      font-weight: 700;
    }
  }

  .header-navigation.active {
    opacity: 1;
    font-weight: 700;
    border-bottom: 1px solid black;
  }

  .notify-circle,
  .cart-circle {
    width: 16px;
    height: 16px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    top: -4px;
    right: -6px;
  }

  @keyframes ringBell {
    0% {
      transform: rotate(15deg);
    }

    25% {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(-15deg);
    }

    75% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(15deg);
    }
  }

  .icon-bell:hover,
  .icon-cart:hover {
    animation: ringBell 1s ease-in-out infinite;
  }

  .cart-circle {
    right: 10px;
  }

  .menu-user {
    background-color: white;
    padding: 10px;
    color: black;
    top: calc(100% + 4px);
    right: 8px;
    box-shadow: rgba(0, 0, 0, 0.24) 2px 0px 20px;
    border-radius: 4px;
    white-space: nowrap;
    display: none;
    transform-origin: top right;
    transition: all .3s linear;

    &::before {
      content: "";
      border: 5px solid transparent;
      border-bottom-color: white;
      position: absolute;
      bottom: 100%;
      right: 4px;
    }

    &::after {
      content: "";
      position: absolute;
      width: 10%;
      height: 12px;
      background-color: transparent;
      bottom: 100%;
      right: 0;
    }

    .menu-item {
      height: 40px;
      display: flex;
      padding: 8px;
      align-items: center;
      &:hover{
        background-color: #9ed5ff;
        border-radius: 4px;
      }
    }
  }

  .user-avatar {
    height: 32px;
    width: 32px;
    background-color: black;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      .menu-user {
        display: block;
      }
    }
  }

  .notification-container {
    width: 300px;
    right: 0px;
    background: white;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.24) 2px 0px 20px;
    display: none;
    padding: 16px;
    top: 28px;

    &::before {
      content: "";
      border: 5px solid transparent;
      border-bottom-color: white;
      position: absolute;
      bottom: 100%;
      right: 4px;
    }

    &::after {
      content: "";
      position: absolute;
      width: 10%;
      height: 12px;
      background-color: transparent;
      bottom: 100%;
      right: 0;
    }

    .notification-item:hover {
      background-color: #9ed5ff;
      border-radius: 4px;
      color: white;
      .icon-bell {
        animation: ringBell 1s ease-in-out infinite;
      }
    }
  }

  .bell-container:hover .notification-container {
    display: block;
    transition: all 0.3s ease-in-out;
    transform-origin: top right;
  }
}
</style>
