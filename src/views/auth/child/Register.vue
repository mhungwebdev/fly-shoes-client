<template>
  <div class="register dis-flex flex-column align-center m-16 flex-1 jus-center">
    <div class="title font-32 font-weight-700 mb-24">Đăng ký</div>
    <form @keydown.enter="register">
      <FSTextBox
        v-model="fullName"
        :is-focused="firstFocus"
        ref="fsTextBox"
        :config="{
          label: 'Họ tên',
          labelMode: 'floating',
          placeholder: 'Nhập họ tên',
          width: 300,
          elementAttr: { class: 'mb-4' },
        }"
      />
      <FSTextBox
        v-model="email"
        :config="{
          mode: 'email',
          label: 'Email',
          labelMode: 'floating',
          placeholder: 'Nhập email',
          width: 300,
          elementAttr: { class: 'mb-4' },
        }"
      />
  
      <FSTextBox
        v-model="password"
        :config="{
          mode: 'password',
          label: 'Mật khẩu',
          labelMode: 'floating',
          placeholder: 'Nhập mật khẩu',
          validationMessageMode: 'always',
          width: 300,
          elementAttr: { class: 'mb-4' },
        }"
      />
  
      <FSTextBox
        v-model="confirmPassword"
        :config="{
          mode: 'password',
          label: 'Nhập lại mật khẩu',
          labelMode: 'floating',
          placeholder: 'Nhập lại mật khẩu',
          validationMessageMode: 'always',
          width: 300,
          elementAttr: { class: 'mb-20' },
        }"
      />
  
      <div class="dis-flex w-100pc jus-flex-end">
        <div class="button-social-group dis-flex mr-12">
          <FSButton
            :config="{
              icon: 'icon-facebook',
              elementAttr: { class: 'mr-4' },
              stylingMode: 'outlined',
              type: 'default',
              onClick: () => loginWithSocial(SocialType.Facebook),
            }"
          />
          <FSButton
            :config="{
              icon: 'icon-google',
              elementAttr: { class: 'ml-4' },
              stylingMode: 'outlined',
              type: 'default',
              onClick: () => loginWithSocial(SocialType.Google),
            }"
          />
        </div>
  
        <FSButton
          :is-loading="isLoadingRegister"
          :config="{
            text: 'Đăng ký',
            stylingMode: 'contained',
            type: 'default',
            onClick: register,
          }"
        />
      </div>
    </form>

    <div class="pos-absolute text-red" style="bottom: 20px">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import UserService from "@/apis/user-service";
import { FSButton, FSTextBox } from "@/components/controls";
import { SocialType } from "@/enums";
import { fbProvider, ggProvider } from "@/firebase";
import { User } from "@/models";
import { useManagementStore, useUserStore } from "@/stores";
import {
createUserWithEmailAndPassword,
getAuth,
signInWithPopup
} from "@firebase/auth";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";
const errorMessage = ref<String>();

const props = withDefaults(
  defineProps<{
    firstFocus: boolean;
  }>(),
  {
    firstFocus: false,
  }
);

const fsTextBox = ref<InstanceType<typeof FSTextBox>>();

const focusFirstInput = () => {
  fsTextBox.value?.focusInput();
};

defineExpose({
  focusFirstInput,
});

const auth = useFirebaseAuth();
const email = ref<string>("");
const password = ref<string>("");
const fullName = ref<string>("");
const confirmPassword = ref<string>("");
const $router = useRouter();
const userService = new UserService();
const userStore = useUserStore();
const managementStore = useManagementStore();

const isValidRegister = computed(() => {
  if (
    email.value == "" ||
    password.value == "" ||
    confirmPassword.value == "" ||
    fullName.value == ""
  )
    return false;
  if (password.value != confirmPassword.value) return false;

  return true;
});

const isLoadingRegister = ref<boolean>(false);

const register = async () => {
  if (!isValidRegister.value || !auth) {
    managementStore.showWaring("Vui lòng nhập đầy đủ thông tin !");
    return;
  }

  isLoadingRegister.value = true;
  try {
    var userCredentials = await (
      await createUserWithEmailAndPassword(auth, email.value, password.value)
    ).user;
    const userRegister = new User();
    userRegister.Email = email.value;
    userRegister.FirebaseID = userCredentials.uid;
    userRegister.FullName = fullName.value;

    const result = await userService.start(userRegister);
    if (result.Success && result.Data) {
      userStore.currentUser = result.Data[0];
      if(managementStore.urlBreak){
        $router.push(managementStore.urlBreak);
        managementStore.urlBreak = "";
      }else{
        userStore.currentUser?.IsAdmin
          ? $router.push("/admin/overview")
          : $router.push("/");
      }
    }
  } catch (e: any) {
    if (
      e &&
      e.message &&
      e.message == "Firebase: Error (auth/email-already-in-use)."
    ) {
      isLoadingRegister.value = false;
      return (errorMessage.value = "Email đã được sử dụng !");
    }
    
    managementStore.showError();
    isLoadingRegister.value = false;
  }
  isLoadingRegister.value = false;
};

const loginWithSocial = async (socialType: SocialType) => {
  try {
    const auth = getAuth();
    const provider =
      socialType == SocialType.Facebook ? fbProvider : ggProvider;
    const userCredentials = await (await signInWithPopup(auth, provider)).user;
    const user = new User();
    user.Email = userCredentials.email || "";
    user.FirebaseID = userCredentials.uid;
    user.FullName = userCredentials.displayName || "Khách hàng";

    const result = await userService.startWithSocial(user);
    if (result.Success && result.Data) {
      userStore.currentUser = result.Data[0];
      if(managementStore.urlBreak){
        $router.push(managementStore.urlBreak);
        managementStore.urlBreak = "";
      }else{
        userStore.currentUser?.IsAdmin
          ? $router.push("/admin/overview")
          : $router.push("/");
      }
    }
  } catch (error) {
    managementStore.showError();
  }
};
</script>

<style lang="scss" scoped>
.register {
  width: 300px;
  .title {
    color: var(--app-color-primary);
  }
}
</style>
