<template>
    <div class="about-container">
        <div class="banner dis-flex text-white jus-space-between align-flex-end p-40 font-24">
            <div>Địa chỉ : 298 Cầu Diễn</div>
            <div class="font-36 font-weight-700">Fly Shoes</div>
            <div>SDT : 0866940201</div>
        </div>

        <div class="font-28 font-weight-600 mb-8 mt-40">FLY SHOES - GIÀY THỂ THAO THỜI TRANG GIÁ TỐT</div>
        <div class="font-20 font-weight-500">Beginning of tea parties</div>

        <div class="dis-flex mt-40 pt-40 lh-32 font-16 content-1">
            Lời đầu tiên, cho phép Fly shoes được gửi tới quý khách, quý thân nhân và bạn bè lời chúc sức khỏe, thành đạt và
            hạnh phúc. Với nhiều năm kinh nghiệm hoạt động trong lĩnh vực thương mại điện tử tại Việt Nam. Fly shoes mang
            đến
            Dịch vụ mua sắm trực tuyến thông minh & chuyên nghiệp hàng đầu tại Việt Nam. Sau một thời gian hoạt động,
            website
            đã có những bước tiến đáng kể cả về chất lượng và hình thức. Số lượng khách truy cập trở thành khách hàng mua
            sắm
            tăng lên đáng kể. Từ việc chăm chút nội dung cho sản phẩm theo sở thích, Fly Shoes đã dần chinh phục khách
            hàng
            với những dịch vụ mua sắm trực tuyến uy tín và chất lượng. Tự tin với khả năng đáp ứng mọi yêu cầu mua sắm của
            khách hàng, Fly shoes chính thức đem lại dịch vụ mua sắm trực tuyến từ đầu năm 2020. Sự ủng hộ và tin tưởng của
            khách hàng sẽ trở thành nguồn cảm hứng lớn lao cho Fly shoes trong quá trình phác họa những ý tưởng được trở
            thành
            hiện thực.
        </div>

        <div class="dis-flex mt-160">
            <div class="image-1 mr-80"></div>
            <div>
                <div class="font-20 font-weight-600 mb-20">TẠI SAO NÊN CHỌN CHÚNG TÔI?</div>
                <div class="lh-32 font-16">Giao diện website được thiết kế thuận tiện, dễ dàng tìm kiếm sản phẩm và cách
                    thức đặt hàng, mua hàng, liên hệ…Việc mua sắm chưa bao giờ đơn giản hơn thế. Thanh toán đơn giản và
                    nhanh chóng Sau khi đã lựa chọn được sản phẩm ưng ý quý khách có thể chọn trong hiều phương thức thanh
                    toán khác nhau. Việc thanh toán có thể thực hiện đơn giản bằng hóa đơn, chuyển khoản hay trả qua thẻ ghi
                    nợ và thẻ tín dụng. Sau khi đặt hàng thành công, quý khách sẽ được thông báo về tình trạng của đơn hàng.
                    Dịch vụ chăm sóc khách hàng chu đáo và chuyên nghiệp Quý khách có thể sử dụng đường dây nóng miễn phí
                    hoặc trao đổi với những chuyên viên ở bộ phận Chăm sóc khách hàng để xin tư vấn về những vấn đề cá nhân
                    có liên quan từ thời trang, phong cách, hướng dẫn mua hàng. DQ SHOP luôn sẵng sàng hỗ trợ khách hàng một
                    cách tốt nhất, chu đáo nhất và chuyên nghiệp nhất bằng nhiều loại dịch vụ chăm sóc khách hàng khác nhau.
                </div>
            </div>
        </div>

        <div class="image-2 mt-40"></div>

        <div class="dis-flex mt-40">
            <div>
                <div class="font-20 font-weight-600 mb-20">ĐỊA CHỈ CỬA HÀNG: 298, Cầu Diễn, Hà Nội.</div>
                <div class="lh-32 font-16">
                    HOTLINE: 0866940021<br>
                    EMAIL: mhung.haui.webdev@gmail.com
                </div>
            </div>
            <div class="image-3 ml-80 lh-32"></div>
        </div>

        <div class="mt-120 flex-center flex-column">
            <div class="font-32 font-weight-500 mb-16">Our Philosophy</div>
            <div class="w-40pc text-center lh-20">Chừng nào mà chân tôi còn trên mặt đất, tôi sẽ chỉ mang những đôi giày đẹp
            </div>
            <div class="mt-8">― Dr. Seuss, Oh, The Places You'll Go!</div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.about-container {
    .banner {
        height: 600px;
        background-image: url("../../common/images/about-banner.jpg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        box-shadow: inset 0px -118px 144px 0px #333;
        background-attachment: fixed;
    }

    .content-1 {
        border-top: 1px solid #ddd;
    }

    .image-2 {
        height: 600px;
        background-image: url("../../common/images/about-image-2.jpg");
        // background-attachment: fixed;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    .image-1,
    .image-3 {
        height: 460px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: tan;
        width: 520px;
        min-width: 520px;
    }

    .image-1 {
        background-image: url("../../common/images/about-image-1.jpg");
    }

    .image-3 {
        background-image: url("../../common/images/about-image-3.jpg");
    }
}
</style>