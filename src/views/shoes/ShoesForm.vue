<template>
  <div class="shoes-form-container dis-flex pos-relative">
    <div class="form p-20 overflow-auto">
      <div class="font-24 font-weight-700 mb-28">Thông tin chung</div>

      <div class="mb-4">Tên giày<span class="text-red">*</span></div>
      <FSTextBox ref="refShoesName" v-model="shoes.ShoesName">
        <DxValidator>
          <DxRequiredRule message="Tên giày không được để trống" />
        </DxValidator>
      </FSTextBox>
      <div class="dis-flex mb-8 mt-20 align-center">
        <div>
          <div class="mb-4">Thể loại:</div>
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
        </div>

        <div>
          <div class="mb-4">Thương hiệu:</div>
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
          >
            <template #item="{ data: brand }">
              <div class="dis-flex">
                <div
                  class="mr-8 preview-brand h-20px"
                  :style="{ backgroundImage: `url(${brand.BrandLogo})` }"
                ></div>
                <div>{{ brand.BrandName }}</div>
              </div>
            </template>
          </DxSelectBox>
        </div>

        <div>
          <div class="mb-4">Giá:</div>
          <DxNumberBox
            :min="1000"
            step="500"
            format="VND #,##0.##"
            v-model="shoes.Price"
          ></DxNumberBox>
        </div>
      </div>
      <div class="mb-4 mt-20">Ảnh mô tả sản phẩm</div>
      <div class="dis-flex">
        <FSGallery
          class="h-100pc w-50pc image-area"
          :config="{
            dataSource: images,
            loop: true,
            showNavButtons: false,
            showIndicator: true,
            slideshowDelay: 3000,
            width: '100%',
            noDataText: 'Chưa chọn ảnh mô tả sản phẩm',
            itemTemplate:'item'
          }"
        >
          <template #item="{data}">
              <div class="h-100pc w-100pc pos-relative preview-image" :style="{backgroundImage:`url(${data})`}">
                  <div @click="(e) => deleteImage(e,data)" class="pos-absolute top-10 right-10 icon-close cursor-pointer"></div>
              </div>
          </template>
        </FSGallery>
        <FSUploadFile
          v-model="images"
          :config="{
            selectButtonText: 'Chọn ảnh',
            labelText: 'hoặc thả ảnh tại đây',
            multiple: true,
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
        <DxAccordion :data-source="details" noDataText="Không có chi tiết">
          <template #title="{ data }">
            <div class="dis-flex jus-space-between align-center">
              <div class="font-weight-600">
                Chi tiết giày : (size - {{ data.SizeName }},màu -
                {{ data.ColorName }}) x{{ data.Quantity }}
              </div>
              <div
                @click="() => deleteShoesDetail(data.ID)"
                v-if="details.length > 1"
                class="icon-trash"
              ></div>
            </div>
          </template>
          <template #item="{ data }">
            <div>
              <div class="dis-flex mb-8 jus-space-between">
                <div class="flex-1">
                  <div class="mb-4">Size</div>
                  <DxSelectBox
                    v-model="data.SizeID"
                    :data-source="sizes"
                    display-expr="SizeName"
                    value-expr="SizeID"
                    class="flex-1"
                  ></DxSelectBox>
                </div>

                <div class="ml-8 mr-8 flex-2">
                  <div class="mb-4">Màu</div>
                  <DxTagBox
                    v-model="data.ColorIDs"
                    :data-source="colors"
                    display-expr="ColorName"
                    class="color-select-box"
                    value-expr="ColorID"
                    item-template="item"
                    :showSelectionControls="true"
                    :showDropDownButton="true"
                  >
                    <template #item="{ data: color }">
                      <div class="dis-flex">
                        <div
                          class="preview-color mr-8"
                          :style="{ backgroundColor: color.ColorCode }"
                        ></div>
                        <div>{{ color.ColorName }}</div>
                      </div>
                    </template>
                  </DxTagBox>
                </div>

                <div class="flex-1">
                  <div class="mb-4">Số lượng</div>
                  <DxNumberBox
                    v-model="data.Quantity"
                    :min="1"
                    class="flex-1"
                  ></DxNumberBox>
                </div>
              </div>
            </div>
          </template>
        </DxAccordion>
      </div>
    </div>

    <div class="preview dis-flex align-center jus-center">
      <div class="dis-flex close-shoes-form pos-absolute">
        <FSButton
          class="mr-8"
          :config="{ text: 'Hủy', onClick: () => $router.back() }"
        ></FSButton>
        <FSButton
          :is-loading="isLoadingSave"
          :config="{
            text: 'Lưu',
            type: 'default',
            stylingMode: 'contained',
            onClick: save,
          }"
        ></FSButton>
      </div>

      <div>
        <ShoesCard :shoes="shoesPreview"></ShoesCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FSButton,
  FSGallery,
  FSTextBox,
  FSUploadFile,
} from "@/components/controls";
import {
  ShoesDetail,
  type Brand,
  type Category,
  Shoes,
  Color,
  Size,
} from "@/models";
import { DxNumberBox } from "devextreme-vue/number-box";
import { computed, onMounted, ref, watch } from "vue";
import DxSelectBox from "devextreme-vue/select-box";
import DxTagBox from "devextreme-vue/tag-box";
import DxAccordion from "devextreme-vue/accordion";
import {
  BrandService,
  CategoryService,
  ColorService,
  SizeService,
} from "@/apis";
import { useManagementStore } from "@/stores";
import { DxValidator, DxRequiredRule } from "devextreme-vue/validator";
import ShoesCard from "./ShoesCard.vue";
import ImageDefault from "@/common/icons/image-default.jpg";
import ShoesService from "@/apis/shoes-service";
import { useRouter } from "vue-router";
import { ModelState } from "@/enums";

