<template>
  <div class="product-container">
    <div class="align-center dis-flex flex-column product-container">
      <div class="font-32 text-center mb-40">Sản phẩm của chúng tôi</div>
      <div class="dis-flex brand-list">
        <div
          @click="managementStore.filterBrand.Value = brand.BrandID"
          :class="
            managementStore.filterBrand.Value == brand.BrandID ? 'active' : ''
          "
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

      <div class="w-100pc dis-flex mt-40">
        <div class="filter-shoes pt-10">
          <FSTextBox v-model="keywords" class="mb-32" :config="{mode:'search',placeholder:'Tìm kiếm',width:200}"></FSTextBox>
          <DxRadioGroup
            :data-source="managementStore.categories"
            :displayExpr="'CategoryName'"
            :value-expr="'CategoryID'"
            v-model:value="managementStore.filterCategory.Value"
          ></DxRadioGroup>

          <div class="mt-32">
            <div class="dis-flex mb-12 align-center">
              <DxCheckBox v-model="sortPrice"></DxCheckBox>
              <div class="ml-8">Xếp xếp theo giá</div>
            </div>
            <div :class="sortPrice ? '' : 'op-5'" class="dis-flex align-center">
              <div class="mr-16 font-16">Giá</div>
              <div
                @click="sortPrice && changeSortPrice()"
                :class="
                  (sortPrice ? 'cursor-pointer' : '') +
                  ' ' +
                  (payload.SortOrder.SortType == SortType.ASC
                    ? 'icon-asc'
                    : 'icon-desc')
                "
                :title="
                  payload.SortOrder.SortType == SortType.ASC
                    ? 'Tăng dần'
                    : 'Giảm dần'
                "
              ></div>
            </div>
          </div>

          <div class="mt-24">
            <DxRangeSlider
              v-model:start="managementStore.filterPriceStart.Value"
              v-model:end="managementStore.filterPriceEnd.Value"
              :min="0"
              :max="managementStore.priceMax"
              :width="160"
            />
            <div class="dis-flex jus-space-between">
              <div>
                {{
                  managementStore.filterPriceStart.Value.toLocaleString(
                    "it-IT",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )
                }}
              </div>

              <div>
                {{
                  managementStore.filterPriceEnd.Value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>
            </div>
          </div>

          <div class="mt-32 dis-flex align-center">
            <DxCheckBox v-model="onlySale"></DxCheckBox>
            <div class="ml-12">Chỉ sản phẩm giảm giá</div>
          </div>

          <FSButton
            class="mt-12"
            :config="{
              text: 'Bỏ lọc',
              type: 'default',
              stylingMode: 'outlined',
              onClick: resetFilter,
            }"
          ></FSButton>
        </div>

        <div class="shoes flex-1 dis-flex">
          <div v-if="shoes.length == 0" class="no-data"></div>

          <ShoesCard
            :is-preview="false"
            class="flex-1 m-10"
            v-for="(s, index) in shoes"
            :key="index"
            :shoes="s"
            :width="240"
            :height="360"
          >
          </ShoesCard>

          <div class="flex-center w-100pc mt-40">
            <Paginate
              :page-count="pagingInfo.TotalPage"
              :prev-text="'Trang trước'"
              :next-text="'Trang sau'"
              :container-class="'dis-flex'"
              :break-view-class="'break-view-page'"
              v-model="pagingInfo.CurrentPage"
              :click-handler="changePageNumber"
            ></Paginate>
          </div>
        </div>
      </div>
    </div>

    <div class="button-scroll-to-top" title="Go to top"></div>
  </div>
</template>

<script setup lang="ts">
import ShoesService from "@/apis/shoes-service";
import { FSButton, FSTextBox } from "@/components/controls";
import Paginate from "vuejs-paginate-next";
import {
  SortOrder,
  type PagingPayload,
  Shoes,
  PagingInfo,
  FilterColumn,
} from "@/models";
import { useManagementStore, useUserStore } from "@/stores";
import { DxCheckBox } from "devextreme-vue/check-box";
import DxRadioGroup from "devextreme-vue/radio-group";
import DxRangeSlider from "devextreme-vue/range-slider";
import { onMounted, ref, watch } from "vue";
import ShoesCard from "../shoes/ShoesCard.vue";
import { initScrollTop } from "@/common/functions/html-function";
import { SortType } from "@/enums";

const managementStore = useManagementStore();
const userStore = useUserStore();
const shoesService = new ShoesService();
const keywords = ref<string>("");
const timeRef = ref<any>(null);
const shoes = ref<Shoes[]>([]);
const pagingInfo = ref<PagingInfo>(new PagingInfo());
const onlySale = ref<boolean>(false);
const sortPrice = ref<boolean>(false);

const sortPriceDESC = ref<SortOrder>({
  FieldSort: "Price",
  SortType: SortType.DESC,
});

watch(sortPrice, (newVal) => {
  if (newVal) {
    payload.value.SortOrder = sortPriceDESC.value;
  } else {
    payload.value.SortOrder = new SortOrder();
  }

  loadData();
});

const payload = ref<PagingPayload>({
  FilterColumns: [],
  Keyword: "",
  PageIndex: 1,
  PageSize: 9,
  SortOrder: new SortOrder(),
  CustomParam: {
    UserID: userStore.currentUser?.UserID,
  },
});

const resetFilter = () => {
  managementStore.resetFilter();
  onlySale.value = false;
  sortPrice.value = false;
};

onMounted(async () => {
  initScrollTop();
  await loadData();
}),
  watch(
    [
      keywords,
      managementStore.filterPriceStart,
      managementStore.filterPriceEnd,
      onlySale,
    ],
    () => {
      if (timeRef != null) {
        clearTimeout(timeRef.value);
      }

      timeRef.value = setTimeout(() => {
        payload.value.Keyword = keywords.value;
        loadData();
      }, 500);
    }
  );

watch(
  [managementStore.filterBrand, managementStore.filterCategory],
  async () => {
    loadData();
  }
);

const loadData = async (isResetPage: boolean = true) => {
  try {
    if (isResetPage) payload.value.PageIndex = 1;
    payload.value.FilterColumns = [
      managementStore.filterCategory,
      managementStore.filterBrand,
      managementStore.filterPriceStart,
      managementStore.filterPriceEnd,
      onlySale.value ? managementStore.filterVoucher : new FilterColumn(),
    ];
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

const changePageNumber = async (pageNum: number) => {
  payload.value.PageIndex = pageNum;
  await loadData(false);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const changeSortPrice = () => {
  if (payload.value.SortOrder.SortType == SortType.ASC) {
    payload.value.SortOrder.SortType = SortType.DESC;
  } else {
    payload.value.SortOrder.SortType = SortType.ASC;
  }

  loadData();
};
</script>

<style lang="scss">
.product-container {
  .filter-shoes {
    min-width: 200px;
    margin-right: 80px;
    .dx-radiobutton {
      margin-bottom: 10px;
      .dx-radio-value-container {
        padding-right: 20px;
      }
    }
  }

  .shoes {
    width: calc(1200px - 320px);
    flex-wrap: wrap;
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

    .brand.active {
      background-color: rgb(212, 227, 255);
      border-radius: 4px;
    }
  }
}
</style>
