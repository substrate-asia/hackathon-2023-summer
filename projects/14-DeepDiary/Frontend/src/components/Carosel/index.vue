<template>
  <div class="gallery-container">
    <!-- <el-alert title="子组件消息提示的文案" type="info">
      <br />
      <span>this is carosel vue</span>
    </el-alert> -->

    <el-carousel
      :interval="2000"
      indicator-position="none"
      arrow="always"
      :height="bannerHeight + 'px'"
      @change="carouselChange"
    >
      <el-carousel-item v-for="item in items" :key="item.id">
        <el-row :gutter="12">
          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
            style="height: 400px; margin-bottom: 20px"
          >
            <img
              ref="bannerHeight"
              :src="item.src"
              alt=""
              style="width: 100%"
              @load="imgLoad(item.id)"
            />
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    name: 'Carosel',
    components: {},
    props: {
      items: {
        type: Array,
        default: () => [],
        required: true,
      },
      title: {
        type: String,
        default: '88888888888888', // model field name
        required: false,
      },
    },
    data() {
      return {
        bannerHeight: '',
      }
    },
    watch: {},
    created() {
      // this.fetchAlbum()
    },
    mounted() {
      this.imgLoad()
      window.addEventListener(
        'resize',
        () => {
          this.bannerHeight = this.$refs.bannerHeight[0].height
          this.imgLoad()
        },
        false
      )
    },
    methods: {
      carouselChange: function (key1, key2) {
        // const id = this.gallerys[key1].id
        // console.log(key1, key2)
      },
      imgLoad(id) {
        this.$nextTick(() => {
          this.bannerHeight = this.$refs.bannerHeight[0].height
          console.log(this.$refs.bannerHeight[0].height, +id)
          // document.getElementsByClassName拿到的是数组并非某一个对象
          // var testH = document.getElementById('test-div')
          // testH.style.height = this.bannerHeight + 'px'
        })
      },
    },
  }
</script>

<style lang="css" scoped></style>
