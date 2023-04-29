<template>
  <div class="fs-datagrid h-100pc pos-relative">
    <DxDataGrid
      :height="'calc(100% - 56px)'"
      :data-source="dataSource"
      :show-borders="true"
      :key-expr="keyExpr"
      :allow-column-resizing="true"
      :allow-column-reordering="true"
      :show-row-lines="true"
      column-resizing-mode="widget"
      :show-column-lines="true"
      :hoverStateEnabled="true"
      :noDataText="'Không có dữ liệu'"
      min-width="100%"
      :activeStateEnabled="true"
      :onRowClick="(e:any) => $emit('rowClick',e)"
    >
      <DxColumn
        v-for="(column, index) in columns"
        :key="index"
        :alignment="column.TextAlign"
        :width="column.Width"
        :data-field="column.FieldName"
        :allow-sorting="false"
        :caption="column.Caption"
        :cellTemplate="column.CellTemplate || 'templateDefault'"
      >
      </DxColumn>

      <DxColumn
        v-if="isUseCustomAction"
        :fixed="true"
        :fixed-position="'right'"
        :width="1"
        cellTemplate="actionTemplate"
        :allowResizing="false"
        allowReordering="false"
      >
      </DxColumn>

      <template
        v-for="(column, index) in columns.filter(column => column.CellTemplate)"
        :key="index"
        #[column.CellTemplate]="{data}"
      >
        <slot :name="column.CellTemplate" :data="data"> </slot>
      </template>

      <template #templateDefault="{ data }">
        <div>{{ data.value || "--" }}</div>
      </template>

      <template #actionTemplate="{ data }">
        <slot name="action" :data="data">
          <div class="dis-flex custom-action align-center pl-10 pr-10">
            <div
              @click="$emit('editRow', data.key)"
              title="Sửa"
              class="button mr-12 action-edit"
            >
              <div class="icon-pencil pos-relative"></div>
            </div>
            <div title="Xóa" class="button">
              <div class="icon-trash"></div>
            </div>
          </div>
        </slot>
      </template>

      <DxSelection
        v-if="showSelection"
        :allow-select-all="true"
        mode="multiple"
        select-all-mode="page"
        show-check-boxes-mode="always"
      ></DxSelection>

      <DxPaging :enabled="false"></DxPaging>
      <DxLoadPanel :enabled="true"></DxLoadPanel>
    </DxDataGrid>

    <div
      class="footer dis-flex align-center jus-space-between pos-absolute w-100pc"
    >
      <div class="ml-8">
        Tổng : <b>{{ pagingInfo.Total }}</b>
      </div>
      <div>
        <Paginate
          :page-count="pagingInfo.TotalPage"
          :prev-text="'Trang trước'"
          :next-text="'Trang sau'"
          :container-class="'dis-flex'"
          :break-view-class="'break-view-page'"
          v-model="pagingInfo.CurrentPage"
          :click-handler="changePageNumber"
        >
        </Paginate>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column, PagingInfo } from "@/models";
import {
DxColumn,
DxDataGrid,
DxLoadPanel,
DxPaging,
DxSelection,
} from "devextreme-vue/data-grid";
import Paginate from "vuejs-paginate-next";
const $emit = defineEmits(["changePageNumber", "editRow","rowClick"]);

const props = withDefaults(
  defineProps<{
    dataSource: Array<any>;
    columns: Column[];
    keyExpr: string;
    pagingInfo: PagingInfo;
    isUseCustomAction: boolean;
    showSelection: boolean;
  }>(),
  {
    dataSource: () => [],
    totalRecord: 0,
    isUseCustomAction: true,
    showSelection: true,
    columns: () => [],
  }
);

const changePageNumber = (pageNum: number) => {
  $emit("changePageNumber", pageNum);
};
</script>

<style lang="scss">
.fs-datagrid {
  .dx-header-row {
    background-color: var(--app-color-primary) !important;
    td {
      color: white;
    }
  }

  .dx-datagrid-table.dx-pointer-events-none.dx-datagrid-table-fixed {
    .dx-row.dx-data-row.dx-row-lines.dx-column-lines {
      position: relative;
      .custom-action {
        display: none;
        position: absolute;
        right: 0px;
        top: 0px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.008);
        .button {
          width: 28px;
          height: 28px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
    }

    .dx-row.dx-data-row.dx-row-lines.dx-column-lines.dx-state-hover {
      .custom-action {
        display: flex;
      }
    }

    .dx-pointer-events-none.dx-cell-focus-disabled {
      border-left: none;
      border-right: none;
    }
  }

  .dx-datagrid-table.dx-datagrid-table-fixed
    .dx-row.dx-column-lines.dx-header-row
    > td:last-child {
    border-left: none !important;
  }

  .dx-datagrid-table.dx-datagrid-table-fixed
    .dx-row.dx-column-lines.dx-header-row
    > td {
    height: 40px;
  }

  .footer {
    height: 56px;
    background-color: rgb(210, 210, 210);
    bottom: 0;
  }
}
</style>
