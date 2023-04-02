<template>
  <div>
    <DxHtmlEditor>
      <DxMediaResizing :enabled="true" />
      <DxImageUpload :tabs="['file']" file-upload-mode="base64" />
      <DxToolbar :multiline="true">
        <DxItem name="undo" />
        <DxItem name="redo" />
        <DxItem name="separator" />
        <DxItem :accepted-values="sizeValues" name="size" />
        <DxItem :accepted-values="fontValues" name="font" />
        <DxItem name="separator" />
        <DxItem name="bold" />
        <DxItem name="italic" />
        <DxItem name="strike" />
        <DxItem name="underline" />
        <DxItem name="separator" />
        <DxItem name="alignLeft" />
        <DxItem name="alignCenter" />
        <DxItem name="alignRight" />
        <DxItem name="alignJustify" />
        <DxItem name="separator" />
        <DxItem name="orderedList" />
        <DxItem name="bulletList" />
        <DxItem name="separator" />
        <DxItem :accepted-values="headerValues" name="header" />
        <DxItem name="separator" />
        <DxItem name="color" />
        <DxItem name="background" />
        <DxItem name="separator" />
        <DxItem name="link" />
        <DxItem name="image" />
        <DxItem name="separator" />
        <DxItem name="clear" />
        <DxItem name="codeBlock" />
        <DxItem name="blockquote" />
        <DxItem name="separator" />
        <DxItem name="insertTable" />
        <DxItem name="deleteTable" />
        <DxItem name="insertRowAbove" />
        <DxItem name="insertRowBelow" />
        <DxItem name="deleteRow" />
        <DxItem name="insertColumnLeft" />
        <DxItem name="insertColumnRight" />
        <DxItem name="deleteColumn" />
      </DxToolbar>
    </DxHtmlEditor>
  </div>
</template>

<script setup lang="ts">
import {
  DxHtmlEditor,
  DxToolbar,
  DxMediaResizing,
  DxImageUpload,
  DxItem,
} from "devextreme-vue/html-editor";
import { ref } from "vue";

const tabs = [
  { name: 'From This Device', value: ['file'] },
  { name: 'From the Web', value: ['url'] },
  { name: 'Both', value: ['file', 'url'] },
];

const sizeValues = ref<string[]>(['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']);
const fontValues = ref<string[]>(['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana']);
const headerValues = ref<any[]>([false, 1, 2, 3, 4, 5])

</script>

<style scoped></style>
