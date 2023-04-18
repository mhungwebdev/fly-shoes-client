<template>
  <div
    class="admin-shoes-container h-100pc pt-20 pl-12 pr-12 pb-12 w-100pc flex-column dis-flex"
  >
    <div class="font-24 font-weight-700 mb-20">Thông tin đơn hàng</div>
    <div class="grid dis-flex">
      <div class="content-wrapper w-100pc dis-flex flex-column br-4 p-16">
        <div class="toolbar dis-flex mb-12 jus-space-between">
          <div class="dis-flex">
            <FSTextBox
              class="mr-8"
              v-model="keywords"
              :config="{ placeholder: 'Tìm kiếm',mode:'search' }"
            ></FSTextBox>
          </div>
        </div>
        <div class="content h-100pc dis-flex flex-column">
          <FSDataGrid
            :columns="columns"
            :data-source="orders"
            :key-expr="'OrderID'"
            :pagingInfo="pagingInfo"
            @changePageNumber="
              (pageNum) => {
                payload.PageIndex = pageNum;
                loadData(false);
              }
            "
          >
            <template #statusTemplate="{ data }">
              <div :class="`order-status-${data.value} text-white`">
                <div v-if="data.value == OrderStatus.Success">Đã duyệt</div>
                <div v-if="data.value == OrderStatus.Cancel">Đã hủy</div>
                <div v-if="data.value == OrderStatus.Pending">Chờ xác nhận</div>
              </div>
            </template>

            <template #createTemplate="{ data }">
              <div>
                {{ formattedDate(data.value) }}
              </div>
            </template>

            <template #action="{ data }">
              <div class="dis-flex custom-action align-center pl-10 pr-10">
                <div class="button mr-12 action-edit">
                  <div title="Duyệt đơn" class="icon-pencil pos-relative"></div>
                </div>

                <div class="button mr-12 action-edit">
                  <div title="Hủy đơn" class="icon-pencil pos-relative"></div>
                </div>
              </div>
            </template>
          </FSDataGrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderShoesService from "@/apis/order-shoes-service.js";
import { formattedDate } from "@/common/functions/date-function";
import { FSDataGrid, FSTextBox } from "@/components/controls";
import { OrderStatus } from "@/enums";
import {
  PagingInfo,
  type Column,
  OrderShoes,
  PagingPayload,
  SortOrder,
} from "@/models";
import { useManagementStore } from "@/stores";
import { onMounted, ref } from "vue";

const orderService = new OrderShoesService();
const logData = (data:any) => {
    console.log(data);
}
const orders = ref<OrderShoes[]>([]);
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
  { FieldName: "ReceiverName", Caption: "Người nhận",CellTemplate:"" },
  { FieldName: "ReceiverPhone", Caption: "Số điện thoại người nhận",CellTemplate:"" },
  { FieldName: "ReceiverAddress", Caption: "Địa chỉ nhận",CellTemplate:"" },
  {
    FieldName: "CreatedDate",
    Caption: "Ngày tạo",
    CellTemplate: "createTemplate",
  },
  {
    FieldName: "Status",
    Caption: "Trạng thái",
    CellTemplate: "statusTemplate",
    TextAlign: "center",
  },
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
    const result = await orderService.paging(payload.value);
    const resultTotal = await orderService.getTotal(payload.value);
    if (result && result.Success && result.Data) {
      orders.value = result.Data;
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
  .order-status-1 {
    background-color: orange;
  }

  .order-status-2 {
    background-color: green;
  }

  .order-status-3 {
    background-color: red;
  }

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
