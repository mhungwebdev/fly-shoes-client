import type { CartDetail, User } from '@/models';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Notification } from "@/models";
import CartDetailService from '@/apis/cart-detail-service';
import useManagementStore from './app-management';

const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const notifications: Array<Notification> = [];
  const cartDetails = ref<CartDetail[]>([]);
  const cartDetailSV = new CartDetailService();
  const managementStore = useManagementStore();

  const getCartDetail = async () => {
    if (currentUser.value && !currentUser.value.IsAdmin) {
      try {
        const res = await cartDetailSV.getCartDetailByUser(currentUser.value?.UserID);
        cartDetails.value = res.Data;
      } catch (error) {
        cartDetails.value = []
      }
    }
  }

  const deleteCartDetail = async (id: number) => {
    try {
      const res = await cartDetailSV.deleteByID(id);
      if (res && res.Success) {
        managementStore.showSuccess("Xóa thành công");
        getCartDetail();
      } else {
        managementStore.showError();
      }
    } catch (error) {
      managementStore.showError();
    }
  }

  return { currentUser, notifications, getCartDetail, cartDetails,deleteCartDetail }
});

export default useUserStore;