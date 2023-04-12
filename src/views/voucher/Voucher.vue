<template>
  <div
    class="admin-shoes-container h-100pc pt-20 pl-12 pr-12 pb-12 w-100pc flex-column dis-flex"
  >
    <div class="font-24 font-weight-700 mb-20">Thông tin người dùng</div>
    <div class="grid dis-flex">
      <div class="content-wrapper w-100pc dis-flex flex-column br-4 p-16">
        <div class="toolbar dis-flex mb-12 jus-space-between">
          <div class="dis-flex jus-space-between">
            <FSTextBox
              class="mr-8"
              v-model="keywords"
              :config="{ placeholder: 'Tìm kiếm',mode:'search' }"
            ></FSTextBox>
          </div>
          <FSButton :config="{text:'Thêm mới',icon:'plus',type:'default',stylingMode:'contained',onClick:() => $router.push('/admin/vouchers/form')}"></FSButton>
        </div>
        <div class="content h-100pc dis-flex flex-column">
          <FSDataGrid
            :columns="columns"
            :data-source="vouchers"
            :key-expr="'VoucherID'"
            :pagingInfo="pagingInfo"
            :is-use-custom-action="false"
            :show-selection="false"
            @changePageNumber="
              (pageNum) => {
                payload.PageIndex = pageNum;
                loadData(false);
              }
            "
          >
            <template #formulaTypeTemplate="{ data }">
                <div>
                    <div v-if="data.value == FormulaType.Percent">Phần trăm</div>
                    <div v-if="data.value == FormulaType.Subtraction">Trừ trực tiếp</div>
                </div>
            </template>

            <template #timeTemplate="{ data }">
              <div>
                {{ formattedDate(data.value) }}
              </div>
            </template>

            <template #statusTemplate="{data}">
                <div>
                    <div class="text-green" v-if="data.value">Đang active</div>
                    <div class="text-disabled" v-if="!data.value">Đã dừng</div>
                </div>
            </template>
          </FSDataGrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VoucherService from "@/apis/voucher-service";
import { formattedDate } from "@/common/functions";
import { FSButton, FSDataGrid, FSTextBox } from "@/components/controls";
import { FormulaType } from "@/enums";
import {
Column,
PagingInfo,
SortOrder,
Voucher,
type PagingPayload,
} from "@/models";
import { useManagementStore } from "@/stores";
import { onMounted, ref } from "vue";

const voucherService = new VoucherService();

const vouchers = ref<Voucher[]>([]);
const payload = ref<PagingPayload>({
  FilterColumns: [],
  Keyword: "",
  PageIndex: 1,
  PageSize: 15,
  SortOrder: new SortOrder(),
  CustomParam:null
});
const pagingInfo = ref<PagingInfo>(new PagingInfo());
const columns = ref<Column[]>([
  { FieldName: "VoucherTitle", Caption: "Voucher" },
  {
    FieldName: "FormulaType",
    Caption: "Công thức giảm giá",
    TextAlign:'left',
    CellTemplate: "formulaTypeTemplate",
  },
  { FieldName: "VoucherValue", Caption: "Giảm" },
  { FieldName: "Quantity", Caption: "Số lượng còn" },
  {
    FieldName: "EndDate",
    Caption: "Ngày kết thúc",
    TextAlign:'center',
    CellTemplate: "timeTemplate",
  },
  {
    FieldName: "IsActive",
    Caption: "Trạng thái sử dụng",
    TextAlign:'center',
    CellTemplate: "statusTemplate",
  }
]);

const keywords = ref<string>("");
const timeRef = ref<any>(null);
const managementStore = useManagementStore();

onMounted(async () => {
  await loadData();
});

const loadData = async (isResetPage: boolean = true) => {
  try {
    if (isResetPage) payload.value.PageIndex = 1;
    const result = await voucherService.paging(payload.value);
    const resultTotal = await voucherService.getTotal(payload.value);
    if (result && result.Success && result.Data) {
      vouchers.value = result.Data;
    }

    if (resultTotal && resultTotal.Success && resultTotal.Data) {
      pagingInfo.value = resultTotal.Data;
    }
  } catch (error) {
    managementStore.showError();
  }
};
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
