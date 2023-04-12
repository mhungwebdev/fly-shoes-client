<template>
  <div
    :style="{
      width: width + 'px',
      height: height + 'px',
      minWidth: width + 'px',
    }"
    class="shoes-card-container p-10 br-4 dis-flex flex-column cursor-pointer"
  >
    <div
      :style="{
        backgroundImage: `url(${
          shoes.ShoesImages.split(';')[0] || ImageDefault
        })`,
      }"
      class="image br-4 flex-1 pos-relative"
    >
      <div
        class="button-group pos-absolute w-100pc h-100pc dis-flex flex-column align-center jus-center"
      >
        <FSButton
          class="mb-8"
          :config="{
            text: 'Mua ngay',
            type: 'default',
            stylingMode: 'contained',
            width: 160,
          }"
        ></FSButton>
        <FSButton
          :config="{ text: 'Thêm vào giỏ hàng', width: 160 }"
        ></FSButton>
      </div>
    </div>
    <div class="pt-20">
      <div :title="shoes.ShoesName" class="font-16 font-weight-600 shoes-name">
        {{ shoes.ShoesName || "[Tên giày]" }}
      </div>
      <div class="dis-flex jus-space-between">
        <div class="text-red" :class="shoes.Voucher ? 'text-through-line op-6' : ''">
          {{
            shoes.Price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })
          }}
        </div>
        <div class="text-red" v-if="shoes.Voucher">
          {{
            price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })
          }}
        </div>
      </div>
    </div>

    <div class="pt-20 pb-20 info-detail">
      <div class="dis-flex jus-space-between mb-4">
        <div><b>Thương hiệu</b>: {{ shoes.BrandName }}</div>
        <div><b>Thể loại</b>: {{ shoes.CategoryName }}</div>
      </div>

      <div v-if="isPreview" class="mb-4">
        <b>Số lượng có</b>: {{ quantity }}
      </div>
      <div v-if="isPreview" class="mb-4"><b>Màu sắc</b>: {{ colors }}</div>
      <div v-if="isPreview"><b>Size</b>: {{ sizes }}</div>
    </div>

    <div class="voucher font-10" v-if="shoes.Voucher">
      <div>{{ shoes.Voucher.VoucherTitle }}</div>
      <div v-if="shoes.Voucher.FormulaType == FormulaType.Percent">-{{ shoes.Voucher.VoucherValue }}%</div>
      <div v-if="shoes.Voucher.FormulaType == FormulaType.Subtraction">-{{ shoes.Voucher.VoucherValue.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FSButton } from "@/components/controls";
import { Shoes } from "@/models";
import { computed } from "vue";
import ImageDefault from "@/common/icons/image-default.jpg";
import { FormulaType } from "@/enums";

const props = withDefaults(
  defineProps<{
    shoes: Shoes;
    width?: number;
    height?: number;
    isPreview?: boolean;
  }>(),
  {
    shoes: () => new Shoes(),
    width: 400,
    height: 600,
    isPreview: true,
  }
);

const price = computed<number>(() => {
  let p = props.shoes.Price;

  if(props.shoes.Voucher && props.shoes.Voucher.FormulaType == FormulaType.Percent){
    p = (100 - props.shoes.Voucher.VoucherValue)/100 * p;
  }

  return p;
})

const quantity = computed(() => {
  return props.shoes.ShoesDetails.reduce((pre, cur) => pre + cur.Quantity, 0);
});

const colors = computed(() => {
  const colorDetails: string[] = [];
  props.shoes.ShoesDetails.forEach((shoes) => {
    if (!colorDetails.includes(shoes.ColorName)) {
      colorDetails.push(shoes.ColorName);
    }
  });
  return colorDetails.join(";");
});

const sizes = computed(() => {
  const sizeDetails = props.shoes.ShoesDetails.map((shoes) => shoes.SizeName);
  return sizeDetails.join(";");
});
</script>

<style lang="scss" scoped>
.shoes-card-container {
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  position: relative;
  .voucher {
    position: absolute;
    background: red;
    right: -8px;
    color: white;
    padding: 4px;
    top: 20px;
    height: 32px;
    max-height: 32px;
    box-shadow: 2px 3px 10px 0px grey;
    &::before {
      content: "";
      position: absolute;
      border-width: 16px;
      border-style: solid;
      border-color: red;
      right: 100%;
      border-left-color: transparent;
      top: 0px;
    }

    &::after {
      content: "";
      position: absolute;
      border-width: 3px;
      border-style: solid;
      border-color: rgb(106, 0, 0);
      right: 3px;
      border-bottom-color: transparent;
      border-right-color: transparent;
      top: 100%;
    }
  }

  .shoes-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .button-group {
      border-radius: 4px 4px 0px 0px;
      background-color: rgba(0, 0, 0, 0.3);
      display: none;
      opacity: 0;
      transition: all 2s linear;
    }
  }

  .info-detail {
    display: none;
    transition: all 2s linear;
  }

  &:hover {
    .info-detail {
      display: block;
    }

    .image .button-group {
      display: flex;
      opacity: 1;
    }
  }
}
</style>
