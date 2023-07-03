<template>
  <div>
    <!-- <el-alert title="消息提示的文案" type="info">
      <span v-for="album in albums" :key="album.id">{{ album.id }},</span>
    </el-alert>
    <el-button type="primary" @click="fetchImg()">get albums</el-button> -->

    <ImgSearch
      :filtered-list="filteredList"
      @handleImgSearch="onImgSearch"
    ></ImgSearch>

    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="50"
      infinite-scroll-immediate-check="true"
      class="content"
    >
      <Album
        v-if="true"
        ref="album"
        title="Album"
        type="collection"
        route="Face_detail"
        :items="albums"
        :total="totalCnt"
        @albumClick="onGetAlbumId"
        @doubleClick="onRouteJump"
      ></Album>
    </div>
    <div v-show="busy" class="loading">{{ msg }}</div>

    <!-- <Tags v-if="checkedIndex >= 0" :items="img.tags"></Tags>
    <Color v-if="checkedIndex >= 0" :colors="img.colors"></Color>
    <Mcs
      v-if="checkedIndex >= 0"
      :mcs="img.mcs"
      mcstype="img"
      :title="`Mcs Info-${checkedId}`"
    ></Mcs> -->
    <!-- <Img :id="checkedId"></Img> -->
  </div>
</template>

