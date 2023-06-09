import { BrandService, CategoryService } from '@/apis';
import ShoesService from '@/apis/shoes-service';
import { FilterOperator } from '@/enums';
import type { Brand, Category, FilterColumn } from '@/models';
import type DxToast from 'devextreme-vue/toast';
import type { InitializedEventInfo } from 'devextreme/events';
import type dxToast from 'devextreme/ui/toast';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const useManagementStore = defineStore('management', () => {
  //#region Toast
  const toastConfig = ref<DxToast>({
    position: {
      at: 'top',
      my: 'top',
      offset: {
        x: 40
      }
    },
    message: "Hello",
    visible: false,
    width: 'auto',
    displayTime: 3000,
    animation: {
      hide: {
        type: 'slideOut',
        direction: 'top'
      },
      show: {
        type: 'slideIn',
        direction: 'top'
      }
    },
    type: 'warning',
    onInitialized(e: InitializedEventInfo<dxToast>) {
      toastRef.value = e.component;
    },
  });
  const toastRef = ref<dxToast>();

  const showError = (message: string = "Có lỗi xảy ra !") => {
    toastConfig.value.type = 'error';
    toastConfig.value.message = message;
    toastRef.value?.show();
  }

  const showSuccess = (message: string = "Thành công !") => {
    toastConfig.value.type = 'success';
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
  const isLoadingOverlay = ref<boolean>(false);
  const categoryService = new CategoryService();
  const brandService = new BrandService();
  const shoesService = new ShoesService();

  const initWebsite = async () => {
    try {
      const resultCategory = await categoryService.getAll();
      if (resultCategory && resultCategory.Success && resultCategory.Data) {
        categories.value = resultCategory.Data;
      }
  
      const resultBrand = await brandService.getAll();
      if (resultBrand && resultBrand.Success && resultBrand.Data) {
        brands.value = resultBrand.Data;
      }
      priceMax.value = (await shoesService.getMaxPrice()).Data;
    } catch (error) {}
  };

  const filterCategory = ref<FilterColumn>({
    FieldName: "CategoryID",
    Value: null,
    FilterOperator: FilterOperator.Equal,
  });

  const filterBrand = ref<FilterColumn>({
    FieldName: "BrandID",
    Value: null,
    FilterOperator: FilterOperator.Equal,
  })

  const filterPriceStart = ref<FilterColumn>({
    FieldName: "Price",
    Value: 0,
    FilterOperator: FilterOperator.GreaterOrEqual,
  });

  const filterPriceEnd = ref<FilterColumn>({
    FieldName: "Price",
    Value: priceMax.value,
    FilterOperator: FilterOperator.LessOrEqual,
  })

  const filterVoucher = ref<FilterColumn>({
    FieldName: "VoucherID",
    Value: null,
    FilterOperator: FilterOperator.NotEqualNull
  })

  const resetFilter = () => {
    filterCategory.value.Value = null;
    filterBrand.value.Value = null;
    filterPriceStart.value.Value = 0;
    filterPriceEnd.value.Value = priceMax.value;
  }

  return { toastConfig, toastRef, showError, showSuccess, 
    showWaring, urlBreak, brands, categories, priceMax, 
    filterCategory, filterBrand, filterPriceStart, 
    filterPriceEnd,resetFilter,filterVoucher,isLoadingOverlay,initWebsite }

});

export default useManagementStore;