<template>
  <div class="product-detail-container" :class="isLoading && 'dis-none'">
    <div class="dis-flex content">
      <FSGallery
        class="h-100pc image-area"
        :config="{
          dataSource: shoes?.ShoesImages.split(';'),
          loop: true,
          showNavButtons: true,
          showIndicator: true,
          slideshowDelay: 3000,
          width: '100%',
          noDataText: 'Chưa chọn ảnh mô tả sản phẩm',
          itemTemplate: 'item',
        }"
      >
      </FSGallery>

      <div class="ml-120 pos-relative">
        <div class="dis-flex align-center jus-space-between">
          <div class="font-28 font-weight-600">{{ shoes?.ShoesName }}</div>
          <div
            :class="quantity == 0 ? 'text-red' : ''"
            class="text-disabled font-16 font-weight-600 text-nowrap"
          >
            SL: {{ quantity }}
          </div>
        </div>
        <div class="dis-flex align-center">
          <div>
            <div
              :class="
                canUseVoucher && shoes?.Voucher && userStore.currentUser
                  ? 'op-5 text-through-line'
                  : ''
              "
              class="text-red mt-8 font-16"
            >
              {{
                shoes?.Price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}
            </div>
            <div
              v-if="canUseVoucher && shoes?.Voucher"
              class="text-red mt-2 font-16"
              :class="userStore.currentUser || 'op-5'"
            >
              {{
                price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}
            </div>
          </div>

          <div
            class="voucher mt-10 ml-40"
            :class="userStore.currentUser == null ? 'op-3' : ''"
            v-if="shoes?.Voucher && canUseVoucher"
          >
            <div>{{ shoes.Voucher.VoucherTitle }}</div>
            <div v-if="shoes.Voucher.FormulaType == FormulaType.Percent">
              -{{ shoes.Voucher.VoucherValue }}%
            </div>
            <div v-if="shoes.Voucher.FormulaType == FormulaType.Subtraction">
              -{{
                shoes.Voucher.VoucherValue.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}%
            </div>
          </div>
        </div>

        <div
          class="mt-12 p-8 back-yellow-light dis-flex align-center jus-space-between text-white br-4"
          v-if="userStore.currentUser == null"
        >
          <div>Đăng nhập để có thể sử dụng các chương trình giảm giá !</div>
          <FSButton
            :config="{
              text: 'Đăng nhập ngay',
              onClick: () => $router.push('/login'),
            }"
          ></FSButton>
        </div>

        <div class="mt-40 mb-20">
          <span class="font-weight-600 font-18">Thể loại: </span
          >{{ shoes?.CategoryName }}
        </div>
        <div>
          <div class="dis-flex">
            <div>
              <span class="font-weight-600 font-18">Thương hiệu: </span
              >{{ shoes?.BrandName }}
            </div>
            <div class="back-light-blue text-white ml-20 br-4 p-4">
              {{ brand?.BrandSlogan }}
            </div>
          </div>

          <div class="mt-8">{{ brand?.DescriptionShot }}</div>
        </div>

        <div class="mt-20 dis-flex">
          <div class="font-weight-600 font-18 mr-20">Màu</div>
          <div
            :title="color.ColorName"
            :class="
              (colorID == color.ColorID ? 'active' : '') +
              ' ' +
              (color.Disabled && 'op-5')
            "
            class="color-item mr-8 align-center cursor-pointer"
            :style="{ backgroundColor: color.ColorCode }"
            v-for="(color, index) in colors"
            :key="index"
            @click="!color.Disabled && changeColor(color.ColorID)"
          ></div>
        </div>

        <div class="mt-20 dis-flex align-center">
          <div class="font-weight-600 font-18 mr-20">Size</div>
          <DxRadioGroup
            :data-source="sizeComputed"
            :displayExpr="'SizeName'"
            :value-expr="'SizeID'"
            :value="1"
            layout="horizontal"
            v-model="sizeID"
          ></DxRadioGroup>
        </div>

        <div class="mt-40 dis-flex align-center pos-absolute bottom-0">
          <FSButton
            class="mr-20"
            :config="{
              text: 'Thêm vào giỏ hàng',
              type: 'default',
              stylingMode: 'outlined',
              onClick:addShoesInCart
            }"
          ></FSButton>
          <FSButton
            :config="{
              text: 'Mua ngay',
              type: 'default',
              stylingMode: 'contained',
              onClick:() => $router.push(`/payment/${shoes?.ShoesID}`)
            }"
          ></FSButton>
        </div>
      </div>
    </div>

    <div class="mt-20">
      <di>
        <div class="font-20 font-weight-600">Sản phẩm cùng thể loại</div>
        <div class="dis-flex">
          <ShoesCard
            class="flex-1 m-8"
            v-for="(shoes, index) in shoesSameCategory"
            :key="index"
            :is-preview="false"
            :shoes="shoes"
            :width="160"
            :height="280"
          >
          </ShoesCard>
        </div>
      </di>

      <div class="mt-40">
        <div class="font-20 font-weight-600">Sản phẩm cùng thương hiệu</div>
        <div class="dis-flex">
          <ShoesCard
            class="flex-1 m-8"
            v-for="(shoes, index) in shoesSameBrand"
            :key="index"
            :is-preview="false"
            :shoes="shoes"
            :width="160"
            :height="280"
          >
          </ShoesCard>
        </div>
      </div>
    </div>
  </div>

  <div :class="!isLoading && 'dis-none'">
    <div class="dis-flex">
      <ContentLoader :width="480" :height="540"></ContentLoader>

      <div class="dis-flex flex-column ml-120 flex-1 pos-relative">
        <ContentLoader :width="600" class="mb-20" :height="40"></ContentLoader>

        <ContentLoader :width="600" class="mb-20" :height="40"></ContentLoader>

        <ContentLoader :width="600" class="mb-20" :height="40"></ContentLoader>

        <ContentLoader :width="600" class="mb-20" :height="80"></ContentLoader>

        <div class="pos-absolute bottom-0">
          <ContentLoader
            class="mr-16"
            :height="40"
            :width="120"
          ></ContentLoader>
          <ContentLoader :height="40" :width="120"></ContentLoader>
        </div>
      </div>
    </div>

    <div class="mt-40 dis-flex">
      <ContentLoader
        class="flex-1 m-10"
        :height="360"
        v-for="(i, index) in [1, 2, 3, 4, 5]"
        :key="index"
      >
      </ContentLoader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BrandService, CartDetailService } from "@/apis";
