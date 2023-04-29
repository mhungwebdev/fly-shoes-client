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

        <FSButton :config="{
          text: 'Khám phá ngay',
          type: 'normal',
          stylingMode: 'outlined',
          elementAttr: { class: 'text-white' },
          focusStateEnabled: true,
          activeStateEnabled: true,
        }"></FSButton>
      </div>
    </div>

    <div class="mt-60">
      <div class="font-28">FLY SHOES - GIÀY THỂ THAO THỜI TRANG GIÁ TỐT</div>
      <div class="mt-20 font-18 short-about">
        Beginning of tea parties
      </div>
      <div class="dis-flex mt-20 font-16 lh-32">
        Lời đầu tiên, cho phép Fly shoes được gửi tới quý khách, quý thân nhân và bạn bè lời chúc sức khỏe, thành đạt và
        hạnh phúc. Với nhiều năm kinh nghiệm hoạt động trong lĩnh vực thương mại điện tử tại Việt Nam. Fly shoes mang đến
        Dịch vụ mua sắm trực tuyến thông minh & chuyên nghiệp hàng đầu tại Việt Nam. Sau một thời gian hoạt động, website
        đã có những bước tiến đáng kể cả về chất lượng và hình thức. Số lượng khách truy cập trở thành khách hàng mua sắm
        tăng lên đáng kể. Từ việc chăm chút nội dung cho sản phẩm theo sở thích, Fly Shoes đã dần chinh phục khách hàng
        với những dịch vụ mua sắm trực tuyến uy tín và chất lượng. Tự tin với khả năng đáp ứng mọi yêu cầu mua sắm của
        khách hàng, Fly shoes chính thức đem lại dịch vụ mua sắm trực tuyến từ đầu năm 2020. Sự ủng hộ và tin tưởng của
        khách hàng sẽ trở thành nguồn cảm hứng lớn lao cho Fly shoes trong quá trình phác họa những ý tưởng được trở thành
        hiện thực.
      </div>
    </div>

    <div class="mt-160">
      <div class="font-40 dis-flex jus-center">Top bán chạy</div>
      <div class="dis-flex jus-center font-20 mt-8 mb-20">
        Những sản phẩm nổi bật được yêu thích nhất
      </div>

      <div class="dis-flex mt-40 jus-space-between">
        <ShoesCard :width="380" class="best-seller" :is-preview="false" v-for="(shoes, index) in bestSeller" :key="index"
          :shoes="shoes"></ShoesCard>
      </div>

      <div class="p-10 mt-40 dis-flex align-center w-100pc" :style="{background: '#efefef'}">
        <div class="banner-vnpay mr-20"></div>
        <div class="font-20 text-primary font-weight-600">Thanh toán online thuật tiện với VNPAY. Hỗ trợ hầu hết tất cả ngân hàng. Mua sắm nhanh chóng và an toàn</div>
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
  CustomParam: {
    UserID: userStore.currentUser?.UserID
  }
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

  .banner-vnpay {
    background-image: url('../../common/images/vnpay.jpg');
    width: 120px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}</style>
