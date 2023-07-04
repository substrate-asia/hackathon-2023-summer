<template>
  <div class="img-container">
    <div class="img_wrap">
      <el-image :src="img.src" lazy class="imgDetail"></el-image>
    </div>
    <Tags :items="img.tags"></Tags>

    <Album
      v-if="true"
      ref="album"
      title="Person"
      type="person"
      :items="img.persons"
      :total="totalPerson"
      @albumClick="onGetAlbumId"
      @doubleClick="onRouteJump"
    ></Album>
    <!-- 地图 -->
    <!-- <Map ref="map" :addrs="[img.address]" /> -->
    <div class="amap-wrap">
      <el-amap
        ref="map"
        vid="amapContainer"
        :center="img.lnglat"
        :zoom="18"
        view-mode="2D"
        class="amap-demo"
      >
        <el-amap-marker :position="img.lnglat" />
      </el-amap>
    </div>
    <h3>{{ img.address.location }}</h3>
    <Color v-if="img.colors" :colors="img.colors"></Color>
    <Mcs
      v-if="checkedIndex >= 0"
      :id="checkedId"
      :mcs="img.mcs"
      mcstype="face"
      :title="`Mcs Info-${checkedId}`"
    ></Mcs>
  </div>
</template>

<script>
  import { getImgDetail } from '@/api/gallery'

  import Album from '@/components/Album'
  import Mcs from './mcs.vue'
  import Tags from './tags.vue'
  import Color from './color.vue'
  import '@/plugins/aMap'
  export default {
    name: 'Img',
    components: { Album, Mcs, Tags, Color },
    //进入守卫：通过路由规则，进入该组件时被调用
    beforeRouteEnter(to, from, next) {
      console.log('beforeRouteEnter....')

      next()
    },
    //离开守卫：通过路由规则，离开该组件时被调用
    beforeRouteLeave(to, from, next) {
      console.log('beforeRouteLeave....')
      next()
    },
    props: {
      id: {
        type: Number,
        default: 113,
        required: false,
      },
      name: {
        type: String,
        default: '照片详情', // model field name
        required: false,
      },
    },
    data() {
      return {
        img: {
          id: 434,
          user: 'blue',
          tags: 'people,family,爷爷,奶奶',
          thumb:
            'http://localhost:8000/media/CACHE/images/blue/img/2021/09/19/IMG_20210919_110530_lAcSgku/161945f6ee4f8c09e9c27f350ce65132.jpg',
          img_url: 'http://localhost:8000/api/img/434/',
          issue_url: 'http://localhost:8000/api/issue/434/',
          faces: [
            {
              id: 687,
              face_album: 48,
              name: '奶奶',
              src: 'http://localhost:8000/media/face/face_28Ee5.jpg',
            },
            {
              id: 686,
              face_album: 50,
              name: '爷爷',
              src: 'http://localhost:8000/media/face/face_67OCn.jpg',
            },
          ],
          names: ['奶奶', '爷爷'],
          mcs: null,
          colors: {
            img: 434,
            background: [
              {
                id: 144,
                r: 170,
                g: 166,
                b: 161,
                closest_palette_color_html_code: '#9f9c99',
                closest_palette_color: 'cathedral',
                closest_palette_color_parent: 'grey',
                closest_palette_distance: 3.22788548469543,
                percent: 64.1514358520508,
                html_code: '#aaa6a1',
                color: 434,
              },
              {
                id: 145,
                r: 110,
                g: 99,
                b: 87,
                closest_palette_color_html_code: '#7a5747',
                closest_palette_color: 'almond',
                closest_palette_color_parent: 'light brown',
                closest_palette_distance: 10.5113162994385,
                percent: 30.0297298431396,
                html_code: '#6e6357',
                color: 434,
              },
              {
                id: 146,
                r: 39,
                g: 36,
                b: 38,
                closest_palette_color_html_code: '#3a3536',
                closest_palette_color: 'graphite',
                closest_palette_color_parent: 'black',
                closest_palette_distance: 5.65835523605347,
                percent: 5.81883382797241,
                html_code: '#272426',
                color: 434,
              },
            ],
            foreground: [
              {
                id: 147,
                r: 37,
                g: 36,
                b: 45,
                closest_palette_color_html_code: '#2b2e43',
                closest_palette_color: 'navy blue',
                closest_palette_color_parent: 'navy blue',
                closest_palette_distance: 6.52309560775757,
                percent: 55.4630889892578,
                html_code: '#25242d',
                color: 434,
              },
              {
                id: 148,
                r: 152,
                g: 117,
                b: 99,
                closest_palette_color_html_code: '#ac7654',
                closest_palette_color: 'dark rose-beige',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 6.76996755599976,
                percent: 23.6442947387695,
                html_code: '#987563',
                color: 434,
              },
              {
                id: 149,
                r: 133,
                g: 145,
                b: 195,
                closest_palette_color_html_code: '#81a0d4',
                closest_palette_color: 'periwinkle',
                closest_palette_color_parent: 'light blue',
                closest_palette_distance: 6.60187721252441,
                percent: 20.8926162719727,
                html_code: '#8591c3',
                color: 434,
              },
            ],
            image: [
              {
                id: 150,
                r: 172,
                g: 169,
                b: 165,
                closest_palette_color_html_code: '#9f9c99',
                closest_palette_color: 'cathedral',
                closest_palette_color_parent: 'grey',
                closest_palette_distance: 3.92975735664368,
                percent: 44.0937881469727,
                html_code: '#aca9a5',
                color: 434,
              },
              {
                id: 151,
                r: 111,
                g: 99,
                b: 88,
                closest_palette_color_html_code: '#7a5747',
                closest_palette_color: 'almond',
                closest_palette_color_parent: 'light brown',
                closest_palette_distance: 9.85335826873779,
                percent: 26.4559421539307,
                html_code: '#6f6358',
                color: 434,
              },
              {
                id: 152,
                r: 36,
                g: 35,
                b: 42,
                closest_palette_color_html_code: '#39373b',
                closest_palette_color: 'black',
                closest_palette_color_parent: 'black',
                closest_palette_distance: 6.68468189239502,
                percent: 17.472957611084,
                html_code: '#24232a',
                color: 434,
              },
              {
                id: 153,
                r: 172,
                g: 138,
                b: 110,
                closest_palette_color_html_code: '#ac8a64',
                closest_palette_color: 'light brown',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 3.47950530052185,
                percent: 6.38603115081787,
                html_code: '#ac8a6e',
                color: 434,
              },
              {
                id: 154,
                r: 129,
                g: 141,
                b: 192,
                closest_palette_color_html_code: '#81a0d4',
                closest_palette_color: 'periwinkle',
                closest_palette_color_parent: 'light blue',
                closest_palette_distance: 7.39144563674927,
                percent: 5.59128093719482,
                html_code: '#818dc0',
                color: 434,
              },
            ],
            color_variance: 27,
            object_percentage: 24.5679988861084,
            color_percent_threshold: 1.75,
          },
          dates: {
            img: 434,
            year: 2021,
            month: 9,
            day: 19,
            capture_date: '2021-09-19',
            capture_time: '11:05:30',
            earthly_branches: 2,
            is_weekend: true,
            holiday_type: 0,
            digitized_date: null,
          },
          evaluates: {
            img: 434,
            flag: 0,
            rating: 3,
            total_views: 0,
            likes: 0,
          },
          address: {
            img: 434,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '台州市',
            district: '临海市',
            location: '浙江省台州市临海市杜桥镇石道地',
            lnglat: [121.518013, 28.72691],
          },
          src: '',
          name: '',
          type: 'jpg',
          wid: 1904,
          height: 4096,
          aspect_ratio: '2.15',
          is_exist: true,
          title: null,
          caption: null,
          label: null,
          camera_brand: 'HUAWEI',
          camera_model: 'NOH-AN00',
          is_publish: false,
          state: 0,
          created_at: '2022-09-23T21:46:01.951693+08:00',
          updated_at: '2022-09-23T22:42:37.217883+08:00',
          size: '1904-4096',
          lnglat: [121.518013, 28.72691],
        },
        // center: [116.127808, 30.173239],
        checkedIndex: 0,
        checkedId: 0,
        totalPerson: 0,
        ImgQueryForm: {
          id: 0,
        },
      }
    },
    // computed: {
    //   img_id: function () {
    //     console.log('img_id have bee updated:', this.$route.query.id)
    //     return this.$route.query.id
    //   },
    // },
    watch: {
      'img.tags'(newVal, oldVal) {
        // console.log('img.tags have bee changed: %s --> %s', oldVal, newVal)
      },
      //   id(newVal, oldVal) {
      //     console.log('img_id have bee updated: %d ---> %d', oldVal, newVal)
      //     this.ImgQueryForm.id = newVal
      //     this.fetchImgDetail()
      //   },
      deep: true, //为true，表示深度监听，这时候就能监测到a值变化
    },
    created() {
      console.log('img vue created')
    },
    mounted() {
      console.log('img vue mounted')
    },
    activated() {
      console.log('the img component is activated')
      this.fetchImgDetail()
    },
    deactivated() {
      console.log('the img component is deactivated')
    },
    methods: {
      onGetAlbumId(index, item) {
        console.log('recieved the child component value %d,%o', index, item)
        // 声明这个函数，便于子组件调用
        this.checkedIndex = index
        this.checkedId = item.face_album //using faces
        this.checkedId = item.id //using persons
      },

      onRouteJump(index, item) {
        console.log(
          'album double click event item is  %d,%o, start join to FaceGallery',
          index,
          item
        )
        this.$router.push({
          name: 'PersonDetail',
          query: {
            // id: item.face_album,  //using faces
            id: item.id, // using persons
            title: item.name,
          },
        })
      },

      async fetchImgDetail() {
        console.log('start to get the img, id is : ', this.$route.query.id)
        this.ImgQueryForm.id = this.$route.query.id
        const { data } = await getImgDetail(this.ImgQueryForm.id)
        console.log(data)
        this.img = data
        this.totalPerson = this.img.persons.length
        // this.center = this.img.address.lnglat
      },
    },
  }
</script>

<style lang="css" scoped>
  .img_wrap {
    width: 100%;
    height: 400px;
    border: 1px dashed #ccc;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .amap-wrap {
    height: 40vh;
  }
</style>
