<template>
  <div>
    <!-- 地图 -->
    <Map ref="map" :addrs="addrs" @callbackComponent="callbackComponent" />

    <ImgSlide
      v-if="$store.state.map.isShowSwiper"
      ref="imgswiper"
      :imgs="imgs"
    ></ImgSlide>
  </div>
</template>

<script>
  import Map from './map.vue'
  import ImgSlide from './imgSlide.vue'
  import { getImg, getAddress } from '@/api/gallery'
  export default {
    name: 'PgAddress',
    components: { Map, ImgSlide },
    data() {
      return {
        Img: [
          {
            position: [121.127403, 30.173497],
            content: `"<img src="http://localhost:8000/media/CACHE/images/blue/img/2021/02/09/IMG_20210209_160111/833e2409837910a3f0c5892336f16d16.jpg" style="width: 80px; " />"`,
            offset: [-15, -35],
            offsetText: [35, -58],
            label: { content: '11', offset: [10, 10] },
            text: `<div style="width: 60px; font-size: 20px; color: #ff0000; text-align: center;line-height: 50px; height: 60px;">20</div>`,
          },
        ],
        imgs: [],
        addrs: [],
        addrQueryForm: {
          search: '',
          id: '',
          is_located: true,
          longitude__range: '',
          latitude__range: '',
          country__contains: '',
          province__contains: '',
          city__contains: '',
          district__contains: '',
          location__contains: '',
          c_back: '',
          address__city: '',
        },
      }
    },
    computed: {},
    watch: {},
    beforeMount() {
      // !this.order_no && this.getCarsActivation()
    },
    methods: {
      callbackComponent(params) {
        params.function && this[params.function](params.data)
      },
      // 地图初始化完成回调
      loadMap(data) {
        // console.log('data is :', data)
        this.fetchAddress()
      },
      // 地图点击聚合点后完成回调
      loadImg(data) {
        this.fetchImg()
      },
      // 获取img gps数据
      async fetchAddress() {
        var queryForm = this.$store.state.map.addrQueryForm
        const { data, totalCnt } = await getAddress(queryForm)
        console.log('fetchAddress result:', data, totalCnt)
        this.addrs = data
      },
      async fetchImg() {
        var queryForm = this.$store.state.img.queryForm
        const { data, totalCnt } = await getImg(queryForm)
        this.imgs = data
        this.totalCnt = totalCnt
        console.log('totalCnt is: %d', this.totalCnt)
      },
    },
  }
</script>

<style></style>
