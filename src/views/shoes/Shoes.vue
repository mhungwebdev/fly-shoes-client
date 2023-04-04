<template>
  <div
    class="admin-shoes-container h-100pc pt-20 pl-12 pr-12 pb-12 w-100pc flex-column dis-flex"
  >
    <div class="font-24 font-weight-700 mb-20">Thông tin giày</div>
    <div class="grid dis-flex">
      <div class="content-wrapper w-100pc dis-flex flex-column br-4 p-16">
        <div class="toolbar dis-flex mb-12 jus-space-between">
          <div class="dis-flex">
            <FSTextBox
              class="mr-8"
              v-model="keywords"
              :config="{ placeholder: 'Tìm kiếm' }"
            ></FSTextBox>
            <DxSelectBox
              :data-source="categories"
              :display-expr="'CategoryName'"
              :value-expr="'CategoryID'"
              noDataText="Không có dữ liệu"
              placeholder="Thể loại"
              :height="36"
              :width="160"
              class="mr-8"
              :showClearButton="true"
              v-model="filterCategory.Value"
            ></DxSelectBox>
            <DxSelectBox
              :data-source="brands"
              :display-expr="'BrandName'"
              :value-expr="'BrandID'"
              noDataText="Không có dữ liệu"
              placeholder="Thương hiệu"
              :width="160"
              :height="36"
              class="mr-8"
              :showClearButton="true"
              v-model="filterBrand.Value"
            ></DxSelectBox>

            <div>
              <div class="font-12">
                Giá :
                <b class="text-red">{{
                  filterPriceStart.Value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}</b>
                -
                <b class="text-red">{{
                  filterPriceEnd.Value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}</b>
              </div>
              <DxRangeSlider
                v-model:start="filterPriceStart.Value"
                v-model:end="filterPriceEnd.Value"
                :min="0"
                :max="maxPrice"
                :width="160"
              />
            </div>
          </div>

          <div>
            <FSButton :config="{ text: 'Thêm mới',icon:'plus',stylingMode:'contained',type:'default',onClick:() => $router.push('/admin/shoes/form') }"></FSButton>
          </div>
        </div>
        <div class="content h-100pc dis-flex flex-column">
          <FSDataGrid
            :columns="columns"
            :data-source="shoes"
            :key-expr="'ShoesID'"
            :pagingInfo="pagingInfo"
            @changePageNumber="(pageNum) => {(payload.PageIndex = pageNum);loadData(false)}"
          >
            <template #priceTemplate="{ data }">
              <div class="text-red">
                {{
                  data.value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>
            </template>
          </FSDataGrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoesService from "@/apis/shoes-service";
import { FSButton, FSDataGrid, FSTextBox } from "@/components/controls";
import {
  type Shoes,
  type Column,
  type PagingPayload,
  SortOrder,
  PagingInfo,
  Category,
  Brand,
FilterColumn,
} from "@/models";
import { useManagementStore } from "@/stores";
import { onMounted, ref, watch } from "vue";
import DxSelectBox from "devextreme-vue/select-box";
import DxRangeSlider from "devextreme-vue/range-slider";
import CategoryService from "@/apis/category-service";
import { BrandService } from "@/apis";
import { FilterOperator } from "@/enums";

const managementStore = useManagementStore();

const shoesService = new ShoesService();
const categoryService = new CategoryService();
const brandService = new BrandService();

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
  Value: 5000000,
  FilterOperator: FilterOperator.LessOrEqual,
})

const shoes = ref<Shoes[]>([]);
const payload = ref<PagingPayload>({
  FilterColumns: [],
  Keyword: "",
  PageIndex: 1,
  PageSize: 15,
  SortOrder: new SortOrder(),
});
const pagingInfo = ref<PagingInfo>(new PagingInfo());
const keywords = ref<string>("");
const timeRef = ref<any>(null);
const categories = ref<Category[]>([]);
const brands = ref<Brand[]>([]);
const maxPrice = ref<number>(5000000);

watch(
  [keywords,filterPriceStart.value,filterPriceEnd.value], 
  () => {
  if (timeRef != null) {
    clearTimeout(timeRef.value);
  }

  timeRef.value = setTimeout(() => {
    payload.value.Keyword = keywords.value;
    loadData();
  }, 500);
});

watch(
  [filterCategory.value,filterBrand.value],
  async () => {
    await loadData();
  }
)

onMounted(async () => {
  await loadData();
  try {
    const resultCategory = await categoryService.getAll();
    if (resultCategory && resultCategory.Success && resultCategory.Data) {
      categories.value = resultCategory.Data;
    }

    const resultBrand = await brandService.getAll();
    if (resultBrand && resultBrand.Success && resultBrand.Data) {
      brands.value = resultBrand.Data;
    }
    maxPrice.value = (await shoesService.getMaxPrice()).Data;
    filterPriceEnd.value.Value = maxPrice.value;
  } catch (error) {
    managementStore.showError();
  }
});

const loadData = async (isResetPage:boolean = true) => {
  try {
    if(isResetPage) payload.value.PageIndex = 1;
    payload.value.FilterColumns = [filterCategory.value,filterBrand.value,filterPriceStart.value,filterPriceEnd.value];
    const result = await shoesService.paging(payload.value);
    const resultTotal = await shoesService.getTotal(payload.value);
    if (result && result.Success && result.Data) {
      shoes.value = result.Data;
    }

    if (resultTotal && resultTotal.Success && resultTotal.Data) {
      pagingInfo.value = resultTotal.Data;
    }
  } catch (error) {
    managementStore.showError();
  }
};

const columns = ref<Column[]>([
  { FieldName: "ShoesName", Caption: "Tên giày" },
  {
    FieldName: "Price",
    Caption: "Giá",
    CellTemplate: "priceTemplate",
    Width: 160,
  },
  { FieldName: "CategoryName", Caption: "Thể loại", Width: 160 },
  { FieldName: "BrandName", Caption: "Thương hiệu", Width: 160 },
]);
</script>

<style lang="scss" scoped>
.admin-shoes-container {
  .grid {
    height: calc(100% - 40px);
  }
  .grid .content-wrapper {
    background-color: white;
  }

  .filter-group {
    width: 200px;
    height: 100%;
    min-width: 200px;
    background-color: white;
  }
}
</style>
