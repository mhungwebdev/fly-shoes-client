<template>
  <div class="register dis-flex flex-column align-center p-16 flex-1">
    <div class="title font-32 font-weight-700 mb-24">Đăng ký</div>
    <FSTextBox
      v-model="email"
      :is-focused="firstFocus"
      ref="fsTextBox"
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

    <div class="dis-flex">
      <FSButton
        :config="{
          text: 'Đăng nhập',
          stylingMode: 'outlined',
          type: 'default',
          elementAttr: { class: 'mr-12' },
          onClick: () => $router.push('/login'),
        }"
      />

      <FSButton
        :is-loading="isLoadingRegister"
        :config="{
          text: 'Đăng ký',
          stylingMode: 'contained',
          type: 'default',
          elementAttr: { class: 'ml-12' },
          onClick: register,
        }"
      />
    </div>

    <div class="dis-flex jus-center w-100pc mt-16 mb-16">hoặc</div>
    <div class="button-social-group dis-flex">
      <FSButton
        :config="{
          icon: 'icon-facebook',
          elementAttr: { class: 'mr-4' },
          stylingMode: 'outlined',
          type: 'default',
        }"
      />
      <FSButton
        :config="{
          icon: 'icon-google',
          elementAttr: { class: 'ml-4' },
          stylingMode: 'outlined',
          type: 'default',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FSButton, FSTextBox } from "@/components/controls";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";

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
const confirmPassword = ref<string>("");
const $router = useRouter();

const isValidRegister = computed(() => {
  if (email.value == "" || password.value == "" || confirmPassword.value == "")
    return false;
  if (password.value != confirmPassword.value) return false;

  return true;
});

const isLoadingRegister = ref<boolean>(false);

const register = () => {
  if (!isValidRegister.value || !auth) return;

  isLoadingRegister.value = true;
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      $router.push("/");
      isLoadingRegister.value = false;
    })
    .catch((err) => {
      isLoadingRegister.value = false;
      console.log(err);
    });
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
