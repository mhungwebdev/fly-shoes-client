<template>
  <div class="shoes-form-container dis-flex pos-relative">
    <div class="form p-20 overflow-auto">
      <div class="font-24 font-weight-700 mb-28">Thông tin chung</div>

      <FSTextBox v-model="shoes.ShoesName" :config="{ label: 'Tên giày' }">
        <DxValidator>
          <DxRequiredRule message="Tên giày không được để trống" />
        </DxValidator>
      </FSTextBox>
      <div class="dis-flex mb-8 mt-8 align-center">
        <DxSelectBox
          :data-source="categories"
          :display-expr="'CategoryName'"
          :value-expr="'CategoryID'"
          noDataText="Không có dữ liệu"
          placeholder="Thể loại"
          :height="36"
          :width="160"
          class="mr-8"
          v-model="shoes.CategoryID"
        ></DxSelectBox>
        <DxSelectBox
          :data-source="brands"
          :display-expr="'BrandName'"
          :value-expr="'BrandID'"
          noDataText="Không có dữ liệu"
          placeholder="Thương hiệu"
          :width="160"
          :height="36"
          class="mr-8"
          v-model="shoes.BrandID"
        ></DxSelectBox>
        <DxNumberBox
          class="mb-8"
          :label="'Giá'"
          :min="1000"
          step="500"
          format="VND #,##0.##"
          v-model="shoes.Price"
        ></DxNumberBox>
      </div>
      <FSEditor class="mb-8"></FSEditor>
      <div class="dis-flex">
        <div class="image-area mr-20"></div>
        <FSUploadFile
          :config="{
            selectButtonText: 'Chọn ảnh',
            labelText: 'hoặc thả ảnh tại đây',
          }"
        ></FSUploadFile>
      </div>

      <div class="mt-20">
        <div class="mb-12 dis-flex jus-space-between">
          <div class="font-20 font-weight-600">Thông tin chi tiết</div>
          <div
            @click="addShoesDetail"
            class="dis-flex align-center cursor-pointer"
          >
            <div class="icon-plus"></div>
            Thêm
          </div>
        </div>
        <DxAccordion :data-source="shoesDetails" noDataText="Không có chi tiết">
          <template #title="{ data }">
            <div class="dis-flex jus-space-between align-center">
              <div>
                Chi tiết giày : (size - {{ data.SizeName }},màu -
                {{ data.ColorName }}) x{{ data.Quantity }}
              </div>
              <div
                @click="() => deleteShoesDetail(data.ShoesDetailID)"
                v-if="shoesDetails.length > 1"
                class="icon-trash"
              ></div>
            </div>
          </template>
          <template #item="{ data }">
            <div>
              <div class="dis-flex mb-8 jus-space-between">
                <DxSelectBox
                  v-model="data.ColorID"
                  @value-changed="({value}:any) => changeColor(value,data.ShoesDetailID)"
                  :data-source="colors"
                  display-expr="ColorName"
                  value-expr="ColorID"
                  class="flex-1"
                ></DxSelectBox>
                <DxSelectBox
                  v-model="data.SizeID"
                  @value-changed="({value}:any) => changeSize(value,data.ShoesDetailID)"
                  :data-source="sizes"
                  display-expr="SizeName"
                  value-expr="SizeID"
                  class="flex-1 ml-8 mr-8"
                ></DxSelectBox>
                <DxNumberBox
                  v-model="data.Quantity"
                  :min="1"
                  class="flex-1"
                ></DxNumberBox>
              </div>

              <div class="dis-flex">
                <div class="image-area mr-20"></div>
                <FSUploadFile
                  :config="{
                    selectButtonText: 'Chọn ảnh',
                    labelText: 'hoặc thả ảnh tại đây',
                  }"
                ></FSUploadFile>
              </div>
            </div>
          </template>
        </DxAccordion>
      </div>
    </div>

    <div class="preview">
        <div class="dis-flex close-shoes-form pos-absolute">
            <FSButton class="mr-8" :config="{text:'Hủy',onClick:() => $router.back()}"></FSButton>
            <FSButton :config="{text:'Lưu',type:'default',stylingMode:'contained'}"></FSButton>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FSButton, FSTextBox, FSUploadFile } from "@/components/controls";
