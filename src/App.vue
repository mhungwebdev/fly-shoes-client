<template>
  <div class="w-100pc h-full dis-flex jus-center">
    <RouterView></RouterView>
  </div>
  <DxToast v-bind="managementStore.toastConfig"></DxToast>
  <loading
    v-model:active="managementStore.isLoadingOverlay"
    :can-cancel="true"
    :on-cancel="() => managementStore.isLoadingOverlay = false"
    :is-full-page="true"
    loader="dots"
    color="rgb(100, 154, 255)"
    :height="120"
    :width="120"
  />
</template>
<script lang="ts" setup>
import { DxToast } from "devextreme-vue/toast";
import { RouterView } from "vue-router";
import { useManagementStore } from "./stores";
import { onMounted } from "vue";
import { CategoryService, BrandService } from "./apis";
import ShoesService from "./apis/shoes-service";
import Loading from "vue-loading-overlay";

const managementStore = useManagementStore();

const shoesService = new ShoesService();
const categoryService = new CategoryService();
const brandService = new BrandService();

onMounted(async () => {
  await initWebsite();
});

const initWebsite = async () => {
  try {
    const resultCategory = await categoryService.getAll();
    if (resultCategory && resultCategory.Success && resultCategory.Data) {
      managementStore.categories = resultCategory.Data;
    }

    const resultBrand = await brandService.getAll();
    if (resultBrand && resultBrand.Success && resultBrand.Data) {
      managementStore.brands = resultBrand.Data;
    }
    managementStore.priceMax = (await shoesService.getMaxPrice()).Data;
  } catch (error) {}
};
</script>

<style scoped></style>
