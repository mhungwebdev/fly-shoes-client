import type { User } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);

  return { currentUser }
});

export default useUserStore;