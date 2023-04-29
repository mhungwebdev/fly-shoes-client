<template>
  <div class="login dis-flex flex-column align-center m-16 flex-1 jus-center">
    <div class="title font-32 font-weight-700 mb-40">Đăng nhập</div>
    <form @keydown.enter="login">
      <FSTextBox
        ref="fsTextBox"
        v-model="email"
        :is-focused="true"
        :config="{
          mode: 'email',
          label: 'Email',
          labelMode: 'floating',
          placeholder: 'Nhập email',
          width: 300,
          elementAttr: { class: 'mb-16' },
        }"
      />
  
      <FSTextBox
        v-model="password"
        :config="{
          mode: 'password',
          label: 'Mật khẩu',
          labelMode: 'floating',
          placeholder: 'Nhập mật khẩu',
          width: 300
        }"
      />
  
      <div class="dis-flex w-100pc mt-28">
        <FSButton
          :is-loading="isLoadingLogin"
          :config="{
            text: 'Đăng nhập',
            stylingMode: 'contained',
            type: 'default',
            elementAttr: { class: 'mr-12' },
            onClick: login,
          }"
        />
        <div class="button-social-group dis-flex">
          <FSButton
            :config="{
              icon: 'icon-facebook',
              elementAttr: { class: 'mr-4' },
              stylingMode: 'outlined',
              type: 'default',
              onClick:() => loginWithSocial(SocialType.Facebook),
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
      </div>
    </form>

    <div class="mb-32 dis-flex mt-20 text-left w-100pc">
      <div @click="forgotPassWord" class="cursor-pointer text-primary text-under-line">Quên mật khẩu</div>
    </div>

    <div class="pos-absolute text-red" style="bottom: 20px;">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import UserService from "@/apis/user-service";
import { validateEmail } from "@/common/functions/validate-function";
import { FSButton, FSTextBox } from "@/components/controls";
import { SocialType } from "@/enums";
import { fbProvider, ggProvider } from "@/firebase";
import { User } from "@/models";
import { useManagementStore, useUserStore } from "@/stores";
import {
getAuth,
sendPasswordResetEmail,
signInWithEmailAndPassword,
signInWithPopup
} from "@firebase/auth";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth();
const email = ref<string>("");
const password = ref<string>("");
const $router = useRouter();
const userService = new UserService();
const userStore = useUserStore();

const fsTextBox = ref<InstanceType<typeof FSTextBox>>();
const isLoadingLogin = ref<boolean>(false);
const errorMessage = ref<String>();
const managementStore = useManagementStore();

const focusFirstInput = () => {
  fsTextBox.value?.focusInput();
};

defineExpose({
  focusFirstInput,
});

const isLogin = computed(() => {
  return !(email.value == "" || password.value == "");
});

const forgotPassWord = async () => {
  if(email.value == "" && !validateEmail(email.value)){
    managementStore.showWaring("Vui lòng nhập email để nhận mail lấy lại mật khẩu.");
    return;
  }
  const _auth = getAuth();
  await sendPasswordResetEmail(_auth,email.value);
  managementStore.showSuccess("Kiểm tra mail của bạn nhé ❤️")
}

/**
 * đăng nhập với email và mật khẩu
 */
const login = async () => {
  if (isLogin.value) {
    if(!validateEmail(email.value)){
      return errorMessage.value = "Email không đúng định dạng"
    }

    if (auth != null) {
      isLoadingLogin.value = true;
      try{
        const userCredentials = await (await signInWithEmailAndPassword(auth, email.value, password.value)).user;
        const result = await userService.getByField("FirebaseID",userCredentials.uid);
        if(result.Success && result.Data){
          userStore.currentUser = result.Data[0];
          userStore.getCartDetail();
          if(!managementStore.urlBreak){
            userStore.currentUser?.IsAdmin ? $router.push("/admin/overview") : $router.push("/");
          }else{
            $router.push(managementStore.urlBreak);
            managementStore.urlBreak = "";
          }
        }
      }catch(e:any){
        console.log(e);
        isLoadingLogin.value = false;
        if(e && e.message && e.message == "Firebase: Error (auth/wrong-password)."){
          return errorMessage.value = "Sai mật khẩu";
        }

        if(e.message == "Firebase: Error (auth/user-not-found)."){
          return errorMessage.value = "Nguời dùng không tồn tại"
        }

        managementStore.showError();
      }
    }
  }
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
      userStore.getCartDetail();
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
.login {
  width: 300px;

  .title {
    color: var(--app-color-primary);
  }
}
</style>
