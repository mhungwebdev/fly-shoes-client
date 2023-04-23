<template>
  <div class="profile-container">
    <div class="font-20 font-weight-600 mt-80">
      Xin chào : {{ userStore.currentUser?.FullName }}
    </div>

    <div class="mt-40 content p-16 br-4">
      <div class="dis-flex font-16 tab-header pos-relative">
        <div @click="currentTab = Tab.Info" :class="currentTab == Tab.Info && 'active'" class="mr-20 cursor-pointer">
          Thông tin cá nhân
        </div>
        <div @click="currentTab = Tab.Order" :class="currentTab == Tab.Order && 'active'" class="cursor-pointer">
          Đơn hàng
        </div>
        <div :class="currentTab == Tab.Info ? 'info' : 'order'" class="line pos-absolute"></div>
      </div>

      <div v-show="currentTab == Tab.Info" class="mt-32 pos-relative">
        <div class="mt-16 dis-flex align-center">
          <div class="mr-20 font-weight-600">Họ tên:</div>
          <div v-if="!isEdit">{{ userStore.currentUser?.FullName }}</div>
          <FSTextBox ref="fullNameRef" v-if="isEdit" v-model="user.FullName"></FSTextBox>
        </div>

        <div class="mt-16 dis-flex align-center">
          <div class="mr-20 font-weight-600">Email:</div>
          <div v-if="userStore.currentUser?.Email || !isEdit">
            {{ userStore.currentUser?.Email || "--" }}
          </div>
          <FSTextBox ref="emailRef" v-if="isEdit && !userStore.currentUser?.Email" v-model="user.Email"></FSTextBox>
        </div>

        <div class="mt-16 dis-flex align-center">
          <div class="mr-20 font-weight-600">Địa chỉ:</div>
          <div>
            {{ isEdit ? user.Address : userStore.currentUser?.Address || "--" }}
          </div>
        </div>

        <div v-if="isEdit" class="mt-8 dis-flex">
          <DxSelectBox :data-source="cities" class="flex-1" noDataText="Không có dữ liệu" placeholder="Chọn thành phố"
            displayExpr="name" :searchEnabled="true" v-model="citySelected"></DxSelectBox>
          <DxSelectBox class="flex-1 ml-16 mr-16" noDataText="Không có dữ liệu" placeholder="Chọn quận/huyện"
            displayExpr="name" :searchEnabled="true" v-model="districtSelected" :data-source="districts"
            :disabled="citySelected == undefined"></DxSelectBox>
          <DxSelectBox class="flex-1" noDataText="Không có dữ liệu" placeholder="Chọn phường/xã" displayExpr="name"
            :searchEnabled="true" v-model="wardSelected" :data-source="wards" :disabled="districtSelected == undefined">
          </DxSelectBox>
        </div>

        <div class="mt-16 dis-flex align-center">
          <div class="mr-20 font-weight-600">Số điện thoại:</div>
          <div v-if="!isEdit">{{ userStore.currentUser?.Phone || "--" }}</div>
          <FSTextBox v-if="isEdit" v-model="user.Phone"></FSTextBox>
        </div>

        <div class="mt-16 dis-flex align-center">
          <div class="mr-20 font-weight-600">
            Nhận email khi có sản phẩm mới
          </div>
          <DxCheckBox :disabled="true" :value="userStore.currentUser?.ReceiveEmail"></DxCheckBox>
        </div>

        <div class="pos-absolute action-group dis-flex align-center">
          <FSButton v-if="!isEdit" class="mr-16" :config="{
              text: 'Sửa',
              type: 'default',
              stylingMode: 'outlined',
              onClick: () => (isEdit = true),
            }"></FSButton>
          <FSButton v-if="isEdit" :config="{
              text: 'Hủy',
              type: 'normal',
              stylingMode: 'outlined',
              onClick: () => (isEdit = false),
            }"></FSButton>
          <FSButton v-if="isEdit" :is-loading="isLoadingButton" class="mr-16 ml-16" :config="{
              text: 'Lưu',
              type: 'default',
              stylingMode: 'contained',
              onClick: saveEditUser,
            }"></FSButton>
          <FSButton v-if="!isEdit && userStore.currentUser?.IsUsePassword" :config="{
              text: 'Đổi mật khẩu',
              type: 'default',
              stylingMode: 'contained',
              onClick: changePassword
            }"></FSButton>
        </div>
      </div>

      <div class="mt-40" v-show="currentTab == Tab.Order">
        <DxDataGrid :allowColumnResizing="true" :columnResizingMode="'widget'" :showColumnLines="false"
          :showBorders="false" :width="'100%'" :noDataText="'Bạn chưa có đơn hàng nào'" :data-source="orders">
          <DxColumn :width="160" :data-field="'ReceiverName'" :allow-sorting="false" :caption="'Tên người nhận'">
          </DxColumn>

          <DxColumn :width="160" :data-field="'ReceiverPhone'" :allow-sorting="false" :caption="'Số điện thoại'">
          </DxColumn>

          <DxColumn :width="280" :data-field="'ReceiverAddress'" :allow-sorting="false" :caption="'Địa chỉ'">
          </DxColumn>

          <DxColumn :width="160" :data-field="'CreatedDate'" :allow-sorting="false" :caption="'Ngày tạo'"
            cellTemplate="createdTemplate">
          </DxColumn>

          <DxColumn :width="200" :data-field="'PaymentMethod'" :allow-sorting="false" alignment="left"
            :caption="'Phương thức thanh toán'" cellTemplate="paymentMethodTemplate">
          </DxColumn>

          <DxColumn :width="160" :data-field="'PaymentStatus'" :allow-sorting="false" alignment='left'
            :caption="'Trạng thái thanh toán'" cellTemplate="paymentStatusTemplate">
          </DxColumn>

          <DxColumn :width="160" :data-field="'Status'" :allow-sorting="false" :caption="'Trạng thái'"
            cellTemplate="statusTemplate" alignment="center">
          </DxColumn>

          <DxColumn :width="160" :data-field="'TotalBill'" :allow-sorting="false" :caption="'Tổng hóa đơn'"
            cellTemplate="totalBillTemplate">
          </DxColumn>

          <template #createdTemplate="{ data }">
            <div>{{ formattedDate(data.value) }}</div>
          </template>

          <template #totalBillTemplate="{ data }">
            <div class="text-red">
              {{
                data.value.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}
            </div>
          </template>

          <template #statusTemplate="{ data }">
            <div class="text-white order-cancel" v-if="data.value == OrderStatus.Cancel">
              Đã hủy
            </div>
            <div class="text-white order-confirm" v-if="data.value == OrderStatus.Confirm">
              Đã xác nhận
            </div>
            <div class="text-white order-pending" v-if="data.value == OrderStatus.Pending">
              Đang chờ xác nhận
            </div>
            <div class="text-white order-success" v-if="data.value == OrderStatus.Success">
              Đơn hàng thành công
            </div>
          </template>

          <template #paymentMethodTemplate="{ data }">
            <div v-if="data.value == PaymentMethod.ReceiveProduct && data.data.Status != OrderStatus.Cancel">Thanh toán
              khi nhận hàng</div>
            <div v-if="data.value == PaymentMethod.VNPay && data.data.Status != OrderStatus.Cancel">Thanh toán online
            </div>

            <div v-if="data.data.Status == OrderStatus.Cancel">
              --
            </div>
          </template>

          <template #paymentStatusTemplate="{ data }">
            <div v-if="data.value && data.data.Status != OrderStatus.Cancel" class="text-green">Đã thanh toán</div>
            <div v-if="!data.value && data.data.Status != OrderStatus.Cancel" class="text-red">Chưa thanh toán</div>
            <div v-if="data.data.Status == OrderStatus.Cancel">--</div>
          </template>
        </DxDataGrid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserService } from "@/apis";
