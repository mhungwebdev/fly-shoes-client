<template>
  <div class="payment-container">
    <div class="font-24 font-weight-700 mb-40">Thông tin đặt hàng</div>
    <div class="br-4 p-16 shoes-payment">
      <div :class="isLoading && 'dis-none'">
        <ShoesPayment
          @change-use-voucher="changeUseVoucher"
          ref="shoesPaymentRef"
          class="mb-20"
          v-for="(s, index) in shoes"
          :key="index"
          :shoes="s"
          @total-money-change="calcTotalBill"
          :voucher-is-used="
            idVoucherUsed.find((id) => id == s.VoucherID) != undefined
          "
        >
        </ShoesPayment>
        <div class="dis-flex mt-40 flex-column align-flex-end">
          <div class="mb-4 dis-flex">
            <div class="mr-16 font-weight-600">Phí ship:</div>
            <div class="text-red">
              {{ (30000).toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) }}
            </div>
          </div>
          <div class="dis-flex">
            <div class="mr-16 font-weight-600">Tổng:</div>
            <div class="text-red">
              {{
                totalBill.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading">
        <div class="dis-flex mb-20" v-for="(a, i) in [1, 2]">
          <ContentLoader
            :height="160"
            :width="160"
            class="mr-20"
          ></ContentLoader>
          <div class="dis-flex flex-column">
            <ContentLoader class="mb-8" :height="40"></ContentLoader>
            <ContentLoader :height="40"></ContentLoader>
          </div>
        </div>
      </div>
    </div>

    <div class="receiver-info p-16 mt-40 br-4">
      <div class="mb-16">
        <div class="mb-4 font-weight-600">
          Họ tên người nhận <span class="text-red">*</span>
        </div>
        <FSTextBox
          ref="receiverNameRef"
          v-model="order.ReceiverName"
        ></FSTextBox>
      </div>

      <div class="mb-16">
        <div class="mb-4 font-weight-600">
          Số điện thoại người nhận <span class="text-red">*</span>
        </div>
        <FSTextBox
          ref="receiverPhoneRef"
          v-model="order.ReceiverPhone"
        ></FSTextBox>
      </div>

      <div>
        <div class="mb-4 font-weight-600">
          Địa chỉ <span class="text-red">*</span>
        </div>
        <div class="dis-flex align-center jus-space-between">
          <DxSelectBox
            :data-source="cities"
            class="flex-1"
            noDataText="Không có dữ liệu"
            placeholder="Chọn thành phố"
            displayExpr="name"
            :searchEnabled="true"
            v-model="citySelected"
          ></DxSelectBox>
          <DxSelectBox
            class="flex-1 ml-16 mr-16"
            noDataText="Không có dữ liệu"
            placeholder="Chọn quận/huyện"
            displayExpr="name"
            :searchEnabled="true"
            v-model="districtSelected"
            :data-source="districts"
            :disabled="citySelected == undefined"
          ></DxSelectBox>
          <DxSelectBox
            class="flex-1"
            noDataText="Không có dữ liệu"
            placeholder="Chọn phường/xã"
            displayExpr="name"
            :searchEnabled="true"
            v-model="wardSelected"
            :data-source="wards"
            :disabled="districtSelected == undefined"
          ></DxSelectBox>
        </div>
        <FSTextBox
          ref="receiverAddressRef"
          v-model="order.ReceiverAddress"
          class="mt-8"
        ></FSTextBox>

        <div class="mt-40 dis-flex jus-flex-end">
          <FSButton
            class="mr-16"
            :config="{
              text: 'Hủy',
              type: 'default',
              stylingMode: 'outlined',
              onClick: () => $router.push('/shoes'),
            }"
          ></FSButton>
          <FSButton
            :is-loading="isLoadingBtn"
            :config="{
              text: 'Hoàn thành đặt hàng',
              type: 'default',
              stylingMode: 'contained',
              onClick: save,
            }"
          ></FSButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoesService from "@/apis/shoes-service";