import ShoesService from "@/apis/shoes-service";
import VoucherService from "@/apis/voucher-service";
import { FSButton, FSGallery } from "@/components/controls";
import { ErrorCode, FilterOperator, FormulaType, ModelState } from "@/enums";
import {
  Brand,
  CartDetail,
  Color,
  FilterColumn,
  PagingPayload,
  Shoes,
  Size,
  SortOrder,
} from "@/models";
import { useManagementStore, useUserStore } from "@/stores";
import DxRadioGroup from "devextreme-vue/radio-group";
import { computed, onUnmounted, ref, watch } from "vue";
import { ContentLoader } from "vue-content-loader";
import { useRoute, useRouter } from "vue-router";
import ShoesCard from "../shoes/ShoesCard.vue";

const route = useRoute();
const shoesService = new ShoesService();
const brandService = new BrandService();
const canUseVoucher = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const shoes = ref<Shoes>();
const shoesSameCategory = ref<Shoes[]>([]);
const shoesSameBrand = ref<Shoes[]>([]);
const brand = ref<Brand>();
const colors = ref<Color[]>([]);
const sizes = ref<Size[]>([]);
const colorID = ref<number>();
const sizeID = ref<number>();
const userStore = useUserStore();
const managementStore = useManagementStore();
const voucherSV = new VoucherService();
const router = useRouter();
const cartDetailSV = new CartDetailService();

const payload = ref<PagingPayload>({
  FilterColumns: [],
  Keyword: "",
  PageIndex: 1,
  PageSize: 5,
  SortOrder: new SortOrder(),
  CustomParam: {
    UserID: userStore.currentUser?.UserID,
  },
});

const sizeComputed = computed<Size[]>(() => {
  if (colorID.value) {
    const sizeHas = shoes.value?.ShoesDetails.filter(
      (sd) => sd.ColorID == colorID.value
    );
    return sizes.value.filter(
      (size) => sizeHas?.find((s) => s.SizeID == size.SizeID) != undefined
    );
  } else {
    return sizes.value;
  }
});

const quantity = computed(() => {
  if (colorID.value == null && sizeID.value == null) {
    return shoes.value?.ShoesDetails.reduce(
      (pre, cur) => pre + cur.Quantity,
      0
    );
  }

  if (colorID.value == null && sizeID.value != null) {
    return shoes.value?.ShoesDetails.filter(
      (sd) => sd.SizeID == sizeID.value
    ).reduce((pre, cur) => pre + cur.Quantity, 0);
  }

  if (colorID.value != null && sizeID.value == null) {
    return shoes.value?.ShoesDetails.filter(
      (sd) => sd.ColorID == colorID.value
    ).reduce((pre, cur) => pre + cur.Quantity, 0);
  }

  if (colorID.value != null && sizeID.value != null) {
    return shoes.value?.ShoesDetails.filter(
      (sd) => sd.SizeID == sizeID.value && sd.ColorID == colorID.value
    ).reduce((pre, cur) => pre + cur.Quantity, 0);
  }
});

const price = computed(() => {
  if (shoes.value) {
    let p = shoes.value?.Price;

    if (shoes.value?.Voucher) {
      if (shoes.value?.Voucher.FormulaType == FormulaType.Percent) {
        p = ((100 - shoes.value?.Voucher.VoucherValue) / 100) * p;
      } else {
        p = p - shoes.value?.Voucher.VoucherValue;
      }
    }
    return p;
  }

  return 0;
});

