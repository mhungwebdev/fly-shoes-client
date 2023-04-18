<template>
  <div class="w-100pc h-full dis-flex jus-center">
    <RouterView></RouterView>
  </div>
  <DxToast v-bind="managementStore.toastConfig"></DxToast>
  <loading
    v-model:active="managementStore.isLoadingOverlay"
    :can-cancel="true"
    :on-cancel="() => managementStore.isLoadingOverlay = false"
    :is-full-page="true"
    loader="dots"
    color="rgb(100, 154, 255)"
    :height="120"
    :width="120"
  />
</template>
<script lang="ts" setup>
import { DxToast } from "devextreme-vue/toast";
import { onMounted } from "vue";
import Loading from "vue-loading-overlay";
import { RouterView } from "vue-router";
import { useManagementStore } from "./stores";

const managementStore = useManagementStore();

onMounted(async () => {
  await managementStore.initWebsite();
});
</script>

<style scoped></style>
