<template>
    <DxPopup v-bind="config">
        <template #title>
            <div class="font-20 font-weight-600">Chi tiết đơn hàng</div>
        </template>
        <template #content>
            <DxScrollView :width="600" :height="400">
                <div>
                    <OrderDetailPreview :orderDetail="orderDetail" v-for="(orderDetail, index) in orderDetails" :key="index">
                    </OrderDetailPreview>
                </div>
            </DxScrollView>

            <div class="footer align-center dis-flex jus-flex-end p-20">
                <FSButton class="mr-8" :config="{ text: 'Đóng', onClick: () => $emit('close') }"></FSButton>
            </div>
        </template>
    </DxPopup>
</template>

<script setup lang="ts">
import OrderDetailService from '@/apis/order-detail-service';
import { FSButton } from '@/components/controls';
import { useManagementStore } from '@/stores';
import { DxPopup, DxScrollView } from 'devextreme-vue';
import { ref, watch } from 'vue';
import OrderDetailPreview from './OrderDetailPreview.vue';
import type { OrderDetail } from '@/models';
const orderDetailSV = new OrderDetailService();
const managementStore = useManagementStore();

const prop = withDefaults(defineProps<{
    orderID: number
}>(), {

})

const orderDetails = ref<OrderDetail[]>([])

watch(
    () => prop.orderID,
    async () => {
        try {
            const res = await orderDetailSV.getByField("OrderID", prop.orderID);
            if (res && res.Success) {
                orderDetails.value = res.Data;
            } else {
                managementStore.showError();
            }
        } catch (error) {
            managementStore.showError();
            console.log(error);
        }
    },
    {
        immediate: true
    }
)

const emit = defineEmits(['close'])

const config = ref<DxPopup>({
    dragEnabled: true,
    width: 'auto',
    height: 'auto',
    visible: true,
    onHidden: () => emit('close'),
    showCloseButton: true,
    title: "Chi tiết đơn hàng",
    wrapperAttr: { class: "popup-voucher-form" }
});
</script>

<style scoped></style>