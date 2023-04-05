<template>
  <div
    :style="{ width: width + 'px', height: height + 'px' }"
    class="shoes-card-container br-4 dis-flex flex-column cursor-pointer"
  >
    <div
      :style="{ backgroundImage: `url(${shoes.ShoesImages.split(';')[0] || ImageDefault})` }"
      class="image br-4 flex-1 pos-relative"
    >
        <div class="button-group pos-absolute w-100pc h-100pc dis-flex flex-column align-center jus-center">
            <FSButton class="mb-8" :config="{text:'Mua ngay',type:'default',stylingMode:'contained',width:160}"></FSButton>
            <FSButton :config="{text:'Thêm vào giỏ hàng',width:160}"></FSButton>
        </div>
    </div>
    <div class="dis-flex jus-space-between p-20">
      <div class="font-16 font-weight-600">{{ shoes.ShoesName || '[Tên giày]' }}</div>
      <div class="text-red">
        {{
          shoes.Price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })
        }}
      </div>
    </div>

    <div class="pl-20 pr-20 pb-20 info-detail">
        <div class="dis-flex jus-space-between mb-4">
            <div><b>Thương hiệu</b>: {{ shoes.BrandName }}</div>
            <div><b>Thể loại</b>: {{ shoes.CategoryName }}</div>
        </div>

        <div class="mb-4"><b>Số lượng có</b>: {{ quantity }}</div> 
        <div class="mb-4"><b>Màu sắc</b>: {{ colors }}</div>
        <div><b>Size</b>: {{ sizes }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FSButton } from "@/components/controls";
import { Shoes } from "@/models";
import { computed } from "vue";
import ImageDefault from "@/common/icons/image-default.jpg";

const props = withDefaults(
  defineProps<{
    shoes: Shoes;
    width?: number;
    height?: number;
  }>(),
  {
    shoes: () => new Shoes(),
    width: 400,
    height: 600,
  }
);

const quantity = computed(() => {
    return props.shoes.ShoesDetails.reduce((pre,cur) => pre + cur.Quantity,0);
});

const colors = computed(() => {
    const colorDetails:string[] = [];
    props.shoes.ShoesDetails.forEach(shoes => {
        if(!colorDetails.includes(shoes.ColorName)){
            colorDetails.push(shoes.ColorName);
        }
    });
    return colorDetails.join(";")
})

const sizes = computed(() => {
    const sizeDetails = props.shoes.ShoesDetails.map(shoes => shoes.SizeName);
    return sizeDetails.join(";")
})
</script>

<style lang="scss" scoped>
.shoes-card-container {
  background-color: white;
  .image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .button-group {
        border-radius: 4px 4px 0px 0px;
        background-color: rgba(0,0,0,0.3);
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
