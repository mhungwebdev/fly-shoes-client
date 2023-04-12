<template>
  <div class="home-container">
    <div class="banner">
      <div class="overlay flex-column text-white">
        <div class="font-36 font-weight-600 mb-16 text-center">
          Step up your style with our shoes
        </div>
        <div class="font-18 text-center mb-20 w-30pc typing">
          Với nhiều thương hiệu và thể loại chúng tôi tự tin có thể thoản mãn
          nhu cầu của bạn
        </div>

        <FSButton
          :config="{
            text: 'Khám phá ngay',
            type: 'normal',
            stylingMode: 'outlined',
            elementAttr: { class: 'text-white' },
            focusStateEnabled:true,
            activeStateEnabled:true,
          }"
        ></FSButton>
      </div>
    </div>

    <div class="mt-60">
      <div class="font-28">This is your space</div>
      <div class="mt-20 font-18 short-about">
        Talk about your business, your products, or yourself.
      </div>
      <div class="dis-flex mt-40">
        <div class="mr-20">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </div>
        <div class="ml-20">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </div>
      </div>
    </div>

    <div class="mt-160">
      <div class="font-40 dis-flex jus-center">Top bán chạy</div>
      <div class="dis-flex jus-center font-20 mt-8 mb-20">
        Những sản phẩm nổi bật được yêu thích nhất
      </div>

      <div class="dis-flex mt-40">
        <ShoesCard
          class="flex-1 best-seller mr-20"
          :is-preview="false"
          v-for="(shoes, index) in bestSeller"
          :key="index"
          :shoes="shoes"
        ></ShoesCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShoesService from "@/apis/shoes-service";
import { SortOrder, type PagingPayload, type Shoes } from "@/models";
import { useManagementStore, useUserStore } from "@/stores";
import { onMounted, ref } from "vue";
import ShoesCard from "../shoes/ShoesCard.vue";
import { FSButton } from "@/components/controls";

const managementStore = useManagementStore();
const userStore = useUserStore();
const shoesService = new ShoesService();

const bestSeller = ref<Shoes[]>([]);

const payload = ref<PagingPayload>({
  FilterColumns: [],
  Keyword: "",
  PageIndex: 1,
  PageSize: 3,
  SortOrder: new SortOrder(),
  CustomParam:null
});

onMounted(async () => {
  try {
    const result = await shoesService.paging(payload.value);
    if (result && result.Success && result.Data) {
      bestSeller.value = result.Data;
    }
  } catch (error) {
    managementStore.showError();
  }
});
</script>

<style lang="scss" scoped>
.home-container {
  .banner {
    background-image: url("@/common/images/back-group-home.jpg");
    height: 420px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;

    .overlay {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: none;
    }

    &:hover {
      .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .short-about {
    border-bottom: 1px solid #b1b1b1;
    padding-bottom: 48px;
  }

  .best-seller:last-child {
    margin-right: 0px;
  }

  /* The typing effect */
  @keyframes typing {
    from {
      width: 10px;
    }
    to {
      width: 30%;
    }
  }

  /* The typewriter cursor effect */
  @keyframes blink-caret {
    from,
    to {
      border-color: transparent;
    }
    50% {
      border-color: orange;
    }
  }

  .typing {
    height: 40px;
    overflow: hidden;
    animation: typing 1.5s steps(40, end), blink-caret 0.75s step-end infinite;
  }
}
</style>
