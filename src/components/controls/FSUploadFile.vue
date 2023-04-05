<template>
    <div>
        <DxFileUploader v-bind="configWithDefault" />
    </div>
</template>

<script setup lang="ts">
import { StorageService } from '@/apis';
import { useManagementStore } from '@/stores';
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    config:DxFileUploader;
    modelValue:string[];
}>(),{
    config:DxFileUploader
})

const storageService = new StorageService();
const managementStore = useManagementStore();

const configWithDefault = computed(() => {
    return {
        ...props.config,
        accept:"image/*",
        uploadFile:uploadedFile,
        showFileList:false
    }
});

const emit = defineEmits(["update:modelValue"]);

const uploadedFile = async (file:File) => {
    try {
        const url = await storageService.upload(file);
        emit('update:modelValue', [...props.modelValue,url]);
    } catch (error) {
        console.log(error);
        managementStore.showError("Có lỗi xảy ra khi tải ảnh lên")
    }
}

</script>

<style scoped>

</style>