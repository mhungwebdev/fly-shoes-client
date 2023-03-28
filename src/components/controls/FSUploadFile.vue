<template>
    <div>
        <DxFileUploader v-bind="config" />
    </div>
</template>

<script setup lang="ts">
import { DxFileUploader } from 'devextreme-vue/file-uploader';

const props = withDefaults(defineProps<{
    config:DxFileUploader
}>(),{
    config:DxFileUploader
})

</script>

<style scoped>

</style>