<script>
  import { getImg, getImgDetail } from '@/api/gallery'
  // import Album from './album.vue'
  import Album from '@/components/Album'
  // import Mcs from './mcs.vue'
  // import Tags from './tags.vue'
  // import Color from './color.vue'
  import ImgSearch from '@/components/Search'
  //   import Img from '../../img'
  import infiniteScroll from 'vue-infinite-scroll'
  export default {
    name: 'PgAlbum',
    components: { Album, ImgSearch }, //Mcs, Tags, Color,Img
    directives: { infiniteScroll },
    data: function () {
      return {
        checkedIndex: -1,
        checkedId: -1,
        albums: [],
        filteredAlbumsId: [],
        albumLoading: false,
        currentCnt: 0,
        totalCnt: 0,
        totalPage: 0,
        queryForm: {
          page: 1,
          size: 20,
          search: '',
          id: '',
          fc_nums: -1, //-1 ,means all, 6 means the fc_nums > 6
          fc_name: '',
          c_img: '',
          c_fore: '',
          c_back: '',
          address__city: '',
          address__longitude__range: '',
          address__latitude__range: '',
        },
        img: {
          id: 424,
          user: 'blue',
          tags: 'people,allison,family,blue,mother,son,portrait,cute,smile,smiling,happy,child,brother,kids,kid,happiness,little,childhood,together,daughter,father,parent,boy,sibling,home,love,male,children,offspring,joy,dad,baby',
          thumb:
            'http://localhost:8000/media/CACHE/images/blue/img/2021/10/15/IMG_20211015_205624_2snVSbT/e30f3ab6ee617518993ce195063eb4e4.jpg',
          img_url: 'http://localhost:8000/api/img/424/',
          mcs: {
            id: 424,
            file_upload_id: 478660,
            file_name: 'IMG_20211015_205624_2snVSbT.jpg',
            file_size: 3297425,
            updated_at: '2022-09-11T06:28:11.223795+08:00',
            nft_url:
              'https://calibration-ipfs.filswan.com/ipfs/QmeqXkeHzNUUhhkVudHttJcTruAewqE7auiJRmTFc9GVpy',
            pin_status: 'Pinned',
            payload_cid: 'QmeqXkeHzNUUhhkVudHttJcTruAewqE7auiJRmTFc9GVpy',
            w_cid:
              'a7c76a32-8e58-4c80-a08b-182aea32a61cQmeqXkeHzNUUhhkVudHttJcTruAewqE7auiJRmTFc9GVpy',
            status: 'success',
            deal_success: true,
            is_minted: true,
            token_id: '106146',
            mint_address: '0x8B6Ad2eD1151ae4cA664D0d44CE4d42307c91708',
            nft_tx_hash:
              '0x5800cb2bfb4de721beea508f577856ebd397bedcc81826ae18cf4e69630a4951',
          },
          issue_url: 'http://localhost:8000/api/issue/424/',
          faces: [
            {
              id: 674,
              face_album: 33,
              name: 'allison',
              src: 'http://localhost:8000/media/face/face_62A4R.jpg',
            },
            {
              id: 673,
              face_album: 32,
              name: 'blue',
              src: 'http://localhost:8000/media/face/face_vUMup.jpg',
            },
          ],
          imgcategories: [
            {
              id: 28,
              name: 'people portraits',
              confidence: 99.9494705200195,
              img: 424,
              category: 19,
            },
            {
              id: 116,
              name: 'allison,blue',
              confidence: 0.0,
              img: 424,
              category: 49,
            },
            {
              id: 301,
              name: 'light grey',
              confidence: 0.0,
              img: 424,
              category: 129,
            },
            {
              id: 302,
              name: 'brown',
              confidence: 0.0,
              img: 424,
              category: 151,
            },
            {
              id: 303,
              name: 'blue',
              confidence: 0.0,
              img: 424,
              category: 130,
            },
            {
              id: 304,
              name: 'lavender',
              confidence: 0.0,
              img: 424,
              category: 165,
            },
            {
              id: 305,
              name: 'brown',
              confidence: 0.0,
              img: 424,
              category: 152,
            },
            {
              id: 306,
              name: 'light grey',
              confidence: 0.0,
              img: 424,
              category: 135,
            },
            {
              id: 307,
              name: 'lavender',
              confidence: 0.0,
              img: 424,
              category: 166,
            },
          ],
          names: ['allison', 'blue'],
          colors: {
            img: 424,
            background: [
              {
                id: 155,
                r: 180,
                g: 172,
                b: 170,
                closest_palette_color_html_code: '#b5acab',
                closest_palette_color: 'pebble beach',
                closest_palette_color_parent: 'light grey',
                closest_palette_distance: 0.807487785816193,
                percent: 77.1583633422852,
                html_code: '#b4acaa',
                color: 424,
              },
              {
                id: 156,
                r: 113,
                g: 104,
                b: 104,
                closest_palette_color_html_code: '#6a6378',
                closest_palette_color: 'lavender',
                closest_palette_color_parent: 'lavender',
                closest_palette_distance: 9.98624515533447,
                percent: 22.8050098419189,
                html_code: '#716868',
                color: 424,
              },
            ],
            foreground: [
              {
                id: 157,
                r: 179,
                g: 154,
                b: 152,
                closest_palette_color_html_code: '#bfa3af',
                closest_palette_color: 'quartz',
                closest_palette_color_parent: 'lavender',
                closest_palette_distance: 6.92436790466309,
                percent: 76.9221954345703,
                html_code: '#b39a98',
                color: 424,
              },
              {
                id: 158,
                r: 51,
                g: 38,
                b: 34,
                closest_palette_color_html_code: '#40312f',
                closest_palette_color: 'espresso',
                closest_palette_color_parent: 'brown',
                closest_palette_distance: 4.04085111618042,
                percent: 22.9919261932373,
                html_code: '#332622',
                color: 424,
              },
            ],
            image: [
              {
                id: 159,
                r: 183,
                g: 171,
                b: 168,
                closest_palette_color_html_code: '#b5acab',
                closest_palette_color: 'pebble beach',
                closest_palette_color_parent: 'light grey',
                closest_palette_distance: 1.49923467636108,
                percent: 71.7352600097656,
                html_code: '#b7aba8',
                color: 424,
              },
              {
                id: 160,
                r: 105,
                g: 88,
                b: 83,
                closest_palette_color_html_code: '#5d473a',
                closest_palette_color: 'latte',
                closest_palette_color_parent: 'brown',
                closest_palette_distance: 7.15549325942993,
                percent: 21.7715339660645,
                html_code: '#695853',
                color: 424,
              },
              {
                id: 161,
                r: 121,
                g: 136,
                b: 161,
                closest_palette_color_html_code: '#6e7e99',
                closest_palette_color: 'larkspur',
                closest_palette_color_parent: 'blue',
                closest_palette_distance: 3.80917143821716,
                percent: 6.14859485626221,
                html_code: '#7988a1',
                color: 424,
              },
            ],
            color_variance: 38,
            object_percentage: 27.9794883728027,
            color_percent_threshold: 1.75,
          },
          dates: {
            img: 424,
            year: 2021,
            month: 10,
            day: 15,
            capture_date: '2021-10-15',
            capture_time: '20:56:24',
            earthly_branches: 3,
            is_weekend: false,
            holiday_type: 0,
            digitized_date: null,
          },
          evaluates: {
            img: 424,
            flag: 0,
            rating: 3,
            total_views: 0,
            likes: 0,
          },
          address: {
            img: 424,
            is_located: true,
            longitude_ref: 'E',
            longitude: 121.137001,
            latitude_ref: 'N',
            latitude: 30.183302,
            altitude_ref: 1.0,
            altitude: 0.0,
            location: '浙江省宁波市慈溪市周巷镇傅家路绿城惠园',
            district: '慈溪市',
            city: '宁波市',
            province: '浙江省',
            country: '中国',
          },
          src: 'http://localhost:8000/media/blue/img/2021/10/15/IMG_20211015_205624_2snVSbT.jpg',
          filename: 'IMG_20211015_205624.jpg',
          type: 'jpg',
          wid: 4160,
          height: 1936,
          aspect_ratio: '0.47',
          is_exist: true,
          title: null,
          caption: null,
          label: null,
          camera_brand: 'HUAWEI',
          camera_model: 'NOH-AN00',
          is_publish: false,
          state: 0,
          created_at: '2022-09-11T06:22:27.315472+08:00',
          updated_at: '2022-09-11T06:22:33.460152+08:00',
          size: '4160-1936',
        },
        filteredList: {},
        data: [],
        busy: false,
        msg: 'Loading.....',
      }
    },
    created() {
      // this.fetchImg()
      // this.loadMore()
    },
    mounted() {
      this.loadMore()
    },
    methods: {
      loadMore: function () {
        console.log('infinite loading... ', this.busy)
        this.busy = true
        setTimeout(() => {
          console.log('timing is out... ')
          // // 当前页数如果小于总页数，则继续请求数据，如果大于总页数，则滚动加载停止
          // if (this.currentCnt < this.totalCnt || this.totalCnt === 0) {
          //   //  这里是列表请求数据的接口,在这个接口中更新总页数
          //   this.msg = 'Loading.....'
          this.fetchImg()
          // } else {
          //   this.msg = 'there is no more img any more'
          // }
          this.busy = false
        }, 1000)
      },

      onGetAlbumId(index, item) {
        console.log('recieved the child component value %d,%o', index, item)
        // 声明这个函数，便于子组件调用
        this.checkedIndex = index
        this.checkedId = item.id
        // this.fetchImgDetail()
      },
      onRouteJump(index, item) {
        console.log(
          'album double click event item is  %d,%o, start jump to Img',
          index,
          item
        )
        this.$router.push({
          name: 'Img',
          query: {
            id: item.id,
            title: item.name,
          },
        })
      },

      async fetchImg() {
        console.log('albums loading... ')

        // 当前页数如果小于总页数，则继续请求数据，如果大于总页数，则滚动加载停止
        if (this.currentCnt < this.totalCnt || this.totalCnt === 0) {
          //  这里是列表请求数据的接口,在这个接口中更新总页数
          this.msg = 'Loading.....'
          const { data, totalCnt, totalPage, filteredList, code } =
            await getImg(this.queryForm)
          if (code === 200) {
            this.albums = [...this.albums, ...data]
            this.currentCnt = this.albums.length
            this.totalCnt = totalCnt
            this.totalPage = totalPage
            this.category = filteredList
            this.queryForm.page += 1
            this.busy = false
            console.log('totalCnt is: %d', this.totalCnt)
          }
        } else {
          this.msg = 'there is no more img any more'
        }

        // let i = 0
        // this.filteredAlbumsId = [] //must clear first
        // for (i = 0; i < this.currentCnt; i++) {
        //   this.filteredAlbumsId[i] = this.albums[i].id
        // }
      },
      // async fetchImgDetail() {
      //   console.log('start to get the img ...')
      //   this.queryForm.id = this.checkedId
      //   const { data } = await getImgDetail(this.queryForm)
      //   this.img = data
      // },

      onImgSearch(queryForm) {
        console.log('recieve the queryForm info from the search component')
        console.log(queryForm)
        this.queryForm = queryForm
        this.totalCnt = 0
        this.albums = []
        this.fetchImg()
        // this.loadMore()
      },
    },
  }
</script>

<style>
  .content {
    height: 700px;
    width: 100%;
    margin: 0 auto;
    overflow: auto;
  }
  .loading {
    font-weight: bold;
    font-size: 20px;
    color: grey;
    text-align: center;
  }
</style>
