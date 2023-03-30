<template>
  <div class="w-100pc h-full dis-flex jus-center">
    <RouterView></RouterView>
  </div>
  <DxToast v-bind="managementStore.toastConfig"></DxToast>
</template>
<script lang="ts" setup>
import { DxToast } from 'devextreme-vue/toast';
import { RouterView } from 'vue-router';
import { useManagementStore } from './stores';

const managementStore = useManagementStore();

</script>

<style scoped>
</style>
