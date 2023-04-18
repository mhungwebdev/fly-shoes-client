<template>
  <div class="dis-flex jus-space-between shoes-in-payment">
    <div class="dis-flex">
      <div
        class="image br-4 mr-20"
        :style="{ backgroundImage: `url(${shoes.ShoesImages.split(';')[0]})` }"
      ></div>
      <div>
        <div class="dis-flex align-center mb-12">
          <div class="font-weight-600 font-18 mr-16">{{ shoes.ShoesName }}</div>
          <div class="op-7">SL có: {{ maxQuantity }}</div>
        </div>
        <div class="dis-flex align-center mb-8">
          <div class="mr-8">SL:</div>
          <DxNumberBox
            :max="maxQuantity"
            v-model="orderDetail.Quantity"
            :min="1"
          ></DxNumberBox>
        </div>
        <div class="dis-flex align-center mb-8">
          <div class="mr-8">Màu:</div>
          <DxSelectBox
            displayExpr="ColorName"
            valueExpr="ColorID"
            :data-source="colors"
            v-model="colorID"
          ></DxSelectBox>
        </div>
        <div class="dis-flex align-center mb-8">
          <div class="mr-8">Size:</div>
          <DxSelectBox
            :data-source="sizes"
            displayExpr="SizeName"
            valueExpr="SizeID"
            v-model="sizeID"
          ></DxSelectBox>
        </div>
      </div>
    </div>

    <div>
      <div
        :class="isUseVoucher && 'text-through-line op-5'"
        class="text-red text-right mb-8"
      >
        {{
          (shoes.Price * orderDetail.Quantity).toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })
        }}
      </div>
      <div v-if="isUseVoucher" class="text-red text-right mb-8">
        {{
          price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })
        }}
      </div>
      <div
        v-if="
          shoes.Voucher &&
          (orderDetail.VoucherID == shoes.VoucherID || !voucherIsUsed)
        "
      >
        <span class="mr-8">Sử dụng voucher</span
        ><DxCheckBox v-model="isUseVoucher"></DxCheckBox>
        <div class=" mt-8 back-red text-white p-4 br-4">
          <div>{{ shoes.Voucher.VoucherTitle }}</div>
          <div class="dis-flex font-12">
            <div>
              <div v-if="shoes.Voucher?.FormulaType == FormulaType.Percent">
                -{{ shoes.Voucher.VoucherValue }}%
              </div>
              <div v-if="shoes.Voucher?.FormulaType == FormulaType.Subtraction">
                -{{
                  shoes.Voucher.VoucherValue.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormulaType } from "@/enums";
import { OrderDetail, Shoes, ShoesDetail } from "@/models";
import DxCheckBox from "devextreme-vue/check-box";
import DxNumberBox from "devextreme-vue/number-box";
import DxSelectBox from "devextreme-vue/select-box";
import { computed, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    shoes: Shoes;
    voucherIsUsed?: boolean;
    modelValue?: OrderDetail;
    idVoucherUsed?: number[];
  }>(),
  {
    shoes: () => new Shoes(),
    voucherIsUsed: false,
    modelValue: () => new OrderDetail(),
    idVoucherUsed: () => [],
  }
);

const colorID = ref<number>();
const sizeID = ref<number>();
const orderDetail = ref<OrderDetail>(new OrderDetail());

const emit = defineEmits(["change-use-voucher", "total-money-change"]);

watch([colorID, sizeID], () => {
  const shoesDetail = props.shoes.ShoesDetails.find(
    (sd) => sd.SizeID == sizeID.value && sd.ColorID == colorID.value
  );

  if (shoesDetail) {
    orderDetail.value.ShoesDetailID = shoesDetail.ShoesDetailID;
  }
});

const maxQuantity = computed(() => {
  const shoesDetail = props.shoes.ShoesDetails.find(
    (sd) => sd.SizeID == sizeID.value && sd.ColorID == colorID.value
  );
  if (shoesDetail) {
    return shoesDetail.Quantity;
  }

  return 1;
});

const price = computed<number>(() => {
  const total = calcMoneyWithVoucher();

  return total;
});

const calcMoneyWithVoucher = () => {
  let p = props.shoes.Price;

  if (props.shoes.Voucher) {
    if (props.shoes.Voucher.FormulaType == FormulaType.Percent) {
      p = ((100 - props.shoes.Voucher.VoucherValue) / 100) * p;
    } else {
      p = p - props.shoes.Voucher.VoucherValue;
    }
  }

  const total = (orderDetail.value.Quantity - 1) * props.shoes.Price + p;
  return total;
};

const colors = computed(() => {
  if (sizeID.value) {
    const data: ShoesDetail[] = [];
    props.shoes.ShoesDetails.forEach((sd) => {
      if (
        sd.SizeID == sizeID.value &&
        data.find((dsd) => dsd.ColorID == sd.ColorID) == undefined
      ) {
        data.push(sd);
      }
    });
    return data;
  } else {
    const data: ShoesDetail[] = [];
    props.shoes.ShoesDetails.forEach((sd) => {
      if (data.find((dsd) => dsd.ColorID == sd.ColorID) == undefined) {
        data.push(sd);
      }
    });
    return data;
  }
});

const sizes = computed(() => {
  if (colorID.value) {
    const data: ShoesDetail[] = [];
    props.shoes.ShoesDetails.forEach((sd) => {
      if (
        sd.ColorID == colorID.value &&
        data.find((dsd) => dsd.SizeID == sd.SizeID) == undefined
      ) {
        data.push(sd);
      }
    });
    return data;
  } else {
    const data: ShoesDetail[] = [];
    props.shoes.ShoesDetails.forEach((sd) => {
      if (data.find((dsd) => dsd.SizeID == sd.SizeID) == undefined) {
        data.push(sd);
      }
    });
    return data;
  }
});

const isUseVoucher = ref<boolean>(false);

watch(isUseVoucher, () => {
  if (isUseVoucher.value) {
    orderDetail.value.VoucherID = props.shoes.VoucherID;
  } else {
    orderDetail.value.VoucherID = null;
  }
  emit("change-use-voucher", isUseVoucher.value, props.shoes.VoucherID);
});

onMounted(() => {
  colorID.value = props.shoes.ShoesDetails[0].ColorID;
  sizeID.value = props.shoes.ShoesDetails[0].SizeID;
  orderDetail.value.ShoesDetailID = props.shoes.ShoesDetails[0].ShoesDetailID;
  orderDetail.value.ShoesID = props.shoes.ShoesDetails[0].ShoesID;
  orderDetail.value.TotalMoney = props.shoes.Price;
});

watch([() => orderDetail.value.Quantity, isUseVoucher], () => {
  let total = props.shoes.Price*orderDetail.value.Quantity;
  if(isUseVoucher.value){
    total = calcMoneyWithVoucher();
  }

  orderDetail.value.TotalMoney = total;
  emit("total-money-change", props.shoes.ShoesID,total);
});

defineExpose({
  orderDetail,
});
</script>

<style lang="scss" scoped>
.shoes-in-payment {
  .image {
    width: 160px;
    height: 160px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