import AddressService from "@/apis/address-api";
import OrderShoesService from "@/apis/order-shoes-service";
import { formattedDate } from "@/common/functions";
import { validateEmail } from "@/common/functions/validate-function";
import { FSButton, FSTextBox } from "@/components/controls";
import { ModelState, OrderStatus, PaymentMethod } from "@/enums";
import { City, District, OrderShoes, User, Ward } from "@/models";
import { useManagementStore, useUserStore } from "@/stores";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import DxCheckBox from "devextreme-vue/check-box";
import DxDataGrid, { DxColumn } from "devextreme-vue/data-grid";
import DxSelectBox from "devextreme-vue/select-box";
import { onMounted, ref, watch } from "vue";

enum Tab {
  Info = 1,
  Order,
}

const isEdit = ref<boolean>(false);
const user = ref<User>(new User());
const cities = ref<City[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);
const citySelected = ref<City>();
const districtSelected = ref<District>();
const wardSelected = ref<Ward>();
const addressSV = new AddressService();
const managementStore = useManagementStore();
const userSV = new UserService();

const fullNameRef = ref<InstanceType<typeof FSTextBox>>();
const emailRef = ref<InstanceType<typeof FSTextBox>>();
const currentTab = ref<Tab>(Tab.Info);
const userStore = useUserStore();
const isLoadingButton = ref<boolean>(false);
const orderSV = new OrderShoesService();

