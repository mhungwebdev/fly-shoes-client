<template>
    <div class="dis-flex w-100pc">
        <TheSidebarAdmin></TheSidebarAdmin>
        <div class="flex-1 back-group-grey p-8">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import TheSidebarAdmin from '@/layouts/TheSidebarAdmin.vue';
</script>

<style scoped>
.back-group-grey {
    background-color: rgb(191 191 191);
}
</style>