<template>
  <DxPopup v-bind="config">
    <template #content>
      <DxScrollView :style="{paddingBottom:'56px'}">
        <div>
          <div>Voucher<span class="text-red">*</span></div>
          <FSTextBox v-model="voucher.VoucherTitle" class="mt-4">
            <DxValidator>
              <DxRequiredRule message="Voucher không được để trống" />
            </DxValidator>
          </FSTextBox>

          <div class="mt-16 mb-4">Loại voucher</div>
          <DxRadioGroup
            v-model="voucher.FormulaType"
            display-expr="Text"
            value-expr="Value"
            layout="horizontal"
            :data-source="voucherTypes"
          ></DxRadioGroup>

          <div class="mt-16 mb-4">Số lượng</div>
          <DxNumberBox
            min="1"
            v-model="voucher.Quantity"
          ></DxNumberBox>

          <div class="mt-16 mb-4">Giảm</div>
          <DxNumberBox
            v-bind="configInputValue"
            v-model="voucher.VoucherValue"
          ></DxNumberBox>

          <div class="mt-16 mb-4">Ngày kết thúc</div>
          <FSDateBox v-model="voucher.EndDate"></FSDateBox>

          <div class="mt-16 mb-4">Giày áp dụng</div>
          <DxTagBox
            v-model="voucher.ShoesIDApply"
            :data-source="shoes"
            display-expr="ShoesName"
            class="shoes-tag-box"
            value-expr="ShoesID"
            item-template="item"
            :showSelectionControls="true"
            :showClearButton="true"
            selectAllText="Chọn tất cả"
            :searchEnabled="true"
            searchExpr="ShoesName"
            placeholder="Chọn giày áp dụng voucher"
          >
            <template #item="{ data }">
              <div>
                <div>
                  <div :style="{whiteSpace:'pre-wrap'}" class="font-weight-700">{{ data.ShoesName }}</div>
                  <div class="text-red">
                    {{
                      data.Price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                    }}
                  </div>
                </div>

                <div class="text-green">
                  {{ data.VoucherID ? "Đã có voucher" : "--" }}
                </div>
              </div>
            </template>
          </DxTagBox>
        </div>
      </DxScrollView>

      <div class="footer align-center dis-flex jus-flex-end p-20">
        <FSButton class="mr-8" :config="{text:'Hủy',onClick:() => $router.back()}"></FSButton>
        <FSButton :config="{text:'Lưu',type:'default',stylingMode:'contained',onClick:save}"></FSButton>
      </div>
    </template>
  </DxPopup>
</template>

<script setup lang="ts">
import ShoesService from "@/apis/shoes-service";
import VoucherService from "@/apis/voucher-service";
import { FSButton, FSDateBox, FSTextBox } from "@/components/controls";
import { FormulaType, ModelState } from "@/enums";
import { Shoes, Voucher } from "@/models";
import { useManagementStore } from "@/stores";
import { DxRequiredRule } from "devextreme-vue/data-grid";
import { DxNumberBox } from "devextreme-vue/number-box";
import { DxPopup } from "devextreme-vue/popup";
import DxRadioGroup from "devextreme-vue/radio-group";
import { DxScrollView } from 'devextreme-vue/scroll-view';
import DxTagBox from "devextreme-vue/tag-box";
import DxValidator from "devextreme-vue/validator";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const voucher = ref<Voucher>(new Voucher());

const managementStore = useManagementStore();

const shoesService = new ShoesService();
const voucherService = new VoucherService();
const shoes = ref<Shoes[]>([]);

onMounted(async () => {
    try {
        const result = await shoesService.getAll();
        if (result && result.Success && result.Data) {
          shoes.value = result.Data;
        }
    } catch (error) {
        console.log(error);
        managementStore.showError();
    }
});

const voucherTypes = ref<
  {
    Text: string;
    Value: FormulaType;
  }[]
>([
  {
    Text: "Phần trăm",
    Value: FormulaType.Percent,
  },
  {
    Text: "Trừ thẳng",
    Value: FormulaType.Subtraction,
  },
]);

const configInputValue = computed<DxNumberBox>(() => {
  return {
    min: voucher.value.FormulaType == FormulaType.Subtraction ? 1000 : 1,
    max: voucher.value.FormulaType == FormulaType.Subtraction ? undefined : 100,
    step: voucher.value.FormulaType == FormulaType.Subtraction ? 1000 : 1,
    format:
      voucher.value.FormulaType == FormulaType.Subtraction
        ? "VND #,##0.##"
        : undefined,
  };
});

const config = ref<DxPopup>({
  dragEnabled: true,
  width: 400,
  height: 600,
  visible: true,
  onHidden: () => router.back(),
  showCloseButton: true,
  title: "Thông tin voucher",
  wrapperAttr:{class:"popup-voucher-form"}
});

const validate = () =>{
    if(voucher.value.VoucherTitle == "" && voucher.value.ShoesIDApply.length == 0){
        managementStore.showWaring("Vui lòng nhập đủ thông tin !")
        return false;
    }

    return true;
}

const save = async () => {
    if(validate()){
        voucher.value.State = ModelState.Insert;
        try {
            var result = await voucherService.save(voucher.value);
            if(result && result.Success){
                managementStore.showSuccess("Lưu thành công");
                router.back();
            }else{
                managementStore.showSuccess();
            }

        } catch (error) {
            console.log(error);
            managementStore.showError();
        }
    }
}
</script>

<style lang="scss" scoped>
.popup-voucher-form {
    .dx-overlay-content {
        position: relative;

        .footer {
            position: absolute;
            width: 100%;
            height: 56px;
            background-color: rgb(233, 233, 233);
            left: 0;
            bottom: 0;
        }
    }
}
</style>
