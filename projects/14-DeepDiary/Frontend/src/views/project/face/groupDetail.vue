<template>
  <div>
    <Carosel title="照片" :items="groups"></Carosel>
    <Gallery
      ref="face"
      :name="$route.query.title"
      :items="groups"
      :total="groups.length"
      disp-type="img"
    ></Gallery>
  </div>
</template>

<script>
  import Gallery from '@/components/Gallery'
  import Carosel from './carosel.vue'
  import { getCategoryDetail } from '@/api/gallery'
  export default {
    name: 'GroupDetail',
    components: { Gallery, Carosel },
    data() {
      return {
        groups: [],
        totalCnt: 0,
        queryForm: {
          id: '',
        },
      }
    },
    computed: {},
    watch: {
      'queryForm.id'(newVal, oldVal) {
        console.log(
          'this.faceQueryForm.id have bee changed: %d --> %d',
          oldVal,
          newVal
        )
        this.groups = []
        this.fetchFaceGroupDetail()
      },
    },
    created() {
      console.log('component have been created --')
    },
    mounted() {
      console.log('component have been mounted --')
      // this.fetchFaceGroupDetail()
    },
    activated() {
      console.log('the face component is activated')
      this.queryForm.id = this.$route.query.id
    },
    deactivated() {
      console.log('the face component is deactivated')
    },
    methods: {
      async fetchFaceGroupDetail() {
        console.log('start to get the fetchFaceGroupDetail...')

        this.queryForm.id = this.$route.query.id
        // console.log('this.queryForm.id: ', this.queryForm.id)
        const { data } = await getCategoryDetail(this.$route.query.id)
        console.log('fetchFaceGroupDetail: ', data)
        this.groups = [...data.img]
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