interface Detail {
  SizeID: number;
  ColorIDs: number[];
  Quantity: number;
  ID: number;
}

const managementStore = useManagementStore();

const categoryService = new CategoryService();
const brandService = new BrandService();
const sizeService = new SizeService();
const colorService = new ColorService();
const shoesService = new ShoesService();

const isLoadingSave = ref<boolean>(false);
const categories = ref<Category[]>([]);
const brands = ref<Brand[]>([]);
const colors = ref<Color[]>([]);
const sizes = ref<Size[]>([]);

const initDetail: Detail = {
  ColorIDs: [],
  ID: 1,
  Quantity: 1,
  SizeID: 0,
};
const details = ref<Detail[]>([initDetail]);
const shoes = ref<Shoes>(new Shoes());
const images = ref<string[]>([]);

//#region onMounted
onMounted(async () => {
  try {
    const resultColor = await colorService.getAll();
    if (resultColor && resultColor.Success && resultColor.Data) {
      colors.value = resultColor.Data;
      details.value[0].ColorIDs.push(colors.value[0].ColorID);
    }

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

    const resultSize = await sizeService.getAll();
    if (resultSize && resultSize.Success && resultSize.Data) {
      sizes.value = resultSize.Data;
      details.value[0].SizeID = sizes.value[0].SizeID;
    }

    const { id } = $router.currentRoute.value.params;
  } catch (error) {
    managementStore.showError();
  }
});
//#endregion

const deleteImage = (e:MouseEvent,data:string) => {
    e.stopPropagation();
    images.value = images.value.filter(image => image != data);
}

const shoesPreview = computed<Shoes>(() => {
  const shoesDetails: ShoesDetail[] = [];
  shoes.value.ShoesImages = images.value.join(";");

  details.value.forEach((detail) => {
    if (
      shoesDetails.find((shoesDetail) => shoesDetail.SizeID == detail.SizeID) ==
      undefined
    ) {
      detail.ColorIDs.forEach((id) => {
        const color = colors.value.find((color) => color.ColorID == id);
        const size = sizes.value.find((size) => detail.SizeID == size.SizeID);
        if (color != undefined && size != undefined) {
          const shoesDetail = new ShoesDetail();
          shoesDetail.ColorCode = color.ColorCode;
          shoesDetail.SizeName = size.SizeName;
          shoesDetail.ColorID = color.ColorID;
          shoesDetail.ColorName = color.ColorName;
          shoesDetail.Quantity = detail.Quantity;
          shoesDetail.SizeID = detail.SizeID;
          shoesDetails.push(shoesDetail);
        }
      });
    }
  });

  shoes.value.ShoesDetails = shoesDetails;

  return shoes.value;
});

watch(
  () => shoes.value.CategoryID,
  () => {
    const category = categories.value.find(
      (category) => category.CategoryID == shoes.value.CategoryID
    );
    if (category != undefined) {
      shoes.value.CategoryName = category.CategoryName;
    }
  }
);

watch(
  () => shoes.value.BrandID,
  () => {
    const brand = brands.value.find(
      (brand) => brand.BrandID == shoes.value.BrandID
    );
    if (brand != undefined) {
      shoes.value.BrandName = brand.BrandName;
    }
  }
);

const addShoesDetail = () => {
  const idMax = details.value[details.value.length - 1].ID;

  const newShoesDetail: Detail = {
    ID: idMax + 1,
    ColorIDs: [colors.value[0].ColorID],
    SizeID: sizes.value[0].SizeID,
    Quantity: 1,
  };

  details.value = [...details.value, newShoesDetail];
};

const deleteShoesDetail = (detailID: number) => {
  details.value = details.value.filter((detail) => detail.ID != detailID);
};

const validate = (): boolean => {
  let valid = true;

  if (!shoes.value.ShoesName) {
    valid = false;
  }

  if (!shoes.value.ShoesImages) {
    valid = false;
  }

  return valid;
};
const $router = useRouter();
const save = async () => {
  if (validate()) {
    try {
      isLoadingSave.value = true;
      shoes.value.State = ModelState.Insert;
      const res = await shoesService.save(shoes.value);
      isLoadingSave.value = false;
      if (res && res.Success) {
        managementStore.showSuccess("Lưu thành công !");
        $router.back();
      } else {
        managementStore.showError();
      }
    } catch (error) {
      isLoadingSave.value = false;
      managementStore.showError();
    }
  } else {
    managementStore.showWaring("Vui lòng nhập đủ dữ liệu !");
  }
};
</script>

<style lang="scss">
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

.preview-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  min-width: 20px;
}

.preview-brand {
  min-width: 20px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.preview-image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
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