import { ErrorCode, PaymentType } from "@/enums";
import {
  City,
  District,
  OrderDetail,
  OrderShoes,
  Ward,
  type Shoes,
} from "@/models";
import PayloadGetShoesPayment from "@/models/payload-get-shoes-payment";
import { useManagementStore, useUserStore } from "@/stores";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ShoesPayment from "./child/ShoesPayment.vue";
import { FSButton, FSTextBox } from "@/components/controls";
import DxSelectBox from "devextreme-vue/select-box";
import AddressService from "@/apis/address-api";
import { ContentLoader } from "vue-content-loader";
import { validatePhone } from "@/common/functions/validate-function";
import OrderShoesService from "@/apis/order-shoes-service";

const orderSV = new OrderShoesService();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const managementStore = useManagementStore();
const shoes = ref<Shoes[]>([]);
const order = ref<OrderShoes>(new OrderShoes());
const shoesSV = new ShoesService();
const shoesPaymentRef = ref<InstanceType<typeof ShoesPayment>>();
const idVoucherUsed = ref<number[]>([]);
const cities = ref<City[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);
const citySelected = ref<City>();
const districtSelected = ref<District>();
const wardSelected = ref<Ward>();
const addressSV = new AddressService();
const isLoading = ref<boolean>(false);
const isLoadingBtn = ref<boolean>(false);
const shoesMoney = ref<
  {
    id: number;
    money: number;
  }[]
>([]);

const receiverNameRef = ref<InstanceType<typeof FSTextBox>>();
const receiverPhoneRef = ref<InstanceType<typeof FSTextBox>>();
const receiverAddressRef = ref<InstanceType<typeof FSTextBox>>();

onMounted(async () => {
  try {
    var res = await addressSV.getCity();
    if (res && res.Success && res.Data) {
      cities.value = res.Data;
    } else {
      managementStore.showError();
    }
  } catch (error) {
    managementStore.showError();
  }

  if (userStore.currentUser?.FullName) {
    order.value.ReceiverName = userStore.currentUser.FullName;
  }

  if (userStore.currentUser?.Address) {
    order.value.ReceiverAddress = userStore.currentUser.Address;
  }
});

watch(
  citySelected,
  () => {
    districtSelected.value = undefined;
    wardSelected.value = undefined;
    getDistrict();
  },
  {
    deep: true,
  }
);

watch(
  districtSelected,
  () => {
    wardSelected.value = undefined;
    getWard();
  },
  {
    deep: true,
  }
);

const getDistrict = async () => {
  try {
    if (citySelected.value) {
      var res = await addressSV.getDistrictByCity(citySelected.value.code);
      if (res && res.Success && res.Data) {
        districts.value = res.Data;
      } else {
        managementStore.showError();
      }
    }
  } catch (error) {
    managementStore.showError();
  }
};

const getWard = async () => {
  try {
    if (districtSelected.value) {
      var res = await addressSV.getWardByDistrict(districtSelected.value.code);
      if (res && res.Success && res.Data) {
        wards.value = res.Data;
      } else {
        managementStore.showError();
      }
    }
  } catch (error) {
    managementStore.showError();
  }
};

const prepareForPayment = async (paymentType: PaymentType) => {
  let shoesIDs: any[] = [];
  switch (paymentType) {
    case PaymentType.Full:
      await userStore.getCartDetail();
      shoesIDs = userStore.cartDetails.map((c) => c.ShoesID);
      break;
    case PaymentType.One:
      let { id } = route.params;
      shoesIDs = [id];
      break;
    default:
      router.push("/shoes");
      break;
  }

  if (userStore.currentUser) {
    try {
      var payload = new PayloadGetShoesPayment();
      payload.ShoesIDs = shoesIDs as number[];
      payload.UserID = userStore.currentUser.UserID;

      var res = await shoesSV.getShoesForPayment(payload);
      if (res && res.Success && res.Data) {
        shoes.value = res.Data;
        shoes.value.forEach((s) => {
          shoesMoney.value.push({
            id: s.ShoesID,
            money: s.Price,
          });
        });
      } else {
        managementStore.showError();
      }
    } catch (error) {
      managementStore.showError();
    }
  } else {
    managementStore.urlBreak = route.fullPath;
    router.push("/login");
  }
};

