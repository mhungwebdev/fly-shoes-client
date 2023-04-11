import type { Brand, Category } from '@/models';
import type DxToast from 'devextreme-vue/toast';
import type { InitializedEventInfo } from 'devextreme/events';
import type dxToast from 'devextreme/ui/toast';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useManagementStore = defineStore('management', () => {
    //#region Toast
    const toastConfig = ref<DxToast>({
        position:{
          at:'top',
          my:'top',
          offset:{
            x:40
          }
        },
        message:"Hello",
        visible:false,
        width:'auto',
        displayTime:3000,
        animation:{
          hide:{
            type:'slideOut',
            direction:'top'
          },
          show:{
            type:'slideIn',
            direction:'top'
          }
        },
        type:'warning',
        onInitialized(e:InitializedEventInfo<dxToast>) {
            toastRef.value = e.component;
        },
      });
    const toastRef = ref<dxToast>();

    const showError = (message:string = "Có lỗi xảy ra !") => {
        toastConfig.value.type = 'error';
        toastConfig.value.message = message;
        toastRef.value?.show();
    }

    const showSuccess = (message: string = "Thành công !") => {
        toastConfig.value.type  = 'success';
        toastConfig.value.message = message;
        toastRef.value?.show();
    }

    const showWaring = (message: string = "Cảnh báo !") => {
        toastConfig.value.type = "warning";
        toastConfig.value.message = message;
        toastRef.value?.show();
    }
    //#endregion

    const urlBreak = "";

    const brands = ref<Brand[]>([]);
    const categories = ref<Category[]>([]);
    const priceMax = ref<number>(50000000);

    return {toastConfig,toastRef,showError,showSuccess,showWaring,urlBreak,brands,categories,priceMax}

});

export default useManagementStore;