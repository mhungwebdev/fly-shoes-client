<template>
    <DxChart v-if="dataSource.length > 0" id="chart" :data-source="dataSource">
        <DxCommonSeriesSettings argument-field="state" type="bar" hover-mode="allArgumentPoints"
            selection-mode="allArgumentPoints">
            <DxLabel :visible="true">
                <DxFormat :precision="0" type="fixedPoint" />
            </DxLabel>
        </DxCommonSeriesSettings>
        <DxSeries argument-field="Title" value-field="Total" type="bar" color="teal" width="80" :name="title" />
        <DxScrollBar :height="5" />
        <DxLegend vertical-alignment="bottom" horizontal-alignment="center" />

        <DxExport :enabled="true" />
    </DxChart>

    <div class="w-100pc mt-120 flex-center" v-if="dataSource.length == 0">Không có dữ liệu</div>
</template>

<script setup lang="ts">
import {
  DxChart,
  DxCommonSeriesSettings,
  DxExport,
  DxLegend,
  DxScrollBar,
  DxSeries,
} from "devextreme-vue/chart";
import type { DataAnalyst } from "../Overview.vue";

const prop = withDefaults(defineProps<{
    dataSource:DataAnalyst[],
    title:string
}>(),{})

</script>

<style scoped></style>