const changeUseVoucher = (isUse: boolean, idVoucher: number) => {
  if (isUse) {
    idVoucherUsed.value.push(idVoucher);
  } else {
    idVoucherUsed.value = idVoucherUsed.value.filter((id) => id != idVoucher);
  }
};

const validate = (): boolean => {
  if (!order.value.ReceiverName) {
    receiverNameRef.value?.focusInput();
    managementStore.showWaring("Vui lòng nhập đầy đủ thông tin !");
    return false;
  }

  if (!order.value.ReceiverPhone) {
    receiverPhoneRef.value?.focusInput();
    managementStore.showWaring("Vui lòng nhập đầy đủ thông tin !");
    return false;
  }

  if (!order.value.ReceiverAddress) {
    receiverAddressRef.value?.focusInput();
    managementStore.showWaring("Vui lòng nhập đầy đủ thông tin !");
    return false;
  }

  if (!validatePhone(`${order.value.ReceiverPhone}`)) {
    managementStore.showWaring("Vui lòng nhập đúng số điện thoại !");
    receiverPhoneRef.value?.focusInput();
    return false;
  }

  return true;
};

const save = async () => {
  if (!validate()) {
    return;
  }

  if (Array.isArray(shoesPaymentRef.value)) {
    order.value.OrderDetails = [];
    shoesPaymentRef.value.forEach((ref) => {
      const orderDetail = (ref as InstanceType<typeof ShoesPayment>)
        .orderDetail;
      order.value.OrderDetails.push(orderDetail);
    });
  }

  order.value.TotalBill = totalBill.value;
  isLoadingBtn.value = true;
  try {
    var paymentType = route.name == PaymentType.Full ? 1 : 0;
    var res = await orderSV.order(paymentType, order.value);
    if(res && res.Success){
        userStore.getCartDetail();
        managementStore.showSuccess("Đặt hàng thành công !");
        router.push("/shoes")
    }else{
        if(res.ValidateInfo && res.ValidateInfo[0]){
            const error = res.ValidateInfo[0];
            if(error.ErrorCode == ErrorCode.ProductNotEnough){
                managementStore.showError("Số lượng sản phẩm không đủ")
            }else if(error.ErrorCode == ErrorCode.VoucherNotEnough){
                managementStore.showError("Đã hết voucher !");
            }else{
                managementStore.showError();
            }
        }
    }
  } catch (error) {
    managementStore.showError();
  }
  isLoadingBtn.value = false;
};

watch(
  route,
  async () => {
    if (route.name == PaymentType.Full || route.name == PaymentType.One) {
      isLoading.value = true;
      await prepareForPayment(route.name);
      isLoading.value = false;
    } else {
      router.push("/shoes");
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(shoes.value, () => {
  order.value.OrderDetails = [];
  shoes.value.forEach((s) => {
    const orderDetail = new OrderDetail();
    orderDetail.ShoesID = s.ShoesID;
    orderDetail.VoucherID = null;
    order.value.OrderDetails.push(orderDetail);
  });
});

watch([citySelected, districtSelected, wardSelected], () => {
  const city = citySelected.value?.name ? citySelected.value.name : "";
  const district = districtSelected.value?.name
    ? districtSelected.value.name + " - "
    : "";
  const ward = wardSelected.value?.name ? wardSelected.value.name + " - " : "";

  order.value.ReceiverAddress = `${ward}${district}${city}`;
});

const calcTotalBill = (id: number, money: number) => {
  const shoes = shoesMoney.value.find((s) => s.id == id);
  if (shoes) {
    shoes.money = money;
  }
};

const totalBill = computed(() => {
  return shoesMoney.value.reduce((pre, cur) => pre + cur.money, 0) + 30000;
});
</script>

<style lang="scss" scoped>
.payment-container {
  .shoes-payment {
    box-shadow: -3px 3px 21px 8px #ddd;
  }

  .receiver-info {
    box-shadow: -3px 3px 21px 8px #ddd;
  }
}
</style>
