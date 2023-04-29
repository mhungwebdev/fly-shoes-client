<template>
  <div class="dis-flex jus-space-between order-detail-container">
    <div class="dis-flex">
      <div class="image br-4 mr-20" :style="{ backgroundImage: `url(${shoes.ShoesImages.split(';')[0]})` }"></div>
      <div>
        <div class="dis-flex mb-12">
          <div class="font-weight-600 font-18 mr-16">{{ shoes.ShoesName }}</div>
          <div class="op-7op-7 text-nowrap">SL mua: {{ orderDetail.Quantity }}</div>
        </div>
        <div class="dis-flex jus-space-between">
          <div>
            <div class="dis-flex align-center mb-8">
              <div class="mr-8">Màu: {{ shoesDetail.ColorName }}</div>
            </div>
            <div class="dis-flex align-center mb-8">
              <div class="mr-8">Size: {{ shoesDetail.SizeName }}</div>
            </div>
          </div>

          <div class="align-flex-end dis-flex flex-column">
            <div v-if="orderDetail.VoucherID" class="back-red br-4 h-40px p-4 text-white">
              Có sử dụng voucher
            </div>
            <div>Giá: <span class="text-red">{{ shoes.Price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            }) }}</span></div>
            <div>Tổng: <span class="text-red">{{ orderDetail.TotalMoney.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            }) }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoesDetailService from '@/apis/shoes-detail-service';
import ShoesService from '@/apis/shoes-service';
import { Shoes, type OrderDetail, ShoesDetail } from '@/models';
import { useManagementStore } from '@/stores';
import { ref, watch } from 'vue';

const shoesSV = new ShoesService();
const shoesDetailSV = new ShoesDetailService();
const managementStore = useManagementStore();

const prop = withDefaults(defineProps<{
  orderDetail: OrderDetail
}>(), {});

const shoes = ref<Shoes>(new Shoes());
const shoesDetail = ref<ShoesDetail>(new ShoesDetail());

watch(
  () => prop.orderDetail.OrderDetailID,
  async () => {
    try {
      var res = await shoesSV.getByField("ShoesID", prop.orderDetail.ShoesID);
      if (res && res.Success) {
        shoes.value = res.Data[0];
      } else {
        managementStore.showError();
      }
    } catch (error) {
      managementStore.showError();
    }
  }, {
  immediate: true
}
)

watch(
  () => prop.orderDetail.OrderDetailID,
  async () => {
    try {
      var res = await shoesDetailSV.getByField("ShoesDetailID", prop.orderDetail.ShoesDetailID);
      if (res && res.Success) {
        shoesDetail.value = res.Data[0];
      } else {
        managementStore.showError();
      }
    } catch (error) {
      managementStore.showError();
    }
  }, {
  immediate: true
}
)
</script>

<style lang="scss" scoped>
.order-detail-container {
  .image {
    width: 160px;
    min-width: 160px;
    height: 160px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>