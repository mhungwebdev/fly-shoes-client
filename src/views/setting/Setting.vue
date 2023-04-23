<template>
    <div class="setting-container back-white p-20 m-16 br-4">
        <div class="web-info">
            <div class="title font-20 font-weight-600 dis-flex align-center jus-space-between">
                <div v-if="emailSignature?.EmailType == EmailType.Signature">Chân chữ ký</div>
                <div v-if="!isEditEmailSignature" @click="isEditEmailSignature = true"
                    class="icon-pencil back-white cursor-pointer"></div>
                <div v-if="isEditEmailSignature" class="dis-flex">
                    <FSButton class="mr-8" :config="{ text: 'Hủy', onClick: () => isEditEmailSignature = false }"></FSButton>
                    <FSButton :config="{ text: 'Lưu', onClick: saveEmailSignature }"></FSButton>
                </div>
            </div>
            <div v-if="!isEditEmailSignature" class="value" v-html="emailSignature?.EmailContent"></div>

            <div v-if="isEditEmailSignature">
                <FSEditor v-model="emailSignature.EmailContent"></FSEditor>
            </div>
        </div>

        <div>
            <SettingItemVue class="mb-20" v-for="(settingItem, index) in settingItems" :key="index"
                :settingItem="settingItem">
            </SettingItemVue>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SettingItemVue from './SettingItem.vue';
import { BrandService, CategoryService, ColorService, SizeService } from '@/apis';
import { useManagementStore } from '@/stores';
import FSEditor from '@/components/controls/FSEditor.vue';
import { FSButton } from '@/components/controls';
import { ModelState } from '@/enums';
import EmailTemplateService from '@/apis/email-template-service';
import EmailType from '@/enums/email-type';
import { EmailTemplate } from '@/models';

export interface SettingItem {
    Title: string;
    LoadData: Function;
    DisplayExpr: string;
    ValueExpr: string;
}

const managementStore = useManagementStore();

const brandSV = new BrandService();
const categorySV = new CategoryService();
const colorSV = new ColorService();
const sizeSV = new SizeService();
const emailTemplateSV = new EmailTemplateService();
const isEditEmailSignature = ref<boolean>(false);

const emailSignature = ref<EmailTemplate>(new EmailTemplate())

const loadBrand = async () => {
    return (await brandSV.getAll()).Data;
}

const loadCategory = async () => {
    return (await categorySV.getAll()).Data;
}

const loadColor = async () => {
    return (await colorSV.getAll()).Data;
}

const loadSize = async () => {
    return (await sizeSV.getAll()).Data;
}

const settingItems = ref<SettingItem[]>([
    {
        Title: 'Thương hiệu',
        LoadData: loadBrand,
        DisplayExpr: "BrandName",
        ValueExpr: "BrandValue",
    },
    {
        Title: 'Thể loại',
        LoadData: loadCategory,
        DisplayExpr: "CategoryName",
        ValueExpr: "CategoryID",
    },
    {
        Title: 'Màu sắc',
        LoadData: loadColor,
        DisplayExpr: "ColorName",
        ValueExpr: "ColorID",
    },
    {
        Title: 'Size',
        LoadData: loadSize,
        DisplayExpr: "SizeName",
        ValueExpr: "SizeID",
    }
])

async function getEmailSignature() {
    try {
        var res = await emailTemplateSV.getByField("EmailType", EmailType.Signature);
        if (res && res.Success) {
            emailSignature.value = (res.Data as EmailTemplate[])[0];
        } else {
            managementStore.showError();
        }
    } catch (error) {
        managementStore.showError();
    }
}

const saveEmailSignature = async () => {
    if (!emailSignature.value.EmailContent) {
        managementStore.showWaring("Vui lòng nhập chân chữ ký")
    }

    try {
        emailSignature.value.State = ModelState.Update;
        const res = await emailTemplateSV.save(emailSignature.value);
        if (res && res.Success) {
            managementStore.showSuccess("Cập nhật thành công");
            getEmailSignature();
            isEditEmailSignature.value = false;
        } else {
            managementStore.showError();
        }
    } catch (error) {
        managementStore.showError();
    }
}

onMounted(async () => {
    await getEmailSignature();
})
</script>

<style lang="scss" scoped>
.setting-container {
    overflow: auto;
    height: calc(100% - 32px);

    .web-info {
        border: 1px solid #ddd;
        margin-bottom: 20px;

        .title {
            padding: 10px;
            color: white;
            background-color: var(--app-color-primary);
        }

        .value {
            padding: 10px;
        }
    }
}
</style>