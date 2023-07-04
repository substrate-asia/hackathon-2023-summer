<template>
  <div class="gallery-container">
    <vab-upload
      ref="vabUpload"
      url="/api/img/"
      name="src"
      :limit="50"
      :size="8"
    ></vab-upload>

    <!-- Album -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ title }}({{ checkedIndex + 1 }} / {{ total }})</span>
        <span v-if="albumName">> {{ albumName }} ({{ albumCnt }})</span>
        <el-page-header
          v-if="false"
          :content="title"
          @back="goBack"
        ></el-page-header>
        <el-button-group style="float: right">
          <el-button type="primary" icon="el-icon-plus"></el-button>
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button
            type="primary"
            icon="el-icon-map-location"
            @click="clear"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-user-solid"
            @click="changeFaceMode"
          ></el-button>

          <el-button
            type="primary"
            icon="el-icon-remove"
            @click="onAlbumChoose($event, -1, null)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="handleShow({ key: 'value' })"
          ></el-button>
        </el-button-group>
      </div>

      <div
        id="album"
        ref="album"
        v-infinite-scroll="load"
        class="infinite-list"
        style="overflow: auto"
        infinite-scroll-distance="50"
      >
        <div
          v-for="(album, index) in items"
          :key="album.id"
          class-name="album-item"
          class="infinite-list-item"
          @click="onAlbumChoose($event, index, album)"
          @dblclick="onDoubleClick($event, index, album)"
        >
          <img
            className="img-responsive"
            :class="checkedIndex === index ? 'img-checked' : 'img-unchecked'"
            :src="album.src"
            :alt="album.name"
          />
          <!-- :title="album.name" -->
          <div class="jg-caption">
            <el-badge
              :value="album.value"
              :max="99"
              class="item"
              type="primary"
            >
              <el-input
                v-model="album.name"
                size="small"
                placeholder="Change the Name"
                style="float: left; font-size: 8px"
                class="album-name"
                @blur="changeName(album.name, album)"
                @keyup.enter.native="enterBlur($event)"
              ></el-input>
            </el-badge>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import $ from 'jquery'

  import 'justifiedGallery/dist/js/jquery.justifiedGallery.min'
  import 'justifiedGallery/dist/css/justifiedGallery.css'

  import VabUpload from '@/components/VabUpload'

  import {
    changeFaceAlbumName,
    changeFaceName,
    clear_face_album,
  } from '@/api/gallery'

  export default {
    name: 'Album',
    components: { VabUpload },
    props: {
      items: {
        type: Array,
        default: () => [],
        required: true,
      },
      total: {
        type: Number,
        default: 50,
        required: true,
      },

      title: {
        type: String,
        default: 'Album', // model field name
        required: true,
      },
      type: {
        type: String,
        default: 'img', // could be face, personal, group, collection, address, obect
        required: false,
      },
      route: {
        type: String,
        default: 'Face_detail', // could be face, personal, group, collection, address, obect
        required: false,
      },
    },
    data() {
      return {
        drawer: false,
        direction: 'rtl',
        plugin: null,
        elementLoadingText: '正在加载...',
        msg: '',
        postData: {
          id: 0,
          name: '',
        },
        // albums: [],
        albumLoading: false,
        totalAlbumCnt: 0,
        curAlbumCnt: 0,

        checkedIndex: -1, //if set this default value to 0, then the album will auto checked once enter this page
        checkedId: 0,
        checkedName: '',
        // dispTags: false,

        albumName: '', //相册下面的具体名字
        albumCnt: 1, //某个相册下面的具体数量
      }
    },
    watch: {
      items(newVal, oldVal) {
        this.$nextTick(() => {
          console.log('Album numbers have been changed', newVal.length)
          // window.album.refresh()
          $('#album').justifiedGallery()
          // $('#album').justifiedGallery('norewind')
        })
      },
    },
    created() {
      // this.fetchAlbum()
    },
    mounted() {
      this.justifyInit()
    },
    methods: {
      justifyInit: function () {
        // $('#album')
        $('[id=album]')
          .justifiedGallery({
            captions: true,
            lastRow: 'left',
            rowHeight: 150,
            margins: 5,
          })
          .on('jg.complete', function () {
            // console.log('jg.complete event was trigged')
          })
      },

      onAlbumChoose($event, index, item) {
        console.log('单击事件: ', item)

        this.checkedIndex = index
        this.checkedId = item.id
        if (index < 0) return //reture directly if there is no item in items

        this.$emit('albumClick', index, item) //自定义事件  传递值“子向父组件传值”
      },

      //双击事件
      onDoubleClick(event, index, item) {
        console.log('双击事件')
        this.$emit('doubleClick', index, item) //自定义事件  传递值“子向父组件传值”
      },

      async changeFaceAlbumName(value, album) {
        console.log(value, this.albumName)
        // this.items[index].name = value
        if (value !== this.albumName) {
          this.postData.id = album.id //人脸相册id
          this.postData.name = value

          const { data, msg } = await changeFaceAlbumName(this.postData)
          console.log(data, msg)
          this.$message({
            message: `Success changed ${this.albumName} to ${value}`,
            type: 'success',
          })

          this.albumName = value
        }
      },

      async changeFaceName(value, album) {
        console.log(value, this.albumName)
        // this.items[index].name = value
        if (value !== this.albumName) {
          this.postData.id = this.checkedId
          this.postData.name = value
          console.log('this.postData.id', this.postData.id)
          const { data, msg } = await changeFaceName(this.postData)
          console.log(data, msg)
          this.$message({
            message: `Success changed ${this.albumName} to ${value}`,
            type: 'success',
          })

          this.albumName = value
        }
      },

      changeName(value, album) {
        if (this.type === 'person') {
          this.changeFaceAlbumName(value, album)
        }
        if (this.type === 'img') {
          this.changeFaceName(value, album)
        }
      },

      changeFaceMode() {
        this.$store.state.face.isGroupMode = !this.$store.state.face.isGroupMode
        this.checkedIndex = -1 //clear the select one, back to default state
      },

      //回车失去焦点
      enterBlur(event) {
        event.target.blur()
      },

      async clear() {
        const { data, msg } = await clear_face_album(this.postData)
        console.log(msg)
        this.$message({
          message: msg,
          type: 'success',
        })
      },
      //upload the img
      handleShow(data) {
        this.$refs['vabUpload'].handleShow(data)
      },

      load() {
        this.$emit('load') //自定义事件  传递值“子向父组件传值”
      },
    },
  }
</script>

<style lang="css" scoped>
  .img-checked {
    border-radius: 60px;
    border-style: solid;
    border-width: 3px;
    border-color: #1515f1c3;
    box-shadow: -20px -20px 20px rgba(34, 34, 183, 0.5);

    /* opacity: 0.1; */
  }
  .img-unchecked {
    opacity: 0.5;
  }
  /* .box-card {
    height: 500x;
    border: 1px solid rgb(8, 23, 231);
  } */
  .item {
    margin-top: 1px;
    margin-right: 15px;
  }
  /* .infinite-list {
    height: 550px;
    width: 100%;
    margin: 0 auto;
    overflow: auto;
  } */
</style>
