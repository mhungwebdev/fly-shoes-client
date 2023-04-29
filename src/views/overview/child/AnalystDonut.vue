<template>
    <DxPieChart v-if="dataSource.length > 0" id="pie" :data-source="dataSource" type="doughnut">
        <DxSeries argument-field="Title" value-field="Total">
            <DxLabel :visible="true" :customize-text="customizeText">
                <DxConnector :visible="true" />
            </DxLabel>
        </DxSeries>
        <DxExport :enabled="true" />
        <DxLegend :visible="false" :margin="0" horizontal-alignment="center" vertical-alignment="bottom" />
    </DxPieChart>

    <div class="w-100pc mt-120 flex-center" v-if="dataSource.length == 0">Không có dữ liệu</div>
</template>

<script setup lang="ts">
import DxPieChart, {
    DxLegend,
    DxSeries,
    DxLabel,
    DxConnector,
    DxExport,
} from 'devextreme-vue/pie-chart';
import type { DataAnalyst } from '../Overview.vue';

const prop = withDefaults(defineProps<{
    dataSource: DataAnalyst[],
    title: string
}>(), {})

const customizeText = ({ argument, value }: any) => {
    return `${argument}: ${value.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
    })}`;
}
</script>

<style scoped></style>