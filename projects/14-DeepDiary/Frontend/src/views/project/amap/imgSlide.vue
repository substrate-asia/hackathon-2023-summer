<template>
  <div v-if="imgs && imgs.length > 0" class="imgs-wrap">
    <div class="imgs-swiper-wrap">
      <swiper ref="swiper" class="swiper" :options="swiperOption">
        <swiper-slide v-for="item in imgs" :key="item.id">
          <imgsItem :img="item" />
        </swiper-slide>

        <div slot="pagination" class="swiper-pagination"></div>
        <div slot="button-prev" class="swiper-button-prev"></div>
        <div slot="button-next" class="swiper-button-next"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
  // imgs item
  import imgsItem from './imgItem.vue'
  // swiper
  import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  // API

  export default {
    name: 'ImgSlide',
    components: { imgsItem, Swiper, SwiperSlide },
    props: {
      imgs: {
        type: Array,
        default: () => [
          {
            id: 1,
            content: '',
            position: [],
            offset: [],
          },
        ],
      },
    },
    data() {
      return {
        swiperOption: {
          slidesPerView: 5,
          breakpoints: {
            // responsive define
            1920: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            1600: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            960: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
          },
          spaceBetween: 10,

          // loop: true,
          // loopedSlides: 1, //
          // zoom: true,
          // slidesPerGroup: 5,
          // loopFillGroupWithBlank: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
          keyboard: {
            enabled: true,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        imgsList: [
          {
            id: 434,
            src: 'http://localhost:8000/media/blue/img/2021/09/19/IMG_20210919_110530_lAcSgku.jpg',
            thumb:
              'http://localhost:8000/media/CACHE/images/blue/img/2021/09/19/IMG_20210919_110530_lAcSgku/161945f6ee4f8c09e9c27f350ce65132.jpg',
            tags: 'people,family,爷爷,奶奶',
          },
          {
            id: 433,
            src: 'http://localhost:8000/media/blue/img/2021/02/09/IMG_20210209_160111.jpg',
            thumb:
              'http://localhost:8000/media/CACHE/images/blue/img/2021/02/09/IMG_20210209_160111/833e2409837910a3f0c5892336f16d16.jpg',
            tags: 'people,family,susan,blue,导入时间,import date,portrait,person,smile,smiling,happy,nutriment,happiness,together,love,male,man,couple,210321,frozen dessert,dessert,ice lolly',
            img_url: 'http://localhost:8000/api/img/433/',
            name: 'IMG_20210209_160111.jpg',
          },
          {
            id: 432,
            src: 'http://localhost:8000/media/blue/img/1970/01/01/eed6ff167af13d6a271c25cc9b6da277.jpeg',
            thumb:
              'http://localhost:8000/media/CACHE/images/blue/img/1970/01/01/eed6ff167af13d6a271c25cc9b6da277/350894e8304ef264a3df21c3aa08ca2d.jpeg',
            tags: 'people,attractive,cover girl,adult,pretty,fashion,model,portrait,person,face,hair,eyes,brunette,smasher,cute,happy',
          },
          {
            id: 431,
            src: 'http://localhost:8000/media/blue/img/1970/01/01/b1fc6cc28c297f6910f267da332d7fc8.jpeg',
            thumb:
              'http://localhost:8000/media/CACHE/images/blue/img/1970/01/01/b1fc6cc28c297f6910f267da332d7fc8/7bb5bfc1d897419122805b02b8a0379e.jpeg',
            tags: 'attractive,adult,pretty,fashion,sexy,model,portrait,person,face,hair,lady,makeup,brunette,skin,lips,cute,saint,abbess,lock,make',
          },
          {
            id: 430,
            src: 'http://localhost:8000/media/blue/img/1970/01/01/1310f1459e8cabf0e02cea3fd5960e7d.jpeg',
            thumb:
              'http://localhost:8000/media/CACHE/images/blue/img/1970/01/01/1310f1459e8cabf0e02cea3fd5960e7d/c8212dc44d7c29de7843e74580f5cb8b.jpeg',
            tags: 'people,attractive,cover girl,adult,pretty,fashion,sexy,model,portrait,person,face,hair,lady,eyes,makeup,brunette,skin,smasher,lips,blond,cute,smile,human,youth',
            img_url: 'http://localhost:8000/api/img/430/',
            name: '1310f1459e8cabf0e02cea3fd5960e7d.jpeg',
          },
          {
            id: 429,
            src: 'http://localhost:8000/media/blue/img/1970/01/01/9b0581159678d43fb03b5b1aceda1546.jpeg',
            thumb:
              'http://localhost:8000/media/CACHE/images/blue/img/1970/01/01/9b0581159678d43fb03b5b1aceda1546/5abb05fcff0be30bbba2abfcc5b18c73.jpeg',
            tags: 'people,attractive,adult,pretty,fashion,model,portrait,person,face,hair,makeup,skin,blond,cute,smile,lifestyle,deity,saint,shoulder,superior,smiling,abbess,happy,care',
            img_url: 'http://localhost:8000/api/img/429/',
          },
        ],
      }
    },
    watch: {},
    methods: {},
  }
</script>
<style lang="scss">
  .imgs-wrap {
    position: absolute; // refer to the father div
    left: 0;
    bottom: 100px;
    right: 0;
    z-index: 11;
  }
</style>
