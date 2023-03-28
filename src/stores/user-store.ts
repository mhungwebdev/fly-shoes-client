import { User } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>(new User());

  return { currentUser }
});

export default useUserStore;