const orders = ref<OrderShoes[]>([]);

onMounted(async () => {
  if (userStore.currentUser) {
    user.value = JSON.parse(JSON.stringify(userStore.currentUser));
  }

  var res = await addressSV.getCity();
  if (res && res.Success && res.Data) {
    cities.value = res.Data;
  }

  try {
    var res = await orderSV.getOrderByUser();
    if (res && res.Success) {
      orders.value = res.Data;
    } else {
      managementStore.showError();
    }
  } catch (error) {
    managementStore.showError();
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

watch([citySelected, districtSelected, wardSelected], () => {
  const city = citySelected.value?.name ? citySelected.value.name : "";
  const district = districtSelected.value?.name
    ? districtSelected.value.name + " - "
    : "";
  const ward = wardSelected.value?.name ? wardSelected.value.name + " - " : "";

  user.value.Address = `${ward}${district}${city}`;
});

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

const changePassword = async () => {
  const _auth = getAuth();
  if (userStore.currentUser) {
    await sendPasswordResetEmail(_auth, userStore.currentUser?.Email);
  }
  managementStore.showSuccess("Kiểm tra mail của bạn nhé ❤️");
};

const validate = (): boolean => {
  if (!user.value.FullName) {
    managementStore.showWaring("Vui lòng nhập họ tên !");
    fullNameRef.value?.focusInput();
    return false;
  }

  if (!user.value.Email) {
    managementStore.showWaring("Vui lòng nhập email !");
    fullNameRef.value?.focusInput();
    return false;
  }

  if (user.value.Email && !validateEmail(user.value.Email)) {
    managementStore.showWaring("Email sai định dạng !");
    fullNameRef.value?.focusInput();
    return false;
  }

  return true;
};

const saveEditUser = async () => {
  if (validate()) {
    try {
      isLoadingButton.value = true;
      user.value.State = ModelState.Update;
      var res = await userSV.save(user.value);
      if (res && res.Success) {
        managementStore.showSuccess("Sửa thành công !");
        userStore.currentUser = user.value;
        isEdit.value = false;
      } else {
        managementStore.showError();
      }
    } catch (error) {
      managementStore.showError();
    }
    isLoadingButton.value = false;
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  .content {
    background-color: white;
    box-shadow: 0px 6px 16px -2px #9e9e9e;

    .tab-header {
      border-bottom: 1px solid #ddd;
      padding-bottom: 16px;

      div:not(.line) {
        padding: 4px;
        transition: all 0.3s linear;
      }

      .active {
        background-color: rgb(95, 194, 255);
        color: white;
        border-radius: 4px;
      }
    }

    .line {
      height: 3px;
      width: 136px;
      background-color: rgb(95, 194, 255);
      bottom: 0px;
      left: 0px;
      transition: all 0.3s ease-in-out;
    }

    .line.info {
      width: 136px;
    }

    .line.order {
      width: 78px;
      left: 154px;
    }

    .action-group {
      top: -20px;
      right: 0;
    }
  }

  .order-confirm {
    background-color: rgb(23, 104, 255);
  }

  .order-pending {
    background-color: rgb(235, 229, 58);
  }

  .order-cancel {
    background-color: rgb(161, 0, 0);
  }

  .order-success {
    background-color: rgb(2, 155, 2);
  }
}
</style>
