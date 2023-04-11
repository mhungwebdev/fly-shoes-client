<template>
  <div class="footer-container w-100pc">
    <div class="form-receive-email flex-column-center">
      <div class="font-32 mb-8">Nhận thông báo khi có sản phẩm mới</div>
      <div :style="{ textAlign: 'center' }" class="w-40pc">
        Bạn sẽ nhận được thông báo khi chúng tôi có sản phẩm mới. Và bạn sẽ luôn
        là người sở hữu sản phẩm sớm nhất. Hãy đăng ký ngay nhé
      </div>

      <div class="dis-flex mt-20">
        <FSTextBox
          v-if="!userStore.currentUser?.Email"
          v-model="email"
          :config="{ placeholder: 'Email...', mode: 'email' }"
          class="mr-12"
        ></FSTextBox>
        <FSButton
          v-if="!userStore.currentUser?.ReceiveEmail"
          :is-loading="isLoadingButton"
          :config="{
            text: 'Đăng ký',
            type: 'default',
            onClick: registerReceiveEmail,
          }"
        ></FSButton>

        <FSButton
          v-if="userStore.currentUser?.ReceiveEmail"
          :is-loading="isLoadingButton"
          :config="{
            text: 'Hủy đăng ký',
            type: 'danger',
            onClick: unsubscribeReceiveEmail,
          }"
        ></FSButton>
      </div>
    </div>
    <div class="footer-content dis-flex jus-center pt-40">
      <div class="dis-flex text-white">
        <div class="mr-200 font-32 font-weight-900">Fly Shoes</div>

        <div class="dis-flex flex-1 ml-200 jus-space-between">
          <div>
            <div class="font-20 mb-20">Menu</div>
            <div class="mb-12 cursor-pointer">Trang chủ</div>
            <div class="mb-12 cursor-pointer">Sản phẩm</div>
            <div class="mb-12 cursor-pointer">Giới thiệu</div>
          </div>

          <div>
            <div class="font-20 mb-20">CATEGORY</div>
            <div
              class="mb-12 cursor-pointer"
              v-for="(category, index) in managementStore.categories"
              :key="index"
            >
              {{ category.CategoryName }}
            </div>
          </div>

          <div>
            <div class="font-20 mb-20">BRAND</div>
            <div
              v-for="(brand, index) in managementStore.brands"
              :key="index"
              class="mb-12 cursor-pointer"
            >
              {{ brand.BrandName }}
            </div>
          </div>

          <div>
            <div class="font-20 mb-20">FOLLOW</div>
            <div>Facebook</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserService from "@/apis/user-service";
import { validateEmail } from "@/common/functions/validate-function";
import { FSButton, FSTextBox } from "@/components/controls";
import type InfoUpdateField from "@/models/info-update-field";
import { useManagementStore, useUserStore } from "@/stores";
import { ref } from "vue";

const userStore = useUserStore();
const email = ref<string>(userStore.currentUser?.Email || "");
const managementStore = useManagementStore();
const userService = new UserService();
const isLoadingButton = ref<boolean>(false);

const registerReceiveEmail = async () => {
  if (!validateEmail(email.value)) {
    managementStore.showError("Email không đúng định dạng.");
    return;
  }

  if (!userStore.currentUser?.UserID) {
    managementStore.showError();
    return;
  }

  try {
    isLoadingButton.value = true;
    if (!userStore.currentUser?.Email) {
      const updateEmail: InfoUpdateField = {
        FieldName: "Email",
        FieldValue: email.value,
      };

      const res = await userService.updateSingleField(
        updateEmail,
        userStore.currentUser?.UserID
      );

      if (res && res.Success) {
        userStore.currentUser.Email = email.value;
      } else {
        managementStore.showError();
      }
    }

    const updateReceiveEmail: InfoUpdateField = {
      FieldName: "ReceiveEmail",
      FieldValue: true,
    };

    const res = await userService.updateSingleField(
      updateReceiveEmail,
      userStore.currentUser?.UserID
    );

    if (res && res.Success) {
      managementStore.showSuccess("Đăng kí thành công");
      userStore.currentUser.ReceiveEmail = true;
    } else {
      managementStore.showError();
    }
    isLoadingButton.value = false;
  } catch (error) {
    managementStore.showError();
    isLoadingButton.value = false;
  }
};

const unsubscribeReceiveEmail = async () => {
  try {
    if (!userStore.currentUser?.UserID) return;
    const updateReceiveEmail: InfoUpdateField = {
      FieldName: "ReceiveEmail",
      FieldValue: false,
    };

    const res = await userService.updateSingleField(
      updateReceiveEmail,
      userStore.currentUser?.UserID
    );

    if (res && res.Success) {
      managementStore.showSuccess("Hủy đăng kí thành công");
      userStore.currentUser.ReceiveEmail = false;
    } else {
      managementStore.showError();
    }
  } catch (error) {
    managementStore.showError();
  }
};
</script>

<style lang="scss" scoped>
.footer-container {
  height: 400px;
  width: 100%;
  min-height: 400px;

  .form-receive-email {
    height: 300px;
    background-color: #c5c5c5;
  }

  .footer-content {
    background-color: rgb(47, 47, 47);
    height: 400px;
  }

  .footer-content > div {
    width: 1200px;
  }
}
</style>
