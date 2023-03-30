<template>
  <div class="overview-container w-100pc h-100pc p-20 br-4">
    <div class="font-24 font-weight-700 mb-40">Tổng quan</div>

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

        <FSDateBox></FSDateBox>
      </div>

      <div class="mt-28">
        <DxChart id="chart" :data-source="dataSource">
          <DxSeries
            argument-field="day"
            value-field="oranges"
            name="My oranges"
            type="bar"
            color="var(--app-color-primary)"
            width="80"
          />
          <DxScrollBar :height="5"/>
          <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />

          <DxExport :enabled="true" />
        </DxChart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FSDateBox } from "@/components/controls";
import { useManagementStore } from "@/stores";
import { DxChart, DxSeries, DxExport,DxLegend,DxScrollBar } from "devextreme-vue/chart";
import { ref } from "vue";
const managementStore = useManagementStore();

const currentTab = ref<number>(0);

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
