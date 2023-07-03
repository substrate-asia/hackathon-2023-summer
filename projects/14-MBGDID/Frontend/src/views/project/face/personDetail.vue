<template>
  <div>
    <Carosel title="照片" :items="faces"></Carosel>
    <Gallery
      ref="face"
      :name="$route.query.title"
      :items="faces"
      :total="faces.length"
      disp-type="face"
    ></Gallery>
  </div>
</template>

<script>
  import Gallery from '@/components/Gallery'
  import Carosel from './carosel.vue'
  import {
    getGallery,
    getAlbum,
    getFaceAlbum,
    getFaceGallery,
    getFaceAlbumDetail,
  } from '@/api/gallery'
  export default {
    name: 'PersonDetail',
    components: { Gallery, Carosel },
    data() {
      return {
        faces: [],
        faceLoading: false,
        totalFaceCnt: 0,
        curFaceCnt: 0,
        faceQueryForm: {
          id: '',
        },
      }
    },
    computed: {
      // album_id: function () {
      //   console.log('album_id have bee updated:')
      //   return this.$route.query.id
      // },
    },
    watch: {
      'faceQueryForm.id'(newVal, oldVal) {
        console.log(
          'this.faceQueryForm.id have bee changed: %d --> %d',
          oldVal,
          newVal
        )
        this.faces = []
        this.fetchFacePerson()
      },
    },
    created() {
      console.log('component have been created --')
    },
    mounted() {
      console.log('component have been mounted --')
      // this.fetchFacePerson()
    },
    activated() {
      console.log('the face component is activated')
      this.faceQueryForm.id = this.$route.query.id
    },
    deactivated() {
      console.log('the face component is deactivated')
    },
    methods: {
      async fetchFacePerson() {
        console.log(
          'start to get the fetchFacePerson...',
          this.faceQueryForm.id
        )
        // if (this.faceLoading) return //incase fetch more data during the fetching time
        // this.faceLoading = true
        // await getFaceGallery(this.faceQueryForm, 1)
        // if (this.curFaceCnt < this.totalFaceCnt || this.totalFaceCnt === 0) {

        // if (this.checkedIndex < 0) {
        //   return
        // }
        // this.faceQueryForm.face_album__id = this.album_id

        // this.faceQueryForm.id = this.$route.query.id

        // if (this.faceQueryForm.id !== true) return
        const { data } = await getFaceAlbumDetail(this.faceQueryForm)
        console.log('getFaceAlbumDetail: ', data)
        this.faces = [...data.faces]

        // this.faceQueryForm.face_album__id = this.$route.query.id
        // const { data } = await getFaceGallery(
        //   this.faceQueryForm
        // this.checkedId
        // )
        // if (totalCount === 0) return //could fetch any data
        // // this.ImgQueryForm.page += 1
        // console.log(
        //   'get img api result, data is %o, total is %d',
        //   data,
        //   totalCount
        // // )
        // this.faces = [...data]
        // console.log(this.faces)
        // this.curFaceCnt = this.faces.length
        // this.totalFaceCnt = totalCount
        setTimeout(() => {
          this.albumLoading = false
        }, 300)
        // }
      },
      //进入守卫：通过路由规则，进入该组件时被调用
      beforeRouteEnter(to, from, next) {
        console.log('beforeRouteEnter....')
      },
      //离开守卫：通过路由规则，离开该组件时被调用
      beforeRouteLeave(to, from, next) {
        console.log('beforeRouteLeave....')
      },
    },
  }
</script>

<style></style>
