<template>
  <div class="overview-container dis-flex flex-column w-100pc h-100pc pt-20 pb-20 br-4">
    <div class="font-24 font-weight-700 mb-40 pl-20 pr-20">Tổng quan</div>

    <div class="flex-1 overflow-auto pl-20 pr-20">
      <div>
        <div class="mb-12 font-16 font-weight-600">Hôm nay</div>
        <div class="dis-flex analyst-today jus-space-between">
          <div
            class="analyst-item flex-1 p-16 br-4"
            v-for="(analystItem, index) in analystItems"
            :key="index"
          >
            <div class="mb-24 font-weight-700">{{ analystItem.Title }}</div>
            <div class="dis-flex align-flex-end jus-space-between">
              <div
                class="icon-analyst"
                :style="{ backgroundColor: analystItem.IconColor }"
              ></div>
              <div>{{ analystItem.Value }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="mt-16">
        <div class="dis-flex jus-space-between align-center">
          <div class="dis-flex pos-relative">
            <div
              :class="currentTab == index && 'analyst-tab-active'"
              class="analyst-tab mr-28 font-16"
              v-for="(analystTab, index) in analystTabs"
              @click="currentTab = index"
              :key="index"
            >
              {{ analystTab }}
            </div>
  
            <div
              :class="`analyst-line-${currentTab}`"
              class="analyst-line pos-absolute"
            ></div>
          </div>
  
          <div class="dis-flex">
            <FSDateBox
              class="mr-16"
              v-model="startDate"
              :config="{
                label: 'Từ ngày',
                labelMode: 'floating',
                max: endDate,
                dateOutOfRangeMessage:
                  'Ngày bắt đầu không được lớn hơn ngày kết thúc',
              }"
            ></FSDateBox>
  
            <FSDateBox
              v-model="endDate"
              :config="{
                label: 'Đến ngày',
                labelMode: 'floating',
                max: new Date(),
              }"
            ></FSDateBox>
          </div>
        </div>
  
        <div class="mt-28 w-100pc">
          <DxChart id="chart" :data-source="dataSource">
            <DxSeries
              argument-field="day"
              value-field="oranges"
              type="bar"
              color="teal"
              width="80"
              :name="analystTabs[currentTab]"
            />
            <DxScrollBar :height="5" />
            <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />
  
            <DxExport :enabled="true" />
          </DxChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FSDateBox } from "@/components/controls";
import { useManagementStore } from "@/stores";
import {
  DxChart,
  DxExport,
  DxLegend,
  DxScrollBar,
  DxSeries,
} from "devextreme-vue/chart";
import { ref } from "vue";
const managementStore = useManagementStore();

const currentTab = ref<number>(0);

const endDate = ref<Date>(new Date());
const startDate = ref<Date>(
  new Date(
    endDate.value.getFullYear(),
    endDate.value.getMonth(),
    endDate.value.getDate() - 7
  )
);

interface AnalystItem {
  Title: string;
  IconColor: string;
  Value: number;
}

const analystItems: AnalystItem[] = [
  {
    Title: "Tổng đơn",
    IconColor: "black",
    Value: 130,
  },
  {
    Title: "Tổng sản phẩm đã bán",
    IconColor: "palevioletred",
    Value: 138,
  },
  {
    Title: "Tổng doanh thu",
    IconColor: "teal",
    Value: 14800000,
  },
  {
    Title: "Tổng số khách hàng",
    IconColor: "tomato",
    Value: 130,
  },
];

const analystTabs: string[] = [
  "Đơn hàng",
  "Sản phẩm đã bán",
  "Thu nhập",
  "Khách hàng",
];

const dataSource = [
  {
    day: "Monday",
    oranges: 3,
  },
  {
    day: "Tuesday",
    oranges: 2,
  },
  {
    day: "Wednesday",
    oranges: 3,
  },
  {
    day: "Thursday",
    oranges: 4,
  },
  {
    day: "Friday",
    oranges: 6,
  },
  {
    day: "Saturday",
    oranges: 12,
  },
  {
    day: "Sunday",
    oranges: 4,
  },
];
</script>

<style lang="scss" scoped>
.overview-container {
  box-sizing: border-box;
  background-color: white;
  .analyst-today {
    .analyst-item {
      background-color: rgb(213, 213, 213);
      box-sizing: border-box;
      margin-right: 16px;
      &:last-child {
        margin-right: unset;
      }
    }
  }

  .analyst-tab {
    cursor: pointer;
  }

  .analyst-tab-active {
    color: var(--app-color-primary);
    font-weight: 700;
  }

  .analyst-line {
    height: 2px;
    background-color: var(--app-color-primary);
    bottom: -10px;
    transition: all 0.3s ease-in-out;
  }

  .analyst-line-0 {
    width: 69px;
    left: 0px;
  }

  .analyst-line-1 {
    left: 90px;
    width: 123px;
  }

  .analyst-line-2 {
    left: 227px;
    width: 72px;
  }

  .analyst-line-3 {
    left: 316px;
    width: 87px;
  }
}
</style>
