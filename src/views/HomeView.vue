<template>
  <div>
    Hello {{ userStore.currentUser?.FullName }}
    <FSButton :config="{onClick:signOut,text:'Logout'}"></FSButton>
  </div>
</template>

<script setup lang="ts">
import { BrandService } from '@/apis';
import FSButton from '@/components/controls/FSButton.vue';
import { useUserStore } from '@/stores';
import { getAuth } from '@firebase/auth';
const userStore = useUserStore();

const brandService = new BrandService();
brandService.deleteByID(1);

const signOut = () => {
  const auth = getAuth();
  userStore.currentUser = null;
  auth.signOut();
}
</script>

<style scoped>

</style>