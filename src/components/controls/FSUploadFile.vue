<template>
    <div>
        <DxFileUploader v-bind="configWithDefault" />
    </div>
</template>

<script setup lang="ts">
import { StorageService } from '@/apis';
import { useManagementStore } from '@/stores';
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { computed, onMounted, ref } from 'vue';
import { getCurrentUser } from 'vuefire';

const props = withDefaults(defineProps<{
    config:DxFileUploader;
    modelValue?:string;
}>(),{
    config:DxFileUploader
})

const token = ref<string>();
onMounted(async () => {
    token.value = await (await getCurrentUser())?.getIdToken();
});

const storageService = new StorageService();
const managementStore = useManagementStore();

const configWithDefault = computed(() => {
    return {
        ...props.config,
        accept:"image/*",
        multiple:false,
        uploadUrl:'https://localhost:44352/api/v1/Storage/upload-multi',
        showFileList:false,
        uploadHeaders:{
            "Authorization":token.value
        },
        uploadFile:uploadedFile
    }
});

const emit = defineEmits(["update:modelValue"]);

const uploadedFile = async (file:File) => {
    try {
        const url = await storageService.upload(file);
        emit('update:modelValue', url);
    } catch (error) {
        console.log(error);
        managementStore.showError("Có lỗi xảy ra khi tải ảnh lên")
    }
}

</script>

<style scoped>

</style>