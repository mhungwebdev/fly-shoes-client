<template>
  <div class="container pos-relative">
    <div class="pos-absolute auth-header w-100pc flex-center">
      <div :style="{width:'1200px'}">
        <TheHeaderClientVue />
      </div>
    </div>

    <div class="form br-4 dis-flex overflow-hidden pos-relative">
      <Login v-if="$router.currentRoute.value.path == '/login'" ref="loginRef" />
      <Register :first-focus="true" v-if="$router.currentRoute.value.path == '/register'" ref="registerRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Login from "./child/Login.vue";
import Register from "./child/Register.vue";
import TheHeaderClientVue from "@/layouts/TheHeaderClient.vue";

const $router = useRouter();

const loginRef = ref<InstanceType<typeof Login>>();
const registerRef = ref<InstanceType<typeof Register>>();
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 0px;
  box-sizing: border-box;

  .auth-header {
    top: 40px;
    left: 0px;
  }

  .form {
    background-color: white;
    height: 480px;
    // box-shadow: 0px 8px 10px var(--app-color-primary);
    .poster {
      transition: all .5s ease-in-out;
    }

    .poster.left {
      transform: translate(0%, 0px);
    }

    .poster.right {
      transform: translate(100%, 0px);
    }
  }
}
</style>
