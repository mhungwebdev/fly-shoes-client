<template>
  <div class="overview-container dis-flex flex-column w-100pc h-100pc pt-20 pb-20 br-4">
    <div class="font-24 font-weight-700 mb-40 pl-20 pr-20">Tổng quan</div>

    <div class="flex-1 overflow-auto pl-20 pr-20">
      <div>
        <div class="mb-12 font-16 font-weight-600">Hôm nay</div>
        <div class="dis-flex analyst-today jus-space-between">
          <div class="analyst-item flex-1 p-16 br-4" v-for="(analystItem, index) in analystItems" :key="index">
            <div class="mb-24 font-weight-700">{{ analystItem.Title }}</div>
            <div class="dis-flex align-flex-end jus-space-between">
              <div class="icon-analyst" :style="{ backgroundColor: analystItem.IconColor }"></div>
              <div>{{ analystItem.Value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <div class="dis-flex jus-space-between align-center">
          <div class="dis-flex pos-relative">
            <div :class="currentTab.Value == analystTab.Value && 'analyst-tab-active'" class="analyst-tab mr-28 font-16"
              v-for="(analystTab, index) in analystTabs" @click="currentTab = analystTab" :key="index">
              {{ analystTab.Title }}
            </div>

            <div :class="`analyst-line-${currentTab.Value}`" class="analyst-line pos-absolute"></div>
          </div>

          <div class="dis-flex">
            <DxSelectBox :data-source="timeAnalysts" displayExpr="Title" valueExpr="Value" v-model="timeAnalyst">
            </DxSelectBox>
          </div>
        </div>

        <div class="mt-28 w-100pc">
          <DxChart id="chart" :data-source="dataSource">
            <DxSeries argument-field="Title" value-field="Total" type="bar" color="teal" width="80"
              :name="currentTab.Title" />
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
import ReportService from "@/apis/report-api";
import { TabAnalyst, TimeAnalyst } from "@/enums";
import { useManagementStore } from "@/stores";
import {
DxChart,
DxExport,
DxLegend,
DxScrollBar,
DxSeries,
} from "devextreme-vue/chart";
import DxSelectBox from "devextreme-vue/select-box";
import { ref, watch } from "vue";
const managementStore = useManagementStore();

interface AnalystItem {
  Title: string;
  IconColor: string;
  Value: number;
}

interface TimeToAnalysis {
  Title: string;
  Value: TimeAnalyst
}

interface TabAnalystItem {
  Title:string;
  Value:TabAnalyst
}

interface DataAnalyst {
  Title:string;
  Total:number;
}

const currentTab = ref<TabAnalystItem>({
    Title:"Đơn hàng",
    Value:TabAnalyst.Order
  });
const timeAnalyst = ref<TimeAnalyst>(TimeAnalyst.CurrentWeek);

const reportService = new ReportService()

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

const timeAnalysts: TimeToAnalysis[] = [
  {
    Title: "Tuần này",
    Value: TimeAnalyst.CurrentWeek
  },
  {
    Title: "Tuần trước",
    Value: TimeAnalyst.LastWeek
  },
  {
    Title: "Tháng này",
    Value: TimeAnalyst.CurrentMonth
  },
  {
    Title: "Tháng trước",
    Value: TimeAnalyst.LastMonth
  },
  {
    Title: "Năm nay",
    Value: TimeAnalyst.CurrentYear
  },
  {
    Title: "Năm trước",
    Value: TimeAnalyst.CurrentYear
  }
]

const analystTabs: TabAnalystItem[] = [
  {
    Title:"Đơn hàng",
    Value:TabAnalyst.Order
  },{
    Title:"Sản phẩm đã bán",
    Value:TabAnalyst.Product
  },{
    Title:"Thu nhập",
    Value:TabAnalyst.InCome
  },{
    Title:"Khách hàng",
    Value:TabAnalyst.Customer
  }
];

const dataSource = ref<DataAnalyst[]>([]);

watch(
  [currentTab,timeAnalyst],
  async () => {
    try {
      const res = await reportService.getReport(currentTab.value.Value,timeAnalyst.value);
      if(res && res.Success){
        dataSource.value = res.Data;
      }else{
        managementStore.showError();
      }
    } catch (error) {
      managementStore.showError();
    }
  },{
    deep:true,
    immediate:true
  }
)
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

  .analyst-line-1 {
    width: 69px;
    left: 0px;
  }

  .analyst-line-2 {
    left: 95px;
    width: 128px;
  }

  .analyst-line-3 {
    left: 244px;
    width: 72px;
  }

  .analyst-line-4 {
    left: 342px;
    width: 87px;
  }
}
</style>
