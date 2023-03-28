<template>
  <div class="w-100pc h-full dis-flex jus-center">
    <RouterView></RouterView>
  </div>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { useUserStore } from './stores';

const userStore = useUserStore();
console.log(userStore);

</script>

<style scoped>
</style>