import {
  ShoesDetail,
  type Brand,
  type Category,
  Shoes,
  Color,
  Size,
} from "@/models";
import { DxNumberBox } from "devextreme-vue/number-box";
import { onMounted, ref, watch } from "vue";
import DxSelectBox from "devextreme-vue/select-box";
import FSEditor from "@/components/controls/FSEditor.vue";
import DxAccordion from "devextreme-vue/accordion";
import {
  BrandService,
  CategoryService,
  ColorService,
  SizeService,
} from "@/apis";
import { useManagementStore } from "@/stores";
import {
  DxValidator,
  DxRequiredRule,
} from 'devextreme-vue/validator';

const managementStore = useManagementStore();

const categoryService = new CategoryService();
const brandService = new BrandService();
const sizeService = new SizeService();
const colorService = new ColorService();

const categories = ref<Category[]>([]);
const brands = ref<Brand[]>([]);
const colors = ref<Color[]>([]);
const sizes = ref<Size[]>([]);

const shoesDetails = ref<ShoesDetail[]>([new ShoesDetail(1)]);
const shoes = ref<Shoes>(new Shoes());

//#region onMounted
onMounted(async () => {
  try {
    const resultCategory = await categoryService.getAll();
    if (resultCategory && resultCategory.Success && resultCategory.Data) {
      categories.value = resultCategory.Data;
      shoes.value.CategoryID = categories.value[0].CategoryID;
      shoes.value.CategoryName = categories.value[0].CategoryName;
    }

    const resultBrand = await brandService.getAll();
    if (resultBrand && resultBrand.Success && resultBrand.Data) {
      brands.value = resultBrand.Data;
      shoes.value.BrandID = brands.value[0].BrandID;
      shoes.value.BrandName = brands.value[0].BrandName;
    }

    const resultColor = await colorService.getAll();
    if (resultColor && resultColor.Success && resultColor.Data) {
      colors.value = resultColor.Data;
      shoesDetails.value[0].ColorID = colors.value[0].ColorID;
      shoesDetails.value[0].ColorName = colors.value[0].ColorName;
    }

    const resultSize = await sizeService.getAll();
    if (resultSize && resultSize.Success && resultSize.Data) {
      sizes.value = resultSize.Data;
      shoesDetails.value[0].SizeID = sizes.value[0].SizeID;
      shoesDetails.value[0].SizeName = sizes.value[0].SizeName;
    }
  } catch (error) {
    managementStore.showError();
  }
});
//#endregion

const addShoesDetail = () => {
  const idMax = shoesDetails.value[shoesDetails.value.length - 1].ShoesDetailID;

  const newShoesDetail = new ShoesDetail(idMax + 1);
  newShoesDetail.ColorID = colors.value[0].ColorID;
  newShoesDetail.ColorName = colors.value[0].ColorName;
  newShoesDetail.SizeID = sizes.value[0].SizeID;
  newShoesDetail.SizeName = sizes.value[0].SizeName;

  shoesDetails.value = [...shoesDetails.value, newShoesDetail];
};

const deleteShoesDetail = (shoesDetailID: number) => {
  shoesDetails.value = shoesDetails.value.filter(
    (shoesDetail) => shoesDetail.ShoesDetailID != shoesDetailID
  );
};

const changeColor = (value: any, shoesDetailID: number) => {
  const shoesDetail = shoesDetails.value.find(
    (shoesDetail) => shoesDetail.ShoesDetailID == shoesDetailID
  );
  const color = colors.value.find((color) => color.ColorID == value);

  if (shoesDetail != undefined && color != undefined) {
    shoesDetail.ColorName = color.ColorName;
  }
};

const changeSize = (value: any, shoesDetailID: number) => {
  const shoesDetail = shoesDetails.value.find(
    (shoesDetail) => shoesDetail.ShoesDetailID == shoesDetailID
  );
  const size = sizes.value.find((size) => size.SizeID == value);

  if (shoesDetail != undefined && size != undefined) {
    shoesDetail.SizeName = size.SizeName;
  }
};
</script>

<style lang="scss" scoped>
@keyframes showForm {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes showPreview {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.shoes-form-container {
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  .form {
    background-color: white;
    animation: showForm 0.3s ease-in-out;
  }

  .preview {
    width: 400px;
    min-width: 50%;
    height: 100%;
    background-color: rgb(191 191 191);
    animation: showPreview 0.3s ease-in-out;
  }

  .image-area {
    width: 280px;
    height: 320px;
    min-width: 280px;
    border: 1px solid #ddd;
  }

  .close-shoes-form {
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
}
</style>
