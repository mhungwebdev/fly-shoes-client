<template>
  <div class="container pos-relative">
    <div class="form br-4 dis-flex overflow-hidden pos-relative">
      <Login ref="loginRef" />
      <Register ref="registerRef" :first-focus="isFirstFocusInput" />

      <FSGallery
        :class="positionPoster == Position.Left ? 'left' : 'right'"
        class="poster pos-absolute h-100pc w-50pc"
        :config="{
          dataSource: galleryPoster,
          loop:true,
          showNavButtons:true,
          showIndicator:true,
          slideshowDelay:3000,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Register from "./child/Register.vue";
import Login from "./child/Login.vue";
import { useRouter } from "vue-router";
import { onUpdated, ref, onMounted, computed } from "vue";
import {FSGallery} from "@/components/controls";
import Post1 from "@/common/images/image-description-01.jpg";
import Post2 from "@/common/images/image-description-02.jpg";
import Post3 from "@/common/images/image-description-03.jpg";
import Post4 from "@/common/images/image-description-04.jpg";
import Post5 from "@/common/images/image-description-5.png";
import Post6 from "@/common/images/image-description-6.jpg";

enum Position {
  Left = 1,
  Right = 2,
}

const $router = useRouter();
const pathLogin = "/login";

const positionPoster = ref<Position>();
const loginRef = ref<InstanceType<typeof Login>>();
const registerRef = ref<InstanceType<typeof Register>>();
const galleryPoster = ref([Post1,Post2,Post3,Post4,Post5,Post6]);

const isFirstFocusInput = computed<boolean>(() => {
  if ($router.currentRoute.value.path == pathLogin) return false;

  return true;
});

const getPositionPoster = () => {
  if ($router.currentRoute.value.path == pathLogin)
    positionPoster.value = Position.Right;
  else positionPoster.value = Position.Left;
};
onMounted(() => {
  getPositionPoster();
});

onUpdated(() => {
  getPositionPoster();

  if ($router.currentRoute.value.path == pathLogin)
    loginRef.value?.focusFirstInput();
  else registerRef.value?.focusFirstInput();
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/common/images/image-bg-authen.webp");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 0px;
  box-sizing: border-box;

  .form {
    background-color: white;
    height: 400px;
    filter: drop-shadow(4px 3px 20px var(--app-color-primary));
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
