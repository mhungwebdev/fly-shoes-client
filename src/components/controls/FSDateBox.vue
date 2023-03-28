<template>
    <div class="fs-date-box">
        <DxDateBox v-model:value="internalValue" v-bind="config" />
    </div>
</template>

<script setup lang="ts">
import DxDateBox from 'devextreme-vue/date-box';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    config:DxDateBox,
    modelValue?:any,
}>(),{
    config:DxDateBox
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed(({
    get() {
        return props.modelValue;
    },

    set(val){
        emit('update:modelValue',val)
    }
}));

</script>

<style scoped>

</style>