<template>
  <div class="gallery-container">
    <DxGallery v-bind="config">
      <template #item="{ data }">
        <div
          class="gallery-item"
          :style="{ backgroundImage: `url(${data})` }"
        ></div>
      </template>
    </DxGallery>
  </div>
</template>

<script setup lang="ts">
import DxGallery from "devextreme-vue/gallery";

const props = withDefaults(
  defineProps<{
    config: DxGallery;
  }>(),
  {
    config: DxGallery,
  }
);
</script>

<style lang="scss">
.gallery-container {
  .gallery-item {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .dx-gallery .dx-gallery-nav-button-next.dx-widget.dx-state-hover::after,
  .dx-gallery .dx-gallery-nav-button-prev.dx-widget.dx-state-hover::after,
  .dx-gallery .dx-gallery-nav-button-next.dx-widget.dx-state-active::after,
  .dx-gallery .dx-gallery-nav-button-prev.dx-widget.dx-state-active::after {
    background-color: unset !important;
  }
}
</style>
