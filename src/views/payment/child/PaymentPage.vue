<template>
    <DxPopup v-bind="config">
        <template #content>
            <div class="font-18 font-weight-600 mb-32">
                Đơn hàng của bạn đã được tạo với phương thức thanh toán mặc định là thanh toán khi nhận hàng. Bạn có thể
                thanh toán online ngay tại đây
            </div>

            <div class="font-weight-600 mb-4">Chọn phương thức thanh toán</div>
            <DxRadioGroup display-expr="Text" value-expr="Value" layout="horizontal" :data-source="paymentMethods"
                v-model="paymentMethod">

            </DxRadioGroup>

            <div v-if="paymentMethod == PaymentMethod.VNPay" class="font-weight-600 mb-4 mt-20">Loại thẻ thanh toán</div>
            <DxRadioGroup v-if="paymentMethod == PaymentMethod.VNPay" display-expr="Text" value-expr="Value"
                layout="horizontal" :data-source="cardOptions" v-model="cartOption">
            </DxRadioGroup>

            <div class="footer align-center dis-flex jus-flex-end p-20">
                <FSButton :is-loading="isLoading" :config="{ text: 'Xác nhận', type: 'default', stylingMode: 'contained',onClick:confirmPaymentMethod }"></FSButton>
            </div>
        </template>
    </DxPopup>
</template>

<script setup lang="ts">
import { OrderShoes } from '@/models';
import { DxPopup } from "devextreme-vue/popup";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DxRadioGroup from "devextreme-vue/radio-group";
import { PaymentMethod } from '@/enums';
import { FSButton } from '@/components/controls';
import VNPayService from '@/apis/vnpay-api';
import { useManagementStore } from '@/stores';

enum CartOption {
    InArea = 1,
    International = 2,
}

const props = withDefaults(defineProps<{
    orderShoes: OrderShoes
}>(), {
    orderShoes: () => new OrderShoes()
});

const paymentMethod = ref<PaymentMethod>(PaymentMethod.ReceiveProduct);
const cartOption = ref<CartOption>(CartOption.InArea)

const paymentMethods = ref<
    {
        Text: string;
        Value: PaymentMethod;
    }[]
>([
    {
        Text: "Thanh toán khi nhận hàng",
        Value: PaymentMethod.ReceiveProduct,
    },
    {
        Text: "Thanh toán online",
        Value: PaymentMethod.VNPay,
    },
]);

const cardOptions = ref<
    {
        Text: string;
        Value: CartOption;
    }[]
>([
    {
        Text: "ATM-Tài khoản ngân hàng nội địa",
        Value: CartOption.InArea,
    },
    {
        Text: "Thanh toán qua thẻ quốc tế",
        Value: CartOption.International,
    },
]);

const router = useRouter();
const vnPayService = new VNPayService();
const managementStore = useManagementStore();
const isLoading = ref<boolean>(false);

const config = ref<DxPopup>({
    dragEnabled: true,
    visible: true,
    width: 400,
    height: 'auto',
    onHidden: () => router.back(),
    showCloseButton: true,
    title: "Chọn phương thức thanh toán",
    wrapperAttr:{class:"payment-method-wrapper"},
    onHiding:() => {
        managementStore.showSuccess("Đặt hàng thành công !");
        router.push("/shoes");
    }
});

const confirmPaymentMethod = async () => {
    isLoading.value = true;
    if(paymentMethod.value == PaymentMethod.ReceiveProduct){
        router.push("/shoes")
    }else{
        props.orderShoes.BankCode = cartOption.value == CartOption.InArea ? "VNBANK" : "INTCARD";
        try {
            var res = await vnPayService.getURLRedirect(props.orderShoes);
            window.open(res,"_blank");
            router.push("/shoes")
        } catch (error) {
            managementStore.showError();
        }
    }
    isLoading.value = false;
    managementStore.showSuccess("Đặt hàng thành công !");
}
</script>

<style lang="scss">
.payment-method-wrapper {
    .dx-popup-content {
        padding-bottom: 120px !important;
    }
    .dx-overlay-content {
        position: relative;


        .footer {
            position: absolute;
            width: 100%;
            height: 56px;
            background-color: rgb(233, 233, 233);
            left: 0;
            bottom: 0;
        }
    }
}
</style>