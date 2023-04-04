<template>
    <div class="fs-date-box">
        <DxDateBox v-model:value="internalValue" v-bind="configDateBoxDefault" v-model:max="config.max" />
    </div>
</template>

<script setup lang="ts">
import DxDateBox from 'devextreme-vue/date-box';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
    config:DxDateBox,
    modelValue?:any,
}>(),{
    config:DxDateBox
})

const configDateBoxDefault = ref<DxDateBox>({});

watch(
    props.config,
    () => {
        configDateBoxDefault.value = {
            ...props.config,
            displayFormat:'dd/MM/yyyy'
        }
    },
    {
        deep:true,
        immediate:true
    }
)

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