<template>
    <div class="about-container">
        <div class="banner dis-flex text-white jus-space-between align-flex-end p-40 font-24">
            <div>Địa chỉ : 298 Cầu Diễn</div>
            <div class="font-36 font-weight-700">Fly Shoes</div>
            <div>SDT : 0866940201</div>
        </div>

        <div class="font-28 font-weight-600 mb-8 mt-40">This is our life story</div>
        <div class="font-20 font-weight-500">Beginning of tea parties</div>

        <div class="dis-flex mt-40 pt-40 content-1">
            <div class="mr-40 lh-32 font-16">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
            </div>
            <div class="ml-40 lh-32 font-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</div>
        </div>

        <div class="dis-flex mt-160">
            <div class="image-1 mr-80"></div>
            <div class="lh-32 font-16">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
        </div>

        <div class="image-2 mt-40"></div>

        <div class="dis-flex mt-40">
            <div class="lh-32 font-16">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            <div class="image-3 ml-80 lh-32"></div>
        </div>

        <div class="mt-120 flex-center flex-column">
            <div class="font-32 font-weight-500 mb-16">Our Philosophy</div>
            <div class="w-40pc text-center lh-20">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. </div>
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

    .image-1,.image-3{
        height: 460px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;background-color: tan;
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