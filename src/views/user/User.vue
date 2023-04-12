<template>
  <div
    class="admin-shoes-container h-100pc pt-20 pl-12 pr-12 pb-12 w-100pc flex-column dis-flex"
  >
    <div class="font-24 font-weight-700 mb-20">Thông tin người dùng</div>
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
            :data-source="users"
            :key-expr="'UserID'"
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
            <template #amountSpent="{ data }">
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
import UserService from '@/apis/user-service';
import { FSDataGrid, FSTextBox } from '@/components/controls';
import { FilterOperator } from '@/enums';
import { SortOrder, type PagingPayload, type User, PagingInfo, Column, FilterColumn } from '@/models';
import { useManagementStore } from '@/stores';
import { onMounted, ref } from 'vue';


const userService = new UserService();

const filterAdmin = new FilterColumn();
filterAdmin.FieldName = "IsAdmin";
filterAdmin.FilterOperator = FilterOperator.NotEqual;
filterAdmin.Value = true;

const users = ref<User[]>([]);
const payload = ref<PagingPayload>({
  FilterColumns: [filterAdmin],
  Keyword: "",
  PageIndex: 1,
  PageSize: 15,
  SortOrder: new SortOrder(),
  CustomParam:null
});
const pagingInfo = ref<PagingInfo>(new PagingInfo());
const columns = ref<Column[]>([
  { FieldName: "FullName", Caption: "Họ tên" },
  { FieldName: "Email", Caption: "Email" },
  { FieldName: "Address", Caption: "Địa chỉ" },
  { FieldName: "Phone",Caption: "Số điện thoại"},
  { FieldName: "AmountSpent",Caption: "Số tiền đã tiêu trong shop",CellTemplate:'amountSpent'},
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
    const result = await userService.paging(payload.value);
    const resultTotal = await userService.getTotal(payload.value);
    if (result && result.Success && result.Data) {
      users.value = result.Data;
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