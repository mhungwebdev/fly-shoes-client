import type { User } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const token = ref<string | null>(null);

  return { currentUser,token }
});

export default useUserStore;