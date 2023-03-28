import { defineAsyncComponent } from 'vue';

const FSButton = defineAsyncComponent(() => import('./FSButton.vue'));
const FSTextBox = defineAsyncComponent(() => import('./FSTextBox.vue'));
const FSDateBox = defineAsyncComponent(() => import('./FSDateBox.vue'));
const FSGallery = defineAsyncComponent(() => import('./FSGallery.vue'));
const FSUploadFile = defineAsyncComponent(() => import('./FSUploadFile.vue'));

export {
    FSButton,
    FSTextBox,
    FSDateBox,
    FSGallery,
    FSUploadFile
}