const getShoesDetail = async (id: any) => {
  try {
    isLoading.value = true;
    var res = await shoesService.getByID(id);
    if (res && res.Success) {
      shoes.value = res.Data;
      if (shoes.value?.BrandID) {
        var resBrand = await brandService.getByID(shoes.value.BrandID);
        if (resBrand && resBrand.Success) {
          brand.value = resBrand.Data;
        }
      }

      if (shoes.value?.Voucher) {
        canUseVoucher.value = await voucherSV.checkVoucherUsage(
          shoes.value?.VoucherID,
          userStore.currentUser?.UserID || 0
        );
      }

      if (shoes.value?.ShoesDetails && shoes.value?.ShoesDetails.length > 0) {
        const sizeData: Array<Size> = [];
        const colorData: Array<Color> = [];
        shoes.value.ShoesDetails.forEach((sd) => {
          if (colorData.find((c) => c.ColorID == sd.ColorID) == undefined) {
            const color = new Color();
            color.ColorID = sd.ColorID;
            color.ColorCode = sd.ColorCode;
            color.ColorName = sd.ColorName;
            colorData.push(color);
          }

          if (sizeData.find((s) => s.SizeID == sd.SizeID) == undefined) {
            const size = new Size();
            size.SizeID = sd.SizeID;
            size.SizeName = sd.SizeName;

            sizeData.push(size);
          }
        });
        sizes.value = sizeData;
        colors.value = colorData;
        sizeID.value = undefined;
        colorID.value = undefined;
      }
    } else {
      managementStore.showError();
    }
  } catch (error) {
    managementStore.showError();
  }
  isLoading.value = false;
};

const addShoesInCart = async () => {
  if (userStore.currentUser) {
    const cartDetail = new CartDetail();
    (cartDetail.ShoesID = shoes.value?.ShoesID || 0),
      (cartDetail.UserID = userStore.currentUser?.UserID);
    cartDetail.State = ModelState.Insert;

    try {
      const res = await cartDetailSV.save(cartDetail);

      if (res && res.Success) {
        userStore.getCartDetail();
        managementStore.showSuccess("Đã thêm vào giở hàng");
      } else {
        if (res.ValidateInfo.length > 0) {
          const error = res.ValidateInfo[0];
          switch (error.ErrorCode) {
            case ErrorCode.Exist:
              managementStore.showWaring("Sản phẩm đã có trong giở hàng");
              break;
            default:
              managementStore.showError();
              break;
          }
        }
      }
    } catch (error) {
      managementStore.showError();
    }
  } else {
    managementStore.urlBreak = route.path;
    router.push("/login");
  }
};

watch(sizeID, () => {
  if (sizeID.value) {
    const sizeHas = shoes.value?.ShoesDetails.filter(
      (sd) => sd.SizeID == sizeID.value
    );
    colors.value.forEach((color) => {
      if (!sizeHas?.find((s) => s.ColorID == color.ColorID)) {
        color.Disabled = true;
      } else {
        color.Disabled = false;
      }
    });
  } else {
    colors.value.forEach((color) => (color.Disabled = false));
  }
});

watch(
  route,
  async () => {
    const { id } = route.params;
    if (id) {
      await getShoesDetail(id);
      await getShoesRelative();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const getShoesRelative = async () => {
  try {
    const filterCategory = managementStore.filterCategory;
    const filterBrand = managementStore.filterBrand;
    const filter: FilterColumn = {
      FieldName: "ShoesID",
      FilterOperator: FilterOperator.NotEqual,
      Value: shoes.value?.ShoesID,
    };
    filterCategory.Value = shoes.value?.CategoryID;
    filterBrand.Value = shoes.value?.BrandID;
    payload.value.FilterColumns = [filter, filterCategory];
    const resShoesSameCategory = await shoesService.paging(payload.value);
    payload.value.FilterColumns = [filter, filterBrand];
    const resShoesSameBrand = await shoesService.paging(payload.value);

    if (resShoesSameCategory && resShoesSameCategory.Success) {
      shoesSameCategory.value = resShoesSameCategory.Data;
    }

    if (resShoesSameBrand && resShoesSameBrand.Success) {
      shoesSameBrand.value = resShoesSameBrand.Data;
    }
  } catch (error) {}
};

const changeColor = (id: number) => {
  if (colorID.value == id) {
    colorID.value = undefined;
  } else {
    colorID.value = id;
  }
};

onUnmounted(() => {
  managementStore.resetFilter();
});
</script>

<style lang="scss">
.product-detail-container {
  .content {
    min-height: 540px;
    height: 540px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 70px;
    .image-area {
      width: 480px;
      min-width: 480px;
    }
    .color-item {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #ddd;
      position: relative;
    }

    .color-item.active::after {
      content: "";
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: green;
      top: -1px;
      right: -1px;
      border-radius: 50%;
    }

    .voucher {
      background: red;
      color: white;
      padding: 8px;
      border-radius: 4px;
      box-sizing: border-box;
      width: fit-content;
    }
  }
}
</style>
