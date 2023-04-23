<template>
  <div class="setting-item">
    <div class="font-20 font-weight-600 title dis-flex jus-space-between">
      <div>{{ settingItem.Title }}</div>
      <div @click="isOpen = !isOpen" :class="isOpen ? 'icon-arrow-up' : 'icon-arrow-bottom'" class="cursor-pointer"></div>
    </div>
    <div :class="!isOpen && 'hidden'" class="p-10 list">
      <div class="item pos-relative" v-for="(item, index) in items" :key="index">
        <div>{{ item[settingItem.DisplayExpr] }}</div>
        <div class="action pos-absolute dis-flex right-0 top-0 h-100pc align-center pr-10">
          <div @click="$emit('editRow', item[settingItem.ValueExpr])" title="Sửa" class="button mr-12 flex-center">
            <div class="icon-pencil pos-relative cursor-pointer"></div>
          </div>
          <div title="Xóa" class="button flex-center cursor-pointer">
            <div class="icon-trash"></div>
          </div>
        </div>
      </div>

      <div class="action-add">Thêm mới</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { SettingItem } from './Setting.vue';


const props = withDefaults(defineProps<{
  settingItem: SettingItem
}>(), {
})

const isOpen = ref<boolean>(true);
const items = ref<any[]>([]);

onMounted(async () => {
  await loadData();
})

const loadData = async () => {
  items.value = await props.settingItem.LoadData();
}

</script>

<style lang="scss" scoped>
.setting-item {
  border: 1px solid #ddd;

  .title {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    background-color: var(--app-color-primary);
    color: white;
  }

  .list {
    transition: all .3s ease-in-out;
    overflow: hidden;
    .item {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      border-radius: 4px;
      transition: all .3s linear;

      .action {
        display: none;
      }

      &:hover {
        background-color: rgb(98, 200, 255);
        color: white;

        .action {
          display: flex;

          .button {
            background-color: white;
            border-radius: 50%;
            height: 32px;
            width: 32px;
          }
        }
      }
    }

    .action-add {
      border-top: 1px solid #ddd;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: rgb(0, 159, 233);
      cursor: pointer;
    }
  }

  .list.hidden {
    height: 0px;
    padding: 0px;
  }
}
</style>
