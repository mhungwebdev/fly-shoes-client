<template>
  <div class="admin-shoes-container h-100pc pt-20 pl-12 pr-12 pb-12 w-100pc flex-column dis-flex">
    <div class="font-24 font-weight-700 mb-20">Thông tin đơn hàng</div>
    <div class="grid dis-flex">
      <div class="content-wrapper w-100pc dis-flex flex-column br-4 p-16">
        <div class="toolbar dis-flex mb-12 jus-space-between">
          <div class="dis-flex">
            <FSTextBox class="mr-8" v-model="keywords" :config="{ placeholder: 'Tìm kiếm', mode: 'search' }"></FSTextBox>
          </div>
        </div>
        <div class="content h-100pc dis-flex flex-column">
          <FSDataGrid :columns="columns" :data-source="orders" :key-expr="'OrderID'" :pagingInfo="pagingInfo"
            :show-selection="false" :width="'100%'" @changePageNumber="(pageNum) => {
                payload.PageIndex = pageNum;
                loadData(false);
              }
              ">
            <template #statusTemplate="{ data }">
              <div class="text-white order-cancel" v-if="data.value == OrderStatus.Cancel">
                Đã hủy
              </div>
              <div class="text-white order-confirm" v-if="data.value == OrderStatus.Confirm">
                Đã xác nhận
              </div>
              <div class="text-white order-pending" v-if="data.value == OrderStatus.Pending">
                Đang chờ xác nhận
              </div>
              <div class="text-white order-success" v-if="data.value == OrderStatus.Success">
                Đơn hàng thành công
              </div>
            </template>

            <template #createTemplate="{ data }">
              <div>
                {{ formattedDate(data.value) }}
              </div>
            </template>

            <template #paymentMethodTemplate="{ data }">
              <div v-if="data.value == PaymentMethod.ReceiveProduct && data.data.Status != OrderStatus.Cancel">Thanh toán
                khi nhận hàng</div>
              <div v-if="data.value == PaymentMethod.VNPay && data.data.Status != OrderStatus.Cancel">Thanh toán online
              </div>

              <div v-if="data.data.Status == OrderStatus.Cancel">
                --
              </div>
            </template>

            <template #paymentStatusTemplate="{ data }">
              <div v-if="data.value && data.data.Status != OrderStatus.Cancel" class="text-green">Đã thanh toán</div>
              <div v-if="!data.value && data.data.Status != OrderStatus.Cancel" class="text-red">Chưa thanh toán</div>
              <div v-if="data.data.Status == OrderStatus.Cancel">--</div>
            </template>

            <template #action="{ data }">
              <div class="dis-flex custom-action align-center pl-10 pr-10">
                <div @click="updateStatusOrder(data.key, OrderStatus.Confirm)"
                  v-if="data.data.Status == OrderStatus.Pending" class="button mr-12 action-edit">
                  <div title="Duyệt đơn" class="icon-accept-order pos-relative"></div>
                </div>

                <div @click="updateStatusOrder(data.key, OrderStatus.Success)"
                  v-if="data.data.Status == OrderStatus.Confirm" class="button action-edit">
                  <div title="Xác nhận đơn hàng thành công" class="icon-order-success pos-relative"></div>
                </div>

                <div @click="updateStatusOrder(data.key, OrderStatus.Cancel)"
                  v-if="![OrderStatus.Cancel, OrderStatus.Success].includes(data.data.Status)"
                  class="button mr-12 action-edit">
                  <div title="Hủy đơn" class="icon-cancel-order pos-relative"></div>
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
import { OrderStatus, PaymentMethod } from "@/enums";
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
const orders = ref<OrderShoes[]>([]);
const payload = ref<PagingPayload>({
  FilterColumns: [],
  Keyword: "",
  PageIndex: 1,
  PageSize: 15,
  SortOrder: new SortOrder(),
  CustomParam: null,
});
const pagingInfo = ref<PagingInfo>(new PagingInfo());
const columns = ref<Column[]>([
  { FieldName: "ReceiverName", Caption: "Người nhận", CellTemplate: "" },
  {
    FieldName: "ReceiverPhone",
    Caption: "Số điện thoại người nhận",
    CellTemplate: "",
  },
  { FieldName: "ReceiverAddress", Caption: "Địa chỉ nhận", CellTemplate: "" },
  {
    FieldName: "CreatedDate",
    Caption: "Ngày tạo",
    CellTemplate: "createTemplate",
  }, {
    FieldName: "PaymentMethod",
    Caption: "Phương thức thanh toán",
    CellTemplate: "paymentMethodTemplate",
    TextAlign: "left"
  }, {
    FieldName: "PaymentStatus",
    Caption: "Trạng thái thanh toán",
    CellTemplate: "paymentStatusTemplate",
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

const updateStatusOrder = async (orderID: number, status: OrderStatus) => {
  try {
    var res = await orderService.updateOrderStatus(orderID, status);
    if (res.Success) {
      managementStore.showSuccess();
      loadData();
    } else {
      managementStore.showError();
    }
  } catch (error) {
    managementStore.showError();
  }
}
</script>

<style lang="scss" scoped>
.admin-shoes-container {
  .order-confirm {
    background-color: rgb(23, 104, 255);
    padding: 8px;
    border-radius: 4px;
  }

  .order-pending {
    background-color: rgb(235, 229, 58);
    padding: 8px;
    border-radius: 4px;
  }

  .order-cancel {
    background-color: rgb(161, 0, 0);
    padding: 8px;
    border-radius: 4px;
  }

  .order-success {
    background-color: rgb(2, 155, 2);
    padding: 8px;
    border-radius: 4px;
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
