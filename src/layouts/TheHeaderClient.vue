<template>
  <div
    class="the-header-client dis-flex align-center jus-space-between width-100pc"
  >
    <div
      class="font-32 font-weight-900 cursor-pointer"
      @click="$router.push('/')"
    >
      Fly Shoes
    </div>
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
          <div class="pos-absolute back-red notify-circle font-10">
            {{ userStore.notifications.length }}
          </div>
          <div v-if="userStore.notifications.length > 0" class="notification-container pos-absolute">
            <div class="overflow-auto p-16" :style="{maxHeight:'300px'}">
              <div
                v-for="(notification, index) in sortByField('SortOrder',userStore.notifications)"
                :key="index"
                class="notification-item dis-flex align-center pl-10 pr-10 pt-10 pb-10"
              >
                <div class="icon-bell icon-logo mr-12"></div>
                <div>{{ notification.Message }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pos-relative cart-button">
          <div class="icon-cart cursor-pointer mr-20 ml-20"></div>
          <div class="pos-absolute back-red cart-circle font-10">
            {{ userStore.cartDetails.length }}
          </div>
          <div
            v-if="userStore.cartDetails.length > 0"
            class="cart-container pos-absolute"
          >
            <div class="overflow-auto p-10" :style="{maxHeight:'300px'}">
              <div
                v-for="(cartDetail, index) in userStore.cartDetails"
                :key="index"
                class="cart-item dis-flex align-center p-6"
                @click="$router.push(`/shoes/${cartDetail.ShoesID}`)"
              >
                <div
                  :style="{
                    backgroundImage: `url(${
                      cartDetail.ShoesImages.split(';')[0]
                    })`,
                  }"
                ></div>
                <div>
                  <div
                    :title="cartDetail.ShoesName"
                    class="shoes-name font-weight-600"
                  >
                    {{ cartDetail.ShoesName }}
                  </div>
                  <div class="font-12 text-red">
                    {{
                      cartDetail.Price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                    }}
                  </div>
                  <div class="dis-flex align-center jus-space-between">
                    <div class="font-12 op-5 mt-4" v-if="cartDetail.Total > 0">
                      SL còn : {{ cartDetail.Total }}
                    </div>
                    <div v-if="cartDetail.Total == 0">Đã hết hàng</div>
  
                    <div
                      class="pos-absolute voucher font-10"
                      v-if="cartDetail.Voucher"
                    >
                      <div
                        v-if="
                          cartDetail.Voucher.FormulaType == FormulaType.Percent
                        "
                      >
                        -{{ cartDetail.Voucher.VoucherValue }}%
                      </div>
                      <div
                        v-if="
                          cartDetail.Voucher.FormulaType ==
                          FormulaType.Subtraction
                        "
                      >
                        - {{ kFormatter(cartDetail.Voucher.VoucherValue) }}
                      </div>
                    </div>
  
                    <div
                      @click="(e) => deleteCartDetail(e, cartDetail.CartDetailID)"
                      class="icon-trash"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cart-group-button">
              <FSButton
                :config="{
                  text: 'Thanh toán',
                  type: 'default',
                  stylingMode: 'contained',
                  width: '100%',
                  onClick: () => $router.push('/payment'),
                }"
              ></FSButton>
            </div>
          </div>
        </div>
        <div class="user-avatar pos-relative cursor-pointer">
          {{ avatarText }}
          <div class="menu-user pos-absolute">
            <div @click="$router.push('/profile')" class="menu-item">
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
import { FormulaType } from "@/enums";
import { useUserStore } from "@/stores";
import { getAuth } from "@firebase/auth";
import { computed } from "vue";
import { kFormatter } from "@/common/functions/number-function";
import { FSButton } from "@/components/controls";
import {sortByField} from "@/common/functions/array-function"
const userStore = useUserStore();

const avatarText = computed(() => {
  if (userStore.currentUser)
    return getAvatarText(userStore.currentUser.FullName);
});

const deleteCartDetail = (e: MouseEvent, id: number) => {
  e.stopPropagation();
  userStore.deleteCartDetail(id);
};

const signOutApp = () => {
  const auth = getAuth();
  userStore.currentUser = null;
  userStore.notifications = [];
  userStore.cartDetails = [];
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
    transition: all 0.3s linear;

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
      &:hover {
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
        transform-origin: top right;
        animation: showMenu 0.2s ease-in-out;
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

  .cart-container {
    .cart-group-button {
      background-color: white;
      padding: 8px;
      padding-bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    width: 300px;
    right: 20px;
    background: white;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.24) 2px 0px 20px;
    display: none;
    top: 28px;
    transform-origin: top right;
    padding-bottom: 10px;

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

    .shoes-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 212px;
    }

    .cart-item:hover {
      background-color: #9ed5ff;
      border-radius: 4px;
      cursor: pointer;
    }

    .cart-item > div:first-child {
      width: 40px;
      height: 40px;
      background-position: center;
      background-size: cover;
      margin-right: 12px;
      min-width: 40px;
    }

    .cart-item {
      .voucher {
        background-color: red;
        color: white;
        padding: 2px;
        top: 16px;
        left: 8px;
      }
    }
  }

  @keyframes showMenu {
    from {
      transform: scale(0);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .bell-container:hover .notification-container {
    display: block;
    transition: all 0.3s ease-in-out;
    transform-origin: top right;
    animation: showMenu 0.2s ease-in-out;
  }

  .cart-button:hover {
    .cart-container {
      display: block;
      animation: showMenu 0.2s ease-in-out;
    }
  }
}
</style>
