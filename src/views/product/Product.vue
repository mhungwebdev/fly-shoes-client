<template>
  <div class="product-container">
    <div class="align-center dis-flex flex-column product-container">
      <div class="font-32 text-center mb-40">Sản phẩm của chúng tôi</div>
      <div class="dis-flex brand-list">
        <div
          class="flex-center flex-column mr-32 cursor-pointer p-10 brand"
          v-for="(brand, index) in managementStore.brands"
          :key="index"
        >
          <div
            class="logo-brand"
            :style="{ backgroundImage: `url(${brand.BrandLogo})` }"
          ></div>
          <div>{{ brand.BrandName }}</div>
        </div>
      </div>

      <div class="w-100pc dis-flex mt-100">
        <div class="filter-shoes">
          <DxRadioGroup
            :data-source="managementStore.categories"
            :displayExpr="'CategoryName'"
            :value-expr="'CategoryID'"
          ></DxRadioGroup>

          <div class="mt-32">
            <DxRangeSlider
              v-model:start="filterPriceStart.Value"
              v-model:end="filterPriceEnd.Value"
              :min="0"
              :width="160"
            />
            <div class="dis-flex jus-space-between">
              <div>
                {{
                  filterPriceStart.Value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>

              <div>
                {{
                  filterPriceEnd.Value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>
            </div>
          </div>

          <div class="dis-flex align-center mt-32">
            <div class="mr-16">Giá</div>
            <div class="icon-asc cursor-pointer"></div>
          </div>
        </div>

        <div class="shoes flex-1"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterOperator } from "@/enums";
import type { FilterColumn } from "@/models";
import { useManagementStore } from "@/stores";
import DxRadioGroup from "devextreme-vue/radio-group";
import DxRangeSlider from "devextreme-vue/range-slider";
import { ref } from "vue";

const managementStore = useManagementStore();

const filterPriceStart = ref<FilterColumn>({
  FieldName: "Price",
  Value: 0,
  FilterOperator: FilterOperator.GreaterOrEqual,
});

const filterPriceEnd = ref<FilterColumn>({
  FieldName: "Price",
  Value: 5000000,
  FilterOperator: FilterOperator.LessOrEqual,
});
</script>

<style lang="scss" scoped>
.product-container {
  .category-list {
    width: fit-content;
    .category {
      margin-right: 32px;
    }
  }

  .brand-list {
    .brand {
      min-width: 60px;
      &:hover {
        background-color: rgb(212, 227, 255);
        border-radius: 4px;
      }

      .logo-brand {
        width: 32px;
        height: 32px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>
