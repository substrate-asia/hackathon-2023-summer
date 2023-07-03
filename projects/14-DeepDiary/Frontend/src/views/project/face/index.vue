<template>
  <div>
    <Album
      v-if="true"
      ref="album"
      title="人脸相册"
      :items="$store.state.face.isGroupMode ? groups : persons"
      :total="totalCnt"
      @albumClick="onGetAlbumId"
      @doubleClick="onRouteJump"
    ></Album>

    <Profile v-if="checkedProfile" :id="checkedProfile" mcstype="img"></Profile>
    <!-- :title="`Profile Info-${checkedId}`" -->
    <br />
    <!-- <span>下面是通过路由加载的内容</span>
    <router-view /> -->
  </div>
</template>

<script>
  import Album from '@/components/Album'
  import Profile from './profile.vue'
  import { getFaceAlbum, getCategory } from '@/api/gallery'
  export default {
    name: 'Face',
    components: { Album, Profile },
    data: function () {
      return {
        faceAlbumQueryForm: {
          page: 1,
          size: 30,
          search: '',
          faceAlumId: 1,
          faces__id__gte: 0,
        },
        categoryQueryForm: {
          page: 1,
          size: 20,
          type: 'group',
        },

        persons: [],
        groups: [],
        albumLoading: false,
        totalCnt: 0,
        curAlbumCnt: 0,
        checkedIndex: -1,
        checkedId: -1,
        checkedProfile: 0,
      }
    },
    watch: {
      '$store.state.face.isGroupMode'(newVal, oldVal) {
        console.log('$store.state.face.isGroupMode', newVal)
      },
    },
    created() {},
    mounted() {
      this.fetchFaceAlbum()
      this.fetchFaceGroup()
    },
    methods: {
      onGetAlbumId(index, item) {
        console.log('recieved the child component value %d,%o', index, item)
        // 声明这个函数，便于子组件调用
        this.checkedIndex = index
        this.checkedId = item.id || 0 // if return unexpected id, then set the id to default 1
        if (this.persons[index].profile !== null)
          this.checkedProfile = this.persons[index].profile
        else this.checkedProfile = 0
      },
      onRouteJump(index, item) {
        console.log('album double click event item is  %d,%o', index, item)
        this.$router.push({
          // name: 'GroupDetail',
          name: this.$store.state.face.isGroupMode
            ? 'GroupDetail'
            : 'PersonDetail',
          query: {
            id: item.id,
            title: item.name,
          },
        })
      },

      async fetchFaceAlbum() {
        if (this.albumLoading) return //incase fetch more data during the fetching time

        this.albumLoading = true
        if (this.curAlbumCnt < this.totalCnt || this.totalCnt === 0) {
          console.log('start to get the album...')
          const { data, totalCnt } = await getFaceAlbum(this.faceAlbumQueryForm)
          if (totalCnt === 0) return //could fetch any data
          // this.faceAlbumQueryForm.page += 1
          console.log(
            'get img api result, data is %o, total is %d',
            data,
            totalCnt
          )
          this.persons = [...this.persons, ...data]
          this.curAlbumCnt = this.persons.length
          this.totalCnt = totalCnt
          setTimeout(() => {
            this.albumLoading = false
          }, 300)
        }
      },
      async fetchFaceGroup() {
        const { data, totalCnt } = await getCategory(this.categoryQueryForm)
        console.log(
          'get fetchFaceGroup result, data is %o, total is %d',
          data,
          totalCnt
        )
        this.groups = data
        this.totalCnt = totalCnt
      },
    },
  }
</script>

<style></style>
