<template>
  <div class="gallery-container">
    <vab-upload
      ref="vabUpload"
      url="/api/img/"
      name="src"
      :limit="50"
      :size="8"
    ></vab-upload>

    <!-- FaceGallery -->
    <el-card v-if="true" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ name }}({{ items.length }} / {{ total }})</span>
        <el-button-group style="float: right">
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button
            type="primary"
            icon="el-icon-map-location"
            @click="test"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="handleShow({ key: 'value' })"
          ></el-button>
        </el-button-group>
      </div>

      <!-- 照片墙展示 -->
      <div
        id="gallery"
        ref="gallery"
        v-infinite-scroll="load"
        class="infinite-list"
        style="overflow: auto"
      >
        <a
          v-for="item in items"
          :key="item.id"
          class="gallery infinite-list-item"
          className="gallery-item"
          :data-src="storageType === 'oss' ? item.src : item.mcs.nft_url"
          :data-sub-html="item.desc"
        >
          <img
            className="img-responsive"
            :src="dispType === 'face' ? item.thumb_face : item.thumb"
          />
        </a>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from 'jquery'

  import lightGallery from 'lightgallery'
  // Plugins
  import lgThumbnail from 'lightgallery/plugins/thumbnail'
  import lgZoom from 'lightgallery/plugins/zoom'
  import lgAutoplay from 'lightgallery/plugins/autoplay'
  import lgRotate from 'lightgallery/plugins/rotate'
  import lgFullscreen from 'lightgallery/plugins/fullscreen'
  import lgMediumZoom from 'lightgallery/plugins/mediumZoom' //适用于博客照片放大

  import 'lightgallery/css/lightgallery-bundle.css' //CSS 打包引用

  import 'justifiedGallery/dist/js/jquery.justifiedGallery.min'
  import 'justifiedGallery/dist/css/justifiedGallery.css'

  import VabUpload from '@/components/VabUpload'

  export default {
    name: 'Gallery',
    components: { VabUpload },
    props: {
      items: {
        type: Array,
        default: () => [],
        required: true,
      },
      name: {
        type: String,
        default: '88888888888888', // model field name
        required: true,
      },
      total: {
        type: Number,
        default: 50,
        required: true,
      },
      dispType: {
        type: String,
        default: 'face', // model field name
        required: true,
      },
      storageType: {
        type: String,
        default: 'oss', // oss, mcs
        required: false,
      },
      limit: {
        type: Number,
        default: 50,
        required: false,
      },
      size: {
        type: Number,
        default: 8,
        required: false,
      },
    },
    data() {
      return {
        // dispType: 'face', //could be face, thumb, map
        // srcList: this.items, //初始化直接用props中的值
      }
    },
    computed: {},
    watch: {
      items(newVal, oldVal) {
        this.$nextTick(() => {
          console.log('gallery have been changed')
          window.gallery.refresh()
          // $('#gallery').justifiedGallery('norewind')
          $('#gallery').justifiedGallery()
        })
      },
    },
    created() {},
    mounted() {
      this.lgInit()
      this.justifyInit()
    },
    methods: {
      justifyInit: function () {
        $('#gallery')
          .justifiedGallery({
            captions: false,
            lastRow: 'left',
            rowHeight: 150,
            margins: 5,
          })
          .on('jg.complete', function () {
            console.log('jg.complete event was trigged')
          })
      },
      lgInit: function () {
        const lgGallery = document.getElementById('gallery')
        window.gallery = lightGallery(lgGallery, {
          // dynamic: true,
          addClass: 'gallery',
          autoplayFirstVideo: false,
          pager: false,
          galleryId: 'nature',
          plugins: [
            lgThumbnail,
            lgZoom,
            lgAutoplay,
            lgRotate,
            lgFullscreen,
            // lgMediumZoom,
          ],
          thumbnail: true,
          slideShowInterval: 2000,
          mobileSettings: {
            controls: false,
            showCloseIcon: false,
            download: false,
            rotate: false,
          },
        })
      },
      onChangeDispType(type) {
        // this.dispType = type
        // console.log('before')
        // this.srcList = []
        // console.log('after')
        // this.$nextTick(() => {
        //   window.gallery.refresh()
        //   $('#gallery').justifiedGallery('norewind')
        //   console.log('onChangeDispType2')
        // })
        // console.log('onChangeDispType')
        // console.log(this.srcList)
      },
      test() {},
      handleShow(data) {
        this.$refs['vabUpload'].handleShow(data)
      },
      load() {
        console.log('loading...')
      },
    },
  }
</script>

<style lang="css" scoped></style>
