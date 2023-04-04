<template>
    <div ref="fsButton" class="fs-button pos-relative">
        <dx-button ref="dxButtonRef"></dx-button>
        <div class="loading pos-absolute">
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DxButton from "devextreme-vue/button";
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    config: DxButton;
    isLoading?: boolean;
  }>(),
  {
    config: DxButton,
    isLoading:false
  }
);

const dxButtonRef = ref<DxButton>();
const fsButton = ref<HTMLElement>();

const turnOnLoading = () => {
    fsButton.value?.querySelector(".loading")?.setAttribute("style","display:flex");
    return true;
}

const turnOffLoading = () => {
    fsButton.value?.querySelector(".loading")?.setAttribute("style","display:none");
}

watch(
    () => props.isLoading,
    (isLoading) => {
        return isLoading && turnOnLoading() || turnOffLoading();
    }
)

onMounted(() => {
  const config = props.config;
  config.activeStateEnabled = false;
  config.focusStateEnabled = false;
  dxButtonRef.value?.instance?.option(config);
});

watch(
  () => props.config,
  (newValue: DxButton) => {
    const config = newValue;
    config.activeStateEnabled = false;
    config.focusStateEnabled = false;
    dxButtonRef.value?.instance?.option(config);
  },
  {
    deep: true,
    immediate:true
  }
);
</script>

<style lang="scss" scoped>
.fs-button {
    width: fit-content;
    .loading {
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
        background-color: #337ab7;
        width: 100%;
        height: 100%;
        top:0;
        left: 0;
        border-radius: 4px;
        display: none;
        align-items: center;
        justify-content: center;
        div {
            animation: spin .5s infinite;
            border:2px solid #fff;
            border-top-color: transparent;
            border-radius: 50%;
            width:16px;
            height: 16px;
        }
    }
}
</style>
