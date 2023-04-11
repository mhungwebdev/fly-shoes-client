import type { User } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from "@/models";

const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const notifications:Array<Notification> = []; 

  return { currentUser,notifications }
});

export default useUserStore;