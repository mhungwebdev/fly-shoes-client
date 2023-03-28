<template>
  <div class="fs-text-box-container">
    <DxTextBox value-change-event="keyup" v-model:value="internalValue" ref="dxTextBox" />
  </div>
</template>

<script setup lang="ts">
import DxTextBox from "devextreme-vue/text-box";
import { ref, watch, onMounted, computed } from "vue";

const props = withDefaults(
  defineProps<{
    config: DxTextBox;
    isFocused?: boolean;
    modelValue?: any;
  }>(),
  {
    config: DxTextBox,
    isFocused: false,
  }
);

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const dxTextBox = ref<DxTextBox>();

onMounted(() => {
  dxTextBox.value?.instance?.option(props.config);
  if (props.isFocused) focusInput();
});

watch(
  () => props.config,
  (newValue) => {
    dxTextBox.value?.instance?.option(newValue);
  },
  {
    deep: true,
    immediate: true,
  }
);

const focusInput = () => {
  dxTextBox.value?.instance?.focus();
};

defineExpose({
  focusInput,
});
</script>

<style scoped></style>
