<template>
  <div>
    <ImgSearch @handleImgSearch="onImgSearch"></ImgSearch>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="50"
      infinite-scroll-immediate-check="true"
      class="content"
    >
      <Gallery
        ref="gallery"
        name="相片"
        disp-type="thumb"
        storage-type="oss"
        :items="gallerys"
        :total="totalCnt"
      ></Gallery>
    </div>

    <div v-show="busy" class="loading">{{ msg }}</div>
  </div>
</template>

<script>
  import Gallery from '@/components/Gallery'
  import ImgSearch from '@/components/Search'
  import infiniteScroll from 'vue-infinite-scroll'
  import { getImg } from '@/api/gallery'
  export default {
    name: 'PgGallery',
    components: { Gallery, ImgSearch }, //ImgSearch
    directives: { infiniteScroll },
    data: function () {
      return {
        queryForm: {
          page: 1,
          search: '',
          id: '',
          fc_nums: -1, //-1 ,means all, 6 means the fc_nums > 6
          fc_name: '',
          c_img: '',
          c_fore: '',
          c_back: '',
          address__city: '',
        },
        gallerys: [],
        Loading: false,
        totalCnt: 0,
        currentCnt: 0,

        gallerysWithoutMcs: [],
        totalgallerysWithoutMcsCnt: 0,
        processedMcsCnt: 0,

        busy: false,
        msg: 'Loading.....',
      }
    },
    created() {
      // this.fetchImg()
      // this.fetchImgWithoutMcs()
    },
    mounted() {
      this.loadMore()

      // const $window = $(window)
      // $window.fetchImg = this.fetchImg // 把这个函数赋值给window，便于全局调用
      // // 未铺满整个页面加载
      // $window.scroll(function () {
      //   if (
      //     $window.scrollTop() >=
      //     $(document).height() - $window.height() - 10
      //   ) {
      //     // console.log('infinite-scroll-gallery: start reload the data')
      //     $window.fetchImg()
      //   }
      // })
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
      async fetchImgWithoutMcs() {
        this.queryForm.mcs__file_upload_id = 0
        const { data, totalCnt } = await getImg(this.queryForm)
        if (totalCnt === 0) return //could fetch any data
        console.log('start to get the img without mcs...')
        console.log('the img without mcs is %o', data)
        this.gallerysWithoutMcs = data
        this.totalgallerysWithoutMcsCnt = totalCnt
      },
      // async fetchImg() {
      //   this.queryForm.mcs__file_upload_id = ''
      //   console.log('start to get the img...')
      //   console.log(this.Loading)
      //   if (this.Loading) return //incase fetch more data during the fetching time

      //   this.Loading = true
      //   if (this.currentCnt < this.totalCnt || this.totalCnt === 0) {
      //     const { data, totalCnt } = await getImg(this.queryForm)
      //     if (totalCnt === 0) return //could fetch any data
      //     this.queryForm.page += 1
      //     console.log(
      //       'get img api result, data is %o, total is %d',
      //       data,
      //       totalCnt
      //     )
      //     this.gallerys = [...this.gallerys, ...data]
      //     this.currentCnt = this.gallerys.length
      //     this.totalCnt = totalCnt
      //     setTimeout(() => {
      //       this.Loading = false
      //     }, 300)
      //   }
      // },

      async fetchImg() {
        console.log('albums loading... ')

        // 当前页数如果小于总页数，则继续请求数据，如果大于总页数，则滚动加载停止
        if (this.currentCnt < this.totalCnt || this.totalCnt === 0) {
          //  这里是列表请求数据的接口,在这个接口中更新总页数
          this.msg = 'Loading.....'
          const { data, totalCnt, totalPage, filteredList, code } =
            await getImg(this.queryForm)
          if (code === 200) {
            this.gallerys = [...this.gallerys, ...data]
            this.currentCnt = this.gallerys.length
            this.totalCnt = totalCnt
            this.totalPage = totalPage
            this.category = filteredList
            this.queryForm.page += 1
            this.busy = false
            console.log('totalCnt is: %o', this.gallerys)
          }
        } else {
          this.msg = 'there is no more img any more'
        }
      },

      onImgSearch(queryForm) {
        console.log('recieve the queryForm info from the search component')
        console.log(queryForm)
        this.queryForm = queryForm
        this.totalCnt = 0
        this.gallerys = []
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
