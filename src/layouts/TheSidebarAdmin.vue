<template>
  <div class="sidebar-admin-container pos-relative">
    <div class="header">
      <div
        class="avatar text-white dis-flex align-center jus-center font-24 font-weight-700"
      >
        {{ avatarName }}
      </div>
    </div>

    <RouterLink
      class="mb-4"
      :to="subsystem.Path"
      v-for="(subsystem, index) in subsystems"
      :key="index"
    >
      <div class="sidebar-item br-4 ml-20 mr-20 dis-flex align-center mb-16">
        <div class="icon mr-16 ml-12" :class="subsystem.IconClass"></div>
        <div class="text-white">{{ subsystem.Text }}</div>
      </div>
    </RouterLink>

    <div @click="doSignOut" class="button-sign-out ml-20 mr-20 br-4">
        <div class="icon icon-sign-out mr-16 ml-12"></div>
        <div>Đăng xuất</div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores";
import { getAuth, signOut } from "@firebase/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";

interface Subsystem {
  IconClass: string;
  Text: string;
  Path: string;
}

const $router = useRouter();

const userStore = useUserStore();

const doSignOut = async () => {
  const auth = getAuth();
  await signOut(auth);
  userStore.currentUser = null;
  $router.push("/login")
}

const avatarName = computed(() => {
  return userStore.currentUser?.FullName.slice(0, 2).toLocaleUpperCase();
});

const subsystems: Subsystem[] = [
  {
    IconClass: "icon-overview",
    Text: "Tổng quan",
    Path: "/admin/overview",
  },
  {
    IconClass: "icon-shoes",
    Text: "Giày",
    Path: "/admin/shoes",
  },
  {
    IconClass: "icon-order",
    Text: "Đơn hàng",
    Path: "/admin/orders",
  },
  {
    IconClass: "icon-user",
    Text: "Người dùng",
    Path: "/admin/users",
  },
  {
    IconClass: "icon-voucher",
    Text: "Voucher",
    Path: "/admin/vouchers",
  },
  {
    IconClass: "icon-setting",
    Text: "Thiết lập",
    Path: "/admin/settings",
  },
];
</script>

<style lang="scss" scoped>
.sidebar-admin-container {
  .button-sign-out {
    height: 40px;
    background-color: white;
    color: #333;
    display: flex;
    align-items: center;
    position: absolute;
    width: calc(100% - 40px);
    bottom: 20px;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    margin-bottom: 12px;
    color: unset;
  }

  .router-link-active .sidebar-item {
    background-color: var(--app-color-primary);
  }
  width: 240px;
  min-width: 240px;
  background-color: rgb(43, 43, 43);

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    min-width: 40px;
    background-color: var(--app-color-primary);
  }

  .header {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
}

.sidebar-item {
  min-height: 40px;

  &:hover {
    background-color: var(--app-color-primary);
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
